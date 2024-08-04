const express = require('express');
const router = express.Router();
var md5 = require('md5');
const {kal_db} = require("../config/db");

router.post('/login', async (req, res) => {
    try {
        const json = req.body;
        

        if (!json["emp_username"] || !json["emp_password"]) {
          res.send({
            status: "400",
            message: "WARNING",
            detail: "No Data found",
          });
          return;
        }

        const [res_emp] = await kal_db.query(`
            SELECT * FROM mas_employee 
            WHERE emp_username = ? 
            AND emp_password = ? 
            AND emp_status = ?`
            ,[json["emp_username"], md5(json["emp_password"]).toUpperCase(), 1]);
        

        if (!res_emp || !res_emp[0]) {
            res.send({
              status: "404",
              message: "WARNING",
              detail: "No Data found",
            });
            return;
          }

        res.send({
            data:res_emp[0],
            status: "200",
            message: "SUCCESS",
            detail:"Login successful"
        });
    
      } catch (err) {
        res.send({ status: "500", message: 'ERROR',detail:err.message });
      }
});

router.post('/authen', async (req, res) => {

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

        const [res_emp] = await kal_db.query(`
            SELECT emp_id,emp_username,emp_email,emp_status,role_id FROM mas_employee 
            WHERE emp_id = ?
            AND emp_username = ? 
            AND emp_email = ?
            AND emp_status = ?
            AND role_id = ?`
            ,[json["emp_id"]
            ,json["emp_username"]
            ,json["emp_email"]
            ,json["emp_status"]
            ,json["role_id"]]);

        
        if (res_emp && res_emp.length > 0) {
          res.send({
            data: res_emp[0],
            status: "200",
            message: "SUCCESS",
            detail: "Authen successful",
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

      
      let role_id = ''

      if(json['role_id']){
        role_id = `EMP.role_id = '${json['role_id']}' AND `
      }

      const query_search = `${role_id}`

      const [res_total] = await kal_db.query(`SELECT COUNT(*) AS total FROM mas_employee`);
      const [res_emp] = await kal_db.query(`
        SELECT EMP.*,ROL.role_name FROM mas_employee AS EMP 
        LEFT JOIN mas_role AS ROL ON ROL.role_id = EMP.role_id
        WHERE ${query_search} EMP.emp_status != 1 AND CONCAT_WS(' ', EMP.emp_firstname, EMP.emp_lastname ,EMP.emp_username) LIKE '%' ? '%' LIMIT ? OFFSET ?`,[json['search'],pageSize,offset]);
        
      if (res_emp) {
        
      let total = parseInt(res_total[0].total);
      let totalPages = Math.ceil(total / pageSize);

        res.send({
          data: res_emp,
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

    if (!json['emp_id']) {
      res.send({
        status: "400",
        message: "WARNING",
        detail: "No Data found",
      });
      return;
    }

    const [res_emp] = await kal_db.query(`
      SELECT EMP.*,ROL.role_name FROM mas_employee AS EMP 
      LEFT JOIN mas_role AS ROL ON ROL.role_id = EMP.role_id 
      WHERE emp_id = ?`,
      json["emp_id"]
    );

    if (res_emp && res_emp.length > 0) {
      res.send({
        data: res_emp[0],
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
        const json = req.body;
        

        if (!json) {
          res.send({
            status: "400",
            message: "WARNING",
            detail: "No Data found",
          });
          return;
        }

        const [res_emp] = await kal_db.query(`
            SELECT * FROM mas_employee 
            WHERE emp_id = ?
            OR emp_username = ? 
            OR emp_email = ?`
            ,[json["emp_id"]
            ,json["emp_username"]
            ,json["emp_email"]]);

        

        if(res_emp && res_emp[0]){
            res.send({
                status: "404",
                message: "WARNING",
                detail:"Duplicate Data"
            });
            return
        }

        await conn
        .query(`
            INSERT INTO mas_employee (emp_id
            ,emp_username
            ,emp_password
            ,emp_firstname
            ,emp_lastname
            ,emp_phone
            ,emp_email
            ,emp_status
            ,role_id) VALUES (?,?,?,?,?,?,?,?,?)`,[json["emp_id"]
            ,json["emp_username"]
            ,md5(json["emp_password"]).toUpperCase()
            ,json["emp_firstname"]
            ,json["emp_lastname"]
            ,json["emp_phone"]
            ,json["emp_email"]
            ,"1"
            ,"1"]);
            
        
        res.send({
            status: "200",
            message: "SUCCESS",
            detail:"Login successful"
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

    const [res_emp] = await kal_db.query(`SELECT * FROM mas_employee WHERE emp_id = ?`,[json["emp_id"]]);
    
    if (res_emp && res_emp.length > 0) {
      await kal_db.query(
        `
        UPDATE mas_employee SET emp_username = ?
        ,emp_password = ?
        ,emp_firstname = ?
        ,emp_lastname = ?
        ,emp_phone = ?
        ,emp_email = ?
        ,emp_status = ?
        ,role_id = ? WHERE asset_id = ?`,
        [
          json["emp_username"],
          json["emp_password"],
          json["emp_firstname"],
          json["emp_lastname"],
          json["emp_phone"],
          json["emp_email"],
          json["emp_status"],
          json["role_id"],       
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
      
      if (!json['emp_id']) {
        res.send({
          status: "400",
          message: "WARNING",
          detail: "No Data found",
        });
        return;
      } 
      
      const [res_emp] = await kal_db.query(`SELECT * FROM mas_employee WHERE emp_id = ?`,[json["asset_id"]]);
      if(res_emp && res_emp.length > 0){
        await kal_db.query(`DELETE FROM mas_employee WHERE emp_id = ?`,[json["emp_id"]]);     

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


module.exports = router;