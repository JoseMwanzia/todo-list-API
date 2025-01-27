import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import Update from './Update';

function TodoList() {
    const localTokens = JSON.parse(localStorage.getItem('authToken'));
    const [tokens, setTokens] = useState({ token: localTokens.token, refreshToken: localTokens.refreshToken });
    const [data, setData] = useState([])
    const [page, setPage] = useState(1)
        try {
            let res = await fetch(`https://todo-list-api-f7q3.onrender.com/todos?page=${page}`, {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    'authorization': `Bearer ${tokens.token}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                return setData(data.data), setTotal(data.total) // Update state with fetched data
            } 

            console.warn("Access token expired. Attempting to refresh page...");

            // Refresh token logic
            let newRes = await fetch('http://localhost:3000/refresh', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ token: tokens.refreshToken }),
            });

            if (newRes.ok) {
                const refreshedToken = await newRes.clone().text();
                setTokens((prevData) => ({...prevData, token: refreshedToken})); // Update tokens

                // Retry fetching todos with the new access token
                res = await fetch('http://localhost:3000/todos', {
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json',
                        'authorization': `Bearer ${tokens.token}`,
                    },
                });
            } else {
                console.error("Failed to refresh tokens. Please log in again.");
                return;
            }
        } catch (error) {
            console.error("Error fetching todos:", error);
        }
    }

    useEffect(() => {   
        fetchTodo(page)
    }, [tokens.token])

    async function handleLogout() {
        try {
            const response = await fetch('http://localhost:3000/logout', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'authorization': `bearer ${tokens.token}`
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
    }

  return (
    <>
        <Row xs={1} md={2} className="g-4 mt-5  ">
            {data.length >0 ? data.map((res) => (
                <Col key={res.id}>
                <Card>
                    {/* <Card.Img variant="top" src="holder.js/100px160" /> */}
                    <Card.Body>
                        <Card.Title>{res.title}</Card.Title>
                        <Card.Text>
                            {res.description}
                        </Card.Text>
                        <Update title={res.title} description={res.description} todoId={res.id} token={tokens.token}/>
                    </Card.Body>
                </Card>
                </Col>
            )) : 
            <h1>Loading...</h1>
            }
        </Row>
        <Col className='g-4 my-3 d-flex justify-content-center'>
            <Button className='w-25 btn-danger' onClick={handleLogout}>Logout</Button>
        </Col>
    </>
  )
}

export default TodoList