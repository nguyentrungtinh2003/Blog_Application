import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";

const Home = () => {
  const [newPost, setNewPost] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/posts/newPost")
      .then((response) => {
        setNewPost(response.data);
      })
      .catch((error) => {
        console.log("Error axios data new post !");
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/posts")
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.log("Error axios get all posts");
      });
  }, []);

  // Hiển thị thời gian đăng bài viết
  const getTimeElapsed = (postDate) => {
    const currentDate = new Date();
    const postDateTime = new Date(postDate);

    const elapsedMilliseconds = currentDate - postDateTime;
    const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
    const elapsedMinutes = Math.floor(elapsedSeconds / 60);
    const elapsedHours = Math.floor(elapsedMinutes / 60);
    const elapsedDays = Math.floor(elapsedHours / 24);

    // Check if post date is in the current or previous year
    const postYear = postDateTime.getFullYear();
    const currentYear = currentDate.getFullYear();

    if (elapsedDays > 365) {
      return `${Math.floor(elapsedDays / 365)} năm trước`;
    } else if (elapsedDays > 30) {
      return `${Math.floor(elapsedDays / 30)} tháng trước`;
    } else if (elapsedDays > 0) {
      return `${elapsedDays} ngày trước`;
    } else if (elapsedHours > 0) {
      return `${elapsedHours} giờ trước`;
    } else if (elapsedMinutes > 0) {
      return `${elapsedMinutes} phút trước`;
    } else if (elapsedSeconds > 0) {
      return `${elapsedSeconds} giây trước`;
    } else {
      return "vừa xong";
    }
  };

  return (
    <div>
      <Container className="mt-4">
        <Carousel interval={2000}>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://i1.wp.com/theappentrepreneur.com/wp-content/uploads/2013/02/Blogging-Apps-For-Bloggers.jpg?fit=730%2C382&ssl=1"
              alt="First slide"
            />
            <Carousel.Caption>
              <h3></h3>
              <p></p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://www.teknopk.com/wp-content/uploads/2018/03/blogging.jpg"
              alt="Second slide"
            />
            <Carousel.Caption>
              <h3></h3>
              <p></p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://www.hallaminternet.com/wp-content/uploads/2020/01/Is-blogging-relevant-anymore.jpeg"
              alt="Third slide"
            />
            <Carousel.Caption>
              <h3></h3>
              <p></p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
        <h2 className="text-center my-4">Danh sách bài viết</h2>
        <Carousel>
          {posts.map((p, i) => (
            <Carousel.Item>
              <img
                className=" d-block w-100"
                src={p.img || "https://via.placeholder.com/150"}
                alt="First slide"
              />
              <Carousel.Caption>
                <h3>{p.name}</h3>
                <p> {new Date(p.date).toLocaleDateString()}</p>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
          ;
        </Carousel>
        <h2 className="text-center my-4">Bài viết mới</h2>
        <Row>
          {newPost.map((post, index) => (
            <Col md={4}>
              <Card className="mb-4">
                <Card.Img
                  variant="top"
                  src={post.img || "https://via.placeholder.com/150"}
                />
                <Card.Body>
                  <Card.Title>{post.name}</Card.Title>

                  <Card.Text>
                    {" "}
                    <strong>{getTimeElapsed(post.date)}</strong>
                  </Card.Text>
                  {/* <Button variant="primary" href="/article/1">
                  Read more
                </Button> */}
                </Card.Body>
              </Card>
            </Col>
          ))}
          ;
        </Row>
      </Container>
    </div>
  );
};

export default Home;
