var express = require('express');
var exec = require('child_process').exec;
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index');
});

router.post('/', function(req, res) {
  var hex = ['1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
  var key = "";

  for (var i = 0; i < 32; i++) {
    var char = hex[Math.floor(Math.random() * 15)];
    key = key + char;

    if ( i === 7 || i === 11 || i === 15 || i === 19) {
      key = key + '-';
    }
  }

  var makeKey_start = "curl \'https://api.parse.com/1/users\' -H \'Origin: http://dev.justyo.co\' -H \'Accept-Encoding: gzip,deflate,sdch\' -H \'Accept-Language: en-US,en;q=0.8\' -H \'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36\' -H \'Content-Type: text/plain\' -H \'Accept: */*\' -H \'Referer: http://dev.justyo.co/\' -H \'Connection: keep-alive\' --data-binary \'{\"username\":";

  var makeKey_end = ",\"callback\":\"http://asdf.co\",\"emailAddress\":\"ne2210@columbie.edu\",\"password\":\"59c32cd0-c3d7-e1f5-c76f-990f5f4acbb7\",\"udid\":\""+key+"\",\"parentUser\":\"NEPSTEIN\",\"_ApplicationId\":\"iPmwrhjFVCYwL4ZZlicpCIeyJIbRUuXvPhLMCxOs\",\"_JavaScriptKey\":\"MPSGagRkBsI3OCIfFooumAm7sDHaAzZjDlP8BEDN\",\"_ClientVersion\":\"js1.2.18\",\"_InstallationId\":\"5ffaea5d-b2ff-ccf7-5c7f-7e4514ef5ac4\",\"_SessionToken\":\"CGz1ESoL8qEkl5h59LyfAjSpZ\"}\' --compressed";

  var child;

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
      if (event.link !== ''){
              var initYo = 'curl --data "api_token='
                      + key
                      + '&username='
                      + event.friends[i].toUpperCase()
                      +'&link='
                      +event.link
                      + '" http://api.justyo.co/yo/';
           }
      else{
            var initYo = 'curl --data "api_token='
                      + key
                      + '&username='
                      + event.friends[i].toUpperCase()
                      + '" http://api.justyo.co/yo/';
           }

       var subscribeToService = 'curl --data "api_token='
                  + key
                  + '&username='
                  + 'yovite'
                  + '" http://api.justyo.co/yo/';

      child = exec(initYo, function(a, b, c) {
        console.log('init Yo: ');
        console.log(initYo);
        console.log(a, b, c);
        console.log('\n');
      });
    }

    setTimeout(function(){
      var checkCount = 'curl "http://api.justyo.co/subscribers_count/?api_token=' + key + '"';

      console.log('check subscribers curl: ');
      console.log(checkCount);
      console.log('\n');

      var all = 'curl --data "api_token=' + key + '" http://api.justyo.co/yoall/';

      console.log('yo all curl: ');
      console.log(all);
      console.log('\n');

      var host = 'curl --data "api_token='
                  + key
                  + '&username='
                  + event.host.toUpperCase()
                  + '" http://api.justyo.co/yo/';

      console.log('host curl: ');
      console.log(host);
      console.log('\n');

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