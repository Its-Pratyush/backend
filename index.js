const express = require("express");
const app = express();
const port = 8000;
const connectToMongo = require("./db");
const cors = require("cors");

connectToMongo();
app.use(cors());
app.use(express.json());

//available routes
app.get("/", (req,res)=>{
  res.send("Hello")
}
)
app.use("/api/auth", require("./Routes/auth"));
app.use("/api/notes", require("./Routes/notes"));
app.use("/api/todos", require("./Routes/todo"));

app.listen(port, () => {
  console.log(`smart desk backend http://localhost:${port}`);
});
