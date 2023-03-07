var mysql = require('mysql2');
var express=require('express');
const routes = require('./routes/routes');
var app=express()
app.use(express.json())
require('dotenv').config();


routes(app);
app.listen(process.env.PORT,(err)=>
{
  if(err)
  {
    console.log(err)
  }
  else
  {
    console.log("on port 3000")
  }
});
app.get("/healthz",(req,res)=>{
  res.status(200).json();
})
module.exports=app;