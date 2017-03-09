/**
 * Created by Administrator on 2017/3/9 0009.
 */
var _ = require('underscore') // underscore.extend用一个对象里的字段替换掉老的对应的对象的字段
var Movie = require('../models/movie')
var User = require('../models/user')

module.exports = function(app) {
    //pre handle user 预处理session用户
    app.use(function(req, res, next) {
        var _user = req.session.user
        if(_user) {
            // 付给本地变量
            app.locals.user = _user
        }
        return next()
    })
//路由开始
//index page
    app.get('/', function(req, res) {
        //console.log(req.session.user)
        //调用模型Movie.fetch方法
        Movie.fetch(function(err, movies) {
            if (err) {
                console.log(err)
            }
            //渲染首页模板查询到的movies
            res.render('index', {
                title: 'imooc 首页',
                movies: movies
            })
        })

    })
//signup注册
    app.post('/user/signup', function(req, res) {
        var _user = req.body.user
        //'/user/signup/111?id=1112' req.query.id====id=1112
        //'/user/signup/111?id=1112'req.param('id') 111  >  1112
        //console.log(req.body)
        User.findOne({name: _user.name}, function(err, user) {
            if(err){
                console.log(err)
            }
            //console.log("name::::::"+user)
            if(user) {
                return res.redirect('/')
            } else {
                var user = new User(_user)
                user.save(function(err, user) {
                    if(err) {
                        console.log(err)
                    }
                    res.redirect('/admin/userlist')
                    console.log(user)
                })
            }
        })
    })

//signin登录
    app.post('/user/signin', function(req, res) {
        var _user = req.body.user
        var name = _user.name
        var password = _user.password

        User.findOne({name: name}, function(err, user) {
            if(err) {
                console.log(err)
            }
            if(!user) {
                return res.redirect('/')
            }
            user.comparePassword(password, function(err, isMatch) {
                if(err) {
                    console.log(err)
                }
                if(isMatch) {
                    //console.log('password is matched')
                    //保存登录状态
                    req.session.user = user
                    return res.redirect('/')
                } else {
                    console.log('password is not matched')
                }
            })
        })
    })
//退出
    app.get('/logout', function(req, res){
        //删除信息
        delete req.session.user
        delete app.locals.user
        res.redirect('/')
    })

//userlist page
    app.get('/admin/userlist', function(req, res) {
        User.fetch(function(err, users) {
            if(err) {
                console.log(err)
            }
            res.render('userlist', {
                title: '用户列表页',
                users: users
            })
        })
    })
//detail page
    app.get('/movie/:id', function(req, res) {
        var id = req.params.id // 取当前id
        //Movie.findById查询单条数据方法
        Movie.findById(id, function(err, movie) {
            //渲染
            res.render('detail', {
                title: 'imooc ' + movie.title,
                movie: movie
            })
        })

    })

//更新电影 admin update movie
    app.get('/admin/update/:id', function(req, res) {
        var id = req.params.id

        if (id) {
            Movie.findById(id, function(err, movie) {
                res.render('admin', {
                    title: 'node 后台更新页',
                    movie: movie
                })
            })
        }
    })

//从表单post过来的数据admin post movie
    app.post('/admin/movie/new', function(req, res) {
        //拿去id
        var id = req.body.movie._id
        //拿去movie对象
        var movieObj = req.body.movie
        //声明一个对象
        var _movie
        //如果id不是undefinde说明这条数据在数据库中存储过得
        //需要对他更新
        if(id !== 'undefined') {
            //现在数据库中查询这条数据
            Movie.findById(id, function(err, movie) {
                if(err) {
                    console.log(err)
                }
                //用post传过来的数据更新原来的数据
                //underscore.extend用一个对象里的字段替换掉老的对应的对象的字段
                //老的为第一个,新的为第二个
                _movie = _.extend(movie, movieObj)
                _movie.save(function(err, movie) {
                    if(err) {
                        console.log(err)
                    }
                    //更新或存储成功了,让数据呈现在对应的详情页面
                    res.redirect('/movie/' + movie._id)
                })
            })
        } else {
            //如果数据库中没有post的
            _movie = new Movie({
                doctor: movieObj.doctor,
                title: movieObj.title,
                country: movieObj.country,
                language: movieObj.language,
                year: movieObj.year,
                poster: movieObj.poster,
                summary: movieObj.summary,
                flash: movieObj.flash
            })

            _movie.save(function(err, movie) {
                if (err) {
                    console.log(err)
                }

                res.redirect('/movie/' + movie._id)
            })
        }
    })

//admin page
    app.get('/admin/movie', function(req, res) {
        res.render('admin', {
            title: 'imooc 后台录入页',
            movie: {
                title: '',
                doctor: '',
                country: '',
                year: '',
                poster: '',
                flash: '',
                summary: '',
                language: ''
            }
        })
    })

//list page
    app.get('/admin/list', function(req, res) {
        //调用模型Movie.fetch方法
        Movie.fetch(function(err, movies) {
            if (err) {
                console.log(err)
            }
            //渲染
            res.render('list', {
                title: 'imooc 列表页',
                movies: movies
            })
        })
    })

//list delete movie
    app.delete('/admin/list', function(req, res){
        var id = req.query.id
        if(id){
            Movie.remove({_id: id}, function(err, movie){
                if(err){
                    console.log(err)
                }else {
                    res.json({success:1})
                }
            })
        }
    })
//失去焦点判断用户名是否存在
    app.post('/userlist', function(req, res) {
        var val = req.body.name
        //console.log(val)
        if(val !== '') {
            User.findOne({name: val}, function(err, username) {
                if(username) {
                    res.json({success:1})
                } else {
                    res.json({success:0})
                }
            })
        } else {
            res.json({success:-1})
        }
    })
}

