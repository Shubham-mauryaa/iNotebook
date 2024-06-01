const connectToMongo = require('./db');
const express = require('express')

connectToMongo();

const app = express()
const port = 5000

 //it is a middleware that is required to request body content in any mongoose models for example in auth.js it will show undefined for console.log(req.body) even after giving some content to the body because of not using middleware 
 app.use(express.json())

//routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})