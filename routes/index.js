const express = require('express');

const router = express.Router();
const needle = require('needle');
const apicache = require('apicache');
const moment = require('moment');

//Env vars

const API_BASE_URL = process.env.API_BASE_URL;
const API_KEY_NAME = process.env.API_KEY_NAME;
const API_KEY_VALUE = process.env.API_KEY_VALUE;
const API_HOURLY_URL = process.env.API_HOURLY_URL;

//Init cache 


router.get('/weather', async (req, res, next) => {
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
    //console.log(data);
    res.status(200).json(data);
   
  } catch (err) {
    res.status(500).json({ Error: err });

  }
});

router.get('/hourly', async (req, res, next) => {
  try {
    const params = new URLSearchParams({
      [API_KEY_NAME]: API_KEY_VALUE,
      ...req.query,
    });
    console.log(`REQUEST: ${API_BASE_URL}?${params}`)
    const apiRes = await needle('get', `${API_HOURLY_URL}?${params}`);
    const data = apiRes.body;

    const weeklyForcast = data.daily;
    
    //convert unix timestamp to day of the week
    for (let i = 0; i < 8; ++i) {
     const day = data.daily[i];
     convertedTime = new Date(day.dt * 1000);
     day.convertedTime = moment(convertedTime).format('dddd');
     console.log("converting");
     data.daily[i].convertedTime = day.convertedTime;
    }

    //convert unix timestamp to hours of the day
    for(let i = 0; i < 48; ++i) {
      const hour = data.hourly[i];
      convertedTime = new Date(hour.dt * 1000);
      hour.convertedTime = moment(convertedTime).format('LT');
      data.hourly[i].convertedTime = hour.convertedTime;
    }
    //console.log(data);
    res.status(200).json(data);
   
  } catch (err) {
    res.status(500).json({ Error: err });

  }
})

module.exports = router;
