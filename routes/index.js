const express = require('express');

const router = express.Router();
const needle = require('needle');
const apicache = require('apicache');

//Env vars

const API_BASE_URL = process.env.API_BASE_URL;
const API_KEY_NAME = process.env.API_KEY_NAME;
const API_KEY_VALUE = process.env.API_KEY_VALUE;

//Init cache 


router.get('/', async (req, res, next) => {
  try {
    const params = new URLSearchParams({
      [API_KEY_NAME]: API_KEY_VALUE,
      ...req.query,
    });
    const apiRes = await needle('get', `${API_BASE_URL}?${params}`);
    const data = apiRes.body;

    if(process.env.NODE_ENV !== 'production') {
      console.log(`REQUEST: ${API_BASE_URL}?${params}`)
    }
    console.log(data);
    res.status(200).json(data);
   
  } catch (err) {
    res.status(500).json({ whatWentWrong: err });

  }
});

module.exports = router;
