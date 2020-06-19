const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = require('express').Router();
const Users = require("./auth-model.js")

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
  // implement login
});

module.exports = router;
