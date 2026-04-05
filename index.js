require('dotenv').config()
const express = require('express');
const Person = require('./models/person')
const app = express();
const morgan = require('morgan')
const cors = require('cors')


app.use(cors());
app.use(express.json());

app.use(express.static('dist'))

morgan.token('body', (req) => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'));



let persons = [
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
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    },
    {
        "id": 5,
        "name": "Fernando",
        "number": "1111111111111111111111111111111111111111111"
    }
]

// const generateId = () => {
//     return Math.floor(Math.random() * 1000000000)
// }

app.get('/', (request, response) => {
    response.send("<h1>Hello world</h1>")



})

app.get('/api/persons', (request, response) => {

    Person.find({})
        .then(persons => {
            response.json(persons);
        })
})


app.post('/api/persons', (request, response, next) => {

    let person = request.body;
    if (!person.name || !person.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    Person.findOne({ name: person.name })
        .then(existingPerson => {
            if (existingPerson) {
                return response.status(400).json({
                    error: 'name must be unique'
                })
            }

            const newPerson = new Person({
                name: person.name,
                number: person.number
            })

            return newPerson.save()
        })
        .then(savedPerson => {
            response.json(savedPerson);
        })
        .catch(error => next(error))
})



app.get('/api/persons/:id', (request, response, next) => {

    const id = request.params.id;

    Person.findById(id)
        .then(person => {
            if (person) {
                return response.json(person)
            } else {
                return response.status(404).end()
            }
        })
        .catch(error => next(error))
})


app.put('/api/persons/:id', (request, response, next) => {


    const id = request.params.id;
    const { name, number } = request.body;
    Person.findByIdAndUpdate(id, { name, number }, { returnDocument: 'after', runValidators: true, context: 'query' })
        .then(
            updatePerson => {
                response.json(updatePerson);
            })
        .catch(error => next(error))

})


app.delete('/api/persons/:id', (request, response, next) => {


    const id = request.params.id;
    Person.findByIdAndDelete(id)
        .then(
            () => {
                response.status(204).end();
            })
        .catch(error => next(error))
    // persons = persons.filter(person => person.id !== id);

    // response.status(204).end();

})



app.get('/info', (request, response) => {
    console.log(request);
    console.log(response);
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <br/>
        <p>${date}</p>
        `)


})

const unknownEndpoint = (request, response) => {
    response.status(404).json({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

//este middleware debe ser siempre el ultimo
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const date = new Date();


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})