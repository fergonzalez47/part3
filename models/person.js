const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: [3, 'Name must be at least 3 characters'],
        required: [true, 'Name is required']
    },
    number: {
        type: String,
        minLength: [8, 'Number must be at least 8 numbers'],
        validate: {
            validator: function (phoneNumber) {
                return /^\d{2,3}-\d+$/.test(phoneNumber)
            },
            message: props => `${props.value} is not a valid phone number`
        },
        required: [true, 'User phone number required']
    }
});


personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = document._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})


const Person = mongoose.model('Person', personSchema)

module.exports = Person;