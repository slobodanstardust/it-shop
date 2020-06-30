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
              .then(() => {
                User.findOne({ _id: user._id })
                  .select('_id username password')
                  .exec()
                  .then(result => {
                    console.log(result)
                    res.status(201).json({
                      message: 'User created',
                      document: result
                    })
                  })
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
  const id = req.params.id

  if (id !== '5efa744bbd11c40684056b34') { // Check if it is the Admin user.
    User.findOne({ _id: id })
      .exec()
      .then(user => {
        if (user) {
          User.deleteOne({ _id: id })
          .exec()
          .then(result => {
            console.log(user)
            res.status(200).json({ message: 'User deleted.' })
          })
          .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
          })
        } else {
          res.status(404).json({ message: 'User does not exist.' })
        }
      })
  } else {
    res.status(409).json({ message: 'Admin can not be deleted.' })
  }
}