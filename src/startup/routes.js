const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require('cookie-parser')
const i18n = require('./i18n.config')
const errorMiddleware = require('../middleware/error.middleware');
// router
const userRouter = require('../routes/user.route');
const skladRouter = require('../routes/sklad.route');
const productcategoryRouter = require('../routes/productcategory.route');
const productRouter = require('../routes/product.route');
const brandRouter = require('../routes/brand.route');
const colorRouter = require('../routes/color.route');
const manufacturRouter = require('../routes/manufactur.route');
const producmodelRouter = require('../routes/productmodel.route');
const unitylRouter = require('../routes/unity.route');
const additionnameRouter = require('../routes/additionname.route');
const valyutaRouter = require('../routes/valyuta.route');
const kursRouter = require('../routes/kurs.route');
const firmaRouter = require('../routes/firma.route')
const kontragentRouter = require('../routes/kontragent.route')
const prixodRouter = require('../routes/prixod.route')
const rasxodRouter = require('../routes/rasxod.route')
const shtrixRouter = require('../routes/shtrix.route')
const reportRouter = require('../routes/report.route')
const staticRouter = require('../routes/modbilereport.route')
const InitialBalanceRouter = require('../routes/initialBalance.route')
const kontragentInitialRouter = require('../routes/kontragentInitial.route')
const kontragentPayRouter = require('../routes/kontragentPay.route')
// router
const HttpException = require('../utils/HttpException.utils');

module.exports = async function (app) {
    // parse requests of content-type: application/json
    // parses incoming requests with JSON payloads
    app.use(express.json());
    // enabling cors for all requests by using cors middleware
    app.use(cors());
    // Enable pre-flight
    app.options("*", cors());
    app.use(express.static(path.join(__dirname, '../../dist')));
    // i18n.setLocale('uz');
    app.use(cookieParser());
    app.use(i18n.init)
    app.use(function (req, res, next) {
        var send = res.send;
        res.send = function (body) {
            let status = res.statusCode;
            if (req.get('mobile') && (typeof body == 'object')) {
                let error = false;
                let message = body.message;
                if (body.errors) {
                    message = message + ': ' + body.errors[0].msg;
                }
                if (body.data) {
                    body = body.data;
                }
                if (!(status == 200 || status == 201)) {
                    error = true;
                    body = null;
                } else if (body.error) {
                    error = true;
                    body = null;
                }
                if (!message) {
                    message = 'Info';
                }
                body = {
                    error,
                    error_code: status,
                    message,
                    data: body,
                };
                if (req.get('mobile') == 'analytics') {
                    body.success = !body.error;
                    // if(error && status === 401){
                    //     body.error_code = 405;
                    // }
                }
                res.statusCode = 200;
            }else if(req.get('mobile') && (typeof body === 'string') && (body === "Ma'lumot o'chirildi" || body === "Маълумот ўчирилди")){
                body = {
                    "error": false,
                    "error_code": 200,
                    "message": body,
                    "body": null
                }
                res.statusCode = 200;
            }
            send.call(this, body);
        };
        next();
    });
    app.use(`/api/v1/users`, userRouter);
    app.use(`/api/v1/sklad`, skladRouter)
    app.use(`/api/v1/productcategory`, productcategoryRouter)
    app.use(`/api/v1/product`, productRouter)
    app.use(`/api/v1/brand`, brandRouter)
    app.use(`/api/v1/color`, colorRouter)
    app.use(`/api/v1/manufactur`, manufacturRouter)
    app.use(`/api/v1/productmodel`, producmodelRouter)
    app.use(`/api/v1/unity`, unitylRouter)
    app.use(`/api/v1/additionname`, additionnameRouter)
    app.use(`/api/v1/valyuta`, valyutaRouter)
    app.use(`/api/v1/kurs`, kursRouter)
    app.use(`/api/v1/firma`, firmaRouter);
    app.use(`/api/v1/kontragent`, kontragentRouter)
    app.use(`/api/v1/prixod`, prixodRouter)
    app.use(`/api/v1/rasxod`, rasxodRouter)
    app.use(`/api/v1/shtrix`, shtrixRouter)
    app.use(`/api/v1/report`, reportRouter)
    app.use(`/api/v1/report`, staticRouter)
    app.use(`/api/v1/initial-balance`, InitialBalanceRouter)
    app.use(`/api/v1/kontragent-initial`, kontragentInitialRouter);
    app.use(`/api/v1/kontragent-pay`, kontragentPayRouter);
    app.use(`/api/v1/`, express.static('uploads'))
    // 404 error
    app.all('*', (req, res, next) => {
        const err = new HttpException(404, req.mf('Endpoint not found'));
        next(err);
    });

    app.use(errorMiddleware);
}