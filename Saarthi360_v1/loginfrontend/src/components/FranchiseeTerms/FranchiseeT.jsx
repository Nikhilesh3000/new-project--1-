// import React, { useEffect, useState } from "react";
// import "./franchiseeterms.css";

// const FranchiseeTerms = () => {
//   const [terms, setTerms] = useState([]);

//   useEffect(() => {
//     fetch("http://localhost:5000/api/franchisee-terms")
//       .then((res) => res.json())
//       .then((data) => setTerms(data))
//       .catch((err) => console.error("Error fetching terms:", err));
//   }, []);

//   return (
//     <div className="franchisee-terms-container">
//       <h2>Franchisee Terms & Conditions</h2>
//       <ul>
//         {terms.map((term, index) => (
//           <li key={index}>{term.description}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default FranchiseeTerms;
