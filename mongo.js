const mongoose = require('mongoose')

const password = process.argv[2];

const url =
    `mongodb+srv://phonebookdb:${password}@phonebook-cluster.xvx4qd9.mongodb.net/phonebook?appName=phonebook-cluster`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    }
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 4) {
    Person.find({})
        .then(result => {
            console.log("Phonebook:");
            
            result.forEach(person => {
                console.log(person.name, person.number)
            })
            mongoose.connection.close();
        })

    // exit(0) → terminó bien
    // exit(1) → terminó con error
    // process.exit(0)
} else {

    const newPerson = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })

    newPerson.save().then(result => {
        console.log(`Added ${newPerson.name} ${newPerson.number} to phonebook`);

        mongoose.connection.close()
    })
}