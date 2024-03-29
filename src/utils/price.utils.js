const userRolesUtils = require('./userRoles.utils');
const priceTypeUtils = require('./priceType.utils');
const payTypeUtils = require('./payType.utils');
const SkladModel = require('../models/sklad.model');

exports.getProfitPrice = async (payType, price, dollar_rate) => {
    //Sozlamalarni olish
    let sklad = await SkladModel.findOne({ where: { id: userRolesUtils.MainSklad } });
    let priceType = sklad.common_price_type;
    console.log(priceType)
    if(payType == payTypeUtils.Naqd || payType == payTypeUtils.Plastik)//so'm
    {
        if(priceType){
            if(priceType == priceTypeUtils.Sum)//so'm
            {
                return price;
            }else {//Dollar
                return price / dollar_rate;
            }
        }else{
            return price;
        }
    }else {//Dollar
        if(priceType){
            if(priceType == priceTypeUtils.Sum)//so'm
            {
                return price * dollar_rate;
            }else {//Dollar
                return price;
            }
        }else{
            return price;
        }
    }
}