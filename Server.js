const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Database Initialization
const db = new sqlite3.Database("./referrals.db");

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS referrals (id TEXT, code TEXT UNIQUE)");
});

app.get("/referrals", (req, res) => {
  db.all("SELECT * FROM referrals", [], (err, rows) => {
    if (err) return res.status(500).send({ error: "Database error." });
    res.send(rows);
  });
});

app.post("/referrals", (req, res) => {
  db.all("SELECT * FROM referrals", [], (err, rows) => {
    if (err) return res.status(500).send({ error: "Database error." });

    if (rows.length >= 10) {
      return res.status(400).send({ error: "Maximum of 10 referrals reached." });
    }

    const newReferral = { id: uuidv4(), code: uuidv4().slice(0, 8) };

    db.run("INSERT INTO referrals (id, code) VALUES (?, ?)", 
      [newReferral.id, newReferral.code],
      err => {
        if (err) return res.status(500).send({ error: "Referral code must be unique." });
        res.send(newReferral);
      }
    );
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
