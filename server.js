'use strict';

const express= require('express');
const cors = require('cors');
const axios = require('axios');

require('dotenv').config();
const mongoose= require('mongoose');

const server = express();
server.use(cors());
server.use(express.json());

const PORT= process.env.PORT;

mongoose.connect('mongodb://localhost:27017/',
    { useNewUrlParser: true, useUnifiedTopology: true }); 


server.listen(PORT,(req,res)=>{
    console.log(`listening on PORT ${PORT}`);
})



const dataSchema=new mongoose.Schema({
    name:String,
    img:String,
    level:String
})

const dataModel = mongoose.model('digimon',dataSchema)

//test 
server.get('/',(req,res)=>{
    res.send("Hello Razan From Alaa")
})

server.get('/getData',getDataHandler)
server.post('/addToFav',addToFavHandler)
server.get('/getFavData',getFavDataHandler)
server.delete('/deleteFavData/:id',deleteFavDataHandler)
server.put('/updateFav/:id',updateFavHandler)





function getDataHandler(req,res){
    const url = `https://digimon-api.vercel.app/api/digimon`

    axios.get(url).then(result=>{
        const dataArray= result.data.map(item=>{
            return new Digimon(item)
        })
        res.status(200).send(dataArray)
    })
}


function addToFavHandler(req,res){
    const {name,img,level}= req.body

    const favData= new dataModel({
        name:name,
        img:img,
        level:level
    })
    favData.save()
}

function getFavDataHandler(req,res){
    dataModel.find({},(error,data)=>{
        res.status(200).send(data)
    })
}


function deleteFavDataHandler(req,res){
    const id = req.params.id

    dataModel.remove({_id:id},(error,data)=>{
        dataModel.find({},(error,data)=>{
            res.status(200).send(data)
        })
    })
}


function updateFavHandler(req,res){
    const id = req.params
    dataModel.find({},(error,data)=>{
        data.map((item,index)=>{
            if (index==id) {
                // console.log(item);
                item.name=req.body.name,
                item.img=req.body.img,
                item.level=req.body.level
            }
            item.save()
        }) 
        console.log(data);
        res.send(data)
})
}


class Digimon{
    constructor(data){
       this.name=data.name,
       this.img=data.img,
       this.level=data.level
    }
}