const express=require('express');
const router=express.Router();
//上传图片的模板
var multer=require('multer');
//生成的图片放入uploads文件夹下
var upload=multer({dest:'uploads/'})
//图片上传必须用post方法
router.post('/img',upload.single('test'),(req,res)=>{
    console.log(req.file);
    res.send({code:0,path:'/api/static/'+file.name})
})
module.exports=router;
