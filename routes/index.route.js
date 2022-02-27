const express = require('express');
const router = express.Router();
const indexController = require('../app/src/controllers/IndexController');

router.get('/',  async (req, res)=>{
    res.render('index');
});

router.get('/create/:cedula', async (req, res)=>{
    const response = await indexController.insertRecord(req.params.cedula);
    const result = (response.hasOwnProperty('rowsAffected')) ? response : {};
    res.send(result);
});

module.exports = router;