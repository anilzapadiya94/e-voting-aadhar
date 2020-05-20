var express = require('express');
var morgan = require('morgan');
var path = require('path');
var bodyParser = require('body-parser');	
var passwordHash = require('password-hash');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var request = require('request');
var fs = require('fs');
Web3 = require('web3')
solc = require('solc')
var app = express();
app.use( bodyParser.json() )
app.use(cookieParser());
app.use(morgan('combined'));
var mysql = require("mysql");



app.use("/", express.static("ui"));


var username;
var password;
//var vcode;
var aadhar;
var phone;

// DataBase 

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "blockvotes"
});

connection.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
	res.status(500).send({ message: 'error'+err });
    return;
  }
  console.log('Connection established');
});

app.post('/login', function(req, res) {
    
	
	console.log(req.body);
    username = req.body.username;
    password = req.body.password;
    var hashedPassword = passwordHash.generate(password);
    console.log(hashedPassword);
    
	
	// Perform a query
	$query = "SELECT `id`,`phone`,`aadhar` FROM `code` WHERE `votercode`='"+username+"' AND `password`='"+password+"'";

	connection.query($query, function(err, rows, fields) {
    if(err){
        console.log("An error ocurred performing the query.");
		res.status(500).send({ message: 'error'+err });
        return;
    }
	
	//phone=rows[0].phone;
	//aadhar=rows[0].aadhar;
	//module.exports = { phone: rows[0].phone , aadhar : rows[0].aadhar };
	res.status(200).json({ message: hashedPassword+rows[0].phone+rows[0].aadhar});
    //console.log("Query succesfully executed: ", rows);
	console.log(phone);
	console.log(aadhar);
	});

  /*  if (username == "admin" && password == "password") {

    	res.status(200).send({ message: hashedPassword});

    } else {
    	res.status(500).send({ message: 'error' });
    }*/
});

app.post('/auth', function(req, res) {
	var cookie_pass = req.cookies['auth'];
	if (passwordHash.verify(password, cookie_pass)) {
		res.status(200).send({ message: hashedPassword});
	} else {
		res.status(500).send({ message: 'error' });
	}
});

app.get('/',function(req,res){
	var cookie_pass = req.cookies['auth'];
	//res.status(200).send({ message: "test"});
	console.log("inside /app in index.js 3");
	if (passwordHash.verify(password, cookie_pass)) {
		res.sendFile(path.join(__dirname, 'ui', 'app.html'));
	} else {
		console.log('ok');
		
	}
	//res.json({ text: 't' });
});


app.get('/app', function(req, res){
	
	//var a=phone;
	//var b=aadhar;
	var cookie_pass = req.cookies['auth'];
	var cookie_otp = req.cookies['show'];

	
	if (passwordHash.verify(password, cookie_pass) && cookie_otp != null) {
		
		// Perform a query
		$query = "UPDATE `code` SET `auth` = 1 WHERE `votercode`='"+username+"'";

		connection.query($query, function(err, rows, fields) {
		if(err){
			res.redirect('/');
		}});
		
		//res.sendFile(path.join(__dirname, 'ui', 'clist.html'));
		res.redirect('http://localhost/BlockVotes/public/vote/home?code='+username);
		//window.location = 'http://localhost/BlockVotes/public/vote/home?code='+username;
		res.clearCookie('auth');
		res.clearCookie('show');
		res.clearCookie('aadharno');
		res.clearCookie('phone');
		//res.status(500).send({ message: 'error' });
		console.log("inside /app in index.js");
		
	connection.end(function(){
		// The connection has been closed
	});

	} else if (cookie_otp == null && passwordHash.verify(password, cookie_pass)) {
		
		res.sendFile(path.join(__dirname, 'ui', 'app.html'));
	}
	else {
		console.log("inside /app in index.s 2");
		//res.redirect('/');
		console.log(cookie_otp);
		console.log(cookie_otp);
		
		res.status(500).send({ message: 'error2' });
		//break;
	}
	
});

// app.post('/getaddress',function(req,res){

// });

/*app.get('/info', function(req, res){
	var cookie_pass = req.cookies['auth'];
	var cookie_otp = req.cookies['show'];
	if (cookie_pass == null || cookie_pass == '' || cookie_otp == null || cookie_otp == '') {
		res.redirect('/app');
	} else {
		web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
		 code = fs.readFileSync('Voting.sol').toString()

		 compiledCode = solc.compile(code)
		 abiDefinition = JSON.parse(compiledCode.contracts[':Voting'].interface)
		 VotingContract = web3.eth.contract(abiDefinition)
		 byteCode = compiledCode.contracts[':Voting'].bytecode
		 deployedContract = VotingContract.new(['Sanat','Aniket','Mandar','Akshay'],{data: byteCode, from: web3.eth.accounts[0], gas: 4700000})
		
		contractInstance = VotingContract.at(deployedContract.address)

		res.sendFile(path.join(__dirname, 'ui', 'clist.html'));
	}
	
});*/




var port = 8080;
app.listen(8080, function () {
  console.log(`app listening on port ${port}!`);
});


