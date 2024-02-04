import React, { useEffect, useState } from 'react'
import { Card, CardContent, TextField, Button, Stack,  } from '@mui/material';
import interact from 'interactjs';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');
  const [showRegistration, setShowRegistration] = useState(false);

  const cardStyle = {
    width: '24rem',
    // backgroundImage: `url(${background1})`,
    background: 'white',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: 'white',
    border: '2px solid #ddd',
    borderRadius: '8px',
  };

  const inputStyle = {
    color: 'black',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'white', // Change the border color
    },
    '&:focus .MuiOutlinedInput-notchedOutline': {
      borderColor: 'white', // Change the border color on focus
    },
  };
  const handleSignup = (userData) => {
    // Handle registration logic, e.g., send data to server
    console.log('User data submitted:', userData);
    // You may also navigate to a different page or perform other actions
    setShowRegistration(false);
  };

  const handleCancelRegistration = () => {
    setShowRegistration(false);
  };


  useEffect(() => {
    interact('.draggable-card').draggable({
      listeners: {
        move(event) {
          const { target } = event;
          const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
          const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

          target.style.transform = `translate(${x}px, ${y}px)`;
          target.setAttribute('data-x', x);
          target.setAttribute('data-y', y);
        },
      },
    });
  }, []);

  const handleSignupButtonClick = () => {
    setShowRegistration(true);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    // Clear the email error when the user starts typing again
    setEmailError(false);
  };

  const handleEmailBlur = () => {
    // Email validation on blur
    if (email.trim() !== '') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(!emailPattern.test(email));
    }
  };
const navigate = useNavigate();
  const handleLogin = async () => {

    // Check if email or password is empty
  if (email.trim() === '' || password.trim() === '') {
    toast.error('Please enter both email and password', {
      position: 'top-right',
    });
    return;
  }
    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });

      if (response.status === 200) {
        // Assuming your backend returns a token upon successful login
        const {isLogin,user_id,email} = response.data;
        // Show success notification
      toast.success(`Login successful`, {
        position: 'top-right',
      });
        // Store the token in localStorage
        localStorage.setItem('isSingup', true);
        navigate('/dashboard');
        // Perform any additional actions after successful login
        console.log('Login successful');
      } else {
        // Login failed
        console.error('Login failed');
        toast.error(`Login failed! Please try again`, {
          position: 'top-right',
        });
      }
    } catch (error) {
      // Handle error
      console.error('Login error:', error);
      toast.error(`Login failed! Please try again`, {
        position: 'top-right',
      });
    }
  };

  return (
    <Card className="draggable-card" style={cardStyle}>
    <CardContent>
      <h2 style={{ color: 'black' }}>Login</h2>
      <TextField
        type="email"
        label="Email"
        variant="outlined"
        margin="normal"
        fullWidth
        placeholder="Enter email"
        InputProps={{ style: inputStyle }}
        value={email}
        onChange={handleEmailChange}
        onBlur={handleEmailBlur}
        error={emailError}
        helperText={emailError ? 'Invalid email format' : ''}
      />
      <TextField
        type="password"
        label="Password"
        variant="outlined"
        margin="normal"
        fullWidth
        placeholder="Enter password"
        onChange={(e)=>setPassword(e.target.value)}
        InputProps={{ style: inputStyle }}
      />
      <Stack direction="row" spacing={2} justifyContent="space-between" style={{ marginTop: '20px' }}>
        <Button variant="contained" color="success" onClick={handleLogin} style={{ marginTop: '20px', fontWeight: 'bold', background: '#4CAF50', color: 'white' }}>
          Login
        </Button>
        <Link to="/signup">
          <Button variant="contained" color="error" onClick={handleSignupButtonClick} style={{ marginTop: '20px', fontWeight: 'bold', background: '#FF5733', color: 'white' }}>

            Signup+
          </Button>
        </Link>
      </Stack>
    </CardContent>
  </Card>

  )
}

export default Login
