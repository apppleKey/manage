var express = require('express');
var router = require('./router/index.js');
var bodyParser = require('body-parser');
// var logger=require('./utils/log').getLogger('info') ;
var log4 = require('./utils/log.js');
logger = log4.getLogger('info')
var app = express();
// log4.useLogger(app)
// app.use(log4.connectLogger( log4.getLogger('info'), { level: 'auto' }));
// app.use('/node_modules/', express.static('./node_modules/'));
app.use('/public', express.static('./public/'));
app.use('/logs', express.static('./logs/'));
app.use('/api/uploads', express.static('./uploads/'));

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//挂载路由到app服务中
// var upload=require('./utils/imgUpload.js')
// app.use('/api/upload/img',upload)
app.use(router);
app.listen(8989, function () {
    logger.info('server running  8989port....')
});
app.on('err',err=>{
    logger.error(err)
})