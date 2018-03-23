const express = require('express');
const bodyParser = require('body-parser');
const https = require("https");
const app = express();

const url = "https://secure.toronto.ca/c3api_data/v2/DataAccess.svc";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/version', (req, res) => {
    res.status(200).send("APIAI Webhook Integration. Version 1.0");
});

app.get('/', (req, res) => {
    res.status(200).send("Hello from APIAI Webhook Integration.");
});

/* Handling all messenges */
app.post('/webhook', (req, res) => {
    console.log(req.body);
    console.log(req.body.result.parameters["ApplicationName"]);
    console.log(req.body.result.parameters["EntitySetName"]);

https.get(url + "/" + req.body.result.parameters["ApplicationName"] + "/" + req.body.result.parameters["EntitySetName"] + "?$top=" + 
req.body.result.parameters["Top"] + "&$skip=" + req.body.result.parameters["Skip"], r => {
  r.setEncoding("utf8");
  let body = "";
  r.on("data", data => {
    body += data;
  });
  r.on("end", () => {
    //body = JSON.parse(body);
    res.status(200).json({
          speech: url + "/" + req.body.result.parameters["ApplicationName"] + "/" + req.body.result.parameters["EntitySetName"] + "?$top=" + req.body.result.parameters["Top"] + "&$skip=" + req.body.result.parameters["Skip"] + ": " +  body,
          displayText:url + "/" + req.body.result.parameters["ApplicationName"] + "/" + req.body.result.parameters["EntitySetName"] + "?$top=" + req.body.result.parameters["Top"] + "&$skip=" + req.body.result.parameters["Skip"] + ": " + body,
          source: 'DataAccess API'});
});
  });
});


const server = app.listen(process.env.PORT || 80, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});
