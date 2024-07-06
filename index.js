const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "taskmanager",
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("database connected");
});

// fetching tasks
app.get("/tasks", (req, res) => {
  const sql = "SELECT * FROM tasks";
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// Add task
app.post("/tasks", (req, res) => {
  const { title, content } = req.body;
  const sql = "INSERT INTO tasks (title, content) VALUES (?, ?)";
  db.query(sql, [title, content], (err, result) => {
    if (err) throw err;
    res.send({ id: result.insertId, title, content });
  });
});

// Edit task
app.put("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const sql = "UPDATE tasks SET title = ?, content = ? WHERE id = ?";
  db.query(sql, [title, content, id], (err, result) => {
    if (err) throw err;
    res.send({ id, title, content });
  });
});

// Delete task
app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM tasks WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.send({ id });
  });
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
