import React, { useEffect, useState } from "react";
import "./clientterms.css";

const ClientTerms = () => {
  const [terms, setTerms] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/client-terms")
      .then((res) => res.json())
      .then((data) => setTerms(data))
      .catch((err) => console.error("Error fetching client terms:", err));
  }, []);

  return (
    <div className="client-terms-container">
      <h2>Client Terms & Conditions</h2>
      <ul>
        {terms.map((term, index) => (
          <li key={index}>{term.description}</li>
        ))}
      </ul> 
    </div>
  );
};

export default ClientTerms;
