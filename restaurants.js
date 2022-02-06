const mongoose  = require("mongoose");

const RestaurantsSchema = new mongoose.Schema({
    name:{
        type:String
    },
    cuisines:{
        type:String
    },
    city:{
        type:String
    },
   
})

RestaurantsSchema.pre('save',(next) =>{
    console.log("Before Save")
    let now = Date.now()

    this.updatedat = now
    
    if(!this.created){
        this.created = now
    }

    next()
});

RestaurantsSchema.static("getCuisine", function(value) {
    return this.find({cuisines: value})
});

RestaurantsSchema.pre('findOneAndUpdate', (next) => {
    console.log("Before findOneAndUpdate")
    let now = Date.now()
    this.updatedat = now
    console.log(this.updatedat)
    next()
})

RestaurantsSchema.post('init', (doc) => {
    console.log('%s has been initialized from the db', doc._id);
})
RestaurantsSchema.post('validate', (doc) => {
    console.log('%s has been validated (but not saved yet)', doc._id);
})
RestaurantsSchema.post('save', (doc) => {
    console.log('%s has been saved', doc._id);
})
RestaurantsSchema.post('remove', (doc) => {
    console.log('%s has been removed', doc._id);
})

const Restaurant = mongoose.model("Restaurant", RestaurantsSchema)
module.exports = Restaurant;