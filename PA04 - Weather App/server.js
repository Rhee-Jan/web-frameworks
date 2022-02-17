const express = require('express');
var weather = require('weather-js');


const app = express();
app.listen(3000)
app.set('view engine', 'ejs')
let weatherdata;

weather.find({search: 'Davao City, PH', degreeType: 'C'}, function(err, result) {
    if(err) console.log(err);
    
    weatherdata = eval(JSON.stringify(result, null, 2));
    console.log("---------------------")
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

app.get('/others', function(req,res){
    let context = {"weatherdata": weatherdata};
    res.render('others', context);
})