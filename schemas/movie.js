/**
 * Created by Administrator on 2017/2/11.
 */
//  建模模块
var mongoose = require('mongoose')

//传入的相关的字段类型
var MovieSchema = new mongoose.Schema({
    doctor: String,
    title: String,
    language: String,
    country: String,
    summary: String,
    flash: String,
    poster: String,
    year: Number,
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
MovieSchema.pre('save', function(next) {
    //判断数据是不是新加的
    if(this.isNew) {
        //是新加的就把他的创建的和更新的时间设置为当前的时间
        this.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        //如果不是新加的就把更新的时间设置为当前的时间
        this.meta.updateAt = Date.now()
    }
//调用next他的存储流程才会走下去
    next()
})

//经过模型编译实例化 静态方法
MovieSchema.statics = {
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
module.exports = MovieSchema