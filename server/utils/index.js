

// js转换数据库中DateTime字段类型
// 在程序中，从数据库中读取到的日期时间类型数据一般是这种格式："/Date(1355109408000+0800)/"

// 要经过js函数处理变为格式：'2012-12-10 11:05:21'
function timeFormatter(value) {

    var da = new Date(parseInt(value.replace("/Date(", "").replace(")/" , "").split( "+")[0]));

    return da.getFullYear() + "-" + (da.getMonth() + 1) + "-" + da.getDate() + " " + da.getHours() + ":" + da.getMinutes() + ":" + da.getSeconds();

}