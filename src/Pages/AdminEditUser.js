import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";

const AdminEditUser = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/auth/users/${id}`)
      .then((response) => {
        setFormData(response.data);
      })
      .catch((error) => {
        console.log("Error get user by id !");
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:8080/api/auth/users/${id}`, formData)
      .then((response) => {
        console.log("User updated successfully");
      })
      .catch((error) => {
        console.log("Error updating user!");
      });
  };

  return (
    <Container className="container m-4">
      <h2>Edit User</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          Save Changes
        </Button>
      </Form>
    </Container>
  );
};

export default AdminEditUser;
