import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './Home.css'; // Import the CSS file if you have one

function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8080/api/your-endpoint')
      .then(response => setData(response.data))
      .catch(error => console.error('Error fetching data', error));
  }, []);

  return (
    <div className="home-container">
      <h1>Home</h1>
      <div className="links">
        <Link to="/people" className="nav-link">Go to People</Link>
        <Link to="/add-person" className="nav-link">Add New Person</Link>
      </div>
    </div>
  );
}

export default Home;
