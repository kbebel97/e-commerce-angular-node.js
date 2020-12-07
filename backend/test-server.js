const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express()
      .use(cors())
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({ extended: true }));

const db = require('./models');
db.sequelize.sync();

require('./routes/product.routes.js')(app);

// var routes = require('./routes/routes.js');
// app.use('/api/tests', routes);

// set port, listen for requests
const PORT = process.env.PORT || 3080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});