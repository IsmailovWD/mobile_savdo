const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require('cookie-parser')
const i18n = require('./i18n.config')
const errorMiddleware = require('../middleware/error.middleware');
// router
const userRouter = require('../routes/user.route');
const skladRouter = require('../routes/sklad.route');
// router
const HttpException = require('../utils/HttpException.utils');

module.exports = async function(app){
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
                if(
                    req.get('mobile') && 
                    (typeof body == 'object')
                ){
                    let error = false;
                    let message = body.message;
                    if(body.errors){
                        message = message + ': ' + body.errors[0].msg;
                    }
                    if(body.data){
                        body = body.data;
                    }
                    if(!(status == 200 || status == 201)){
                        error = true;
                        body = null;
                    }else if(body.error){
                        error = true;
                        body = null;
                    }
                    if(!message){
                        message = 'Info';
                    }
                    body = { 
                        error,
                        error_code: status,
                        message,
                        data: body,
                    };
                    if(req.get('mobile') == 'analytics'){
                        body.success = !body.error;
                        // if(error && status === 401){
                            //     body.error_code = 405;
                            // }
                        }
                        res.statusCode = 200;
                    }
                send.call(this, body);
            };
            next();
        });
        app.use(`/api/v1/users`, userRouter);
        app.use(`/api/v1/sklad`, skladRouter)
        // 404 error
        app.all('*', (req, res, next) => {
            const err = new HttpException(404, req.mf('Endpoint not found'));
            next(err);
        });

        app.use(errorMiddleware);
}