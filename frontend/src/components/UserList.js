import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Form, Button, Table, Modal } from 'react-bootstrap';
import '../App.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

function UserList() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // New state for delete confirmation
  const [updatedUser, setUpdatedUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNo: '',
    role: ''
  });
  const navigate = useNavigate(); // Create navigate instance

  useEffect(() => {
    axios.get('http://localhost:5000/api/users', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Send token in Authorization header
      }
    })
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const filteredUsers = users
    .filter(user => 
      user.firstName.toLowerCase().includes(search.toLowerCase()) ||
      user.lastName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.mobileNo.includes(search)
    )
    .filter(user => filterRole ? user.role === filterRole : true);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    navigate('/login'); // Redirect to login page
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setUpdatedUser({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobileNo: user.mobileNo,
      role: user.role
    });
    setShowEditModal(true);
  };

  const handleUpdate = () => {
    axios.put(`http://localhost:5000/api/users/${selectedUser._id}`, updatedUser, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Send token in Authorization header
      }
    })
      .then(response => {
        setUsers(users.map(user => user._id === selectedUser._id ? response.data : user));
        setShowEditModal(false);
      })
      .catch(error => console.error('Error updating user:', error));
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteConfirm(true); // Show delete confirmation modal
  };

  const handleDelete = () => {
    axios.delete(`http://localhost:5000/api/users/${selectedUser._id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Send token in Authorization header
      }
    })
      .then(() => {
        setUsers(users.filter(user => user._id !== selectedUser._id));
        setShowDeleteConfirm(false);
      })
      .catch(error => console.error('Error deleting user:', error));
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setShowDeleteConfirm(false);
  };

  return (
    <Container style={{ padding: '40px 0' }}>
      <Card className="shadow-lg p-3 mb-5 bg-white rounded">
        <Card.Body>
          <Card.Title as="h2" className="text-center">User List</Card.Title>
          <Button variant="danger" onClick={handleLogout} className="mb-3">Logout</Button>
          <Form.Control
            type="text"
            placeholder="Search by first name, last name, email, or mobile number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-3"
          />
          <Form.Control
            as="select"
            onChange={(e) => setFilterRole(e.target.value)}
            value={filterRole}
            className="mb-3"
          >
            <option value="">All Roles</option>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
            <option value="Guest">Guest</option>
          </Form.Control>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Mobile No</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.mobileNo}</td>
                  <td>{user.role}</td>
                  <td>
                    <Button variant="warning" onClick={() => handleEditClick(user)}>View</Button>
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={updatedUser.firstName}
                onChange={(e) => setUpdatedUser({ ...updatedUser, firstName: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={updatedUser.lastName}
                onChange={(e) => setUpdatedUser({ ...updatedUser, lastName: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={updatedUser.email}
                onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formMobileNo">
              <Form.Label>Mobile No</Form.Label>
              <Form.Control
                type="text"
                value={updatedUser.mobileNo}
                onChange={(e) => setUpdatedUser({ ...updatedUser, mobileNo: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formRole">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                value={updatedUser.role}
                onChange={(e) => setUpdatedUser({ ...updatedUser, role: e.target.value })}
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
                <option value="Guest">Guest</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
       
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this user?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default UserList;
