const express = require('express');
const bodyParser = require('body-parser');
//const serverless = require('serverless-http');
const app = express();
app.use(bodyParser.json());
require('dotenv').config()

const kruAssetLibrary = require("./api/server");


app.use("/kru-asset-library/api", kruAssetLibrary);

const port = process.env.PORT || 49233;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//module.exports.handler = serverless(app);