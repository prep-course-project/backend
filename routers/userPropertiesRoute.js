const express=require("express");
const app=express();
const router=express.Router({mergeParams:true});
require('dotenv').config();
const DBURL=process.env.DBURL;
const pg=require('pg');
const Client=new pg.Client(DBURL);

router.get('/',(req,res,next)=>{
    console.log('in get user properties')
    const sqlGetCommand=`SELECT * FROM UserProperties`;
     Client.query(sqlGetCommand)
     .then(response=>{
      res.status(200).send(response.rows);
     })
     .catch(err=>{
      res.status(500).send(err);
     })
  
})
router.post('/',(req,res,next)=>{
    const {title,area,purpose,roomsNum,bathsNum,propertyDescription,price,propertyType,cityName,imgUrl}=req.body;
    const sqlPostCommand=`INSERT INTO UserProperties(title,area,purpose,price,roomsNum,bathsNum,propertyDescription,propertyType,cityName,imgUrl) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *;`;
    const values=[title,area,purpose,price,roomsNum,bathsNum,propertyDescription,propertyType,cityName,imgUrl];
    Client.query(sqlPostCommand,values)
    .then(response=>{ 
      res.status(201).send(response.rows)
    })
})

module.exports=router;