onst cors = require('cors');

const whitelist = [
  'http://localhost:3001',
  'http://mesto.anton-sarkisyan.nomoredomains.club',
  'https://mesto.anton-sarkisyan.nomoredomains.club',
];

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  exposedHeaders: ['Set-Cookie'],
  credentials: true,
};

module.exports = cors(corsOptions);