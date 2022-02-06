
const express = require('express');
const restModel = require('../restaurants');
const app = express();



app.get('/restaurants', async (req, res) => {
    const restaurants = await restModel.find({});

    try{
        console.log(restaurants[0].name)
        res.status(200).send(restaurants);
    }catch(err){
        res.status(500).send(err)
    }
})


app.get('/restaurants', async (req, res) => {
    const restaurants = await restModel.find({_id: req.query.id}).select("name");

    try{
        res.send(restaurants)
    }catch(err){
        res.status(500).send(err);
    }
});

app.get('/restaurants/name/:name',async(req,res) => {
    const name = req.params.name
    const restaurants = await restModel.find({name:name});

    try{
        if(restaurants.length != 0){
            res.send(restaurants)
        }else{
            res.send(JSON.stringify({status:false, message: "No data found"}))
        }
    }catch(err){
        res.status(500).send(err);
    }
})

app.get('/restaurants/search',async (req,res) => {
    if(Object.keys(req.query).length != 2){
        res.send(JSON.stringify({status:false, message: "Insufficient query parameter"}))
    }else{
        const name = req.query.name
        const restaurants = await restModel.find({ $or: [{name:name}]})

        try{
            if(restaurants.length != 0){
                res.send(restaurants);
            }else{
                res.send(JSON.stringify({status:false, message: "No data found"}))
            }
        }catch(err){
            res.status(500).send(err)
        }
    }
})

app.get('/restaurants/test', async (req,res) => {
    try{
        const restaurants = restModel.
                            find({})
                            .where('name').equals('McDonalds')
                            .where('cuisines').equals('fast')
                            .where('city').equals('Ajax')
                            .limit(10)
                            .select('name cuisines city')
                            .exec((err,data) => {
                                if(err){
                                    res.send(JSON.send({status:false, message: "No data found"}))
                                }else{
                                    res.send(data);
                                }
                            })
    }catch(err){
        res.status(500).send(err)
    }
})
 

app.post('/restaurants', async (req, res) => {
    console.log(req.body)
    const restaurants = new restModel(req.body);

    try{
        await restaurants.save((err) =>{
            if(err){
                res.send(err)
            }else{
                res.send(restaurants);
            }
        });
    }catch(err){
        res.status(500).send(err);
    }
})

module.exports = app