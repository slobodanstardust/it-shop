const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/user-model')


// POST
exports.createUser = (req, res, err) => {
  User.find({ username: req.body.username })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({ message: 'User already exists.' })
      } else {
        bcrypt.hash(req.body.username, 10, (err, hash) => {
          if (err) {
            console.log(err)
            return res.status(500).json({ error: err })
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              username: req.body.username,
              password: hash
            })
      
            user.save()
              .then(result => {
                console.log(result)
                res.status(201).json({ message: 'User created' })
              })
              .catch(err => {
                console.log(err)
                return res.status(500).json({ error: err })
              })
          }
        })
      }
    })
}

// DELETE
exports.deleteUser = (req, res, err) => {
  User.deleteOne({ _id: req.params.id })
    .exec()
    .then(result => {
      res.status(200).json({ message: 'User deleted.' })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: err })
    })
}