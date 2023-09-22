const Joi = require('joi'); 
const Role = require('../../utils/userRoles.utils');

exports.userSchemas = { 
  create: Joi.object({
    phone_number: Joi.string().required().min(13).max(13),
    fullname: Joi.string().required().min(3).max(50),
    sklad_id: Joi.number().required(),
    // role: Joi.string().valid(Role.Admin, Role.User, Role.Programmer).required(),
    password: Joi.string().min(3).required().label('Password'),
    confirmPassword: Joi.any().equal(Joi.ref('password'))
        .required()
        .label('Confirm password')
        .messages({ 'any.only': '{{#label}} does not match' })
  }),

  update: Joi.object({
    phone_number: Joi.string().min(13).max(13).allow(null),
    fullname: Joi.string().required().min(3).max(50),
    sklad_id: Joi.number().required(),
    // role: Joi.string().valid(Role.Admin, Role.User, Role.Programmer).required(),
    password: Joi.string().min(3).label('Password').empty('').allow(null),
    confirmPassword: Joi.any().equal(Joi.ref('password')).empty('').allow(null)
        .label('Confirm password')
        .messages({ 'any.only': '{{#label}} does not match' })
  }),

  login: Joi.object({
    phone_number: Joi.string().required().min(3),
    password: Joi.string().required().min(3),
  }), 
};