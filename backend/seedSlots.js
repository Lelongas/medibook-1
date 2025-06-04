// addMemberField.js
const mongoose = require("mongoose")

const MONGO_URI = "mongodb://localhost:27017/gpbooking" // replace if different
const connectDB = async () => {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log("Connected to DB")
}

const run = async () => {
  await connectDB()

  const User = mongoose.model("users", new mongoose.Schema({}, { strict: false }))

  const result = await User.updateMany(
    { Member: { $exists: false } }, // only update users without `member`
    { $set: { Member: 0 } }
  )

  console.log(`${result.modifiedCount} users updated.`)
  process.exit()
}

run().catch(err => {
  console.error("Error:", err)
  process.exit(1)
})
