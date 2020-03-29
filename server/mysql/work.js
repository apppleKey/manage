var Table = {};


var query = require('../utils/mysqlquery')




//新增任务
Table.add = function (work_record, callback) {
    var addSql = 'INSERT INTO work_record(Id,create_date,create_time,uid,details) VALUES(NULL,?,?,?,?)';
    var addSqlParams = new Array();
    // 将学生中的属性添加到SQL值数组中
    console.log(work_record)

    addSqlParams.push(work_record.create_date||new Date() * 1);
    addSqlParams.push(new Date(work_record.create_date));
    addSqlParams.push(work_record.id);
    addSqlParams.push(work_record.details);

    query(addSql, addSqlParams, function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return callback(err);
        }
        callback(null, result);
    });
}

//查询所有任务
Table.find = function (req, callback) {
    query(
        // `SELECT * 
        //     FROM work_record ORDER BY create_date DESC
        // `
        "select work_record.*,user.name as user_name from work_record left join user on work_record.uid=user.Id where work_record.isDelete=0 order by work_record.create_date desc",
        function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return callback(err);
            }
            callback(null, result);
        });
}
//查询所有任务
Table.search = function (req, callback) {
    query(
        // `SELECT * 
        //     FROM work_record ORDER BY create_date DESC
        // `
        "select work_record.*,user.name as user_name from work_record left join user on work_record.uid=user.Id where work_record.isDelete=0 and work_record.uid="+req.uid+" order by work_record.create_date desc",
        function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return callback(err);
            }
            callback(null, result);
        });
}

//编辑任务
Table.edit = function (req, callback) {
    var sql = 'update  work_record set create_date=?,details=? where Id = ?';
    var params = []
    // 将学生中的属性添加到SQL值数组中

    params.push(req.create_date||new Date() * 1);
    params.push(req.details);
    params.push(req.id);

    query(sql, params, function (err, result) {
        if (err) {
            logger.info('[SELECT ERROR] - ', err.message);
            return callback(err);
        }
        callback(null, result);
    });
}

//删除任务
Table.delete = function (req, callback) {
    var sql = 'update  work_record set isDelete=1 where Id = ?';
    var params = []
    // 将学生中的属性添加到SQL值数组中

    params.push(req.id);

    query(sql, params, function (err, result) {
        if (err) {
            logger.info('[SELECT ERROR] - ', err.message);
            return callback(err);
        }
        callback(null, result);
    });
}



// 新增用户
Table.addUser = function (params, callback) {
    var addSql = 'INSERT INTO user(Id,create_date,name,nice_name) VALUES(NULL,?,?,?)';

    var addSqlParams = new Array();
    // 将学生中的属性添加到SQL值数组中
    console.log('addUser', params)

    addSqlParams.push(new Date() * 1);
    addSqlParams.push(params.name);
    addSqlParams.push(params.nice_name);

    query(addSql, addSqlParams, function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return callback(err);
        }
        callback(null, result);
    });
}
/**
 * 查询所有 用户
 * @param callback
 */

Table.findUser = function (req, callback) {
    query(
        `SELECT * 
            FROM user
        `,
        function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return callback(err);
            }
            callback(null, result);
        });
        
}

Table.note={
    add(params,callback){
        var addSql = 'INSERT INTO note(Id,title,details) VALUES(NULL,?,?)';
        var addSqlParams = new Array();
        // 将学生中的属性添加到SQL值数组中
        console.log(params)
    
        addSqlParams.push(params.title);
        addSqlParams.push(params.details);
    
        query(addSql, addSqlParams, function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return callback(err);
            }
            callback(null, result);
        });
    },
    delete (req, callback) {
        var sql = 'update  note set is_delete=1 where Id = ?';
        var params = []
        // 将学生中的属性添加到SQL值数组中
    
        params.push(req.id);
    
        query(sql, params, function (err, result) {
            if (err) {
                logger.info('[SELECT ERROR] - ', err.message);
                return callback(err);
            }
            callback(null, result);
        });
    },
    edit(req, callback) {
        var sql = 'update  note set title=?,details=? where Id = ?';
        var params = []
        // 将学生中的属性添加到SQL值数组中
    
        params.push(req.title);
        params.push(req.details);
        params.push(req.id);
    
        query(sql, params, function (err, result) {
            if (err) {
                logger.info('[SELECT ERROR] - ', err.message);
                return callback(err);
            }
            callback(null, result);
        });
    },
    find (req, callback) {
        query(
            "select * from note where is_delete=0 order by create_time desc",
            function (err, result) {
                if (err) {
                    console.log('[SELECT ERROR] - ', err.message);
                    return callback(err);
                }
                callback(null, result);
            });
    },search(req, callback){
        query(
            `select * from note where title like '%${req.keyword}%' or details like '%${req.keyword}%'  order by create_time desc`,
            function (err, result) {
                if (err) {
                    logger.error('[SELECT ERROR] - ', err.message);
                    return callback(err);
                }
                callback(null, result);
            });
    }
}



var updateSql = 'UPDATE work_record SET ' +
    'name = ?, gender = ? , age = ? , hobbies = ? WHERE id = ?';
Table.findByIdAndUpdate = function (id, work_record, callback) {
    var addSqlParams = new Array();
    // 将学生中的属性添加到SQL值数组中
    for (var key in work_record) {
        addSqlParams.push(work_record[key]);
    }
    addSqlParams.shift()
    addSqlParams.push(id);
    console.log(addSqlParams)
    query(updateSql, addSqlParams, function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return callback(err);
        }
        callback(null, result.affectedRows);
    });
}

Table.findByIdAndRemove = function (id, callback) {
    var delSql = `DELETE FROM work_record where id= ${id}`;
    query(delSql, function (err, result) {
        if (err) {
            return callback(err);
        }
        return callback(null, result.affectedRows);
    });
}

//导出模板构造函数
module.exports = Table;