import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Home.css';
import './Profile.css';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [user,setUser] = useState({})
  const [clock, setClock] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {

    const fetchData = async () => {
        try {
            const res = await fetch("http://localhost:8000/profile", {
                credentials: 'include', // Include credentials in the request
            });

            if (!res.ok) {
                // Handle HTTP errors
                throw new Error('Network response was not ok');
            }

            const response = await res.json();

            setUser(response)

            // Sort the data based on the 'id' property before setting the state

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    fetchData();

    const timer = setInterval(() => {
      setClock(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  function logOut(){
    const fetchData = async () => {
      try {
          const res = await fetch("http://localhost:8000/logout", {
              credentials: 'include', // Include credentials in the request
          });

          if (!res.ok) {
              // Handle HTTP errors
              throw new Error('Network response was not ok');
          }

          const response = await res.json();

          if(response.status){
            navigate('/');
          }

          // Sort the data based on the 'id' property before setting the state

      } catch (error) {
          console.error("Error fetching data:", error);
      }
  };

  fetchData();
  }

  useEffect(() => {
    if(user===null){
      navigate('/');
    }
  }, [user, navigate]);

  
  if (user===null) {
    return null;
  }

  return (
    <div className='main'>
      <nav className="navbar navbar-expand-lg" style={{ backgroundColor: 'black' }}>
        <div className="container-fluid">
          <a className="navbar-brand" href="https://iitgoa.ac.in/"> </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span>
              <i className="fa-solid fa-bars" style={{ color: '#ffffff' }}></i>
            </span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item" onClick={()=>{navigate('/')}}>
                <a className="nav-link active" aria-current="page" href="/">Calendar</a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/about">About</a>
              </li>
            </ul>
            <div className="navbar-nav">
              <div className="nav-item">
                <a className="nav-link active" aria-current="page" href="/profile">Profile</a>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className="profile-container">
        <h1 style={{ color: 'white' }}>User Profile</h1>
        <div className="profile-info">
          <label>Name:</label>
          <span id="name">{user.name}</span>
          <label>Roll Number:</label>
          <span id="roll">{user.rollno}</span>
          <label>Email:</label>
          <span id="email">{user.email}</span>
          <label>Branch:</label>
          <span id="branch">{user.Branch}</span>
        </div>
        <div className="logout-btn" onClick={logOut}>
          Logout
        </div>
      </div>
      <footer style={{ backgroundColor: 'rgb(31,36,33)' }}>
        <img id="image" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpOr24GGFIDW0neymjTHQN6SlA9YgzbkSWEes40ztmRA&s" alt="" />
        <div id="text">
          <b>Spring Semester</b>
          <br />IIT Goa Academic calendar 2023-2024
        </div>
        <div id="clock">
          {clock.toLocaleTimeString()}
        </div>
      </footer>
    </div>
  );
};

export default Profile;
