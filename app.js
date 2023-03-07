var mysql = require('mysql');
var express=require('express');
const routes = require('./routes/routes');
var app1=express()
app1.use(express.json());
require('dotenv').config();
var db=require('./configuration/sequelize')
const product=require('./models/user')
var app=require('./demo_db_connection')


app;
module.export=app1;