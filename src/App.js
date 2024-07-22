import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home'; // Assuming Home component exists
import People from './components/People'; // Your People component
import AddPerson from './components/AddPerson'; // Newly created AddPerson component
import './App.css'; // Import the CSS file

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <header>
          <h1>Search People</h1>
        </header>
        <nav className="navbar">
          <a href="/people">People</a>
          <a href="/add-person">Add Person</a>
        </nav>
        <main>
          <Routes>
            <Route path="/people" element={<People />} />
            <Route path="/add-person" element={<AddPerson />} />
          </Routes>
        </main>
        <footer>
          <p>&copy; 2024 My App</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
