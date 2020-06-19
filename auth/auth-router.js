const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret = require("./constants.js");

const router = require('express').Router();
const Users = require("./auth-model.js");
const constants = require("./constants.js");


router.post('/register', (req, res) => {
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

router.post('/login', (req, res) => {
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
    expiresIn: 60
  }

  return jwt.sign(payload, secret, options);
}

module.exports = router;
