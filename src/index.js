const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const routes = require('./routes');
var bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 3001;

routes(app);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

mongoose.connect(`mongodb+srv://phutrieuson:${process.env.MONGO_DB}@money-manager.l4b3dxe.mongodb.net/`)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err))

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})