const express= require('express');
const app=express();
const MongoClient = require("mongodb").MongoClient;
app.use(express.json());
app.use(express.urlencoded({extended:true}));


const client = new MongoClient("mongodb+srv://<username>:<password>@cluster0.p37ld.mongodb.net/test", {
  useUnifiedTopology: true,
});

let collection;
const testfun = async() =>{
    try{
        await client.connect();
        console.log("Connected!");
        collection = client.db().collection("entries");
     }
    catch(err){
        console.error(err);
        process.exit(-1);
    }
}


app.get('/', async(req, res) => {
    let input= await collection.find({}).toArray();;
    res.json(input);
});


app.post('/', async(req,res) => {
    let input=req.body;
    await collection.insertOne(input);
    res.send("Successfully stored your data!");
});


app.put('/', async(req,res)=>{
    let input=req.body;
    let incoming=input.name;
    let data= await collection.findOne({name: incoming});
    data.address=input.address;
    await collection.replaceOne({name: incoming}, data);
    res.send("We have successfully replaced your entry!");
});


app.delete('/', async(req,res)=>{
    let input=req.body;
    await collection.deleteOne({name: input.name});
    res.send("We have deleted the entry!");
});


testfun().then(() => {
    app.listen(8181, ()=> {
        console.log("Server is active:");
    })
})