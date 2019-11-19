const pool = require('./pool.js');
function query(sql,values,cb){
    pool.getConnection((err,conn)=>{
        if(err){return cb(err)}
        conn.query(sql,values,cb);
        conn.release();
    })
}//简写部分代码
function province(cb){
    var sql = "select * from bs_province";
    var values = null;
    query(sql,values,cb)
}
function city(code,cb){
    if(arguments.length<2){return false}
    var sql = "select * from bs_city where province_code = ?";
    var values = [code];
    query(sql,values,cb)
}
function area(code,cb){
    if(arguments.length<2){return false}
    var sql = "select * from bs_area where city_code = ?";
    var values = [code];
    query(sql,values,cb)
}
function street(code,cb){
    if(arguments.length<2){return false}
    var sql = "select * from bs_street where area_code = ?";
    var values = [code];
    query(sql,values,cb)
}


module.exports.province = province;
module.exports.city = city;
module.exports.area = area;
module.exports.street = street;