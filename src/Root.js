import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Root() {
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:8000/", {
                    credentials: 'include', // Include credentials in the request
                });
    
                if (!res.ok) {
                    // Handle HTTP errors
                    throw new Error('Network response was not ok');
                }
    
                const response = await res.json();

                if(response.mess){
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
}

export default Root