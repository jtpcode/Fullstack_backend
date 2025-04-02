const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password, name and number as arguments')
  process.exit(1)
}

const password = process.argv[2]
const newName = process.argv[3]
const newNumber = process.argv[4]

const url = `mongodb+srv://jtpcode:${password}@cluster0.jnb2b.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({})
    .then(result => {
      console.log('phonebook:')
      result.forEach(person => {
        console.log(person.name, person.number)
      })
      mongoose.connection.close()
    })
}
else {
  const person = new Person({
    name: newName,
    number: newNumber,
  })

  person.save()
    .then(() => {
      console.log(`Added ${newName} number ${newNumber} to phonebook`)
      mongoose.connection.close()
    })
}
