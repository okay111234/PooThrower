const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const INDEX_PATH = path.join(__dirname, "index.html");
const username = "myUser123"; // change this if needed

// Middleware to parse JSON
app.use(express.json());

// Random ID generator
function generateId(length = 6) {
  return Math.random().toString(36).substr(2, length);
}

// POST /update — writes formatted HTML to index.html
app.post("/update", (req, res) => {
  const id = generateId();
  const content = req.body.content || "";
  const formatted = `${username},${id},\n${content}`;

  fs.writeFile(INDEX_PATH, formatted, (err) => {
    if (err) return res.status(500).send("Failed to update index");

    console.log(`✅ index.html updated by ${username} with ID ${id}`);

    // Auto-reset the file after 2 seconds
    setTimeout(() => {
      fs.writeFile(INDEX_PATH, "", () => {
        console.log("🧼 index.html reset to empty");
      });
    }, 2000);

    res.send(`Script executed with ID: ${id}`);
  });
});

// Serve index.html
app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`🌐 Server running on http://localhost:${PORT}`);
});
