const { secret_jwt } = require('../startup/config');
const sequelize = require('sequelize');

const BaseController = require('./BaseController');
const SkladModel = require('../models/sklad.model');
const _ = require('lodash');
const { SECTION_TYPE } = require('../utils/mobileReport.utils');
const moment = require('moment');
const db_sequelize = require('../db/db-sequelize');
const DollarExchangeRateModel = require('../models/kurs.model');
const { Op } = require("sequelize");
const payTypeUtils = require("../utils/payType.utils");
const priceTypeUtils = require('../utils/priceType.utils');
const reportController = require('./report.controller');
/******************************************************************************
 *                              Mobile Controller
 ******************************************************************************/
class MobileReportController extends BaseController {
    sectionsList = async (req, res, next) => {
        let sklad_list = await SkladModel.findAll({
            where: req.skladFilter
        });
        sklad_list = _.map(sklad_list, (sklad) => {
            return {
                title: sklad.name,
                value: "" + sklad.id
            }
        });

        let datetime1 = moment().startOf('month').format('DD.MM.YYYY');
        let datetime2 = moment().endOf('month').format('DD.MM.YYYY');
        res.send({
            success: true,
            message: "",
            error_code: -1,
            data: {
                filter: {
                    filter_items: sklad_list,
                    selected_filter: "" + (req.currentUser.sklad_id ? req.currentUser.sklad_id : 1),
                    selected_date_start: datetime1,
                    selected_date_end: datetime2
                },
                sections: [
                    {
                        title: "So'mdagi qarzdorlik",
                        key: "client_percents_sum",
                        type: SECTION_TYPE.HORIZONTAL_CARD
                    },
                    {
                      title: "Dollardagi qarzdorlik",
                      key: "client_percents_dollar",
                      type: SECTION_TYPE.HORIZONTAL_CARD
                    },
                    {
                      title: "Filiallarning kunlik aylanma ulushi",
                      key: "sklad_ulush",
                      type: SECTION_TYPE.CHART_CIRCLE
                    },
                    {
                        title: "Filiallar kunlik aylanmasi",
                        key: "sklad_summa",
                        type: SECTION_TYPE.GRID_CARD
                    },
                    {
                        title: "KASSA",
                        key: "kassa",
                        type: SECTION_TYPE.GRID_CARD
                    },
                    {
                        title: "Qoldig'i kam qolgan tovarlar",
                        key: "product_min",
                        type: SECTION_TYPE.ALERT_LIST
                    },
                    // {
                    //     title: "Umumiy savdo grafigi",
                    //     key: "sklad_chart",
                    //     type: "chart"
                    // },
                    {
                        title: "Kechiktirilgan to'lovlar",
                        key: "kontragent_total",
                        type: SECTION_TYPE.VERTICAL_LIST
                    },
                    // {
                    //     title: "Filiallarni boshqarish",
                    //     key: "home_graph_1",
                    //     type: "vertical_action_list"
                    // },
                    // {
                    //     title: "Buyurtmalar joylashuvi",
                    //     key: "home_map",
                    //     type: "map"
                    // },
                    {
                        title: "Haftalik kirim va chiqimlar grafigi",
                        key: "debit_credit_weekly",
                        type: SECTION_TYPE.CHART_MULTIPLE_LINE
                    }
                ]
          }
        })
    }

    sectionsData = async (req, res, next) => {
        let data = await this.#dataByKey(req.body);
        res.send({
            success: true,
            message: "",
            error_code: -1,
            data
        })
    }

    tableData = async (req, res, next) => {
      let path, id, sklad_id, datetime1, datetime2;
      for(let value of req.body.filter) {
        if(value.key === 'path'){
          path = value.selected_value_key.split("/");
          id = path[1];
          path = path[0];
        }
        else if(value.key === 'filter')
          sklad_id = value.selected_value_key;
        else if(value.key === 'date_start')
          datetime1 = value.selected_value_key;
        else if(value.key === 'date_end')
          datetime2 = value.selected_value_key;
      }
      let sklad = await SkladModel.findByPk(sklad_id);
      let all_sklad = await SkladModel.findAll({
        attributes: ['id', 'name']
      });
      all_sklad = _.map(all_sklad, (sklad) => {
        return {
          title: sklad.name,
          value: "" + sklad.id
        }
      });
      let filter_list = [
        {
          "title": "Filial",
          "key": "branch",
          "selected_value_text": sklad.name,
          "selected_value_key": "" + sklad_id,
          "type": "items",
          "items": all_sklad
        },
        {
          "title": "Boshlanish vaqti",
          "key": "start_date",
          "selected_value_text": datetime1,
          "selected_value_key": datetime1,
          "type": "date",
          "items": []
        },
        {
          "title": "Tugash vaqti",
          "key": "end_date",
          "selected_value_text": datetime2,
          "selected_value_key": datetime2,
          "type": "date",
          "items": []
        }
      ];       
      let data = {};
      data.filter_list = filter_list;//req.body.fiter;
      let filter = { id, sklad_id, datetime1, datetime2 };
      data.table = await this.#tableDateByPath(path, filter); 
      res.send({
          success: true,
          message: "",
          error_code: -1,
          data
      })
    }

    #dataByKey = async (body) => {
      let {
        key,
        selected_filter: sklad_id,
        selected_date_start: datetime1,
        selected_date_end: datetime2,  
      } = body;
      datetime1 = moment(datetime1, 'DD.MM.YYYY').unix();
      datetime2 = moment(datetime2, 'DD.MM.YYYY').unix() + 86399;// 24 * 60 * 60 - 1;
      let filter = { sklad_id, datetime1, datetime2 };
      let data = [];
      switch(key){
          case 'client_percents_sum':
            data = await this.#clientPercent(filter);
            break;
          case 'client_percents_dollar':
            data = await this.#clientPercent(filter, priceTypeUtils.Dollar);
            break;
          case 'sklad_summa':
            data = await this.#dailyRasxod(filter);
            break;
          case 'kassa':
            data = await this.#kassa(filter);
            break;
          case 'product_min':
            data = await this.#productMin(filter);
            break;
          case 'sklad_chart':
            data = await this.#skladChart();
            break;
          case 'kontragent_total':
            data = await this.#kontragentTotal(filter);
            break;
          case 'sklad_ulush':
            data = await this.#dailyRasxodPercent(filter);
            break;
          case 'debit_credit_weekly':
            data = await this.#debitCreditWeekly();
            break;
      }

      return data;
    }

    #tableDateByPath = async (path, filter) => {
      filter.datetime1 = moment(filter.datetime1, 'DD.MM.YYYY').unix();
      filter.datetime2 = moment(filter.datetime2, 'DD.MM.YYYY').unix() + 86399;// 24 * 60 * 60 - 1;
      let data;
      switch(path) {
        case 'client-sum':
          data = await this.#clientPercentTable(filter);
          break;
        case 'client-dollar':
          data = await this.#clientPercentTable(filter, priceTypeUtils.Dollar);
          break;
        case 'kassa':
          data = await this.#kassaTable(filter);
          break;
        case 'daily-rasxod':
            data = await this.#dailyRasxodTable(filter);
            break;
      }
      return data;
    }
    //SECTION_TYPE = HORIZONTAL_CARD
    #clientPercent = async(filter, price_type = priceTypeUtils.Sum) => {
      let { sklad_id, datetime1, datetime2 } = filter;
      let price_query = price_type === priceTypeUtils.Dollar ? 'price_type = 3' : 'price_type < 3';
      let path = price_type === priceTypeUtils.Dollar ? 'client-dollar/' : 'client-sum/';
      let sql = `
        SELECT
          k.name as title,
          CONCAT("${ path }", k.id) as path,
          kr.credit_summa
        FROM (
          SELECT
           kontragent_id,
           SUM(POWER(-1, type + 1) * summa) credit_summa
          FROM kontragent_register 
          WHERE ${ price_query } AND sklad_id = ${ sklad_id } AND datetime <= ${ datetime2 }
          GROUP BY kontragent_id
        ) kr
        LEFT JOIN kontragent k ON k.id = kr.kontragent_id;
      `;
      
      let result = await db_sequelize.query(sql, { type: sequelize.QueryTypes.SELECT, raw: true });
      let summa = _.sumBy(result, (value) => value.credit_summa);

      result = _.map(result, (value) => { 
        value.percent = parseFloat((value.credit_summa * 100 / summa).toFixed(1));
        return value;
      });

      return result;
    }

    #clientPercentTable = async(filter, price_type = priceTypeUtils.Sum) => {
      let { id, sklad_id, datetime1, datetime2 } = filter;
      let sql, sql_begin, sql_end;
      let price_query = price_type === priceTypeUtils.Dollar ? 'price_type = 3' : 'price_type < 3';
      sql_begin = `
        SELECT
          kontragent_id,
          SUM(POWER(-1, type + 1) * summa) as summa
        FROM kontragent_register
        WHERE ${ price_query } AND sklad_id = ${ sklad_id } 
        AND datetime < ${ datetime1 } AND kontragent_id = ${ id}
      `;
      sql_end = `
        SELECT
          kontragent_id,
          SUM(POWER(-1, type + 1) * summa) as summa
        FROM kontragent_register
        WHERE ${ price_query } AND sklad_id = ${ sklad_id } 
        AND datetime <= ${ datetime2 } AND kontragent_id = ${ id }
      `;
      sql = `
        SELECT
            kontragent_id,
            datetime,
            CONCAT(doc_type, " № ", doc_id) as doc,
            SUM(CASE WHEN type = 1 THEN summa ELSE 0 END) as debit,
            SUM(CASE WHEN type = 0 THEN summa ELSE 0 END) as credit
        FROM kontragent_register
        WHERE ${ price_query } AND sklad_id = ${ sklad_id } 
        AND datetime >= ${ datetime1 } AND datetime <= ${ datetime2 }
        AND kontragent_id = ${ id }
        GROUP BY doc_id, doc_type
        ORDER BY datetime, id
      `;

      let result_begin = await db_sequelize.query(sql_begin, { type: sequelize.QueryTypes.SELECT, raw: true });
      let result_end = await db_sequelize.query(sql_end, { type: sequelize.QueryTypes.SELECT, raw: true });
      let result = await db_sequelize.query(sql, { type: sequelize.QueryTypes.SELECT, raw: true });

      let line = 0;
      result = _.map(result, (value) => { 
        value = {
          line: '' + (++line),
          name: value.doc,
          datetime: moment.unix(value.datetime).format("DD-MM-YYYY HH:mm:ss"),
          debit: '' + (value.debit ? value.debit : ''),
          credit: '' + (value.credit ? value.credit : '')
        }
        return value;
      });
      let data = {};
      let width = [1, 2, 3, 1, 1];
      data.header = {
        background: "color_3",
        columns: [
          this.#column('#', width[0]),
          this.#column('Nomi', width[1]),
          this.#column('Vaqti', width[2]),
          this.#column('Kirim', width[3]),
          this.#column('Chiqim', width[4])
        ],
        link: "/"
      };
      data.items = [];
      let begin_summa = result_begin[0].summa ? result_begin[0].summa : 0;
      data.items.push({
        background: "color_1",
        columns: [
          this.#column("Boshlang'ich qoldiq", width[0] + width[1] + width[2]),
          this.#column('' + (begin_summa > 0 ? begin_summa : ''), width[3]),
          this.#column('' + (begin_summa < 0 ? -begin_summa : ''), width[4]),
        ],
        link: "/"
      });
      for(let value of result){
        data.items.push({
          background: "color_1",
          columns: [
            this.#column(value.line, width[0]),
            this.#column(value.name, width[1]),
            this.#column(value.datetime, width[2]),
            this.#column(value.debit, width[3]),
            this.#column(value.credit, width[4]),
          ],
          link: "/"
        })
      }

      let end_summa = result_end[0].summa ? result_end[0].summa : 0;
      data.items.push({
        background: "color_1",
        columns: [
          this.#column("Oxirgi qoldiq", width[0] + width[1] + width[2]),
          this.#column('' + (end_summa > 0 ? end_summa : ''), width[3]),
          this.#column('' + (end_summa < 0 ? -end_summa : ''), width[4]),
        ],
        link: "/"
      });

      return data;
    }

    #dailyRasxodPercent = async(filter) => {
      let { sklad_id, datetime1, datetime2 } = filter;
      let result = await reportController.dailyRasxodFun(parseInt(sklad_id), datetime1, datetime2); 
      let data = [], total = 0, total_dollar = 0, months, info = [], total_summa = 0, total_dollar_summa = 0;
      for(let i = 0; i < result.length; i++) {
        months = JSON.parse(JSON.stringify(result[i].months));
        total = 0;
        total_dollar = 0;
        for(let value in months) {
          if(value != 'null'){
            for(let i = 0; i < months[value].length; i++) {
              if(months[value][i].pay_type_id !== payTypeUtils.Dollar){
                total += months[value][i].total;
              }else{
                total_dollar += months[value][i].total;
              }
            }
          }
        }
        info.push({
          title: result[i].name,
          total: total,
          total_dollar: total_dollar  
        });
        total_summa += total;
        total_dollar_summa += total_dollar;
      }
      let sklad = await SkladModel.findOne({
        where: {
          id: sklad_id
        }
      });
      let dollar_rate = await DollarExchangeRateModel.findOne({
        where: {
          datetime: {
            [Op.lte]: datetime2
          }
        },
        order: [ ['datetime', 'DESC'] ]
      })
      if(!dollar_rate){
        dollar_rate = { summa: 1 };
      }

      let percent = 0, numerator = 0;
      let denominator = 
        sklad.common_price_type == priceTypeUtils.Sum ?  
        total_summa + total_dollar_summa * dollar_rate.summa : 
        total_summa / dollar_rate.summa + total_dollar_summa;
      for(let i = 0; i < info.length; i++) {
        numerator = 
          sklad.common_price_type == priceTypeUtils.Sum ? 
          info[i].total + info[i].total_dollar * dollar_rate.summa : 
          info[i].total / dollar_rate.summa + info[i].total_dollar;
        if(denominator)
          percent =  Math.round( numerator  *  100 /  denominator);
        else
          percent = 0;

        data.push({
          title: info[i].title,
          percent: percent,
          path: "path1"
        })
      }
      
      return data;
    }

    #dailyRasxod = async(filter) => {
      let { sklad_id, datetime1, datetime2 } = filter;
      let result = await reportController.dailyRasxodFun(parseInt(sklad_id), datetime1, datetime2); 
      let data = [], total = 0, total_dollar = 0, months;
      for(let i = 0; i < result.length; i++) {
        months = JSON.parse(JSON.stringify(result[i].months));
        total = 0;
        total_dollar = 0;
        for(let value in months) {
          if(value != 'null'){
            for(let i = 0; i < months[value].length; i++) {
              if(months[value][i].pay_type_id !== payTypeUtils.Dollar){
                total += months[value][i].total;
              }else{
                total_dollar += months[value][i].total;
              }
            }
          }
        }
        data.push({
          title: result[i].name,
          number: total,
          subtitle: `${ total_dollar } $`,
          currency: "UZS",
          path: "daily-rasxod/" + result[i].id,
          "color": "color_5"
        })
      }

      return data;
    }

    #dailyRasxodTable = async(filter) => {
      let { id, sklad_id, datetime1, datetime2 } = filter;
      let result = await reportController.dailyRasxodFun(parseInt(id), datetime1, datetime2); 
      let data = {};
      let width = [2, 2, 2, 2, 2, 2, 2, 2];
      data.header = {
        background: "color_3",
        columns: [
          this.#column('Vaqti', width[0]),
          this.#column('Valyuta', width[1]),
          this.#column('Naqd', width[2]),
          this.#column('Plastik', width[3]),
          this.#column('Dollar', width[4]),
          this.#column('Nasiya', width[5]),
          this.#column('Skidka', width[6]),
          this.#column('Umumiy', width[7]),
        ],
        link: "/"
      };
      data.items = [];
      let months, data_by_date, temp, pay_type;
      let data_month = {};
      let dollar_rate = await DollarExchangeRateModel.findOne({
        where: {
          datetime: {
            [Op.lte]: datetime2
          }
        },
        order: [ ['datetime', 'DESC'] ]
      })
      if(!dollar_rate){
        dollar_rate = { summa: 1 };
      }
      for(let i = 0; i < result.length; i++) {
        months = JSON.parse(JSON.stringify(result[i].months));
        data.items.push({
          background: "color_1",
          columns: [
            this.#column(result[i].name, 16),
          ],
          link: "/"
        })
        data_month = { 
          cash: 0,
          plastic: 0,
          dollar: 0,
          credit: 0,
          skidka: 0,
          total: 0
        };
        for(let value in months) {
          if(value != 'null'){
            temp = [];
            for(let i = 0; i < months[value].length; i++) {
              data_by_date = months[value][i];
              switch(data_by_date.pay_type_id){
                case 1: 
                  pay_type = 'Naqd'; 
                  data_month.credit += parseFloat(data_by_date.total_credit);
                  data_month.skidka += parseFloat(data_by_date.total_skidka);
                  data_month.total += parseFloat(data_by_date.total);
                  break;
                case 2: 
                  pay_type = 'Plastik'; 
                  data_month.credit += parseFloat(data_by_date.total_credit);
                  data_month.skidka += parseFloat(data_by_date.total_skidka);
                  data_month.total += parseFloat(data_by_date.total);
                  break;
                case 3: 
                  pay_type = 'Dollar'; 
                  data_month.credit += parseFloat(data_by_date.total_credit) * dollar_rate.summa;
                  data_month.skidka += parseFloat(data_by_date.total_skidka) * dollar_rate.summa;
                  data_month.total += parseFloat(data_by_date.total) * dollar_rate.summa;
                  break;
              } 
              data_month.cash += parseFloat(data_by_date.total_cash);
              data_month.plastic += parseFloat(data_by_date.total_plastic);
              data_month.dollar += parseFloat(data_by_date.total_dollar);
              temp.push({
                background: "color_1",
                columns: [
                  this.#column(data_by_date.day, width[0]),
                  this.#column(pay_type, width[1]),
                  this.#column(data_by_date.total_cash, width[2]),
                  this.#column(data_by_date.total_plastic, width[3]),
                  this.#column(data_by_date.total_dollar, width[4]),
                  this.#column(data_by_date.total_credit, width[5]),
                  this.#column(data_by_date.total_skidka, width[6]),
                  this.#column(data_by_date.total, width[7]),
                ],
                link: "/"
              })
            }
            //Oylar bo'yicha
            data.items.push(
              {
                background: "color_4",
                columns: [
                  this.#column(data_by_date.month, width[0]),
                  this.#column('', width[1]),
                  this.#column(data_month.cash, width[2]),
                  this.#column(data_month.plastic, width[3]),
                  this.#column(data_month.dollar, width[4]),
                  this.#column(data_month.credit, width[5]),
                  this.#column(data_month.skidka, width[6]),
                  this.#column(data_month.total, width[7]),
                ],
                link: "/"
              }
            );
            for(let i = 0; i < temp.length; i++){
              data.items.push(temp[i]);
            }
          }
        }
      }

      return data;
    }

    #kassa = async(filter) => {
      let { sklad_id, datetime1, datetime2 } = filter;
      let data = [
        {
            title: "Kassa 1",
            number: 1200000,
            subtitle: "LIMIT 2 000 000",
            currency: "UZS",
            path: "path1",
            "color": "color_5"
        },
        {
            title: "Kassa 2",
            number: 1500000,
            subtitle: "LIMIT 5 000 000",
            currency: "UZS",
            path: "path1",
            color: "color_5"
        },
        {
            title: "Kassa 3",
            number: 4200000,
            subtitle: "LIMIT 3 000 000",
            currency: "UZS",
            path: "path1",
            color: "color_5"
        },
        {
            title: "Kassa 4",
            number: 5200000,
            subtitle: "LIMIT 8 000 000",
            currency: "$",
            path: "path1",
            color: "color_5"
        },
        {
            title: "Kassa 5",
            number: 8200000,
            subtitle: "LIMIT 1 000 000",
            currency: "$",
            path: "path1",
            color: "color_5"
        }
      ];

      let sql = `
        SELECT 
          * 
        FROM pay_type pt
        LEFT JOIN 
        (
            SELECT 
              pay_type_id,
            SUM(POWER(-1, type + 1) * summa) total
          FROM kassa_register
          WHERE sklad_id = ${ sklad_id } AND datetime < ${ datetime2 } 
          GROUP BY pay_type_id
        ) kr ON kr.pay_type_id = pt.id
        ORDER BY pt.id;
      `;

      let result = await db_sequelize.query(sql, { type: sequelize.QueryTypes.SELECT, raw: true });

      result = _.map(result, (value) => { 
        value = {
          title: value.name,
          number: value.total,
          subtitle: "",
          currency: value.id === 3 ? 'USD' : 'UZS',
          path: "kassa/0",
          color: "color_5"
        };
        return value;
      });

      return result;
    }

    #kassaTable = async (filter) => {
      let { id, sklad_id, datetime1, datetime2 } = filter;
      let sql, sql_begin, sql_end;

      sql_begin = `
        SELECT 
          sum(CASE WHEN type = 1 and pay_type_id = 1 THEN summa ELSE 0 END ) AS kirim_cash, 
          sum(CASE WHEN type = 1 and pay_type_id = 2 THEN summa ELSE 0 END ) AS kirim_plastic, 
          sum(CASE WHEN type = 0 and pay_type_id = 1 THEN summa ELSE 0 END ) AS chiqim_cash, 
          sum(CASE WHEN type = 0 and pay_type_id = 2 THEN summa ELSE 0 END ) AS chiqim_plastic, 
          sum(CASE WHEN type = 1 and pay_type_id = 3 THEN summa ELSE 0 END ) AS kirim_dollar, 
          sum(CASE WHEN type = 0 and pay_type_id = 3 THEN summa ELSE 0 END ) AS chiqim_dollar 
        FROM kassa_register AS kr 
        WHERE kr.datetime < ${ datetime1 } AND kr.sklad_id = ${ sklad_id }
        LIMIT 1;
      `;
      sql_end = `
        SELECT 
          sum(CASE WHEN type = 1 and pay_type_id = 1 THEN summa ELSE 0 END ) AS kirim_cash, 
          sum(CASE WHEN type = 1 and pay_type_id = 2 THEN summa ELSE 0 END ) AS kirim_plastic, 
          sum(CASE WHEN type = 0 and pay_type_id = 1 THEN summa ELSE 0 END ) AS chiqim_cash, 
          sum(CASE WHEN type = 0 and pay_type_id = 2 THEN summa ELSE 0 END ) AS chiqim_plastic, 
          sum(CASE WHEN type = 1 and pay_type_id = 3 THEN summa ELSE 0 END ) AS kirim_dollar, 
          sum(CASE WHEN type = 0 and pay_type_id = 3 THEN summa ELSE 0 END ) AS chiqim_dollar 
        FROM kassa_register AS kr 
        WHERE kr.datetime <= ${ datetime2 } AND kr.sklad_id = ${ sklad_id }
        LIMIT 1;
      `;
      sql = `
        SELECT 
            kr.sklad_id, 
            kr.doc_id, 
            kr.doc_type, 
            kr.datetime, 
            kr.comment, 
            sum(CASE WHEN type = 1 and pay_type_id = 1 THEN summa ELSE 0 END ) AS kirim_cash,
            sum(CASE WHEN type = 1 and pay_type_id = 2 THEN summa ELSE 0 END ) AS kirim_plastic,
            sum(CASE WHEN type = 0 and pay_type_id = 1 THEN summa ELSE 0 END ) AS chiqim_cash,
            sum(CASE WHEN type = 0 and pay_type_id = 2 THEN summa ELSE 0 END ) AS chiqim_plastic,
            sum(CASE WHEN type = 1 and pay_type_id = 3 THEN summa ELSE 0 END ) AS kirim_dollar,
            sum(CASE WHEN type = 0 and pay_type_id = 3 THEN summa ELSE 0 END ) AS chiqim_dollar
        FROM kassa_register AS kr
        WHERE kr.datetime >= ${ datetime1 } AND kr.datetime <= ${ datetime2 } AND kr.sklad_id = ${ sklad_id } 
        GROUP BY doc_id, doc_type 
        ORDER BY kr.datetime ASC;
      `;

      let result_begin = await db_sequelize.query(sql_begin, { type: sequelize.QueryTypes.SELECT, raw: true });
      let result_end = await db_sequelize.query(sql_end, { type: sequelize.QueryTypes.SELECT, raw: true });
      let result = await db_sequelize.query(sql, { type: sequelize.QueryTypes.SELECT, raw: true });

      let data = {};
      let width = [1, 3, 3, 2, 2, 2, 2, 2, 2, 2];
      data.header = {
        background: "color_3",
        columns: [
          this.#column('#', width[0]),
          this.#column('Nomi', width[1]),
          this.#column('Vaqti', width[2]),
          this.#column('Izoh', width[3]),
          this.#column('', width[4] + width[5], 'vertical', [], [ this.#column('Naqd', 0), this.#column('', 0, 'horizontal', [ this.#column('Kirim', width[4]), this.#column('Chiqim', width[5]) ]) ]),
          this.#column('', width[6] + width[7], 'vertical', [], [ this.#column('Plastik', 0), this.#column('', 0, 'horizontal', [ this.#column('Kirim', width[6]), this.#column('Chiqim', width[7]) ]) ]),
          this.#column('', width[8] + width[9], 'vertical', [], [ this.#column('Dollar', 0), this.#column('', 0, 'horizontal', [ this.#column('Kirim', width[8]), this.#column('Chiqim', width[9]) ]) ]),
        ],
        link: "/"
      };
      data.items = [];
      result_begin = result_begin.length > 0 ? result_begin[0] : { kirim_cash: 0, chiqim_cash: 0, kirim_plastic: 0, chiqim_plastic: 0, kirim_dollar: 0, chiqim_dollar: 0};
      data.items.push({
        background: "color_1",
        columns: [
          this.#column("Boshlang'ich qoldiq", width[0] + width[1] + width[2] + width[3]),
          this.#column(this.#numberFormat(result_begin.kirim_cash - result_begin.chiqim_cash, 2), width[4] + width[5]),
          this.#column(this.#numberFormat(result_begin.kirim_plastic - result_begin.chiqim_plastic, 2), width[6] + width[7]),
          this.#column(this.#numberFormat(result_begin.kirim_dollar - result_begin.chiqim_dollar, 2), width[8] + width[9]),
        ],
        link: "/"
      });
      let raw_number = 0;
      let total = { kirim_cash: 0, chiqim_cash: 0, kirim_plastic: 0, chiqim_plastic: 0, kirim_dollar: 0, chiqim_dollar: 0 };
      for(let value of result){
        data.items.push({
          background: "color_1",
          columns: [
            this.#column(++raw_number + '', width[0]),
            this.#column(value.doc_type + " № " + value.doc_id, width[1]),
            this.#column(moment.unix(value.datetime).format("DD-MM-YYYY HH:mm:ss"), width[2]),
            this.#column(value.comment, width[3]),
            this.#column('', width[4] + width[5], 'horizontal', [ this.#column(this.#numberFormat(value.kirim_cash, 2), width[4]), this.#column(this.#numberFormat(value.chiqim_cash, 2), width[5]) ]),
            this.#column('', width[6] + width[7], 'horizontal', [ this.#column(this.#numberFormat(value.kirim_plastic, 2), width[6]), this.#column(this.#numberFormat(value.chiqim_plastic, 2), width[7]) ]),
            this.#column('', width[8] + width[9], 'horizontal', [ this.#column(this.#numberFormat(value.kirim_dollar, 2), width[8]), this.#column(this.#numberFormat(value.chiqim_dollar, 2), width[9]) ]),
          ],
          link: "/"
        });
        total.kirim_cash += parseFloat(value.kirim_cash);
        total.chiqim_cash += parseFloat(value.chiqim_cash);
        total.kirim_plastic += parseFloat(value.kirim_plastic);
        total.chiqim_plastic += parseFloat(value.chiqim_plastic);
        total.kirim_dollar += parseFloat(value.kirim_dollar);
        total.chiqim_dollar += parseFloat(value.chiqim_dollar);
      }
      data.items.push({
        background: "color_1",
        columns: [
          this.#column("Jami", width[0] + width[1] + width[2] + width[3]),
          this.#column(this.#numberFormat(total.kirim_cash, 2), width[4]),
          this.#column(this.#numberFormat(total.chiqim_cash, 2), width[5]),
          this.#column(this.#numberFormat(total.kirim_plastic, 2), width[6]),
          this.#column(this.#numberFormat(total.chiqim_plastic, 2), width[7]),
          this.#column(this.#numberFormat(total.kirim_dollar, 2), width[8]),
          this.#column(this.#numberFormat(total.chiqim_dollar, 2), width[9]),
        ],
        link: "/"
      });
      result_end = result_end.length > 0 ? result_end[0] : { kirim_cash: 0, chiqim_cash: 0, kirim_plastic: 0, chiqim_plastic: 0, kirim_dollar: 0, chiqim_dollar: 0};
      data.items.push({
        background: "color_3",
        columns: [
          this.#column("Oxirgi qoldiq", width[0] + width[1] + width[2] + width[3]),
          this.#column(this.#numberFormat(result_end.kirim_cash - result_end.chiqim_cash, 2), width[4] + width[5]),
          this.#column(this.#numberFormat(result_end.kirim_plastic - result_end.chiqim_plastic, 2), width[6] + width[7]),
          this.#column(this.#numberFormat(result_end.kirim_dollar - result_end.chiqim_dollar, 2), width[8] + width[9]),
        ],
        link: "/"
      });
      return data;
    }

    #productMin = async(filter) => {
      let { sklad_id, datetime2 } = filter;
      let query = `datetime > ${ 0 } AND datetime <= ${ datetime2 }`;
      if(sklad_id){
          query += ` AND sklad_id = ${ sklad_id }`;
      }

      let sql = `
          SELECT 
              p.*,
              pr.count,
              pr.sklad_id
          FROM (SELECT 
              id,
              addition_name,
              minimum_amount,
              name
          FROM product 
          # WHERE deleted = false
          ) p
          INNER JOIN 
          (
              SELECT 
                  product_id, sklad_id,
                  SUM(count * POWER(-1, type + 1)) as count 
              FROM product_register 
              WHERE ${ query }
              GROUP BY product_id
          ) pr
          ON pr.product_id = p.id AND pr.count <= p.minimum_amount
          ORDER BY p.addition_name, p.id
      `;
      
      let result = await db_sequelize.query(sql, { raw: true, type: sequelize.QueryTypes.SELECT });
      let raw_number = 0; 
      let data = [];
      for(let value of result){
        data.push({
          title: `${ value.name }`,
          sub_title: `Qoldiq: ${ value.count }, Min: ${ value.minimum_amount }`,
          type: ++raw_number % 2 == 1  ? 'info' : 'error', 
          path: "path1"
        })
      }

      return data;
    }

    #skladChart = async() => {
        let data = [
            {
                "title": "OYBEK DO'KON",
                "values": [
                  {
                    "title": "DU",
                    "value": 10000
                  },
                  {
                    "title": "SE",
                    "value": 20000
                  },
                  {
                    "title": "CH",
                    "value": 30000
                  },
                  {
                    "title": "PA",
                    "value": 40000
                  },
                  {
                    "title": "JU",
                    "value": 50000
                  },
                  {
                    "title": "SH",
                    "value": 60000
                  },
                  {
                    "title": "YA",
                    "value": 70000
                  }
                ]
            },
            {
                "title": "MARKAZ DO'KON",
                "values": [
                  {
                    "title": "DU",
                    "value": 30000
                  },
                  {
                    "title": "SE",
                    "value": 10000
                  },
                  {
                    "title": "CH",
                    "value": 40000
                  },
                  {
                    "title": "PA",
                    "value": 80000
                  },
                  {
                    "title": "JU",
                    "value": 50000
                  },
                  {
                    "title": "SH",
                    "value": 55000
                  },
                  {
                    "title": "YA",
                    "value": 23000
                  }
                ]
            }
        ];

        return data;
    }

    #kontragentTotal = async(filter) => {
      let { sklad_id, datetime1, datetime2 } = filter;
      let query = `datetime > ${ 0 } AND datetime <= ${ datetime2 }`;
      if(sklad_id){
          query += ` AND sklad_id = ${ sklad_id }`;
      }

      let query_date = `payment_date > ${ 0 } AND payment_date <= ${ datetime2 }`;
      if(sklad_id){
          query += ` AND sklad_id = ${ sklad_id }`;
      }

      let sql = `
          SELECT 
              k.id,
              k.name,
              k.payment_date,
              kr.sklad_id,
              kr.total,
              kr.total_dollar 
          FROM (
              SELECT * FROM kontragent WHERE ${query_date}
          ) k
          INNER JOIN 
          (
              SELECT 
                  kontragent_id, sklad_id,
                  SUM(CASE WHEN price_type < 3 THEN summa * POWER(-1, type + 1) ELSE 0 END) as total,
                  SUM(CASE WHEN price_type = 3 THEN summa * POWER(-1, type + 1) ELSE 0 END) as total_dollar 
              FROM kontragent_register 
              WHERE ${ query }
              GROUP BY kontragent_id
          ) kr
          ON kr.kontragent_id = k.id AND (kr.total != 0 OR kr.total_dollar != 0)
          ORDER BY k.payment_date, k.name, k.id
      `;

      let result = await db_sequelize.query(sql, { raw: true, type: sequelize.QueryTypes.SELECT });
      
      let data = [];
      let total_dollar, total, day_diff;
      for(let value of result){
        total_dollar = value.total_dollar.toLocaleString('uz-UZ', { maximumFractionDigits: 3 });
        total = value.total.toLocaleString('uz-UZ', { maximumFractionDigits: 3 });
        day_diff = Math.ceil((moment().unix() - value.payment_date) / (24 * 3600));
        data.push({
          title: `${ value.name }, ${ moment.unix(value.payment_date).format('YYYY-MM-DD') }`,
          subtitle: `${ total_dollar } $ || ${ total }`,
          trailing: `${ day_diff } kun`,
          path: "path1"
        })
      }

      return data;
    }

    #debitCreditWeekly = async() => {
        let data = [
            {
              "x": 1,
              "y": 100000
            },
            {
              "x": 2,
              "y": 150000
            },
            {
              "x": 3,
              "y": 450000
            },
            {
              "x": 4,
              "y": 100300
            },
            {
              "x": 5,
              "y": 100000
            },
            {
              "x": 6,
              "y": 150000
            },
            {
              "x": 7,
              "y": 450000
            },
            {
              "x": 8,
              "y": 100300
            },
            {
              "x": 9,
              "y": 100000
            },
            {
              "x": 10,
              "y": 150000
            },
            {
              "x": 11,
              "y": 100000
            },
            {
              "x": 12,
              "y": 150000
            },
            {
              "x": 13,
              "y": 450000
            },
            {
              "x": 14,
              "y": 100300
            },
            {
              "x": 15,
              "y": 100000
            },
            {
              "x": 16,
              "y": 150000
            },
            {
              "x": 17,
              "y": 450000
            },
            {
              "x": 18,
              "y": 100300
            },
            {
              "x": 19,
              "y": 100000
            },
            {
              "x": 20,
              "y": 150000
            },
            {
              "x": 21,
              "y": 100000
            },
            {
              "x": 22,
              "y": 150000
            },
            {
              "x": 23,
              "y": 450000
            },
            {
              "x": 24,
              "y": 100300
            },
            {
              "x": 25,
              "y": 100000
            },
            {
              "x": 26,
              "y": 150000
            },
            {
              "x": 27,
              "y": 450000
            },
            {
              "x": 28,
              "y": 100300
            },
            {
              "x": 29,
              "y": 100000
            },
            {
              "x": 30,
              "y": 300000
            }
        ];

        return data;
    }

    //column
    #column = (value, weight = 1, type = 'single', horizontal = [], vertical = []) => {
      return {
        value,
        weight,
        type,
        horizontal,
        vertical
      }
    }

    #numberFormat = (number, maximumFractionDigits = 3) => {
      return number.toLocaleString('uz-UZ', { maximumFractionDigits });
    }
}



/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new MobileReportController;