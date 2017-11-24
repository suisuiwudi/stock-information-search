var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');
var parseString = require('xml2js').parseString;
var https = require('https');
var apikey = '6X2AN0JOV9DIHGHK';
var error_message = {
  "Error Message": "Invalid API call"
}
error_message = JSON.stringify(error_message);

router.get('/', function(req, res, next){
	res.sendFile(path.join(__dirname, '../', 'views', 'index.html'));
});

router.get('/test', function(req, res, next){
        res.sendFile(path.join(__dirname, '../', 'views', 'test.html'));
});

router.get('/autocomplete/:id', function(req, res, next){
        var url = 'http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input='+req.params.id;
        request(url, function(error, response, body){
            if (response.body)
                res.json(response.body);
            else
                res.json(error_message);
        });
});

router.get('/table/:id', function(req, res, next){
        var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+req.params.id+'&apikey='+apikey;
        request(url, function(error, response, body){
            if (response.body)
                res.json(response.body);
            else
                res.json(error_message);
        });       
})
router.get('/price/:id', function(req, res, next) {
        var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=full&symbol='+req.params.id+'&apikey='+apikey;
        request(url, function(error, response, body){
            if (response.body)
                res.json(response.body);
            else
                res.json(error_message);
        });
});

router.get('/SMA/:id', function(req, res, next) {
        var url = 'https://www.alphavantage.co/query?function=SMA&interval=daily&time_period=10&series_type=close&symbol='+req.params.id+'&apikey='+apikey;
        request(url, function(error, response, body){
            if (response.body)
                res.json(response.body);
            else
                res.json(error_message);
        });
});

router.get('/EMA/:id', function(req, res, next) {
        var url = 'https://www.alphavantage.co/query?function=EMA&interval=daily&time_period=10&series_type=close&symbol='+req.params.id+'&apikey='+apikey;
        request(url, function(error, response, body){
            if (response.body)
                res.json(response.body);
            else
                res.json(error_message);
        });
});

router.get('/STOCH/:id', function(req, res, next) {
        var url = 'https://www.alphavantage.co/query?function=STOCH&interval=daily&symbol='+req.params.id+'&apikey='+apikey;
        request(url, function(error, response, body){
            if (response.body)
                res.json(response.body);
            else
                res.json(error_message);
        });
});

router.get('/RSI/:id', function(req, res, next) {
        var url = 'https://www.alphavantage.co/query?function=RSI&interval=daily&time_period=10&series_type=close&symbol='+req.params.id+'&apikey='+apikey;
        request(url, function(error, response, body){
            if (response.body)
                res.json(response.body);
            else
                res.json(error_message);
        });
});

router.get('/ADX/:id', function(req, res, next) {
        var url = 'https://www.alphavantage.co/query?function=ADX&interval=daily&time_period=10&symbol='+req.params.id+'&apikey='+apikey;
        request(url, function(error, response, body){
            if (response.body)
                res.json(response.body);
            else
                res.json(error_message);
        });
});

router.get('/CCI/:id', function(req, res, next) {
        var url = 'https://www.alphavantage.co/query?function=CCI&interval=daily&time_period=10&symbol='+req.params.id+'&apikey='+apikey;
        request(url, function(error, response, body){
            if (response.body)
                res.json(response.body);
            else
                res.json(error_message);
        });
});

router.get('/BBANDS/:id', function(req, res, next) {
        var url = 'https://www.alphavantage.co/query?function=BBANDS&interval=daily&time_period=10&series_type=close&symbol='+req.params.id+'&apikey='+apikey;
        request(url, function(error, response, body){
            if (response.body)
                res.json(response.body);
            else
                res.json(error_message);
        });
});

router.get('/MACD/:id', function(req, res, next) {
        var url = 'https://www.alphavantage.co/query?function=MACD&interval=daily&series_type=close&symbol='+req.params.id+'&apikey='+apikey;
        request(url, function(error, response, body){
            if (response.body)
                res.json(response.body);
            else
                res.json(error_message);
        });
});

router.get('/News/:id', function(req, res, next) {
        var url = 'https://seekingalpha.com/api/sa/combined/'+req.params.id+'.xml';
        request(url, function(error, response, body){
                var data;
                if (response.body) {
                    parseString(response.body, function (err, result) {
                    data = result;
                    });
                }
            if (data)
                res.json(data);
            else
                res.json(error_message);
        });
});
module.exports = router;