const express = require('express')
const app = express()
const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')

const uri = "mongodb+srv://DKB:txOwzLOhzXWmzsJB@project1.6wbwm.mongodb.net/?retryWrites=true&w=majority&appName=Project1"

const port = 3005
const bodyParser = require('body-parser')

app.use(bodyParser.json())

const schema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  password: String,
  age: Number,
  created_at: {
    type: Date,
    default: Date.now
  }
})

const User = mongoose.model('User', schema)

// Connect to MongoDB once when the server starts
mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => {
    console.error('Error connecting to MongoDB:', error)
    process.exit(1)
  })

app.get('/', (req, res) => {
  res.send('Connected to MongoDB')
})

const messages = []

// Add a true/false parameter to check if the GET function is working
app.get('/users', async (req, res) => {
  try {
    if (req.query.check === 'true') {
      return res.json({ success: true })
    }
    const users = await User.find()
    res.json(users)
  } catch (error) {
    console.error('Error processing GET /users:', error)
    res.status(500).send('Internal Server Error')
  }
})

// Add the POST route for /users with error handling
app.post('/users', async (req, res) => {
  try {
    const user = req.body
    if (!user || !user.email || !user.password) {
      return res.status(400).send('Bad request: email and password are required')
    }

    const newUser = new User({
      id: uuidv4(),
      name: user.name,
      email: user.email,
      password: user.password,
      age: user.age
    })

    await newUser.save()
    res.json(newUser)
  } catch (error) {
    console.error('Error processing POST /users:', error)
    res.status(500).send('Internal Server Error')
  }
})

// Add the PUT route for /users/:id with error handling
app.put('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id
    const updatedData = req.body

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updatedData,
      { new: true }       
    )

    if (!updatedUser) {
      return res.status(404).send('User not found')
    }

    res.json(updatedUser)
  } catch (error) {
    console.error('Error processing PUT /users/:id:', error)
    res.status(500).send('Internal Server Error')
  }
})

// Add the DELETE route for /users/:id with error handling
app.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id
    const deletedUser = await User.findByIdAndDelete(userId)
    if (!deletedUser) {
      return res.status(404).send('User not found')
    }
    res.json({ success: true })
  } catch (error) {
    console.error('Error processing DELETE /users/:id:', error)
    res.status(500).send('Internal Server Error')
  }
})

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack)
  res.status(500).send('Internal Server Error')
})

// Ensure the server is listening on port 3005
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
