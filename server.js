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
app.use('/favorites',favoritesRoute);
app.use('/usersProperties',userPropertiesRoute);
 app.use('/comments',propertyCommentsRoute);
   app.get('*',(req,res)=>{
    res.send('page not found ')
   })
 Client.connect().then(con=>{
    app.listen(PORT,()=>{
        console.log(con);
        console.log(`listening on ${PORT}`)
    })
})