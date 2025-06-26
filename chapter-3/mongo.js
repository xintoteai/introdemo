require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGO_URI

if (!url) {
    console.log('MONGO_URI environment variable is missing')
    process.exit(1)
}

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
    content: 'HTML is easy',
    important: true,
})

// Save the note first, then find all notes
note.save().then((result) => {
    console.log('note saved!')
    // After saving, find all notes
    return Note.find({})
}).then((result) => {
    result.forEach((note) => {
        console.log(note)
    })
    // Close connection only once, after both operations are done
    mongoose.connection.close()
}).catch((error) => {
    console.error('Error:', error)
    mongoose.connection.close()
})