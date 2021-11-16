const app = require('./app');
const mongoose = require('mongoose');
const cors = require('cors');
const PORT = process.env.PORT || 3000;
app.use(cors('*'));
require('dotenv').config();
const url = process.env.URL;

mongoose
  .connect(url)
  .then(() => {
    console.log('connected!!!');
  })
  .catch((err) => {
    console.log('error connecting to MongoDB:', err.message);
  });

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
