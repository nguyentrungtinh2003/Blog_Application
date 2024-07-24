import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";

const AdminPage = () => {
  const [userCount, setUserCount] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null); // State to track selected card

  // Function to fetch users
  const fetchUsers = () => {
    axios
      .get("http://localhost:8080/api/auth/users")
      .then((response) => {
        setUsers(response.data);
        setUserCount(response.data.length); // Update userCount state
        setSelectedCard("users"); // Set selected card to users
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  // Function to fetch posts
  const fetchPosts = () => {
    axios
      .get("http://localhost:8080/api/posts")
      .then((response) => {
        setPosts(response.data);
        setPostCount(response.data.length); // Update postCount state
        setSelectedCard("posts"); // Set selected card to posts
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  };

  useEffect(() => {
    // Fetch initial data
    fetchUsers();
    fetchPosts();
  }, []); // Empty dependency array to run only once on component mount

  const deleteHandel = (id) => {
    axios
      .delete(`http://localhost:8080/api/auth/users/${id}`)
      .then((response) => {
        console.log("Delete user success");
      })
      .catch((error) => {
        console.error("Error delete user", error);
      });
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Admin Dashboard</h2>

      <div className="card-container d-flex justify-content-around flex-wrap">
        {/* Users Card */}
        <Card
          style={{ width: "18rem" }}
          className={`mb-4 ${selectedCard === "users" ? "selected" : ""}`}
          onClick={fetchUsers}
        >
          <Card.Body>
            <Card.Title>Users</Card.Title>
            <Card.Text>Total: {userCount}</Card.Text>
            <Button variant="primary">Manage Users</Button>
          </Card.Body>
        </Card>

        {/* Posts Card */}
        <Card
          style={{ width: "18rem" }}
          className={`mb-4 ${selectedCard === "posts" ? "selected" : ""}`}
          onClick={fetchPosts}
        >
          <Card.Body>
            <Card.Title>Posts</Card.Title>
            <Card.Text>Total: {postCount}</Card.Text>
            <Button variant="primary">Manage Posts</Button>
          </Card.Body>
        </Card>

        {/* Likes Card */}
        <Card style={{ width: "18rem" }} className="mb-4">
          <Card.Body>
            <Card.Title>Likes</Card.Title>
            <Card.Text>Total: {likeCount}</Card.Text>
            <Button
              variant="primary"
              onClick={() => console.log("Manage Likes")}
            >
              Manage Likes
            </Button>
          </Card.Body>
        </Card>

        {/* Comments Card */}
        <Card style={{ width: "18rem" }} className="mb-4">
          <Card.Body>
            <Card.Title>Comments</Card.Title>
            <Card.Text>Total: {commentCount}</Card.Text>
            <Button
              variant="primary"
              onClick={() => console.log("Manage Comments")}
            >
              Manage Comments
            </Button>
          </Card.Body>
        </Card>
      </div>

      {/* Display Users Table */}
      {selectedCard === "users" && users.length > 0 && (
        <div>
          <h3 className="mb-3">Users Table</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.username}</td>
                  <td>
                    <Button variant="info" className="mr-2">
                      <a
                        href={`/editUser/${user.id}`}
                        className="text-white text-decoration-none"
                      >
                        Edit
                      </a>
                    </Button>
                    <Button variant="danger" className="mr-2">
                      <a
                        onClick={() => deleteHandel(user.id)}
                        className="text-white text-decoration-none"
                      >
                        Delete
                      </a>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Display Posts Table */}
      {selectedCard === "posts" && posts.length > 0 && (
        <div>
          <h3 className="mb-3">Posts Table</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th className="text-center">#</th>
                <th>Name</th>
                <th>Content</th>
                <th>Posted By</th>
                <th>Tags</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, index) => (
                <tr key={post.id}>
                  <td className="text-center">{index + 1}</td>
                  <td>{post.name}</td>
                  <td>{post.content}</td>
                  <td>{post.postedBy.username}</td>
                  <td>{post.tags}</td>
                  <td>
                    <Button
                      variant="info"
                      className="mr-2"
                      onClick={() => console.log("Edit Post")}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      className="mr-2"
                      onClick={() => console.log("Delete Post")}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Similar sections for Likes and Comments tables */}
    </Container>
  );
};

export default AdminPage;
