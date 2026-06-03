const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Add this block
app.get("/", (req, res) => {
  res.send("Express server is running!");
});

app.get("/api/message", (req, res) => {
  res.json({
    message: "Hello from Express backend!"
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});