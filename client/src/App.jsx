// src/App.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

import { Link } from "react-router-dom";
function App() {
  const [username, setUsername] = useState("");
  const [language, setLanguage] = useState("C++");
  const [stdin, setStdin] = useState("");
  const [sourceCode, setSourceCode] = useState("");
  const [snippets, setSnippets] = useState([]);

 

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:8081/submit", {
        username,
        language,
        stdin,
        sourceCode,
      })
      .then((response) => {
        console.log(response.data);
        setUsername("");
        setLanguage("C++");
        setStdin("");
        setSourceCode("");
        // Refresh snippets
        axios
          .get("http://localhost:8081/snippets")
          .then((response) => {
            setSnippets(response.data);
          })
          .catch((error) => {
            console.error("Error fetching snippets:", error);
          });
      })
      .catch((error) => {
        console.error("Error submitting snippet:", error);
      });
  };

  return (
    <div>
      <h1>CodeHub</h1>

      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br />

        <label>Preferred Language:</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="C++">C++</option>
          <option value="Java">Java</option>
          <option value="JavaScript">JavaScript</option>
          <option value="Python">Python</option>
        </select>
        <br />

        <label>Standard Input:</label>
        <input
          type="text"
          value={stdin}
          onChange={(e) => setStdin(e.target.value)}
        />
        <br />

        <label>Source Code:</label>
        <textarea
          value={sourceCode}
          onChange={(e) => setSourceCode(e.target.value)}
          required
        />
        <br />

        <button type="submit">Submit</button>
      </form>
      
      
      
      <div class="link">View Your Info Here By clicking the link
        <Link to={"snippets"}> Go to snippets page</Link>
      </div>
    </div>


  );
}

export default App;
