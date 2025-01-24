require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser=require('body-parser')
var validUrl = require('valid-url');
const shortid=require("shortid")

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cors());


app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

//code

const urlstore={}
app.post('/api/shorturl',function(req,res)
{
  const originalurl=req.body.url
  console.log(originalurl)
  if(!validUrl.isUri(originalurl) || !originalurl.startsWith('http://') && !originalurl.startsWith('https://'))
  {
    return res.json({error:'invalid url'})
  }
  const shorturl=shortid.generate()
  urlstore[shorturl]=originalurl
  res.json({original_url:originalurl,short_url:shorturl})
})

app.get('/api/shorturl/:short',function(req,res)
{
  const short=req.params.short
  if (urlstore.hasOwnProperty(short)) {
    const original = urlstore[short]; 
    res.redirect(original); 
  } 
  else 
  {
    res.json({ error: 'invalid url' }); 
  }
})

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

