// Express server
const express = require('express');

// Favicon
const favicon = require('express-favicon');

// Bodyparser package
const bodyParser = require('body-parser');

// Handling requests from external API using 'request' package
const Request = require('request');

// Binding 'express' to 'app' constant
const app = express();

// Using the body-parser to get the 'post' requests from FORM
// 'extended: true' includes nested objects from within the form
app.use(bodyParser.urlencoded({extended: true}));

// Use of static folder to apply rules
app.use(express.static('public'));

// Express running on port 3000 
app.listen(process.env.PORT || 3000, function(){
	console.log('Server running on port 3000.');
});

// On request from browser sending the 'html' file
app.get('/', function(request, response){
	response.sendFile(__dirname + '/index.html');
});

// On form submit ( POST )
app.post('/', function(request, response){
	
	var crypto = request.body.crypto;
	var fiat = request.body.fiat;

	var baseURL = 'https://apiv2.bitcoinaverage.com/indices/global/ticker/';

	// Concatening to serve as URL parameter
	var finalURL = baseURL + crypto + fiat;

	Request(finalURL, function(error, res, body){

		// Parsing the JSON data into JS object
		var data = JSON.parse(body);

		// 'last' is the key in JSON received from API
		var price = data.last;

		// Displaying as HTML
		response.write('<!DOCTYPE html><html><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"><title>Cryptocurrency value checker</title><link rel="stylesheet" href="css/bootstrap.lux.css"></head><body><nav class="navbar navbar-expand-lg navbar-dark bg-dark"><a class="navbar-brand" href="#">Real-time Cryptocurrency value</a></nav></body></html>');
		response.write('<p>The current date is '+ data.display_timestamp + '</p><br/>');
		response.write('<h1>The current price of ' + crypto + ' is '+ price + fiat + ' </h1><br/>');

		switch(fiat){
			case 'USD': response.write('<p>' + price + fiat + ' is equivalent to ' + price * parseFloat('69.67') + ' in Indian rupees.</p><br/>');
					break;
			case 'GBP': response.write('<p>' + price + fiat + ' is equivalent to ' + price * parseFloat('90.39') + ' in Indian rupees.</p><br/>');
					break;
			case 'EUR': response.write('<p>' + price + fiat + ' is equivalent to ' + price * parseFloat('78.43') + ' in Indian rupees.</p><br/>');
					break;
		}

		response.sendFile(__dirname + '/response.html');
		
		// Sending the response
		// There cannot be two response.send() so we use response.write()
		response.send();
	});
});

// protected-mountain-30864