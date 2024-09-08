
const express = require('express');
const router = express.Router();
const {kal_db} = require("../config/db");

router.post('/get-list', async (req, res) => {
  try {

      const [res_agency] = await kal_db.query(`SELECT * FROM mas_role`);

      if (res_agency) {
        res.send({
          data: res_agency,
          status: "200",
          message: "SUCCESS",
          detail: "successful",
        });
        return;
      }

       res.send({
         status: "404",
         message: "WARNING",
         detail: "No Data",
       });
  
    } catch (err) {
      res.send({ status: "500", message: 'ERROR',detail:err.message });
    }
});


module.exports = router;