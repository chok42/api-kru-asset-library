var express = require("express");
const router = express.Router();
var cors = require("cors");
var bodyParser = require("body-parser");
const apiEmployee = require("./api-employee");
const apiAsset = require("./api-asset");
const apiAssetType = require("./api-asset-type");

router.use(cors());
router.use(express.json({ limit: "50mb" }));
router.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 500000,
  })
);

router.use(bodyParser.json({ limit: "50mb" }));
router.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 500000,
  })
);

router.use(express.static("public"));
router.use("/images", express.static("images"));

router.use("/employee", apiEmployee);
router.use("/asset", apiAsset);
router.use("/asset-type", apiAssetType);

module.exports = router;
