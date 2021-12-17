const express = require('express')
const cors = require("cors");
const app = express()
const routes = require('./routes');
const db = require("./models");

// app.get('/', (req, res) => {
//   res.send('Hello World')
// })

const corsOptions = {
  origin: [
    'http://localhost:8080',
    'http://localhost:3000',
    'https://gamemun-bomber-dev-web-76iziw7aaq-as.a.run.app',
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: "Content-Type, Option, Authorization, X-Session-Id",
  credentials: true
};

app.use(cors(corsOptions));
app.enable('trust proxy');
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use('/api', routes);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to my application."
  });
});

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});