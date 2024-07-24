import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Image } from "react-bootstrap";
import { useParams } from "react-router-dom";

const PostDetail = () => {
  const { id } = useParams(); // Lấy id từ tham số URL

  const [postDetail, setPostDetail] = useState({});
  const [views, setViews] = useState();

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/posts/${id}`)
      .then((response) => {
        setPostDetail(response.data);
      })
      .catch((error) => {
        console.log("Error get post by id");
      });
  }, [id]); // Thêm id vào dependency array

  // Kiểm tra nếu postDetail đã được tải trước khi truy cập các thuộc tính của nó
  if (!postDetail.id) {
    return <div>Loading...</div>;
  }

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
      <Row className="justify-content-center">
        <Col md={8} className="mb-4">
          <Card className="shadow-lg">
            <Card.Header className="d-flex align-items-center bg-white">
              <Image
                src={postDetail.img}
                roundedCircle
                style={{ width: "40px", height: "40px", marginRight: "10px" }}
              />
              <div>
                <Card.Title className="mb-0">{postDetail.name}</Card.Title>

                <Card.Subtitle className="text-muted mt-2">
                  Được đăng bởi <strong>{postDetail.postedBy?.username}</strong>{" "}
                  vào <strong>{getTimeElapsed(postDetail.date)}</strong>
                </Card.Subtitle>
              </div>
            </Card.Header>
            <Card.Body>
              {postDetail.img && (
                <Card.Img variant="top" src={postDetail.img} />
              )}
              <p>{postDetail.content}</p>
              <a className="btn btn-link" href="/user">
                {" "}
                <button className="btn btn-primary mt-2">Quay về</button>
              </a>
            </Card.Body>
            <Card.Footer className="bg-white">
              <div className="d-flex justify-content-around">
                {/* Uncomment và sửa các dòng này nếu cần thiết */}
                {/* <Button
                  variant="link"
                  className="text-primary"
                  onClick={() =>
                    likedPosts.includes(postDetail.id)
                      ? handleUnlike(postDetail.id)
                      : handleLike(postDetail.id)
                  }
                >
                  <FaThumbsUp /> {postDetail.likeCount} Thích
                </Button>
                <Button
                  variant="link"
                  className="text-primary"
                  onClick={() => handleShowModal(postDetail.id)}
                >
                  <FaComment /> Bình luận
                </Button>
                <Button variant="link" className="text-primary">
                  <FaShare /> Chia sẻ
                </Button> */}
              </div>
              {/* Uncomment và sửa các dòng này nếu cần thiết */}
              {/* {comments[postDetail.id] &&
                comments[postDetail.id].map((comment) => (
                  <div key={comment.id} className="mt-2">
                    <strong>{comment.postedBy.username}: </strong>
                    {comment.content}
                  </div>
                ))} */}
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PostDetail;
