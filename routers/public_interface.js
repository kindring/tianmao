const express = require("express");
let router = express.Router();
let bbl = require('../bbl/address.js');
router.get("/province",(req,res)=>{
    bbl.get_province(req,res)
});//获取省份数据
router.get("/city",(req,res)=>{
    bbl.get_city(req,res)
});//获取城市数据
router.get("/area",(req,res)=>{
    bbl.get_area(req,res)
});//根据城市id获取区域列表如县等
router.get("/street",(req,res)=>{
    bbl.get_street(req,res)
});//获取街道数据


module.exports = router;