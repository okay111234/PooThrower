const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Read plain text/html body
app.use(express.text({ type: "*/*" }));

// POST /update — changes index.html on disk
app.post("/update", (req, res) => {
  const html = req.body;

  if (!html || typeof html !== "string") {
    return res.status(400).send("Invalid HTML");
  }

  // Write to index.html
  fs.writeFile(path.join(__dirname, "index.html"), html, (err) => {
    if (err) return res.status(500).send("Failed to write file");

    console.log("✅ index.html updated");

    // OPTIONAL: Reset after 10 seconds
    setTimeout(() => {
      fs.writeFile(path.join(__dirname, "index.html"), "", (err) => {
        if (err) console.error("❌ Failed to reset index.html");
        else console.log("🧼 index.html reset to empty");
      });
    }, 10000); // 10 seconds

    res.send("index.html updated");
  });
});

// Serve index.html statically
app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`🌐 Server running: http://localhost:${PORT}`);
});
