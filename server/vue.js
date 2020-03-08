var express = require('express');
var router = express.Router();
var { Movie, User, Cinema, City, Rate } = require('./utils/schema');
var multer = require("multer");
var axios = require('axios')

var { aesEncrypt, keys } = require('./utils');
router.get('/index', (req, res) => {
    res.send('这是  vue测试接口接口')
})
// 电影接口
router.get('/movie', (req, res) => {
    var limit = req.query.limit * 1 | 0;
    Movie.find().limit(limit).then((result) => {

        res.json({
            msg: "电影信息",
            code: 200,
            result,
        })
    })
})
// 获取卖座电影banner
router.get('/maizuo/banner', (req, res) => {
    axios({

        url: 'https://m.maizuo.com/gateway?type=2&cityId=440300&k=2188731',
        headers: {
            'X-Client-Info': '{"a":"3000","ch":"1002","v":"5.0.4","e":"1574251866721554505801"}',
            'X-Host': 'mall.cfg.common-banner'
        }
    }).then(result => {
        res.json({
            msg: "获取卖座电影banner",
            code: 200,
            result: result.data

        })
    })
})

// 获取卖座电影首页banner正在上映的的数据
router.get("/maizuo/films", (req, res) => {
    console.log(res)
    axios({
        params: {
            cityId: req.query.cityId,
            pageNum:req.query.pageNum,
            type:req.type,
        },
        url: "https://m.maizuo.com/gateway?pageSize=10&k=2370175",
        headers: {
            'X-Client-Info': '{"a":"3000","ch":"1002","v":"5.0.4","e":"15725877173487513444945","bc":"110100"}',
            'X-Host': 'mall.film-ticket.film.list'
        }
    }).then(result => {
        // console.log(result);
        res.json({
            msg: '获取卖座电影的films成功',
            code: 200,
            result: result.data.data.films
        })
    })
})
// 获取卖座电影首页即将上映的电影
router.get("/maizuo/films1", (req, res) => {
    console.log(res.params)
    axios({
        params: {
            cityId: req.query.cityId,
            pageNum:req.query.pageNum,
            type:req.type,
        },
        url: "https://m.maizuo.com/gateway?pageNum=1&pageSize=10&type=2&k=1557906",
        headers: {
            'X-Client-Info': '{"a":"3000","ch":"1002","v":"5.0.4","e":"1574251866721554505801","bc":"340800"}',
            'X-Host': 'mall.film-ticket.film.list'
        },
    }).then(result => {
        console.log(result.data.data.films)
        res.json({
            msg: '获取卖座即将上映电影的films成功',
            code: 200,
            result: result.data.data.films
        })
    })
})
// 获取城市影院信息 网上接口
router.get('/cinemas', (req, res) => {
    // console.log(req.query)
    axios({
        params: {
            cityId: req.query.cityId,
            // ticketFlag:req.query.ticketFlag,

        },
        url: 'https://m.maizuo.com/gateway?ticketFlag=1&k=4994645',
        headers: {
            'X-Client-Info': '{"a":"3000","ch":"1002","v":"5.0.4","e":"1574251866721554505801","bc":"110100"}',
            'X-Host': 'mall.film-ticket.cinema.list'
        },

    }).then(result => {
        // console.log(result.data.data);
        res.json({
            msg: '获取城市影院信息',
            code: 200,
            result: result.data.data
        })
    })
})


// 注册
router.post('/register', (req, res) => {
    const body = req.body;
    console.log(req)
    // console.log(body)
    // 判断用户是否存在 用户名和手机任何一个存在都不是新用户
    User.findOne({
        $or: [
            { username: body.username },
            { mobile: body.mobile }
        ]
    }).then(data => {
        // console.log(data)
        //存在，注册过
        if (data) {
            // console.log(data)
            res.json({
                msg: '用户名或手机号已存在,请更换手机号或者用户名',
                code: 200,
                type: 0,
                result: null,
            })
        } else {//不存在，没有注册过
            body.date = new Date()
            User.insertMany(body)
                .then(result => {

                    res.json({
                        msg: '注册成功，请登录',
                        code: '200',
                        type: 1,
                        result
                    })
                })
        }
    })
})

// 登录
router.post('/login', (req, res) => {
    var body = req.body
    // console.log(body)
    User.findOne({ mobile: body.mobile }).then(data => {
        if (data) {//手机号存在，有这个用户
            if (data.password == body.password) {//登录密码与数据库密码一致，登录成功,设置token
                var str = body.mobile + "-" + body.password;
                var token = aesEncrypt(str, keys)
                // console.log("token:"+token)
                req.session.token = token;
                req.session.mobile = body.mobile;
                req.session.username = data.username;
                res.json({
                    code: 200,
                    msg: '登录成功',
                    type: 1,
                    token,
                    result: data,

                })

            } else {//登录密码与数据库密码一致，登录不成功
                res.json({
                    code: 200,
                    msg: '用户名或密码错误，登录失败',
                    type: 0,
                    result: data,

                })
            }
        } else {
            res.json({//没注册去注册
                msg: '手机号不存在，请重新登录',
                code: 200,
                type: 0,
                result: data
            })
        }
    })
})
// 获取用户信息
router.get("/getInfo", (req, res) => {
    User.findOne({
        mobile: req.session.mobile
    }).then(result => {
        res.json({
            code: 200,
            msg: '获取用户的个人信息成功',
            result
        })
    })
})
// 城市列表信息
router.get('/cityList', (req, res) => {

    City.find().then(result => {
        res.json({
            code: 200,
            msg: '获取城市列表信息',
            result,
        })
    })
})
// 修改头像
// 磁盘存储数据 
var storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "./public/upload");  // 存储到 /public/upload
    },
    filename(req, file, cb) {

        cb(null, Date.now() + "wh1910" + file.originalname);
    }
})
var upload = multer({ storage: storage }).any();  // 接收任何格式的文件


// 图片上传  
router.post("/uploadImg", upload, (req, res) => {
    console.log(req.files[0]);
    var path = req.files[0].path;

    User.updateOne({
        mobile: req.session.mobile
    }, {
            $set: {
                pic: path
            }
        }).then(result => {
            res.json({
                msg: '头像上传成功',
                code: 200,
                pic: path,
                type: 1,
                mobile: req.session.mobile,
                result
            })
        })
})

// 根据手机号获取头像
router.post("/getAvatarImg", (req, res) => {
    User.findOne({
        mobile: req.session.mobile
    }).then(result => {
        if (result.pic) {
            res.json({
                msg: '获取头像成功',
                code: 200,
                result,
                type: 1
            })
        } else {
            res.json({
                msg: '获取头像失败',
                code: 200,
                result,
                type: 0
            })
        }
    })
})
// 模糊查询接口
router.get('/search', (req, res) => {
    var key = req.query.name;
    Cinema.find({ name: new RegExp(key) }).sort("1").limit(10).then(result => {
        // console.log(res)
        res.json({
            msg: '模糊查询电影院',
            code: 200,
            result: result
        })
    })

})

// 评论
router.get('/comment', (req, res) => {
    console.log(req.session)
    Rate.findOne({
        username: req.session.username,
        filmId: req.query.filmId,
    }).then(result => {
        if (result) {
            res.json({
                msg: '获取电影信息成功',
                code: 200,
                data: result
            })

        } else {
            res.json({
                msg: '你没有看过',
                code: 500,
                data: null,
            })
        }


    })

})
// 修改评分
router.post('/changeRate', (req, res) => {
    var body = req.body
    console.log(body)
    Rate.findOne({
        username: req.session.username,
        filmId: body.filmId
    }).then(result => {
        if (result) {
            Rate.updateOne({
                username: req.session.username,
                filmId: body.filmId
            }, {
                    rate: body.rate
                }).then(result => {
                    Rate.findOne({
                        username: req.session.username,
                        filmId: body.filmId
                    }).then(result => {
                        res.json({
                            code: 200,
                            msg: '修改评分成功',
                            data: result,
                        })
                    })
                })
        } else {
            Rate.insertMany([
                {
                    username: req.session.username,
                    filmId: body.filmId,
                    rate: body.rate,

                }
            ]).then(result => {
                Rate.findOne({
                    username: req.session.username,
                    filmId: body.filmId
                }).then(result => {
                    res.json({
                        code: 200,
                        msg: '添加评分成功',
                        data: result,
                    })
                })
            })
        }
    })
})

module.exports = router