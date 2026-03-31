const express = require('express');
const app = express();
const morgan = require('morgan')
const cors = require('cors')

app.use(cors());
app.use(express.json());

morgan.token('body', (req, res) => {
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

const generateId = () => {
    return Math.floor(Math.random() * 1000000000)
}

app.get('/', (request, response) => {
    response.send("<h1>Hello world</h1>")



})

app.get('/api/persons', (request, response) => {

    response.json(persons)
})


app.post('/api/persons', (request, response) => {

    let person = request.body;

  

    if (!person.name || !person.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    const existingPerson = persons.find(ep => ep.name === person.name);

    if (existingPerson) {
        return response.status(400).json({
            error: 'name must be unique' 
        })
    }


    const newPerson = {
        id: generateId(),
        name: person.name,
        number: person.number
    }

    persons = persons.concat(newPerson);
    response.json(newPerson);
})




app.get('/api/persons/:id', (request, response) => {

    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);

    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }

})


app.delete('/api/persons/:id', (request, response) => {


    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);

    response.status(204).end();

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



const date = new Date();


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})