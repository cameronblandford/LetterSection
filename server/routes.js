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

function createUrl(uid, cursor = null) {
  const method = 'GET'
  const apiKey = process.env.API_KEY
  const apiSecret = process.env.API_SECRET
  const requestURL = `https://api.letterboxd.com/api/v0/member/${uid}/watchlist`

  const secondsSinceEpoch = Math.round(new Date().getTime() / 1000)
  const nonceUUID = uuid()
  let urlString = `${requestURL}?perPage=100&apikey=${apiKey}&nonce=${nonceUUID}&timestamp=${secondsSinceEpoch}`
  if (cursor) {
    urlString += `&cursor=${cursor}`
  }
  const saltedString = `${method}\u0000${urlString}\u0000`
  const apiSignature = crypto
    .createHmac('sha256', apiSecret)
    .update(saltedString)
    .digest('hex')
  const finalUrl = `${urlString}&signature=${apiSignature}`
  return finalUrl
}

router.get('/check', async (req, res) => {
  let intersection

  if (req.query.q) {
    let usernames = req.query.q.split(',')
    console.log(usernames)
    resultsList = []
    for (let i in usernames) {
      let u = usernames[i]
      const headUrl = `https://letterboxd.com/${u}`
      let headResults
      let uid
      try {
        headResults = await axios.head(headUrl)
        uid = headResults.headers['x-letterboxd-identifier']
      } catch (e) {
        console.log(e.response.status)
        if (e.response.status === 404) {
          console.log(`FOUR OH FOUR`)
          res.status(404).send({
            apiError: e.response.data
          })
        }
      }
      try {
        let userResults = []
        let firstUrl = createUrl(uid)
        let pageResults = (await axios.get(firstUrl)).data
        console.log(`found ${pageResults.items.length} items for ${u}`)
        userResults.push(...pageResults.items)
        while (pageResults.next) {
          let nextUrl = createUrl(uid, pageResults.next)
          let prevNextValue = pageResults.next
          pageResults = (await axios.get(nextUrl)).data
          console.log(`found ${pageResults.items.length} items for ${u}`)
          userResults.push(...pageResults.items)
          debugger
          if (prevNextValue === pageResults.next) {
            break
          }
        }
        resultsList.push(userResults)
      } catch (e) {
        console.log('Error!!')
        console.log(e.response.data)
        if (e.response.status === 404) {
          console.log(`FOUR OH FOUR`)
          res.status(404).send({
            apiError: e.response.data
          })
        } else {
        }
      }
    }
    // resultsList = resultsList.map(x => x.items)
    intersection = _.intersectionBy(...resultsList, 'id')
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
