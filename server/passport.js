const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;
const winston = require('winston');
const bcrypt = require("bcrypt");

passport.use(new LocalStrategy((username, password, cb) => {
  db.query('SELECT id, email, password, type FROM users WHERE email=$1', [email], (err, result) => {
    if (err) {
      winston.error('Error when selecting user on login', err)
      return cb(err)
    }

    if (result.rows.length > 0) {
      const first = result.rows[0]
      bcrypt.compare(user_password, first.user_password, function (err, res) {
        if (res) {
          cb(null, { id: first.id, email: first.email })
        } else {
          cb(null, false)
        }
      })
    } else {
      cb(null, false)
    }
  })
}))

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, cb) => {
  db.query('SELECT id, email FROM users WHERE id = $1', [parseInt(id, 10)], (err, results) => {
    if (err) {
      winston.error('Error when selecting user on session deserialize', err)
      return cb(err)
    }

    cb(null, results.rows[0])
  })
})