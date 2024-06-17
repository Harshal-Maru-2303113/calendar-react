import React, { useEffect, useState } from 'react';
import './Home.css'; // Custom CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Home() {

  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8000/home", {
          credentials: 'include', // Include credentials in the request
        });

        if (!res.ok) {
          // Handle HTTP errors
          throw new Error('Network response was not ok');
        }

        const response = await res.json();

        // Sort the data based on the 'id' property before setting the state
        const sortedData = response.data.sort((a, b) => a.id - b.id);
        setData(sortedData);
        setEvents(JSON.parse(response.events));
        setUser(response.user);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const intervalId = setInterval(updateClock, 1000);
    updateClock();
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to run only once after the component mounts

  const updateClock = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    if (document.getElementById('clock')) {
      document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
    }
  };

  const showPopup = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.style.display = 'block';
    } else {
      console.error(`Element with id ${id} not found`);
    }
  };

  const closePopup = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.style.display = 'none';
    } else {
      console.error(`Element with id ${id} not found`);
    }
  };

  const nextMonth = () => {
    if (currentIndex < 4) setCurrentIndex(currentIndex + 1);
  };

  const lastMonth = () => {
    if (currentIndex > -4) setCurrentIndex(currentIndex - 1);
  };
  // Looping through events

  useEffect(() => {
    if (events && Array.isArray(events)) {
      // Update day titles with event details and set background color based on event type
      events.forEach(event => {
        // Your event handling logic here
        const titleElement = document.getElementsByClassName(`.title-${event.year}-${event.month}-${event.date}`)[0];
        // Update day title with event details
        if (titleElement) {
          titleElement.textContent = `${event.date} ${event.eventTitle.replace(/#/g, "'").replace(/~/g, '"')}`;
        }
        // Set background color based on event type
        const dayElement = document.getElementsByClassName(`.${event.year}-${event.month}-${event.date}`)[0];
        if (dayElement) {
          dayElement.style.backgroundColor = event.eventType === 'exam' ? 'crimson' : 'orange';
        }
      });
    } else {
      console.log("No array")
    }
  }, [events]);

  const deleteEvent = async (e) => {

    e.preventDefault(); // Prevent the default form submission behavior
    const eventId = e.target.value
    const url = 'http://localhost:8000/home';
    const payload = {
      delete: eventId
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      credentials: 'include', // Include credentials in the request
    });

    if (response.ok) {
      window.location.reload();
      navigate('/home'); // Redirect to home page
    } else {
      console.error("deletion failed");
    }
  };

  if (user === null) {
    return (<div className="loading">
      <div className="buffer">
        <span style={{ "--n": 1 }} ></span>
        <span style={{ "--n": 2 }}></span>
        <span style={{ "--n": 3 }}></span>
        <span style={{ "--n": 4 }}></span>
        <span style={{ "--n": 5 }}></span>
        <span style={{ "--n": 6 }}></span>
        <span style={{ "--n": 7 }}></span>
        <span style={{ "--n": 8 }}></span>
        <span style={{ "--n": 9 }}></span>
        <span style={{ "--n": 10 }}></span>
        <span style={{ "--n": 11 }}></span>
        <span style={{ "--n": 12 }}></span>
        <span style={{ "--n": 13 }}></span>
        <span style={{ "--n": 14 }}></span>
        <span style={{ "--n": 15 }}></span>
      </div>
    </div>);
  }

  return (
    <div className='main'>
      <nav className="navbar navbar-expand-lg" style={{ backgroundColor: 'black' }}>
        <div className="container-fluid">
          <a className="navbar-brand" href="https://iitgoa.ac.in/"> </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span>
              <FaBars style={{ color: '#ffffff' }} />
            </span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/home">Calendar</a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/about">About</a>
              </li>
            </ul>
            <div className="navbar-nav">
              <div className="nav-item" onClick={() => { navigate('/profile') }}>
                <a className="nav-link active" aria-current="page" href="/profile">Profile</a>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className="content">
        {data.map((c, index) => {
          const currentMonth = Object.keys(c)[0];
          const currentYear = c.year;
          return (
            <div key={index} className={`calendar content-${index - 4}`} style={{ display: index - 4 === currentIndex ? 'block' : 'none' }}>
              <div className="month"><h3>{`${currentMonth} ${currentYear}`}</h3></div>
              <div className="days">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div className="day" key={day}><h4>{day}</h4></div>
                ))}
                {c[currentMonth].map((week, weekIndex) => (
                  <React.Fragment key={weekIndex}>
                    {week.map((day, dayIndex) => (
                      <div key={dayIndex} className={`day ${currentYear}-${currentMonth}-${day} text-truncate`} onClick={() => day !== 0 && showPopup(`popup-${currentYear}-${currentMonth}-${day}`)} style={{ backgroundColor: events.find((event) => { return event["date"] === day && event["month"] === currentMonth && event["year"] === currentYear && user.course.find((e) => { return event.course === e }) }) ? events.find((event) => { return event["date"] === day && event["month"] === currentMonth && event["year"] === currentYear }).eventType === "exam" ? 'crimson' : 'orange' : '' }}>
                        <h5 className={`title-${currentYear}-${currentMonth}-${day}`}>{day !== 0 ? day : ''} {events.find((event) => { return event["date"] === day && event["month"] === currentMonth && event["year"] === currentYear && user.course.find((e) => { return event.course === e }) }) ? events.find((event) => { return event["date"] === day && event["month"] === currentMonth && event["year"] === currentYear }).eventTitle.replace(/#/g, "'").replace(/~/g, '"') : ''}</h5>
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
              {c[currentMonth].map((week, weekIndex) => (
                <React.Fragment key={weekIndex}>
                  {week.map((day, dayIndex) => {
                    const arr = Array.isArray(events) ? events.filter(event => event.date === day && event.month === currentMonth && event.year === currentYear && user.course.find((e) => { return event.course === e })) : [];
                    return arr.length > 0 ? (
                      <div key={dayIndex} id={`popup-${currentYear}-${currentMonth}-${day}`} className="popup">
                        <div className="popup-content">
                          <span className="close" onClick={() => closePopup(`popup-${currentYear}-${currentMonth}-${day}`)}>&times;</span>
                          <h2>Event Details</h2>
                          <form>
                            <label htmlFor="date">Date: {`${day}-${currentMonth}-${currentYear}`}</label>
                            {arr.map((ele, eleIndex) => (
                              <React.Fragment key={eleIndex}>
                                <hr />
                                <div className="event-type">
                                  <label>Event Type : {ele.eventType}</label><br />
                                </div>
                                <table>
                                  <tbody>
                                    <tr>
                                      <th>Event : {ele.eventTitle.replace(/#/g, "'").replace(/~/g, '"')}</th>
                                    </tr>
                                    <tr>
                                      <th>Course : {ele.course}</th>
                                    </tr>
                                    <tr>
                                      <th>Description : {ele.eventDescription.replace(/#/g, "'").replace(/~/g, '"')}</th>
                                    </tr>
                                    <tr>
                                      <th>By Faculty : {ele.faculty_name}</th>
                                    </tr>
                                  </tbody>
                                </table>
                                {user && user.userType === "staff" && ele.faculty_email === user.email && (
                                  <button type="submit" className="submit-btn" name="delete" value={ele._id} onClick={deleteEvent}>Delete</button>
                                )}
                              </React.Fragment>
                            ))}
                          </form>
                        </div>
                      </div>
                    ) : null;
                  })}
                </React.Fragment>
              ))}
            </div>
          );
        })}
        <div className="arrow-content">
          <div className="form1">
            <button onClick={lastMonth} className="up" id="up"></button>
            <button onClick={nextMonth} className="down" id="down"></button>
          </div>
        </div>
      </div>
      <footer style={{ backgroundColor: 'rgb(31,36,33)' }}>
        <img id="image" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpOr24GGFIDW0neymjTHQN6SlA9YgzbkSWEes40ztmRA&s" alt="logo" />
        <div id="text">
          <b>Spring Semester</b>
          <br />IIT Goa Academic calendar 2023-2024
        </div>
        <div id="clock"></div>
      </footer>
    </div>
  );
}

export default Home;
