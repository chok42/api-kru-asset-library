var fs = require("fs");

//------------------------------------------------------------------------------------------------------------------------------------------
function addfile(name,file) {
  if (!fs.existsSync('images')) {
    fs.mkdirSync('images'); //create floder
  }

  var base64Data = file.split(",")[1]; // split with `,`
  var filePath = `./images/${name}.png`;
  fs.writeFile(filePath, base64Data, "base64", function (err, data) {
    if (err) {
      console.log("err", err);
    }
  });
}

//remove file in folder
function removefile(filePath) {
  fs.unlink(filePath, (err) => {
    if (err && err.code == "ENOENT") {
      console.info("Error! File doesn't exist.");
    } else if (err) {
      console.error("Something went wrong. Please try again later.");
    } else {
      console.info(`Successfully removed file with the path of ${filePath}`);
    }
  });
}

module.exports = {
  addfile,
  removefile,
} 