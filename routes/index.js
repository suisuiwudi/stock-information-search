var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');
var parseString = require('xml2js').parseString;
var https = require('https');
var cheerio = require('cheerio');
var csv_parse = require('csv-parse')
var apikey = '6X2AN0JOV9DIHGHK';
var error_message = {
  "Error Message": "Invalid API call"
}
var csv_parser = csv_parse({delimiter: ','});
const stitch = require("mongodb-stitch")
const clientPromise = stitch.StitchClientFactory.create('nodejs-xixgf');

const fs = require('fs')
var problems = {}
difficulty_score = {Easy:1, Medium:3, Hard:6}
ac_score = 1.5
fs.readFile(path.join(__dirname, '../', 'public', 'data' , 'leetcode_problem.csv'), (err, data) => {
      if (err) throw err; 
      csv_parse(data, function(err, rows) {
        // Your CSV data is in an array of arrys passed to this callback as rows.
         rows.forEach(function(element){
            var name = element[1]
            // console.log(element[0])
            problems[name] = {
                id: element[0],
                name: element[1],
                acrate: element[2],
                difficulty: element[3],
                score: difficulty_score[element[3]] * (ac_score - parseFloat(element[2].substring(0, element[2].length - 1)) / 100)
            }
            // console.log(problems)
         })
        })
});

error_message = JSON.stringify(error_message);

router.get('/', function(req, res, next){
	res.sendFile(path.join(__dirname, '../', 'views', 'index.html'));
});

router.get('/leetcode', function(req, res, next){
        res.sendFile(path.join(__dirname, '../', 'views', 'leetcode.html'));
});
 
router.get('/leetcode/:user', function(req, res, next){
        var username = req.params.user;
        var leetcode_url = 'https://leetcode.com/' + username + '/';
        request(leetcode_url, function(error, response, body){
            if (response.body){
                var isodate = new Date().getTime()
                var timezone = -7
                // isodate += timezone * 1000 * 60 * 60
                
                var log = {"2018-06-22":""}
                // res.json(response.body); 
                var $ = cheerio.load(response.body);
                submissions = []
                $('div.panel-heading:contains("Most recent submissions")').next().children().each(function(i, elem){
                    // console.log($(this).children('.badge.progress-bar-success'))
                    var tmp_time = isodate;
                    var time = $(this).children('.text-muted').text() 
                    day_index = time.indexOf('day');
                    if (day_index > 0){
                        tmp_time -=  1000 * 60 * 60 * 24 * parseInt(time.substring(day_index - 3, day_index))
                    }
                    hour_index = time.indexOf('hour');
                    if (hour_index > 0){
                        tmp_time -= 1000 * 60 * 60 * parseInt(time.substring(hour_index - 3, hour_index))
                    }
                    minute_index = time.indexOf('minute');
                    if (minute_index > 0){
                        tmp_time -= 1000 * 60 * parseInt(time.substring(minute_index - 3, minute_index))
                    }
                    problem_name = $(this).children('b').text()
                    console.log(problem_name)
                    console.log(problems[problem_name])
                    item = {
                        username:username,
                        problem_name:problem_name,
                        success:$(this).children('span').first().text(),
                        time: new Date(tmp_time),
                        score: problems[problem_name]['score']
                    }
                    if (item['success'].includes('Accepted')){
                        var tmp_item = item;
                        submissions.push(tmp_item);
                        clientPromise.then(client => {
                          const db = client.service('mongodb', 'mongodb-atlas').db('leetcode');
                          client.login().then(() =>
                            db.collection('submissions').updateOne(
                                { $and : [ { owner_id: client.authedId()}, {username:username}, {problem_name : tmp_item['problem_name']}, {time: { $lte : tmp_item['time']}} ]},
                                { $set : tmp_item },
                                { upsert : true}
                            )
                          );
                        });
                    }
                });
                clientPromise.then(client => {
                  const db = client.service('mongodb', 'mongodb-atlas').db('leetcode');
                  client.login().then(() =>
                    db.collection('submissions').find({username:username}).limit(100).execute()
                    .then(docs => {
                        console.log("Found docs", docs)
                        console.log("[MongoDB Stitch] Connected to Stitch")
                    }).catch(err => {
                        console.error(err)
                    })
                )})

            
                res.json(submissions);
                
            }
            else
                res.json(error_message);
        });

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