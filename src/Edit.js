import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Home.css';
import './Edit.css';

const Edit = () => {
  const navigate = useNavigate();

  const [eventType, setEventType] = useState('exam');
  const [eventDate, setEventDate] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [courseSelection, setCourseSelection] = useState([]);
  const [course, setCourse] = useState('');
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8000/edit", {
          credentials: 'include', // Include credentials in the request
        });

        if (!res.ok) {
          // Handle HTTP errors
          throw new Error('Network response was not ok');
        }

        const response = await res.json();
        setCourseSelection(response.user.course);
        setCourse(response.user.course[0]);
        setUser(response.user);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      const clockDiv = document.getElementById('clock');
      if (clockDiv) {
        clockDiv.textContent = `${hours}:${minutes}:${seconds}`;
      }
    };

    const intervalId = setInterval(updateClock, 1000);

    // Initial clock update
    updateClock();

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      eventType: eventType,
      eventDate: eventDate,
      eventTitle: eventTitle,
      eventDescription: eventDescription,
      course: course
    };

    const response = await fetch('http://localhost:8000/edit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      credentials: 'include',
    });

    if (response.ok) {
      navigate('/home/staff');
    } else {
      console.error("Submission failed");
    }
  }

  useEffect(() => {
    if(user===null){
      navigate('/');
    }
  }, [user, navigate]);

  if (user.userType !== "staff") {
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
      <div className="container">
        <div className="form-container">
          <h2>Event Input Form</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="eventType">Event Type:</label>
            <select id="eventType" name="eventType" value={eventType} onChange={(e) => setEventType(e.target.value)}>
              <option value="exam">Exam</option>
              <option value="other">Other</option>
            </select>
            <label htmlFor="courseCode">Course Code:</label>
            <select id="courseCode" name="courseCode" value={course} onChange={(e) => setCourse(e.target.value)}>
              {courseSelection.map((course, index) => (
                <option key={index} value={course}>
                  {course}
                </option>
              ))}
            </select>
            <label htmlFor="eventDate">Event Date:</label>
            <input type="date" id="eventDate" name="eventDate" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
            <label htmlFor="eventTitle">Event Title:</label>
            <input type="text" id="eventTitle" name="eventTitle" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} required />
            <label htmlFor="eventDescription">Event Description:</label>
            <input type="text" id="eventDescription" name="eventDescription" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} required />
            <input type="submit" value="Submit" />
          </form>
        </div>
      </div>
      <footer style={{ backgroundColor: 'rgb(31,36,33)' }}>
        <img id="image" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpOr24GGFIDW0neymjTHQN6SlA9YgzbkSWEes40ztmRA&s" alt="" style={{ width: '50px', height: '50px', marginLeft: '10pt' }} />
        <div id="text" style={{ marginLeft: '10px', color: 'white' }}>
          <b>Spring Semester</b>
          <br />IIT Goa Academic calendar 2023-2024
        </div>
        <div id="clock" style={{ fontSize: '1.5em', marginLeft: 'auto' }}></div>
      </footer>
    </div>
  );
};

export default Edit;
