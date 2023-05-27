const express=require('express');
const cors=require('cors');
const axios=require('axios');
const app=express();
require('dotenv').config()
const PORT=process.env.PORT||5000
const APIUrl=process.env.API;
const KEY=process.env.KEY;
const pg=require('pg')
const DBURL=process.env.DBURL;
app.use(express.json());
app.use(cors());
const Client=new pg.Client(DBURL);

app.get('/',async(req,res)=>{
  const options = {
    method: 'GET',
    url: `${APIUrl}/properties/list`,
    params: {
      locationExternalIDs: '5002,6020',
      purpose: 'for-rent',
      hitsPerPage: '25',
      page: '0',
      lang: 'en',
      sort: 'city-level-score',
      rentFrequency: 'monthly',
      categoryExternalID: '4'
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
        'X-RapidAPI-Key': '23b7b0b684msh82ae32f9dad06f4p17313bjsn1460690fb7f7',
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
app.get('/propertyList/city',async(req,res)=>{
    let city=req.query.city;
    let url=`${APIUrl}/auto-complete`
    console.log(url)
    const options = {
        method: 'GET',
        url: url,
        params: {
          query: `${city}`,
          hitsPerPage: '25',
          page: '1',
          lang: 'en'
        },
        headers: {
          'X-RapidAPI-Key': '23b7b0b684msh82ae32f9dad06f4p17313bjsn1460690fb7f7',
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
app.get('/favorites',(req,res)=>{
  const getFavCommand=`SELECT * from Favorites`
  Client.query(getFavCommand)
  .then(response=>res.status(200).send(response.rows))
  .catch(err=>console.log(err))
 })

 app.post('/favorites',async(req,res)=>{
  const {externalID,price,title,imgUrl}=req.body;
  if(externalID&&price&&title&&imgUrl){
    const postFavCommand=`INSERT INTO Favorites(externalId,price,title,imgUrl) values ($1,$2,$3,$4) RETURNING *;`;
    const values=[externalID,price,title,imgUrl]
    Client.query(postFavCommand,values)
    .then(response=>res.status(204).send(response))
    .catch(err=>console.log(err))
  }else res.status(400).send('please provide correct data')
 })
 Client.connect().then(con=>{
    app.listen(PORT,()=>{
        console.log(con);
        console.log(`listening on ${PORT}`)
    })
})