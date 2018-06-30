var express = require('express');
var app = express();
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer();

app.use(express.static(__dirname + '/build'));
app.get('/', function(req, res) {
    res.render('./index.html')
});

app.all('/api/*', function (req, res) {
    proxy.web(req, res, {
        target: 'https://free.currencyconverterapi.com',
        changeOrigin: true
    })
});

var server = app.listen(process.env.PORT || 5000, function () {
    console.log('Listening on port %d', server.address().port);
});