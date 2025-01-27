import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

function AddTodo({ tokens }) {
  const [show, setShow] = useState(false);
  const [data, setData] = useState({title: '', description: ''});

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  async function handleSubmit(event) {
    event.preventDefault();

    const response = await fetch('https://todo-list-api-f7q3.onrender.com/todos', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'authorization': `bearer ${tokens}`
        },
        body: JSON.stringify(data)
    })
    if (response.ok) {
        const data = await response.json()
        console.log(data);
        
    }
  }

  return (
    <>
      <Button variant="light" className='m-2' onClick={handleShow}>
        Add +
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                autoFocus
                value={data.title}
                onChange={(e) => setData((prevData) => ({...prevData, title: e.target.value }))}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="description"
            >
              <Form.Label>Description</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                value={data.description} 
                onChange={(e) => setData((prevData) => ({...prevData, description: e.target.value}))}
              />
            </Form.Group>
            <Button variant="primary" type='submit' onClick={handleClose}>
                Add Todo
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddTodo;