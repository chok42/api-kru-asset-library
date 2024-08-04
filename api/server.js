var express = require("express");
const router = express.Router();
var cors = require("cors");
var bodyParser = require("body-parser");
const apiEmployee = require("./api-employee");
const apiAsset = require("./api-asset");
const apiAssetType = require("./api-asset-type");
const apiAgency = require("./api-aegncy");
const apiRole = require("./api-role");

router.use(cors());
router.use(express.json({ limit: "1024mb" }));
router.use(
  express.urlencoded({
    limit: "1024mb",
    extended: true,
    // parameterLimit: 500000,
  })
);

router.use(bodyParser.json({ limit: "1024mb" }));
router.use(
  bodyParser.urlencoded({
    limit: "1024mb",
    extended: true,
    // parameterLimit: 500000,
  })
);

router.use(express.static("public"));
router.use("/images", express.static("images"));

router.use("/employee", apiEmployee);
router.use("/asset", apiAsset);
router.use("/asset-type", apiAssetType);
router.use("/agency", apiAgency);
router.use("/role", apiRole);

module.exports = router;
