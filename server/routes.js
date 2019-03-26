var express = require('express')
var router = express.Router()
const axios = require('axios')
const uuid = require('uuid/v4')
const crypto = require('crypto')
const _ = require('lodash')
// const passport = require('passport')
// const userController = require('../db/controllers/user')
/* GET users listing. */
router.get('/', function(req, res) {
  res.json({ message: '<3' })
})

router.get('/check', async (req, res) => {
  let intersection

  if (req.query.q) {
    let usernames = req.query.q.split(',')
    console.log(usernames)
    resultsList = []
    for (let i in usernames) {
      let u = usernames[i]
      const headUrl = `https://letterboxd.com/${u}`
      let headResults = await axios.head(headUrl)
      debugger
      let uid = headResults.headers['x-letterboxd-identifier']
      console.log(`User ID: ${uid}`)
      const method = 'GET'
      const apiKey = process.env.API_KEY
      const apiSecret = process.env.API_SECRET
      const requestURL = `https://api.letterboxd.com/api/v0/member/${uid}/watchlist`

      const secondsSinceEpoch = Math.round(new Date().getTime() / 1000)
      const nonceUUID = uuid()
      console.log(`NONCE: ${nonceUUID}`)
      const urlString = `${requestURL}?perPage=100&apikey=${apiKey}&nonce=${nonceUUID}&timestamp=${secondsSinceEpoch}`
      const saltedString = `${method}\u0000${urlString}\u0000`
      const apiSignature = crypto
        .createHmac('sha256', apiSecret)
        .update(saltedString)
        .digest('hex')
      try {
        let results = await axios.get(`${urlString}&signature=${apiSignature}`)
        console.log(`UID: ${uid}`)
        console.log(`WATCHLIST:`)
        console.log(JSON.stringify(results.data, null, 2))
        resultsList.push(results.data.items)
        intersection = _.intersectionBy(...resultsList, 'id')
      } catch (e) {
        console.log('Error!!')
        debugger
        console.log(e.response.data)

        res.status(400).send({
          apiError: e.response.data
        })
      }
    }
    // resultsList = resultsList.map(x => x.items)
    res.json(intersection)
  } else {
    res.status(400).send({ error: 'You did not specify any users!' })
  }
})

// router.post('/register', userController.register)
// router.post('/login', userController.logIn)
// router.get(
//   '/me',
//   passport.authenticate('jwt', { session: false }),
//   (req, res) => {
//     delete req.user.password
//     res.json(req.user)
//   }
// )
// router.patch(
//   '/update',
//   passport.authenticate('jwt', { session: false }),
//   userController.update
// )
module.exports = router
