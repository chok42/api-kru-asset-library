
const express = require('express');
const router = express.Router();
const {kal_db} = require("../config/db");

const { addfile, removefile } = require('../constants/constant');

//get
//asset
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

        let query_is_used = ''
        let query_status = ''
        let query_agency = ''
        let query_type = ''

        if(json['asset_is_used']){
          query_is_used = `ASS.asset_is_used = '${json['asset_is_used']}' AND `
        }
        if(json['asset_status_id']){
          query_status = `ASS.asset_status_id = '${json['asset_status_id']}' AND `
        }

        if(json['agency_id']){
          query_agency = `ASS.agency_id = '${json['agency_id']}' AND `
        }

        if(json['asset_type_id']){
          query_type = `ASS.asset_type_id = ${json['asset_type_id']} AND `
        }

        const query_search = `${query_is_used}${query_status}${query_agency}${query_type}`

        const [res_total] = await kal_db.query(`
          SELECT COUNT(*) AS total 
          FROM trans_asset ASS
          LEFT JOIN mas_asset_type    AS ATY ON ATY.asset_type_id = ASS.asset_type_id
          LEFT JOIN mas_agency        AS AGE ON AGE.agency_id = ASS.agency_id
          LEFT JOIN mas_asset_status  AS AST ON AST.asset_status_id = ASS.asset_status_id
          WHERE ${query_search} CONCAT_WS(' ', ASS.asset_code, ASS.asset_name ,ASS.asset_building_code)  LIKE '%' ? '%'`,[json['search']]);
          
        const [res_asset] = await kal_db.query(`
          SELECT ASS.*
          ,ATY.asset_type_name 
          ,AGE.agency_name
          ,AST.asset_status_name
          FROM trans_asset ASS
          LEFT JOIN mas_asset_type    AS ATY ON ATY.asset_type_id = ASS.asset_type_id
          LEFT JOIN mas_agency        AS AGE ON AGE.agency_id = ASS.agency_id
          LEFT JOIN mas_asset_status  AS AST ON AST.asset_status_id = ASS.asset_status_id
          WHERE ${query_search} CONCAT_WS(' ', ASS.asset_code, ASS.asset_name ,ASS.asset_building_code)  LIKE '%' ? '%' LIMIT ? OFFSET ?`,[json['search'],pageSize,offset]);
          

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

router.post('/getbyid', async (req, res) => {
  try {
      const json = req.body;

      if (!json['asset_id']) {
        res.send({
          status: "400",
          message: "WARNING",
          detail: "No Data found",
        });
        return;
      }

      const [res_asset] = await kal_db
      .query(`
          SELECT ASS.*
          ,ATY.asset_type_name 
          ,AGE.agency_name
          ,AST.asset_status_name
          FROM trans_asset ASS
          LEFT JOIN mas_asset_type    AS ATY ON ATY.asset_type_id = ASS.asset_type_id
          LEFT JOIN mas_agency        AS AGE ON AGE.agency_id = ASS.agency_id
          LEFT JOIN mas_asset_status  AS AST ON AST.asset_status_id = ASS.asset_status_id
          WHERE asset_id = ?`,json['asset_id']
        );

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

// asset status
router.post('/get-list-status', async (req, res) => {
  try {
      const [res_asset] = await kal_db.query(`SELECT *  FROM mas_asset_status`);
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

      let asset_id = 1
      const [res_total] = await kal_db.query(`SELECT asset_id  FROM trans_asset ORDER BY asset_id DESC`);
      if(res_total && res_total.length > 0){
        asset_id = res_total[0].asset_id + 1
      }

      const [res_asset] = await kal_db.query(` SELECT * FROM trans_asset WHERE asset_code = ?` ,[json["asset_code"]]);

      if(res_asset && res_asset.length > 0){
          res.send({
              status: "404",
              message: "WARNING",
              detail:"Duplicate Data"
          });
          return
      }

      await kal_db.query(`
          INSERT INTO trans_asset (asset_id
          ,asset_code
          ,asset_name
          ,asset_model
          ,asset_brand
          ,asset_description
          ,asset_price
          ,asset_creation_date
          ,asset_start_date
          ,asset_building_code
          ,asset_is_used
          ,asset_status_id
          ,agency_id
          ,asset_type_id
          ,asset_image) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,[asset_id
          ,json["asset_code"]
          ,json["asset_name"]
          ,json["asset_model"]
          ,json["asset_brand"]
          ,json["asset_description"]
          ,json["asset_price"]
          ,new Date()
          ,json["asset_start_date"] ? json["asset_start_date"] : null
          ,json["asset_building_code"]
          ,json["asset_is_used"]
          ,json["asset_status_id"]
          ,json["agency_id"]
          ,json["asset_type_id"]
          ,json['asset_image'] ? `images/${json["asset_code"]}.png` : null]);
          
      if(json['asset_image']){
        addfile(json["asset_code"],json['asset_image'])
      }

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

    const [res_asset] = await kal_db.query(`SELECT * FROM trans_asset WHERE asset_id = ?`,[json["asset_id"]]);
    
    if (res_asset && res_asset.length > 0) {
      const resAsset = res_asset[0]

      if(json["asset_image"]){
        removefile(resAsset.asset_image)
        addfile(resAsset.asset_code,json["asset_image"])
      }

      await kal_db.query(
        `
        UPDATE trans_asset SET asset_name = ?
        ,asset_model = ?
        ,asset_brand = ?
        ,asset_description = ?
        ,asset_price = ?
        ,asset_start_date = ?
        ,asset_building_code = ?
        ,asset_is_used = ?
        ,asset_status_id = ?
        ,agency_id = ?
        ,asset_type_id = ? 
        ,asset_image = ?
        ,emp_id = ? WHERE asset_id = ?`,
        [
          json["asset_name"],
          json["asset_model"],
          json["asset_brand"],
          json["asset_description"],
          json["asset_price"],
          json["asset_start_date"],
          json["asset_building_code"],
          json["asset_is_used"],
          json["asset_status_id"],
          json["agency_id"],
          json["asset_type_id"],
          `images/${resAsset.asset_code}.png`,
          json["asset_id"],  
          json["emp_id"],        
        ]
      );

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

router.post('/update-status', async (req, res) => {
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

    const [res_asset] = await kal_db.query(`SELECT * FROM trans_asset WHERE asset_id = ?`,[json["asset_id"]]);
    

    if (res_asset && res_asset.length > 0) {
      await kal_db.query(
        `
        UPDATE trans_asset SET asset_status_id = ?  WHERE asset_id = ?`,
        [
          json["asset_status_id"],
          json["asset_id"],
        ]
      );
      

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

router.post('/update-isused', async (req, res) => {
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

    const [res_asset] = await kal_db.query(`SELECT * FROM trans_asset WHERE asset_id = ?`,[json["asset_id"]]);
    

    if (res_asset && res_asset.length > 0) {
      await kal_db.query(
        `
        UPDATE trans_asset SET asset_is_used = ?  WHERE asset_id = ?`,
        [
          json["asset_is_used"],
          json["asset_id"],
        ]
      );
      

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
      
      if (!json['asset_id']) {
        res.send({
          status: "400",
          message: "WARNING",
          detail: "No Data found",
        });
        return;
      } 
      
      const [res_asset] = await kal_db.query(`SELECT * FROM trans_asset WHERE asset_id = ?`,[json["asset_id"]]);
      if(res_asset && res_asset.length > 0){
        await kal_db.query(`DELETE FROM trans_asset WHERE asset_id = ?`,[json["asset_id"]]);     
        
        removefile(res_asset[0].asset_image)

        res.send({
          status: "200",
          message: "SUCCESS",
          detail: "successful",
        });   
        return
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

router.post('/test', async (req, res) => {
  try {
      const json = req.body;

      //addfile(json['name'],json['image'])
      removefile(`images/${json['name']}`)
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