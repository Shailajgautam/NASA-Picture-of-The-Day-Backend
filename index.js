import express from "express"
import cors from "cors"
import mongoose from "mongoose"

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

await mongoose
      .connect("mongodb://localhost:27017/myLoginRegisterDB", {
      })
      .then((res) => {
        console.log(
          'Connected to Distribution API Database - Initial Connection'
        );
      })
      .catch((err) => {
        console.log(
          `Initial Distribution API Database connection error occured -`,
          err
        );
      });

      const userSchema = mongoose.Schema({
        name: String,
        email: String,
        password: String
      })

      const User = new mongoose.model("User", userSchema)

      app.post("/login",(req , res ) => {
            res.send("My API login")
        })

        app.post("/signup",(req , res ) => {
          res.send("My API signup")
      })

      app.listen(9002,() => {
            console.log("BE started at port 9002")
        })