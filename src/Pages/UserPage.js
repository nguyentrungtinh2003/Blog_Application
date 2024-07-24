import React, { useState, useEffect, useContext } from "react";
import { Carousel } from "react-bootstrap";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Image,
  Modal,
  Form,
} from "react-bootstrap";
import {
  FaThumbsUp,
  FaComment,
  FaShare,
  FaSearch,
  FaStreetView,
  FaChevronCircleDown,
  FaEye,
} from "react-icons/fa";
import { UserContext } from "./UserContext";
import { FaUsersViewfinder } from "react-icons/fa6";

const UserPage = () => {
  const { loggedInUserId } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalPostId, setModalPostId] = useState(null);
  const [commentContent, setCommentContent] = useState("");
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [img, setImg] = useState("");
  const [tags, setTags] = useState("");
  const [postedBy, setPostedBy] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userDetails, setUserDetails] = useState({
    username: "",
    password: "",
    id: "",
    user_id: "", // New state for user_id
  });

  useEffect(() => {
    fetchPosts();
    fetchUserDetails();
  }, []);

  const fetchPosts = () => {
    axios
      .get("http://localhost:8080/api/posts")
      .then((response) => {
        setPosts(response.data);
        const initialComments = {};
        response.data.forEach((post) => {
          axios
            .get(`http://localhost:8080/api/comments/${post.id}`)
            .then((commentResponse) => {
              initialComments[post.id] = commentResponse.data;
              setComments(initialComments);
            })
            .catch((error) => {
              console.error(
                `Error fetching comments for post ${post.id}`,
                error
              );
            });
        });
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  };

  const fetchUserDetails = () => {
    axios
      .get(`http://localhost:8080/api/auth/users/${loggedInUserId}`)
      .then((response) => {
        setUserDetails(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
  };

  const handleProfileUpdate = () => {
    const { id, username, password } = userDetails;
    const updatedUser = {
      username,
      password,
    };
    axios
      .put(`http://localhost:8080/api/auth/users/${id}`, updatedUser)
      .then((response) => {
        setUserDetails(response.data);
        setShowProfileModal(false);
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };

  const handleLike = (postId) => {
    axios
      .put(`http://localhost:8080/api/posts/${postId}/like`)
      .then((response) => {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? { ...post, likeCount: post.likeCount + 1 }
              : post
          )
        );
        setLikedPosts((prevLikedPosts) => [...prevLikedPosts, postId]);
      })
      .catch((error) => {
        console.error("Error liking the post:", error);
      });
  };

  const handleUnlike = (postId) => {
    axios
      .put(`http://localhost:8080/api/posts/${postId}/Unlike`)
      .then((response) => {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? { ...post, likeCount: post.likeCount - 1 }
              : post
          )
        );
        setLikedPosts((prevLikedPosts) =>
          prevLikedPosts.filter((id) => id !== postId)
        );
      })
      .catch((error) => {
        console.error("Error unliking the post:", error);
      });
  };

  const updateComments = (postId, newComment) => {
    setComments((prevComments) => ({
      ...prevComments,
      [postId]: [...prevComments[postId], newComment],
    }));
  };

  const handleShowModal = (postId) => {
    setModalPostId(postId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalPostId(null);
  };

  const handleAddPost = (event) => {
    event.preventDefault();
    const postData = {
      name,
      content,
      img,
      tags: tags.split(",").map((tag) => tag.trim()),
      postedBy: { id: parseInt(postedBy) },
    };

    axios
      .post("http://localhost:8080/api/posts", postData)
      .then((response) => {
        setPosts([...posts, response.data]);
        setName("");
        setContent("");
        setImg("");
        setTags("");
        setPostedBy("");
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Error adding post:", error);
      });
  };

  const handleCommentSubmit = (event, postId) => {
    event.preventDefault();
    const commentData = {
      content: commentContent,
      post: { id: postId },
    };

    axios
      .post("http://localhost:8080/api/comments/create", commentData)
      .then((response) => {
        updateComments(postId, response.data);
        setCommentContent("");
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Error adding comment:", error);
      });
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/posts/search/${searchTerm}`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error searching posts:", error);
    }
  };

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
    <Container className="mt-4">
      <Row className="justify-content-center mb-4">
        <Col md={8} className="text-center sticky-top bg-white py-3">
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Thêm bài đăng
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              fetchUserDetails();
              setShowProfileModal(true);
            }}
          >
            Chỉnh sửa hồ sơ
          </Button>
        </Col>
      </Row>
      {/*Hien thi bai viet nho  */}
      <Row className="mt-4">
        <Carousel className="mt-4">
          {Array.from({ length: Math.ceil(posts.length / 4) }).map(
            (_, index) => (
              <Carousel.Item key={index}>
                <Row>
                  {posts.slice(index * 4, index * 4 + 4).map((post) => (
                    <Col key={post.id} md={3} className="mb-4">
                      <Card className="shadow-sm border-0 h-100">
                        {post.img && (
                          <Card.Img
                            variant="top"
                            src={post.img}
                            alt="Post image"
                            className="img-fluid"
                          />
                        )}
                        <Card.Body>
                          <Card.Title>{post.name}</Card.Title>
                          {/* <Card.Text>{post.content}</Card.Text> */}
                          {/* <Button variant="primary">Xem chi tiết</Button> */}
                        </Card.Body>
                        <Card.Footer className="bg-white">
                          <small className="text-muted">
                            Được đăng bởi{" "}
                            <strong>{post.postedBy.username}</strong> vào{" "}
                            <strong>{getTimeElapsed(post.date)}</strong>
                          </small>
                        </Card.Footer>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Carousel.Item>
            )
          )}
        </Carousel>
      </Row>

      <Row className="justify-content-center mb-4">
        <Col md={8} className="text-center">
          <Form.Group className="shadow-lg">
            <Form.Control
              type="text"
              placeholder="Tìm kiếm bài đăng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
          <Button className="mt-2" variant="primary" onClick={handleSearch}>
            <FaSearch /> Tìm kiếm
          </Button>
        </Col>
      </Row>
      <Row className="justify-content-center">
        {(searchResults.length > 0 ? searchResults : posts).map((post) => (
          <Col key={post.id} md={8} className="mb-4">
            <Card className="shadow-lg">
              <Card.Header className="d-flex align-items-center bg-white">
                <Image
                  src={post.img}
                  roundedCircle
                  style={{ width: "40px", height: "40px", marginRight: "10px" }}
                />
                <div>
                  <Card.Title className="mb-0">{post.name}</Card.Title>
                  <Card.Subtitle className="text-muted mt-2">
                    Được đăng bởi <strong>{post.postedBy.username}</strong> vào{" "}
                    <strong>{getTimeElapsed(post.date)}</strong>
                  </Card.Subtitle>
                </div>
              </Card.Header>
              <Card.Body>
                {/* <Card.Text>{post.content}</Card.Text> */}
                {post.img && <Card.Img variant="top" src={post.img} />}

                <a className="btn btn-link" href={`/view/${post.id}`}>
                  <button className="btn btn-primary mt-2">Xem bài viết</button>
                </a>
              </Card.Body>
              <Card.Footer className="bg-white">
                <div className="d-flex justify-content-around">
                  <Button
                    variant="link"
                    className="text-primary text-decoration-none custom-like-button"
                    onClick={() =>
                      likedPosts.includes(post.id)
                        ? handleUnlike(post.id)
                        : handleLike(post.id)
                    }
                  >
                    <FaThumbsUp /> {post.likeCount} Thích
                  </Button>
                  <Button
                    variant="link"
                    className="text-primary text-decoration-none custom-like-button"
                    onClick={() => handleShowModal(post.id)}
                  >
                    <FaComment /> Bình luận
                  </Button>
                  <Button
                    variant="link"
                    className="text-primary text-decoration-none custom-like-button"
                  >
                    <FaEye /> {post.viewCount} Lượt xem
                  </Button>
                </div>
                {comments[post.id] &&
                  comments[post.id].map((comment) => (
                    <div key={comment.id} className="mt-2">
                      <strong>{comment.postedBy.username}: </strong>
                      {comment.content}
                    </div>
                  ))}
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal for adding a new post */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm bài đăng mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddPost}>
            <Form.Group controlId="formPostName">
              <Form.Label>Tên bài đăng</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên bài đăng"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPostContent">
              <Form.Label>Nội dung</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Nhập nội dung bài đăng"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPostImg">
              <Form.Label>Link ảnh (tùy chọn)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập link ảnh"
                value={img}
                onChange={(e) => setImg(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formPostTags">
              <Form.Label>Tags (phân cách bởi dấu phẩy)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập các tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formPostPostedBy">
              <Form.Label>Người đăng (User ID)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập User ID của người đăng"
                value={postedBy}
                onChange={(e) => setPostedBy(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Đăng bài
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal for commenting on a post */}
      <Modal show={showModal && modalPostId !== null} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Bình luận</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => handleCommentSubmit(e, modalPostId)}>
            <Form.Group controlId="formComment">
              <Form.Label>Nội dung bình luận</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Nhập nội dung bình luận"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Gửi bình luận
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal for profile update */}
      <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa hồ sơ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Tên người dùng</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên người dùng..."
                value={userDetails.username}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, username: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control
                type="password"
                placeholder="Nhập mật khẩu..."
                value={userDetails.password}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, password: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>ID người dùng</Form.Label>
              <Form.Control
                type="text"
                value={userDetails.id}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, id: e.target.value })
                }
              />
            </Form.Group>
            <Button variant="primary" onClick={handleProfileUpdate}>
              Lưu thay đổi
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default UserPage;
