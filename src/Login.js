import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css'; // Import the CSS module

function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
        try {
            const res = await fetch("http://localhost:8000/login", {
                credentials: 'include', // Include credentials in the request
            });

            if (!res.ok) {
                // Handle HTTP errors
                throw new Error('Network response was not ok');
            }

            const response = await res.json();

            if(response.user){
                if(response.user.userType==="staff"){
                    navigate('/home/staff');
                }else{
                    navigate('/home');
                }
            }else{
                navigate('/login');
            }


        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    fetchData();
  }, [navigate]);

  const handlePostRequest = async (e) => {
    e.preventDefault();
    const url = 'http://localhost:8000/login';
    const payload = {
      username: email,
      password: pass,
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
      const res = await response.json();
      if(res.user.userType==="student"){
        navigate('/home'); // Redirect to home page
      }
      else if(res.user.userType==="staff"){
        navigate('/home/staff');
      }
    } else {
      alert("Please enter right creadentials!")
    }
  };

  return (
    <div className={styles.Login}>
      <div className={styles.formContainer} style={{ marginTop: "20px" }}>
        <h1>Login Form</h1>
        <form onSubmit={handlePostRequest}>
          <input
            placeholder='Email'
            name="username"
            type="text"
            value={email}
            onChange={(e) => { setEmail(e.target.value) }}
          />
          <br />
          <input
            placeholder='Password'
            name="password"
            type="password"
            value={pass}
            onChange={(e) => { setPass(e.target.value) }}
          />
          <br />
          <button className={styles.sub} type='submit'>Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
