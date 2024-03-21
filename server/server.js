import express from "express";
import bodyParser from "body-parser";

import cors from "cors";
import { createConnection } from "mysql";
import axios from "axios";
import "dotenv/config";

const apiKey = process.env.JUDGE_API_KEY; // Your Judge0 API key

import { createClient } from "redis";

const redisClient = createClient({
  port: process.env.REDIS_PORT || 6379,
  host: process.env.REDIS_HOST || "127.0.0.1",
});

redisClient.on("connect", () => {
  console.log("Client connected to redis...");
});

redisClient.on("error", (err) => {
  console.error("Error connecting to Redis:", err.message);
});

redisClient.on("end", () => {
  console.log("Client disconnected from redis");
});

process.on("SIGINT", () => {
  redisClient.quit();
});

const app = express();
const port = process.env.PORT || 8081;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Connection
const db = createConnection({
  host: process.env.SQL_HOST || "localhost",
  user: process.env.SQL_USER || "root",
  password: process.env.SQL_PASSWORD || "Cherry@2004",
  database: process.env.SQL_DATABASE || "takeuforward",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database");
});

// Define API endpoints
app.post("/submit", (req, res) => {
  const { username, language, stdin, sourceCode } = req.body;
  const timestamp = new Date();

  const sql =
    "INSERT INTO code_snippets (username, language, stdin, source_code, timestamp) VALUES (?, ?, ?, ?, ?)";
  db.query(
    sql,
    [username, language, stdin, sourceCode, timestamp],
    (err, result) => {
      if (err) throw err;
      res.send("Code snippet submitted successfully");
    }
  );
});

app.get("/snippets", (req, res) => {
  const sql =
    "SELECT username, language, stdin, LEFT(source_code, 100) AS source_code, timestamp FROM code_snippets";
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

axios
  .get("https://judge0-ce.p.rapidapi.com/submissions/1234", {
    headers: {
      "X-RapidAPI-Key": apiKey,
    },
  })
  .then((response) => {
    // Parse response and store output (stdout) in database
    const output = response.data.stdout;
    // Store output in the database or do further processing
  })
  .catch((error) => {
    console.error(error);
  });



// Endpoint to fetch information about the Judge0 API
app.get("/judge0/about", async (req, res) => {
  try {
    const response = await axios.get("https://judge0-ce.p.rapidapi.com/about", {
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while fetching data from the Judge0 API",
    });
  }
});

redisClient.connect();

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
