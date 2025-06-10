require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

if (!url) {
    console.log('MONGODB_URI environment variable is required')
    process.exit(1)
}

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

// const note = new Note({
//   content: 'HTML is easy',
//   important: true,
// })

// // note.save().then((result) => {
// //   console.log('note saved!')
// //   mongoose.connection.close()
// // })

Note.find({}).then((result) => {
    result.forEach((note) => {
        console.log(note)
    })
    mongoose.connection.close()
})