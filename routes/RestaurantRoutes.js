
const express = require('express');
const restModel = require('../restaurants');
const app = express();

app.get('/seed',async (req, res) => {
    try{
        await restModel.insertMany(
            [{
                "name":"Makimono",
                "cuisines":"Japanese",
                "city":"Ajax"
            },
            {
                "name":"Tatami",
                "cuisines":"Japanese",
                "city":"Toronto"
            },
            {
                "name":"Mak European",
                "cuisines":"delicatessen",
                "city":"Quebec"
            },
            {
                "name":"Makimono",
                "cuisines":"delicatessen",
                "city":"Brooklyn"
            }]
        )
        res.send(await restModel.find({}))
    }catch(err){
        res.status(500).send({error: err.toString()})
    }
})

//Question 4
//Selects all columns
app.get('/restaurants', async (req, res) => {
    const restaurants = await restModel.find({});

    try{
        console.log(restaurants[0].name)
        res.status(200).send(restaurants);
    }catch(err){
        res.status(500).send(err)
    }
})



//Question 5
//return all restaurant details by cuisine
app.get('/restaurants/cuisines/:cuisine',async(req,res) => {
    const cuisine = req.params.cuisine
    const restaurants = await restModel.getCuisine(cuisine);

    try{
        if(restaurants.length != 0){
            res.send(restaurants)
        }else{
            res.send(JSON.stringify({status:false, message: "No data found"}))
        }
    }catch(err){
        res.status(500).send(err);
    }
});

//Question 6
//return all restaurants in ASC or DESC by restaurant_id
app.get('/restaurants/sort',async (req,res) => {
        const sortB = req.query.sortBy
        console.log(req.query.sortBy);
        if(sortB == 'DESC'){
            const restaurants = await restModel.find({}).sort({"_id": req.query.sortBy.toLowerCase()})
            try{
                if(restaurants.length != 0){
                    res.send(restaurants);
                }else{
                    res.send(JSON.stringify({status:false, message: "No data found"}))
                }
            }catch(err){
                res.status(500).send(err)
            }
        }else{
            const restaurants = await restModel.find({})
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

//Question 7
//return restaurant details where all cuisines are equal to Delicatessen 
//and the city is not equal to Brooklyn
app.get('/restaurants/Delicatessen', async (req,res) => {
    const restaurants = await restModel.find({cuisines: 'delicatessen', city: {$ne:'Brooklyn'}})

    try{
        res.send(restaurants)
    }catch(err){
        res.status(500).send(err);
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