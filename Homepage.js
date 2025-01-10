import React, { useState, useEffect } from "react";
import axios from "axios";

function HomePage() {
  const [referrals, setReferrals] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:4000/referrals")
      .then(res => setReferrals(res.data))
      .catch(err => setError(err.message));
  }, []);

  const generateReferral = () => {
    axios.post("http://localhost:4000/referrals")
      .then(res => setReferrals([...referrals, res.data]))
      .catch(err => setError(err.response.data.error));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Your Referral Codes</h1>
      {referrals.length < 10 ? (
        <button onClick={generateReferral}>Generate New Referral</button>
      ) : (
        <p>You have reached the limit of 10 referrals.</p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {referrals.map(ref => (
          <li key={ref.id}>{ref.code}</li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;
