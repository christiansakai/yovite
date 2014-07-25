var express = require('express');
var exec = require('child_process').exec;
var router = express.Router();

var makeKey_start = "curl \'https://api.parse.com/1/users\' -H \'Origin: http://dev.justyo.co\' -H \'Accept-Encoding: gzip,deflate,sdch\' -H \'Accept-Language: en-US,en;q=0.8\' -H \'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36\' -H \'Content-Type: text/plain\' -H \'Accept: */*\' -H \'Referer: http://dev.justyo.co/\' -H \'Connection: keep-alive\' --data-binary \'{\"username\":"

var makeKey_end = ",\"callback\":\"http://asdf.co\",\"emailAddress\":\"ne2210@columbie.edu\",\"password\":\"59c32cd0-c3d7-e1f5-c76f-990f5f4acbb7\",\"udid\":\"5df934c7-ce11-eb05-c162-01be8c2c5128\",\"parentUser\":\"NEPSTEIN\",\"_ApplicationId\":\"iPmwrhjFVCYwL4ZZlicpCIeyJIbRUuXvPhLMCxOs\",\"_JavaScriptKey\":\"MPSGagRkBsI3OCIfFooumAm7sDHaAzZjDlP8BEDN\",\"_ClientVersion\":\"js1.2.18\",\"_InstallationId\":\"5ffaea5d-b2ff-ccf7-5c7f-7e4514ef5ac4\",\"_SessionToken\":\"CGz1ESoL8qEkl5h59LyfAjSpZ\"}\' --compressed";


var child;

router.get('/', function(req, res) {
  res.render('index');
});

router.post('/', function(req, res) {
  var event = req.body;

  console.log('Event submitted: ');
  console.log(event);
  console.log('\n');

  var makeKey = makeKey_start + '"' + event.name.toUpperCase() + '"' + makeKey_end;

  console.log('API Key generated: ');
  console.log(makeKey);
  console.log('\n');

  child = exec(makeKey, function(error, stdout, stderr) {
    console.log('error: ', error);
    console.log('stdout: ', stdout);
    console.log('stderr: ', stderr);
    console.log('\n');

    for (var i = 0, l = event.friends.length; i < l; i++) {
      var initYo = 'curl --data "api_token=5df934c7-ce11-eb05-c162-01be8c2c5128&username='
                    + event.friends[i].toUpperCase() + '" http://api.justyo.co/yo/';

      child = exec(initYo);
    }

    setTimeout(function(){
      var checkCount = 'curl "http://api.justyo.co/subscribers_count/?api_token=5df934c7-ce11-eb05-c162-01be8c2c5128"';

      var all = 'curl --data "api_token=5df934c7-ce11-eb05-c162-01be8c2c5128" http://api.justyo.co/yoall/';

      var host = 'curl --data "api_token=5df934c7-ce11-eb05-c162-01be8c2c5128&username='
                 + event.host.toUpperCase() + '" http://api.justyo.co/yo/';

      child = exec(checkCount, function(err, stdout, stderr) {
        var subscribed = parseInt(stdout.toString().slice(11));

        if (subscribed >= (Number(event.minCount) - 1)) {
          child = exec(all);
          child = exec(host);
        }
      });
    }, (Number(event.timeout)* 60 * 1000));
  });

  res.render('index', { show_yovite_sent: true, animate: 'hinge animated' });
});

router.get('/about', function(req, res) {
  res.render('about');
});

module.exports = router;