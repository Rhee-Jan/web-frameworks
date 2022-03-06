const express = require('express');
var weather = require('weather-js');

let weatherdata;
const app = express();
app.listen(3000)
app.set('view engine', 'ejs')



const fs = require("firebase-admin");
const serviceAccount = require("./firebase_key.json");
fs.initializeApp({
    credential: fs.credential.cert(serviceAccount)
});

const db = fs.firestore();

const itemdata = db.collection('item');




weather.find({search: 'Davao City, PH', degreeType: 'C'}, function(err, result) {
    if(err) console.log(err);
    
    weatherdata = eval(JSON.stringify(result, null, 2));
    console.log("---------------------START--------------------")
    //console.log(weatherdata[0].location);
  });

app.get('/', function(req,res){
    let pics = [1,2,3];
    let location =  weatherdata[0].location;
    let forecast =  weatherdata[0].forecast;
    //console.log(forecast)
    console.log(location.name)
    let context = {"weatherdata": weatherdata, "pics": pics,'forecast':forecast,'location':location};
    res.render('index', context);
})

app.get('/others', async function(req,res){
    const items = await itemdata.get();
    console.log(items.docs);
    

    //items.forEach(doc => {
    //    console.log(doc.id, "=>", doc.data());
    //})

    let context = {"weatherdata": weatherdata,
                   "itemData":items.docs,
    };
    res.render('others', context);
})