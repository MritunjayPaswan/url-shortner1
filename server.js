const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express()
const MONGODB_URI = 'mongodb+srv://mritunjay:root@cluster0.yrhez.mongodb.net/urlShortner?retryWrites=true&w=majority'

mongoose.connect(MONGODB_URI || 'mongodb://localhost:27017/shorturl1', {
  useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find()
  res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl })

  res.redirect('/');
})


app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)

  shortUrl.save()

  res.redirect(shortUrl.full)
})

app.get('/delete/:id', (req, res, next) => {
  ShortUrl.findByIdAndRemove(req.params.id, (err, doc) => {
      if (!err) {
          res.redirect('/');
      }
      else { console.log('Error :' + err)
         next(err)
     }
  });
});

app.listen(process.env.PORT || 8080);