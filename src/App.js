import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Edit from './Edit';
import Profile from './Profile';
import Home2 from './Home2';
import Root from './Root';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Root/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/edit" element={<Edit/>} />
        <Route path="/home/staff" element={<Home2/>} exact />
        <Route path="/home" element={<Home/>} exact />
        <Route path="/profile" element={<Profile/>} />
      </Routes>
    </Router>
  );
};

export default App;