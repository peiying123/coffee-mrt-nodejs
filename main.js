const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const app = express();
const path = require('path')

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))
app.use(express.static(path.join(__dirname, 'public')));

const coffeesController = require('./controllers/coffee');


const port = 5001;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', coffeesController.get);
app.post('/getCoffeeWithLocation', coffeesController.getCoffeeWithLocation);
app.post('/storeStatus', coffeesController.storeStatus);
app.post('/getCoffeeWithId', coffeesController.getCoffeeWithId);
app.listen(port, () => {
  db.connect();
  console.log(`Example app listening at http://localhost:${port}`);
});
