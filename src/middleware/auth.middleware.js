const HttpException = require('../utils/HttpException.utils');
const UserModel = require('../models/user.model');
const SkladModel = require('../models/sklad.model');
const jwt = require('jsonwebtoken');
const {secret_jwt} = require('../startup/config')
const userRoles = require('../utils/userRoles.utils');
const { Op , literal} = require('sequelize')
const auth = (...roles) => {
    return async function (req, res, next) {
        try {
            function datetime(){
                let date = new Date(); // Multiply by 1000 to convert seconds to milliseconds

                let day = ('0' + date.getDate()).slice(-2);
                let month = ('0' + (date.getMonth() + 1)).slice(-2);
                let year = date.getFullYear();
                let hours = ('0' + date.getHours()).slice(-2);
                let minutes = ('0' + date.getMinutes()).slice(-2);
                let seconds = ('0' + date.getSeconds()).slice(-2);

                let formattedDateString = `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`
                return formattedDateString
            }
            function int_date(dateString){
                let [datePart, timePart] = dateString.split(' ');
                let [day, month, year] = datePart.split('.');
                let [hours, minutes, seconds] = timePart.split(':');

                let time = new Date(year, month - 1, day, hours, minutes, seconds).getTime();
                return time
            }
            const authHeader = req.headers.authorization;
            const bearer = 'Bearer ';

            if (!authHeader || !authHeader.startsWith(bearer)) {
                throw new HttpException(401, req.mf('Access denied. No credentials sent!'));
            }
            const token = authHeader.replace(bearer, '');

            // Verify Token
            const decoded = jwt.verify(token, secret_jwt);
            const user = await UserModel.findOne({
                attributes: [
                    'id',
                    'phone_number',
                    'fullname',
                    'role',
                    'sklad_id',
                    [literal('sklad.name'), 'sklad_name']
                ],
                where:{ 
                    id: decoded.id, 
                    phone_number: decoded.phone, 
                    loginAt: decoded.loginAt 
                },
                include: [
                    {
                        model: SkladModel,
                        as: 'sklad',
                        attributes:[]
                    }
                ]
            });
            if (!user) {
                throw new HttpException(401, req.mf('Authentication failed!'));
            }
            // check sklad payment
            const sklad = await SkladModel.findOne({
                where: {
                    id: user.sklad_id,
                },
                raw: true
            })
            if(!sklad || !sklad.date2){
                throw new HttpException(401, req.mf('The program has expired'));
            }
            if(int_date(sklad.date2) < new Date().getTime()){
                throw new HttpException(401, req.mf('The program has expired'));
            }
            // check if the current user is the owner user
            const ownerAuthorized = req.params.id == user.id;

            // if the current user is not the owner and
            // if the user role don't have the permission to do this action.
            // the user will get this error
            if (!ownerAuthorized && roles.length && !roles.includes(user.role)) {
                throw new HttpException(401, req.mf('Unauthorized'));
            }
            if(roles.length &&!roles.includes(user.role)){
                throw new HttpException(401, req.mf('Unauthorized'));
            }

            // if the user has permissions
            req.currentUser = user;
            
            next();

        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
}

module.exports = auth;