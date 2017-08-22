var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');

var config = {
    user:'parveesh159',
    database:'parveesh159',
    port:5432,
    password:process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});
function hash(input,salt){
	var hashed = crypto.pbkdf25nc(input,salt,10000,512,'sha512');
	return hashed.toString('hex');
}
app.get('/hash/:input',function(req,res){
	var hashedString = hash(req.params.input,'this is some random string');
	res.send(hashedString);	
});

var pool = new Pool(config);
app.get('/test-db',function(req, res){
    
    pool.query('SELECT * from test',function(err,result){
	if(err){
		res.status(500).send(err.toString());
	}else{
		res.send(JSON.stringify(result.rows));
	}
});
    
    
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/article-one',function(req,res){
	res.sendFile(path.join(__dirname, 'ui', 'article-one.html'));
});

app.get('/article-two',function(req,res){
	res.sendFile(path.join(__dirname, 'ui', 'article-two.html'));
});

app.get('/article-three',function(req,res){
	res.sendFile(path.join(__dirname, 'ui', 'article-three.html'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
