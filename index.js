const express = require('express')
const morgan = require('morgan')

const app = express()

let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  {
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

// Morgan -logging
morgan.token('body', (request) => {
  if (request.body) {
    const strBody = JSON.stringify(request.body)
    return strBody !== '{}' ? strBody : ' '
  }
  return ' '
})

// Middleware
app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (request, response) => {
  response.send('<h1>Phonebook backend</h1>')
})

// Routes
app.get('/info', (request, response) => {
  const timestamp = new Date()
  response.send(`
    Phonebook has info for ${persons.length} people
    <br /><br />
    ${timestamp}
    `
  )
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

const generateId = (max) => {
  return Math.floor(Math.random() * max)
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  // Name already exists
  const exists = persons.find(person => person.name === body.name)
  if (exists) {
    return response.status(400).json({ 
      error: `Name ${body.name} already exists.`
    })
  }

  // Name or number is missing
  if (!body.name) {
    return response.status(400).json({ 
      error: 'Name is missing.'
    })
  }
  else if (!body.number) {
    return response.status(400).json({ 
      error: 'Number is missing.' 
    })
  }

  const person = {
    id: generateId(1000000000).toString(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
