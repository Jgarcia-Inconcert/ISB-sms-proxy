const express = require('express');

const SMSService = require('../services/sms.service');

const router = express.Router();
const service = new SMSService();

router.post('/send', async (req, res, next) => {
    try{
        const body = req.body;
        const smsSend = await service.send(body);
        res.status(200).json(smsSend);
    } catch(error){
        next(error);
    }
});

module.exports = router;