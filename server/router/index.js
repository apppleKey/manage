var fs = require('fs');
var table = require('../mysql/work.js');
var logger = require('../utils/log').getLogger('info');

let path = require("path");
var express = require('express');


var router = express.Router();

var multer = require('multer');
//生成的图片放入uploads文件夹下
    var upload =multer({dest:'./uploads/'})

//图片上传必须用post方法
router.post('/api/upload/img', upload.single('file'), (req, res) => {
    console.log(req.file);
    // console.log(file);
    if (req.file.length === 0) {  //判断一下文件是否存在，也可以在前端代码中进行判断。
        res.render("error", { message: "上传文件不能为空！" });
        return
    } else {
        let file = req.file;
        let fileInfo = {};
        var lastname=new Date()*1+'_'+file.originalname

            fs.renameSync(path.join(__dirname,'../uploads/' + file.filename),path.join(__dirname,'../uploads/' + lastname) );//这里修改文件名字，比较随意。    
        // 获取文件信息
        fileInfo.mimetype = file.mimetype;
        fileInfo.originalname = file.originalname;
        fileInfo.size = file.size;
        fileInfo.path = file.path;
        fileInfo.destination = file.destination;

        // 设置响应类型及编码
        res.set({
            'content-type': 'application/json; charset=utf-8'
        });


        res.send({ code: 0, data: '/api/uploads/' + lastname })
    }
})
/**
 * @api {get} /api/work_record/list 
 * @apiVersion 1.0.0
 * @apiName 获取工作记录
 * @apiGroup work_record
 * @apiParam {Number} id 新闻id
 * @apiSuccess {Number} code 结果标识
 * @apiSuccess {String} message 结果说明
 * @apiSuccess {Object} data 结果数据
 * @apiSuccessExample Success-Response:
 *     HTTP/11 200 OK
 *     {
 *       "code": 1,
 *       "mess": "成功",
 *       "data": {}
 *     }
 */

// 工作记录相关

router.get('/api/work_record/list/search', function (req, res) {
    table.search(req.query, function (err, data) {
        if (err) {
            return res.send({
                code: -1,
                msg: err
            });
        }
        res.send({
            code: 0,
            msg: '成功！',
            data: data
        })
    })

});
router.get('/api/work_record/list', function (req, res) {
    table.find(req.body, function (err, data) {
        if (err) {
            return res.send({
                code: -1,
                msg: err
            });
        }
        res.send({
            code: 0,
            msg: '成功！',
            data: data
        })
    })

});

router.post('/api/work_record/add', function (req, res) {
    table.add(req.body, function (err) {
        if (err) {
            return res.send({
                code: -1,
                msg: 'err'
            });
        }
        res.send({
            code: 0,
            msg: '添加成功！'
        })
    })
})

router.post('/api/work_record/edit', function (req, res) {
    logger.info('/api/work_record/edit', req.method, req.body)
    table.edit(req.body, function (err) {
        if (err) {
            logger.error(err)
            return res.send({
                code: -1,
                msg: '操作失败'
            });
        }
        res.send({
            code: 0,
            msg: '操作成功！'
        })
    })
})

router.post('/api/work_record/delete', function (req, res) {
    logger.info('/api/work_record/delete', req.method, req.body)
    table.delete(req.body, function (err) {
        if (err) {
            logger.error(err)
            return res.send({
                code: -1,
                msg: '操作失败'
            });
        }
        res.send({
            code: 0,
            msg: '操作成功！'
        })
    })
})


//笔记相关
router.get('/api/note/list', function (req, res) {
    table.note.find(req.body, function (err, data) {
        if (err) {
            return res.send({
                code: -1,
                msg: err
            });
        }
        res.send({
            code: 0,
            msg: '成功！',
            data: data
        })
    })

});

router.post('/api/note/add', function (req, res) {
    table.note.add(req.body, function (err) {
        if (err) {
            return res.send({
                code: -1,
                msg: 'err'
            });
        }
        res.send({
            code: 0,
            msg: '添加成功！'
        })
    })
})

router.post('/api/note/edit', function (req, res) {
    logger.info('/api/note/edit', req.method, req.body)
    table.note.edit(req.body, function (err) {
        if (err) {
            logger.error(err)
            return res.send({
                code: -1,
                msg: '操作失败'
            });
        }
        res.send({
            code: 0,
            msg: '操作成功！'
        })
    })
})

router.post('/api/note/delete', function (req, res) {
    logger.info('/api/note/delete', req.method, req.body)
    table.note.delete(req.body, function (err) {
        if (err) {
            logger.error(err)
            return res.send({
                code: -1,
                msg: '操作失败'
            });
        }
        res.send({
            code: 0,
            msg: '操作成功！'
        })
    })
})
router.get('/api/note/search', function (req, res) {
    logger.info('/api/note/search', req.method, req.query)
    table.note.search(req.query, function (err, data) {
        if (err) {
            logger.error(err)
            return res.send({
                code: -1,
                msg: err
            });
        }
        res.send({
            code: 0,
            msg: '成功！',
            data: data
        })
    })
})

// 用户相关
router.get('/api/user/list', function (req, res) {
    // logger.info(req)
    table.findUser(req.body, function (err, data) {
        if (err) {
            return res.send({
                code: -1,
                msg: err
            });
        }
        res.send({
            code: 0,
            msg: '成功！',
            data: data
        })
    })

});

router.post('/api/user/add', function (req, res) {
    table.addUser(req.body, function (err) {
        if (err) {
            return res.send({
                code: -1,
                msg: 'err'
            });
        }
        res.send({
            code: 0,
            msg: '添加成功！'
        })
    })
})




// 3. 把 router 导出
module.exports = router;