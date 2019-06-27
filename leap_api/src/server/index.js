const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient
const JSON = require('circular-json');
var ObjectId = require('mongodb').ObjectID;

var db;

MongoClient.connect('mongodb://127.0.0.1:27017', (err, client) => {
  	if (err) return console.log(err)
  	db = client.db('leap')
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
})




app.use(express.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "DELETE, PUT");
  next();
});

app.get('/financeData', (req, res, next) => {
	var cursor = db.collection('user_info').find().toArray((err, results) => {
	
		res.json(results)
	})
});

app.post('/inputData', (req, res, next) => {

	db.collection('user_info').insertOne(req.body, (err, result) => {
		if (err) return console.log(err)
		return res.send('saved to db yo');
	})
});

app.post('/getID', (req, res, next) => {
	let my_id = req.body._id
	console.log(my_id)
	let object_id = {"_id": ObjectId(my_id)}
	var cursor = db.collection('user_info').findOne((object_id, {"time": true}), ((err, result) => {
		if (err) return console.log(err)
		console.log(result)
		}))
	
});

app.post('/timePost', (req, res, next) => {
	let my_id = req.body._id
	console.log(req.body.time)
	let object_id = {"_id": ObjectId(my_id)}
	var cursor = db.collection('user_info').find((object_id), ((err, result) => {
		if (err) return console.log(err)
		db.collection('user_info').update(object_id, {"$set": {"time": req.body.time}});
		}))

		
	})



const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`))