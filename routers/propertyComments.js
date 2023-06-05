const express=require("express");
const app=express();
const router=express.Router({mergeParams:true});
require('dotenv').config()
const APIUrl=process.env.API;
const DBURL=process.env.DBURL;
const KEY=process.env.KEY;
const pg=require('pg');
const Client=new pg.Client(DBURL);

router.get('/:id',(req,res,next)=>{
    const id=req.params.id
    console.log("in get comment",id)
    const commentCommand=`SELECT * FROM comment where externalID=${id}`;
     Client.query(commentCommand)
      .then(response=>{
        console.log(response)
      res.status(200).send(response.rows);
     })
     .catch(err=>{
      console.log(err)
      res.status(500).send(err);
     })
})
router.post('/:id',(req,res,next)=>{
    const userInput=req.body
    const externalID=req.params.id
    console.log(req.body,'in comment')
    const sql=`INSERT INTO comment(commentName,Email,comment,Rating,externalID) values ($1,$2,$3,$4,$5) RETURNING *;`;
    const values=[userInput.commentName,userInput.Email,userInput.comment,userInput.Rating,externalID];
    Client.query(sql,values)
    .then(response=>{
      getPropertyImg(response.rows.id)
      res.status(200).send(response.rows)
    })
    .catch(err=>{
      res.status(500).send(err)
    })
})
module.exports=router;