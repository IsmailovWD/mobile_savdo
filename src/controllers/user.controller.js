const UserModel = require('../models/user.model');
const HttpException = require('../utils/HttpException.utils');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret_jwt } = require('../startup/config');
const BaseController = require('./BaseController');
const { MyUser, MainUser, Admin,Programmer } = require('../utils/userRoles.utils');
const { Op } = require('sequelize');
const moment = require('moment');

// Include models

const SkladModel = require('../models/sklad.model')
/******************************************************************************
 *                              User Controller
 ******************************************************************************/
class UserController extends BaseController {
    getAll = async (req, res, next) => {
        let modelList = await UserModel.findAll({
            where: {
                id: { [Op.ne]: MyUser }
            },
            order: [
                ['fullname', 'ASC'],
                ['id', 'ASC']
            ]
        });
        res.send(modelList);
    };

    getById = async (req, res, next) => {
        const user = await UserModel.findOne({
            where:{ id: req.params.id }
        });

        if (!user) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(user);
    };

    getByUsername = async (req, res, next) => {
        const user = await UserModel.findOne({where:{ username: req.params.username }});
        if (!user) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(user);
    };

    getCurrentUser = async (req, res, next) => {
        res.send(req.currentUser);
    };

    create = async (req, res, next) => {
        this.checkValidation(req);

        await this.hashPassword(req);
        let { 
            phone_number,
            fullname,
            password,
            sklad_id,
            is_admin
        } = req.body;
        const checkNumber = await this.#phoneNumberCheck(phone_number)
        if(!checkNumber) throw new HttpException(500, req.mf('This phone number is registered in the application'))
        try{
            const model = await UserModel.create({
                phone_number,
                fullname,
                password,
                sklad_id,
                role: is_admin ? 'Admin' : 'Hodim'
            })
    
            if (!model) {
                throw new HttpException(500, req.mf('Something went wrong'));
            }
    
            res.status(201).send(model);
        }catch(e){
            throw new HttpException(500, req.mf(e.message))
        }
    };

    update = async (req, res, next) => {
        this.checkValidation(req);

        await this.hashPassword(req);
        let { 
            phone_number,
            fullname,
            password,
            sklad_id
        } = req.body;
        let numberauth = phone_number
        numberauth = numberauth.replace(/\D/g, '');
        console.log(numberauth)
        if(numberauth.length != 12){
            throw new HttpException(400, req.mf('The phone number is in the wrong format'))
        }else{
            numberauth = "+" + numberauth
        }
        const model = await UserModel.findOne({ where: { id: req.currentUser.id }} );

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }
        if(numberauth != model.phone_number){
            const auth = await UserModel.findOne({
                where:{
                    id: {
                        [Op.ne]: req.currentUser.id
                    },
                    phone_number
                }
            })
            if(auth) throw new HttpException(400, req.mf("This phone number is registered in the application"))
            model.phone_number = numberauth;
            const data = await this.#dateFormar()
            const token = jwt.sign({ id: req.currentUser.id, phone: req.currentUser.phone_number.toString(), loginAt: data }, secret_jwt, {
                expiresIn: '24h'
            });
    
            model.token = token;
            model.loginAt = data
        }else{
            model.token = ''
        }
        model.fullname = fullname;
        if(password) model.password = password;
        const skladAuth = await SkladModel.findOne({
            where: {
                id: sklad_id
            }
        })
        if(!skladAuth) throw new HttpException(500, req.mf('Something went wrong'))
        model.sklad_id = sklad_id
        model.save();

        res.send(model);
    };

    update_user = async (req, res) => {
        this.checkValidation(req);

        await this.hashPassword(req);
        let { 
            phone_number,
            fullname,
            password,
            sklad_id
        } = req.body;
        let numberauth = phone_number
        numberauth = numberauth.replace(/\D/g, '');
        if(numberauth.length != 12){
            throw new HttpException(400, req.mf('The phone number is in the wrong format'))
        }else{
            numberauth = "+" + numberauth
        }
        const model = await UserModel.findOne({ where: { id: req.params.id }} );

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }
        if(numberauth != model.phone_number){
            const auth = await UserModel.findOne({
                where:{
                    id: {
                        [Op.ne]: [MainUser, MyUser]
                    },
                    phone_number
                }
            })
            if(auth) throw new HttpException(400, req.mf("This phone number is registered in the application"))
            model.phone_number = numberauth;
            const data = await this.#dateFormar()
            const token = jwt.sign({ id: req.currentUser.id, phone: req.currentUser.phone_number.toString(), loginAt: data }, secret_jwt, {
                expiresIn: '24h'
            });
    
            model.token = token;
            model.loginAt = data
        }else{
            model.token = ''
        }
        model.fullname = fullname;
        if(password) model.password = password;
        const skladAuth = await SkladModel.findOne({
            where: {
                id: sklad_id
            }
        })
        if(!skladAuth) throw new HttpException(500, req.mf('Something went wrong'))
        model.sklad_id = sklad_id
        model.save();

        res.send(model);
    }

    delete = async (req, res, next) => {
        const model = await UserModel.findOne({ where : 
            { 
                id: req.params.id,
                [Op.and]: [
                    // {role : {[Op.ne]: Admin}},
                    {role : {[Op.ne]: Programmer}}
                ]
            }
        })
        
        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        if (model.id === MainUser) {
            throw new HttpException(400, req.mf('This item cannot be deleted'));
        }
        try {
            await model.destroy({ force: true });
        } catch (error) {
            await model.destroy();
        }
        res.send(req.mf('data has been deleted'));
    };

    userLogin = async (req, res, next) => {
        this.checkValidation(req);

        const { phone_number, password: pass } = req.body;
        let numberauth = phone_number
        numberauth = numberauth.replace(/\D/g, '');
        console.log(numberauth)
        if(numberauth.length != 12){
            throw new HttpException(400, req.mf('The phone number is in the wrong format'))
        }else{
            numberauth = "+" + numberauth
        }
        const user = await UserModel.findOne({
            where: {
                phone_number:numberauth
            }
        });

        if (!user) {
            throw new HttpException(401, req.mf('Incorrect login or password!'));
        }

        const isMatch = await bcrypt.compare(pass, user.password);

        if (!isMatch) {
            throw new HttpException(401, req.mf('Incorrect login or password!'));
        }
        const data = await this.#dateFormar()
        const token = jwt.sign({ id: user.id, phone: user.phone_number.toString(), loginAt: data }, secret_jwt, {
            expiresIn: '24h'
        });

        user.token = token;
        user.loginAt = data
        await user.save();
        res.send(user);
    };

    // hash password if it exists
    hashPassword = async (req) => {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 8);
        }
    }
    #dateFormar = async () => {

        const dates = await new Date();
        const uzbekistanTimeZone = 'Asia/Tashkent';
        const uzbekistanFormattedDate = await dates.toLocaleString('en-US', { timeZone: uzbekistanTimeZone });
        const date = await new Date(uzbekistanFormattedDate);
        const year = await date.getFullYear();
        const month = await String(date.getMonth() + 1).padStart(2, "0");
        const day = await String(date.getDate()).padStart(2, "0");
        const hours = await String(date.getHours()).padStart(2, "0");
        const minutes = await String(date.getMinutes()).padStart(2, "0");
        const seconds = await String(date.getSeconds()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        return formattedDate
    }
    #phoneNumberCheck = async (number) => {
        const user = await UserModel.findOne({
            where: {
                phone_number: number
            }
        })
        if (!user) return true
        return false
    }
}



/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new UserController;