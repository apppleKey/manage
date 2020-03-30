const log4js = require('log4js'),
    path = require('path')

log4js.configure({
    replaceConsole: true,
    appenders: {
        stdout: { //控制台输出
            type: 'console'
        },
        trace: {
            type: 'dateFile',
            filename: 'logs/tracelog/',
            pattern: 'trace-yyyy-MM-dd.log',
            alwaysIncludePattern: true
        },
        debug: {
            type: 'dateFile',
            filename: 'logs/debuglog/',
            pattern: 'debug-yyyy-MM-dd.log',
            alwaysIncludePattern: true
        },
        info: {
            type: 'dateFile',
            filename: 'logs/infolog/',
            pattern: 'info-yyyy-MM-dd.log',
            alwaysIncludePattern: true,
            compress: false,
            backups: 10,
            keepFileExt: true,

        },
        warn: {
            type: 'dateFile',
            filename: 'logs/warnlog/',
            pattern: 'warn-yyyy-MM-dd.log',
            alwaysIncludePattern: true
        },
        error: {
            type: 'dateFile',
            filename: 'logs/errorlog/',
            pattern: 'error-yyyy-MM-dd.log',
            alwaysIncludePattern: true
        },
        fatal: {
            type: 'dateFile',
            filename: 'logs/fatallog/',
            pattern: 'fatal-yyyy-MM-dd.log',
            alwaysIncludePattern: true
        },
        console: {
            type: 'dateFile',
            filename: 'logs/consolelog/',
            pattern: 'console-yyyy-MM-dd.log',
            alwaysIncludePattern: true
        },
    },
    categories: {
        trace: {
            appenders: ['stdout', 'trace'],
            level: 'trace'
        }, //appenders:采用的appender,取appenders项,level:设置级别
        debug: {
            appenders: ['stdout', 'debug'],
            level: 'debug'
        },
        default: {
            appenders: ['stdout', 'info'],
            level: 'info'
        },
        warn: {
            appenders: ['stdout', 'warn'],
            level: 'warn'
        },
        error: {
            appenders: ['stdout', 'error'],
            level: 'error'
        },
        fatal: {
            appenders: ['stdout', 'fatal'],
            level: 'fatal'
        },
    }
})

exports.getLogger = function (name) { //name取categories项
    return log4js.getLogger(name || 'info')
}

// const loggerOfConsole = log4js.getLogger('console');
// console.log = loggerOfConsole.info.bind(loggerOfConsole); // do the same for others - console.debug, etc.
// console.debug = loggerOfConsole.info.bind(loggerOfConsole);

// app.use(log4js.connectLogger(loggerOfConsole, { level: 'auto' }));

// exports.useLogger = function (app) {//用来与express结合
// const loggerOfConsole = log4js.getLogger('info');
// app.use(log4js.connectLogger(loggerOfConsole, { level: 'auto' }));
// return
//     app.use(log4js.connectLogger(log4js.getLogger('console'), {
//         format: '[:remote-addr :method :url :status :response-timems][:referrer HTTP/:http-version :user-agent]'//自定义输出格式
//     }))
// }
exports.useLogger = function (app, logger) { //用来与express结合
    app.use(log4js.connectLogger(logger || logger.getLogger('info'), {
        format: '[:remote-addr :method :url :status :response-timems][:referrer HTTP/:http-version :user-agent]' //自定义输出格式
    }))
}