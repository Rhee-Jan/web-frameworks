import dateFormat, { masks } from "dateformat";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const express = require('express');
const bodyParser = require('body-parser');
var strftime = require('strftime');


var urlencodedParser = bodyParser.urlencoded({ extended: false })

const app = express();
app.use(express.static('assets'))
const port = process.env.PORT || 3000;
app.listen(port)
app.set('view engine', 'ejs')


var fs = require("firebase-admin");
let serviceAccount;

if(process.env.GOOGLE_CREDENTIALS!= null){
    serviceAccount = JSON.parse(process.env.GOOGLE_CREDENTIALS)
}
else{
    serviceAccount = require("./throwers-key.json")
}

fs.initializeApp({
    credential: fs.credential.cert(serviceAccount)
});

const db = fs.firestore();

const itemdata = db.collection('items');


app.get('/', async function(req,res){
    const items = await itemdata.get();
    let context = {"itemData":items.docs,};
    res.render('index', context);
})

app.get('/details/item_id=:item_id', async function(req,res){ 
    let item_id = req.params.item_id;
    let item = db.collection("items").doc(item_id);
    const items = await item.get();
    let sales = await db.collection("items/"+item_id+"/sales").get();
    let context = {
    item_id:item_id, "itemData":items.data(),"sales":sales.docs,
    };
    res.render('others', context);
})

app.post('/update/item_id=:item_id', urlencodedParser, async function(req,res){
    let quan = req.body.quantity;
    
    
    let item_id = req.params.item_id;
    let item = db.collection("items").doc(item_id);
    const items = await item.get();
    let sales = await db.collection("items/"+item_id+"/sales").get();
    var curr_date = strftime('%B %d, %Y, %I:%M %p').toString();


    let totalsales;
    totalsales = parseInt(items.data()["total_sales"]);

    let length;
    length = sales.docs.length + 1;
    length = length.toString();
    
    let context = {
    item_id:item_id, "itemData":items.data(),"sales":sales.docs
    };

    db.collection("items").doc(item_id).update({total_sales: totalsales + parseInt(quan)}); //UPDATE total_sales

    db.collection("items/"+item_id+"/sales").doc(length).set({ //ADD new sales
        date: curr_date,
        quan: quan,
    });
    
    res.redirect("/details/item_id=" +item_id)
})


