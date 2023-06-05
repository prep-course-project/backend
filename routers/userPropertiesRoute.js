const express=require("express");
const app=express();
const router=express.Router({mergeParams:true});
require('dotenv').config();
const DBURL=process.env.DBURL;
const pg=require('pg');
const Client=new pg.Client(DBURL);


module.exports=router;