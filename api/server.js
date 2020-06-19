const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authenticate = require('../auth/authenticate-middleware.js');
const authRouter = require('../auth/auth-router.js');
const jokesRouter = require('../jokes/jokes-router.js');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use('/api/auth', authRouter);
server.use('/api/jokes', authenticate, jokesRouter);

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret = require("../auth/constants.js");
const Users = require("../auth/auth-model.js");
const constants = require('../auth/constants.js');

server.post('/register', (req, res) => {
    const credentials = req.body;
  
    if (credentials) {
      const rounds = process.env.BCRYPT_ROUNDS || 8;
  
      // here we are hashing the password by the number of rounds we have defined
      const hash = bcrypt.hashSync(credentials.password, rounds);
      //here we are simply setting the credentials password to the new hash value
      credentials.password = hash;
  
      Users.add(credentials)
      .then(user => {
        res.status(201).json({newUser: user});
      })
      .catch(error => {
        res.status(500).json({error: error.message})
      })
    } else {
      res.status(400).json({message: "Please provide username and pasword"})
    }
  });
  
  server.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    if (req.body) {
      Users.findBy({username: username})
      .then(([user]) => {
        if(user && bcrypt.compareSync(password, user.password)) {
          const token = createToken(user)
          res.status(200).json({token, user})
        } else {
          res.status(401).json("Invalid Credentials!");
        }
      })
      .catch(err => {
        res.status(500).json(err.message)
      })
    } else {
      res.status(401).json("Please provide credentials to log-in!")
    }
  });
  
  function createToken(user) {
  
    const payload = {
      subject: user.id,
      username: user.username
    };
  
    const secret = constants.jwtSecret
  
    const options = {
      expiresIn: 60 * 60
    }
  
    return jwt.sign(payload, secret, options);
  }

  const restricted = require("../auth/authenticate-middleware.js");

  server.get('/', restricted, (req, res) => {
    const requestOptions = {
      headers: { accept: 'application/json' },
    };
  
    axios
      .get('https://icanhazdadjoke.com/search', requestOptions)
      .then(response => {
        res.status(200).json(response.data.results);
      })
      .catch(err => {
        res.status(500).json({ message: 'Error Fetching Jokes', error: err });
      });
  });

module.exports = server;
