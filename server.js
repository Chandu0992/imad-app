var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');

var config = {
    user:'parveesh159',
    database:'parveesh159',
    host: 'db.imad.hasura-app.io',
    port:5432,
    password:process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});
function hash(input,salt){
	var hashed = crypto.pbkdf2Sync(input,salt,10000,512,'sha512');
	return ["pbkdf2","1000",salt,hashed.toString('hex')].join('$');
}
app.get('/hash/:input',function(req,res){
	var hashedString = hash(req.params.input,'this is some random string');
	res.send(hashedString);	
});

app.post('/create-user',function(req,r){
	var username = req.body.username;
	var password = req.body.password;
	var salt = crypto.randomBytes(128).toString('hex');
	var dbString = hash(password,salt);
	pool.query('INSERT INTO "user"(username,password)values($1,$2)',[username,dbString],function(err, result){
		if(err){
			res.status(500).send(err.toString());
		}else{
			res.send('User Sucessfully Created :'+ username);
		}
	});
});

app.post('/login',function(req,res){
    var username = req.body.username;
	var password = req.body.password;
	
	pool.query('SELECT * FROM "user" WHERE username = $1',[username],function(err, result){
		if(err){
			res.status(500).send(err.toString());
		}else{
		    if(result.rows.length === 0){
                res.send(403).send('Username or Password is InCorrect');		        
		    }else{
		    var dbString = result.rows[0].password;
		    var salt = dbString.split('$')[2];
		    var hashedPassword = hash(password, salt);
		    if(hashedPassword === dbString){
		        res.send('Username and Password is Correct');
		        req.session.auth = {userId: result.rows[0].Id};
		        
		    }else{
		    res.send(403).send('Username or Password is InCorrect');
		}
		    }
		}
	});
});

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: 'someRandomSecretValue',
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30}
}));

app.get('/check-login', function(req, res){
	if(req.session && req.session.auth && req.session.auth.userId){
		res.send('You are Logged in : ' + req.session.auth.userId.toString());
	}else{
		res.send(403).send('username/password is invalid');
	}
});

app.get('/Logout', function(req, res){
	delete req.session.auth;
	res.send('Logged out');
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

function createTemplate (data) {
    var title = data.title;
    var date = data.date;
    var heading = data.heading;
    var content = data.content;
    
    var htmlTemplate = `
    <html>
      <head>
          <title>
              ${title}
          </title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link href="/ui/style.css" rel="stylesheet" />
      </head> 
      <body>
          <div class="container">
              <div>
                  <a href="/">Home</a>
              </div>
              <hr/>
              <h3>
                  ${heading}
              </h3>
              <div>
                  ${date.toDateString()}
              </div>
              <div>
                ${content}
              </div>
              <hr/>
              <h4>Comments</h4>
              <div id="comment_form">
              </div>
              <div id="comments">
                <center>Loading comments...</center>
              </div>
          </div>
          <script type="text/javascript" src="/ui/article.js"></script>
      </body>
    </html>
    `;
    return htmlTemplate;
}

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
