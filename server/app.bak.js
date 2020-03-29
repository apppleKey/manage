const express=require('express')
const app=express();
const mysql=require('mysql')

app.get("/creatdb",(req,res)=>{
    let sql="CREATE DATABASE front";
    db.query(sql,(err,result)=>{
        if(err){
            console.log(err);
        }else{
            console.log(result);
            res.send("Database create success...")
        }
    })
})

app.listen(3000,()=>{
    console.log('3000端口启动。。。。')
})
const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'111111'
})

db.connect(err=>{
    if(err){throw err}
    console.log('连接成功！')
})

