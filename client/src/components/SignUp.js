import React, { useState } from 'react';

export default function SignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState()

  async function register(event) {
    event.preventDefault();
    try {
      const sigupData = {
        name,
        email,
        password
      }

      const response = await fetch('https://todo-list-api-f7q3.onrender.com/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sigupData)
      })

      if (response.ok) {
        window.location.href = '/'
        setName('')
        setEmail('')
        setPassword('')
      } else {
        const data = await response.json()
        setErrorMessage(data.error)
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message)
    }
  }

  // console.log(errorMessage);


  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <form onSubmit={register}>
          <h3>Sign Up</h3>
          <div className="mb-3">
            <label>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)}
              type="text"
              className="form-control"
              placeholder="Name"
            />
          </div>
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
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Sign Up
            </button>
          </div>
          <p className="forgot-password text-right">
            Already registered <a href="/sign-in">sign in?</a>
          </p>
        </form>
      </div>
    </div>
  )
}
