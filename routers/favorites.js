const express=require("express");
const router=express.Router({mergeParams:true});
const DBURL=process.env.DBURL;
require('dotenv').config()
const pg=require('pg')
const Client=new pg.Client(DBURL);
router.get('/',async(req,res,next)=>{
    const getFavCommand=`SELECT * from Favorites`
    Client.query(getFavCommand)
    .then(response=>res.status(200).send(response.rows))
    .catch(err=>console.log(err))
})
router.post('/',(req,res,next)=>{
    const {externalID,price,title,imgUrl,area,purpose}=req.body;
    const postFavCommand=`INSERT INTO Favorites(externalId,price,title,imgUrl,area,purpose) values ($1,$2,$3,$4,$5,$6) RETURNING *;`;
    const values=[externalID,price,title,imgUrl,area,purpose]
    Client.query(postFavCommand,values)
    .then(response=>console.log(response))
    .catch(err=>res.status(500).send(err))
});
router.delete('/:id', (req,res) =>{
    const externalID = req.params.id;
    const sql = `DELETE FROM Favorites WHERE externalID = ${externalID}`
    Client.query(sql).then(result => {
      res.status(204).json({
        deleteResult : result.rows
      })
    })
    .catch(err=>res.status(500).send(err))
   })
module.exports=router;