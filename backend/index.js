const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors');


let phonebook = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary", 
      "number": "39-23-6423122"
    }
]

app.use(cors());
app.use(express.json())
// app.use(morgan('tiny:req'))
morgan.token('req', function (req, res) { 
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :req'));


app.get('/api/persons',(request, response) => {
  response.json(phonebook)
})

const now = new Date()
const time = now.toUTCString()
app.get('/info', (request ,response) => {
    response.send(`phonebook has info for ${phonebook.length} people <br> ${time} `)
})

app.get('/api/persons/:id', (request, response) => {
    const id = parseInt(request.params.id)
    const entry =  phonebook.find(e => e.id === id )
    if(!entry){
      return response.status(404).send('user not found')
    }
    response.json(entry)

    console.log(id);
    console.log(entry);
})

app.delete('/api/persons/:id', (request, response) => {
    const id = parseInt(request.params.id)
    phonebook = phonebook.filter(entry => entry.id !==id )
    response.send('user deleted succesfully')
})

app.post('/api/persons', (request, response) => {
    const newEntry = request.body

    if(!(newEntry.name && newEntry.number)){
      return response.status(400).send({
        error: "name and number should not be empty"
      })
    }

    const flag = phonebook.find(p => p.name === newEntry.name)
    if(flag){
      return response.status(400).send({
        error: "name must be unique"
    })
    }
    newEntry.id = Math.floor(Math.random() * 1000)
    phonebook = phonebook.concat(newEntry)
    // console.log(phonebook);
    response.json(phonebook)
})



const PORT = 3001
app.listen(PORT)
console.log(`server running in port ${PORT}`);