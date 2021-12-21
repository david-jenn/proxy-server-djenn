const express = require('express');
// const cors = require('cors');
const rateLimit = require('express-rate-limit')
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const app = express();

//Rate limiting 
// const limiter = rateLimit({
//   windowMs: 10 * 60 * 1000,
//   max: 5
// })

// app.use(limiter);
// app.set('trust proxy', 1);

// Routes
//TO Fix deployment

app.use('/', express.static('public', { index: 'index.html' }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", `${process.env.FRONT_END_ACCESS}`);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use('/api', require('./routes/index'))



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
