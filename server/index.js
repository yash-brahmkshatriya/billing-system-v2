const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const api = require('./api');
const serverUtil = require('./utils/serverUtil');

const app = express();

app.use(cors());
const PORT = process.env.PORT || 8000;

const startApp = async () => {
  app.use(express.json());
  app.use(cookieParser());

  app.get('/', (req, res) =>
    res.status(200).send('Billing system v2 Express erver running...')
  );
  app.use('/api', api);

  app.listen(PORT, () => {
    console.log(`Billing System v2 API - up and running on ${PORT}`);
  });
};

serverUtil
  .boot(app)
  .then(() => {
    startApp();
  })
  .catch((err) => console.error(err));
