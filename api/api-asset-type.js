
const express = require('express');
const router = express.Router();
const {kal_db} = require("../config/db");

//get
router.post('/get', async (req, res) => {
    try {
        const json = req.body;

        if (!json) {
          res.send({
            status: "400",
            message: "WARNING",
            detail: "No Data found",
          });
          return;
        }

        let page = parseInt(json['page']) || 1;
        let pageSize = parseInt(json['pageSize']) || 10;
        let offset = (page - 1) * pageSize;

        const [res_total] = await kal_db.query(`SELECT COUNT(*) AS total FROM mas_asset_type WHERE asset_type_name LIKE '%' ? '%'`,[json['search']]);
        const [res_asset] = await kal_db.query(`SELECT * FROM mas_asset_type WHERE asset_type_name LIKE '%' ? '%' LIMIT ? OFFSET ?`,[json['search'],pageSize,offset]);
          
        if (res_asset) {
          
        let total = parseInt(res_total[0].total);
        let totalPages = Math.ceil(total / pageSize);

          res.send({
            data: res_asset,
            totalCount: total,
            totalPages: totalPages,
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

router.post('/get-list', async (req, res) => {
  try {
      const [res_asset] = await kal_db.query(`SELECT * FROM mas_asset_type`);
      if (res_asset) {
        res.send({
          data: res_asset,
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

router.post('/getbyid', async (req, res) => {
  try {
      const json = req.body;

      if (!json['asset_type_id']) {
        res.send({
          status: "400",
          message: "WARNING",
          detail: "No Data found",
        });
        return;
      }

      const [res_asset] = await kal_db.query(`SELECT * FROM mas_asset_type WHERE asset_type_id = ?`,json['asset_type_id']);

      if (res_asset && res_asset.length > 0) {
        res.send({
          data: res_asset[0],
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

//insert
router.post('/insert', async (req, res) => {

    try {
      let json = req.body;
      
      if (!json) {
        res.send({
          status: "400",
          message: "WARNING",
          detail: "No Data found",
        });
        return;
      }

      let asset_type_id = 1
      const [res_total] = await kal_db.query(`SELECT asset_type_id FROM mas_asset_type ORDER BY asset_type_id DESC`);
      if(res_total && res_total.length > 0){
        asset_type_id = res_total[0].asset_type_id + 1
      }

      const [res_assetType] = await kal_db.query(` SELECT * FROM mas_asset_type WHERE asset_type_name = ?` ,[json["asset_type_name"]]);

      if(res_assetType && res_assetType.length > 0){
          res.send({
              status: "404",
              message: "WARNING",
              detail:"Duplicate Data"
          });
          return
      }

      await kal_db.query(`INSERT INTO mas_asset_type (asset_type_id,asset_type_name) VALUES (?,?)`,[asset_type_id,json['asset_type_name']]);
          
      res.send({
          status: "200",
          message: "SUCCESS",
          detail:"successful"
      });
    
      } catch (err) {
        res.send({ status: "500", message: 'ERROR',detail:err.message });
      }
});

//update
router.post('/update', async (req, res) => {
  try {
    const json = req.body;
    

    if (!json) {
      res.send({
        status: "400",
        message: "WARNING",
        detail: "No Data found",
      });
      return;
    }

    const [res_asset] = await kal_db.query(`SELECT * FROM mas_asset_type WHERE asset_type_id = ?`,[json["asset_type_id"]]);

    if (res_asset && res_asset.length > 0) {

      await kal_db.query(`UPDATE mas_asset_type SET asset_type_name = ?  WHERE asset_type_id = ?`,[json["asset_type_name"],json["asset_type_id"]]);

      res.send({
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
    res.send({ status: "500", message: "ERROR", detail: err.message });
  }
});

//delete
router.post('/delete', async (req, res) => {

  try {
      const json = req.body;
      
      if (!json['asset_type_id']) {
        res.send({
          status: "400",
          message: "WARNING",
          detail: "No Data found",
        });
        return;
      } 

      await kal_db.query(`DELETE FROM mas_asset_type WHERE asset_type_id = ?`,[json["asset_type_id"]]);        
      
      res.send({
          status: "200",
          message: "SUCCESS",
          detail:"successful"
      });
  
    } catch (err) {
      res.send({ status: "500", message: 'ERROR',detail:err.message });
    }
});

module.exports = router;