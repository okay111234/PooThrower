const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const INDEX_PATH = path.join(__dirname, "index.html");

app.use(express.json()); // Parse JSON body

// Generate random short ID
function generateId(length = 6) {
  return Math.random().toString(36).substr(2, length);
}

app.post("/update", (req, res) => {
  const { username, content } = req.body;

  if (!username || !content) {
    return res.status(400).send("Missing username or content");
  }

  const id = generateId();
  const formatted = `${username},${id},\n${content}`;

  fs.writeFile(INDEX_PATH, formatted, (err) => {
    if (err) {
      console.error("❌ Failed to write:", err);
      return res.status(500).send("Failed to update index.html");
    }

    console.log(`✅ index.html updated by ${username} (${id})`);

    setTimeout(() => {
      fs.writeFile(INDEX_PATH, "", () => {
        console.log("🧼 index.html reset");
      });
    }, 2000);

    res.send(`Script executed with ID: ${id}`);
  });
});

// Serve index.html
app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`🌐 Server running at http://localhost:${PORT}`);
});
