const express = require('express');
const router = express.Router();
const quinielaControllers = require('../app/src/controllers/QuinielaControllers');

router.get('/',  async (req, res)=>{
    res.send({ status: 1, message: 'Quiniela index'});
});

router.get('/getNumbers/:from/:to', async (req, res)=>{
    const response = await quinielaControllers.getNumbersBetween(req.params.from, req.params.to);
    res.send(response);
});

router.get('/getNumbersByDate/:date', async (req, res)=>{
    const response = await quinielaControllers.getNumbersByDate(req.params.date);
    res.send(response);
});

module.exports = router;