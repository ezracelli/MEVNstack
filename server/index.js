// meta setup
var express = require('express')
var app = express()
app.use(express.static(__dirname + '/dist/'))

var cors = require('cors')
app.use(cors({ origin: true }))

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var mongoose = require('mongoose')
mongoose
  .connect(
    process.env.MONGODB_URI ||
      'mongodb://cst2415:Tigercst2415@ds213832.mlab.com:13832/shopping_list',
    { useFindAndModify: false, useNewUrlParser: true }
  )
  .then(() => console.log('connection to database established'))
  .catch(err => {
    console.log(err)
    process.exit(1)
  })

var Item = require('./models/item.js')

var port = process.env.PORT || 80

// router setup
var router = express.Router()
router.get('/', (req, res) => res.json({ message: 'Hello, world!' }))

router
  .route('/items')
  .get((req, res) => {
    Item.find((err, items) => {
      if (err) res.send(err)
      else res.json(items)
    })
  })
  .post((req, res) => {
    var item = new Item()
    item.name = req.body.name
    item.save(err => {
      if (err) res.send(err)
      else {
        res.status(201)
        res.send(item._id)
      }
    })
  })

router
  .route('/items/:itemId')
  .get((req, res) => {
    Item.findById(req.params.itemId, (err, item) => {
      if (err) res.send(err)
      else res.json(item)
    })
  })
  .put((req, res) => {
    Item.findById(req.params.itemId, (err, item) => {
      if (err) res.send(err)
      else {
        item.name = req.body.name
        item.save(err => {
          if (err) res.send(err)
          else res.json({})
        })
      }
    })
  })
  .delete((req, res) => {
    Item.findOneAndRemove({ _id: req.params.itemId }, (err, item) => {
      if (err) res.send(err)
      else res.json({})
    })
  })

app.use('/api', router)

var yargs = require('yargs')
if (yargs.argv.prod) {
  app.use('/', express.static(__dirname + '/../dist', { extensions: ['html'] }))
}

// start the server
app.listen(port, () => {
  console.log('express server listening on port ' + port)
})
