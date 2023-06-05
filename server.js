const express=require('express');
const cors=require('cors');
const axios=require('axios');
const app=express();
var bodyParser = require('body-parser');
require('dotenv').config()
const PORT=process.env.PORT||5000
const APIUrl=process.env.API;
const DBURL=process.env.DBURL;
const KEY=process.env.KEY;
const pg=require('pg')
const Client=new pg.Client(DBURL);
const favoritesRoute=require('./routers/favorites');
const userPropertiesRoute=require('./routers/userPropertiesRoute')
const propertyCommentsRoute=require('./routers/propertyComments')
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.get('/',async(req,res)=>{
  console.log('in get ')
  const allQueryes={...req.query}
  const location=req.query.locationExternalIDs;
  console.log(location)
  const options = {
    method: 'GET',
    url: `${APIUrl}/properties/list`,
    params: {
      locationExternalIDs: location||'5002,6020',
      purpose: 'for-rent',
      hitsPerPage: '25',
      page: '0',
      lang: 'en',
      sort: 'city-level-score',
      rentFrequency: 'monthly',
      categoryExternalID: '4',
      ...allQueryes,
    },
    headers: {
      'X-RapidAPI-Key': `${KEY}`,
      'X-RapidAPI-Host': 'bayut.p.rapidapi.com'
    }
  };
  try {
    const response = await axios.request(options);
    res.send(response.data)
  } catch (error) {
    console.error(error);
  }
})
app.get('/properites/detail',async(req,res)=>{
    const id=req.query.id;
    console.log(id)
    const options = {
      method: 'GET',
      url: `${APIUrl}/properties/detail`,
      params: {
        externalID: `${id}`
      },
      headers: {
        'X-RapidAPI-Key': KEY,
        'X-RapidAPI-Host': 'bayut.p.rapidapi.com'
      }
    };
    
    try {
      const response = await axios.request(options);
      res.send(response.data)
    } catch (error) {
      console.error(error);
    }
})
app.get('/propertyList/autoComplete',async(req,res)=>{
    let userQuery=req.query.q;
    let url=`${APIUrl}/auto-complete`
    console.log(url,userQuery)

    const options = {
        method: 'GET',
        url: url,
        params: {
          query: `${userQuery}`,
          hitsPerPage: '25',
          page: '1',
          lang: 'en'
        },
        headers: {
          'X-RapidAPI-Key':KEY ,
          'X-RapidAPI-Host': 'bayut.p.rapidapi.com'
        }
      };
      try {
          const response = await axios.request(options);
            res.send(response.data);
      } catch (error) {
        res.status(500).send(error)
      }
})
app.get('/userProperties',(req,res,next)=>{
  console.log('in get user properties')
  const sqlGetCommand=`SELECT * FROM UserProperties`;
   Client.query(sqlGetCommand)
   .then(response=>{
    res.status(200).send(response.rows);
   })
   .catch(err=>{
    console.log('finding')
    res.status(500).send(err);
   })

});
app.post('/userProperties',(req,res,next)=>{
  const {title,area,purpose,roomsNum,bathsNum,propertyDescription,price,propertyType,cityName,imgUrl}=req.body;
  const sqlPostCommand=`INSERT INTO UserProperties(title,area,purpose,price,roomsNum,bathsNum,propertyDescription,propertyType,cityName,imgUrl) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *;`;
  const values=[title,area,purpose,price,roomsNum,bathsNum,propertyDescription,propertyType,cityName,imgUrl];
  Client.query(sqlPostCommand,values)
  .then(response=>{ 
    res.status(201).send(response.rows)
  })
})
app.get('/comment/:id',(req,res,next)=>{
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
app.post('/comment/:id',(req,res,next)=>{
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
app.get('/favorites',async(req,res,next)=>{
  try{
      const getFavCommand=`SELECT * from Favorites`
      const favoriteProperties=await Client.query(getFavCommand);
      console.log(favoriteProperties,'favorites')
      if (favoriteProperties){
          res.status(200).send(favoriteProperties)
      }
  }
  catch(err){
      console.log(err)
      res.status(500).send(err);
  }

})
app.post('/favorites',async(req,res,next)=>{
  const {externalID,price,title,imgUrl,area,purpose}=req.body;
  const postFavCommand=`INSERT INTO Favorites(externalId,price,title,imgUrl,area,purpose) values ($1,$2,$3,$4,$5,$6) RETURNING *;`;
  const values=[externalID,price,title,imgUrl,area,purpose];
  try{
      const response=await Client.query(postFavCommand,values);
      res.status(202).send(response.rows)
    
  }catch(err){
      res.status(500).send(err)
  }
});
app.delete('/favorites/:id', (req,res) =>{
  const externalID = req.params.id;
  const sql = `DELETE FROM Favorites WHERE externalID = ${externalID}`
  Client.query(sql).then(result => {
    res.status(204).json({
      deleteResult : result.rows
    })
  })
  .catch(err=>res.status(500).send(err))
 })
 
   app.get('*',(req,res)=>{
    res.send('page not found ')
   })
 Client.connect().then(con=>{
    app.listen(PORT,()=>{
        console.log(con);
        console.log(`listening on ${PORT}`)
    })
})