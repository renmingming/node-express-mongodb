/**
 * Created by Administrator on 2017/2/12.
 */
var mongoose = require('mongoose')
var UserSchema = require('../schemas/user')
//引入模式文件拿到导出的模块
//编译生成Movie模型
//通过调用mongoose.model（模型名字，模式名字）
var User = mongoose.model('User', UserSchema)

module.exports = User