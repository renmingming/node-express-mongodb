/**
 * Created by Administrator on 2017/2/11.
 */
//  建模模块
var mongoose = require('mongoose')
//存储密码设计的算法
var bcrypt = require('bcryptjs')
var SALT_WORK_FACTOP = 10

//传入的相关的字段类型
var UserSchema = new mongoose.Schema({
    name: {
        unique: true,
        type: String
    },
    password: String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
})

//为模式添加一个方法
//每存一个数据就调用一次这个save方法
UserSchema.pre('save', function(next) {
    var user = this
    //判断数据是不是新加的
    if(this.isNew) {
        //是新加的就把他的创建的和更新的时间设置为当前的时间
        this.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        //如果不是新加的就把更新的时间设置为当前的时间
        this.meta.updateAt = Date.now()
    }
//  密码加盐  生产随机一个盐 第一个参数生成强度第二个是生产后的盐
    bcrypt.genSalt(SALT_WORK_FACTOP, function(err, salt) {
        if(err){
            return next(err)
        }
        //hash  第一个用户密码第二个加盐后的
        //console.log(user.password)
        bcrypt.hash(user.password, salt, function(err, hash){
            if(err) return next(err)
            //console.log(hash)
            user.password = hash
            next()
        })
    })
//调用next他的存储流程才会走下去
//    next()
})
// 实例方法
UserSchema.methods = {
    comparePassword: function(_password, cb) {
        bcrypt.compare(_password, this.password, function(err, isMatch) {
            if(err) {return cb(err)}

            cb(null, isMatch)
        })
    }
}
//经过模型编译实例化 静态方法在模型中调
UserSchema.statics = {
    //添加fetch方法：取出某前所有的数据
    fetch: function(cb) {
        return this
          .find({})
          .sort('meta.updateAt') //排序 （按照更新时间排序）
          .exec(cb) //执行回调方法
    },
    //findById方法：查询单条数据
    findById: function(id, cb) {
        return this
          .findOne({_id: id})
          .exec(cb)
    }
}

//导出模式MovieSchema
module.exports = UserSchema