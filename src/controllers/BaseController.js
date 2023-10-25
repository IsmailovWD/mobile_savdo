const { validationResult } = require('express-validator');
const HttpException = require('../utils/HttpException.utils');

const HistoryDocModel = require('../models/historyDoc.model')

class BaseController{
    checkValidation = (req) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new HttpException(400, req.mf('Validation faild'), errors);
        }
    }
    writeHistoryDoc = async (history_doc) => {
        const datetime = Math.floor(Date.now() / 1000);
        const { 
            user_id, sklad_id, 
            doc_id, doc_type, action, data
        } = history_doc;
        try{
            await HistoryDocModel.create({
                datetime,
                sklad_id,
                user_id,
                doc_id,
                doc_type,
                action,
                data
            });
        }catch(err){
            console.log(err);
        }
    }
}

module.exports = BaseController;