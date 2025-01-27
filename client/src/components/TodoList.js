import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Logout from './Logout';
import Update from './Update';
import AddTodo from './AddTodo';

function TodoList() {
    const localTokens = JSON.parse(localStorage.getItem('authToken'));
    const [tokens, setTokens] = useState({ token: localTokens.token, refreshToken: localTokens.refreshToken });
    const [data, setData] = useState([])
    const [search, setSearch] = useState('')
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const limit = 10
    const totalPages = Math.ceil(total / limit)


  const handleNextPage = async () => {
    if (page < totalPages) {
        setPage(page + 1) 
        await fetchTodo(page + 1)
    }
  };

  const handlePreviousPage = async () => {
    if (page > 1) {
        setPage(page - 1)
        await fetchTodo(page - 1)
    }
  };

    async function fetchTodo(page) {
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

    async function handleSearch(event) {
        event.preventDefault();
        if (!search) return await fetchTodo(page)
        const res = await fetch(`http://localhost:3000/todos?term=${search}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${tokens.token}`,
            },
        });

        if (res.ok) {
            const data = await res.json();
            setData(data.filterdTodos); // Update state with fetched data
        } else {
            console.error("Failed to fetch todos:", res.status);
        }
    }

  return (
    <>
        <div>
            <form onSubmit={handleSearch} className='search w-50 my-3 mx-2'>
            <div style={{position: 'relative'}}>
                <input value={search} onChange={(e) => setSearch(e.target.value)}
                    type="text"
                    className="form-control"
                    placeholder="Search"
                    // style={{width: '100%', paddingLeft: '35px', height: '35px', boxSizing: 'border-box'}}
                    />
                    <svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16" style={{position: 'absolute', right: '100px', top: '25%', }}>
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                    </svg>
                
                <Button type='submit' style={{position: 'absolute', right: '0px', top: '0%', }}>Search</Button>
            </div>
            </form>
            <AddTodo tokens={tokens.token}/>
        </div>
        <div>
            <Row xs={1} md={2} className="g-4">
                {data.length >0 ? data.map((res) => (
                    <Col key={res.id}>
                    <Card>
                        {/* <Card.Img variant="top" src="holder.js/100px160" /> */}
                        <Card.Body>
                            <Card.Title>{res.title}</Card.Title>
                            <Card.Text className='custom-text'>
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
            <div>
                <button onClick={handlePreviousPage} disabled={page === 1}>
                    Previous
                </button>
                <span>
                    Page {page} of {totalPages}
                </span>
                <button onClick={handleNextPage} disabled={page === totalPages}>
                    Next
                </button>
            </div>
        </div>
        <Logout tokens={tokens}/>
    </>
  )
}

export default TodoList