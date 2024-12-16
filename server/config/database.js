const mongoose = require("mongoose");

const connectDB = async function(){
    try{
        await mongoose.connect("mongodb+srv://preetambhardwajdoc12:mkhBmN9ZQA0eNMEf@clusterpreetam.oroic.mongodb.net/task_manager");

        console.log("Connected to MongoDB Successfully");
    }catch(error){
        console.error("Could not connect to MongoDB", error);
        process.exit(1);
    }
}

module.exports = connectDB;