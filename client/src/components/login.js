import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState()
  const navigate = useNavigate()

  async function login(event) {
    event.preventDefault();
    const loginData = { email, password }

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(loginData)
      })

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('authToken', JSON.stringify(data));
        navigate('/')
      } else {
        const data = await response.json()
        console.log(data.message);
        setErrorMessage(data.message)
      }
    } catch (error) {
      console.log(error.message);
      setErrorMessage(error.message)
    }

  }

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <form onSubmit={login}>
          <h3>Sign In</h3>
          <div className="mb-3">
            <label>Email address</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="form-control"
              placeholder="Enter email"
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="form-control"
              placeholder="Enter password"
            />
            {errorMessage && <p className='text-danger'>{errorMessage}</p>}
          </div>
          <div className="mb-3">
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="customCheck1"
              />
              <label className="custom-control-label" htmlFor="customCheck1">
                Remember me
              </label>
            </div>
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
          <p className="forgot-password text-right">
            Forgot <a href="#">password?</a>
          </p>
        </form>
      </div>
    </div>
  )

}