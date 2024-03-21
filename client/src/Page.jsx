import React, { useState, useEffect } from "react";
import axios from "axios";

export const SnippetsPage = () => {
  const [snippets, setSnippets] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8081/snippets")
      .then((response) => {
        setSnippets(response.data);
      })
      .catch((error) => {
        console.error("Error fetching snippets:", error);
      });
  }, []);

  return (
    <div>
      <h2> Snippets Table Page</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Language</th>
            <th>Stdin</th>
            <th>Source Code (First 100 chars)</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {snippets.map((snippet, index) => (
            <tr key={index}>
              <td>{snippet.username}</td>
              <td>{snippet.language}</td>
              <td>{snippet.stdin}</td>
              <td>{snippet.source_code}</td>
              <td>{snippet.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
