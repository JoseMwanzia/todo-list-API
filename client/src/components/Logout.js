import React from 'react'
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import { useNavigate } from 'react-router-dom';

function Logout({ tokens }) {
    const navigate = useNavigate();
    // localStorage.removeItem('authToken')

    async function handleLogout() {
        try {
            const response = await fetch('https://todo-list-api-f7q3.onrender.com/logout', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `bearer ${tokens.token}`
                },
                body: JSON.stringify({token: tokens.token, refreshToken: tokens.refreshToken})
            })
            if (response.ok) {
                const data = await response.json()
                navigate(data.redirect)
                localStorage.removeItem('authToken')
            }
        } catch (error) {
            console.error('Error Loogig out', error)
        }
    };

  return (
    <Col className='g-4 my-3 d-flex justify-content-center '>
        <Button className='w-25 btn-danger' onClick={handleLogout}>Logout</Button>
    </Col>
  )
}

export default Logout

