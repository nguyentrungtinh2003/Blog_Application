package com.TrungTinhFullStack.blog_backend_http.Service;

import com.TrungTinhFullStack.blog_backend_http.Entity.Comment;
import com.TrungTinhFullStack.blog_backend_http.Entity.Post;
import com.TrungTinhFullStack.blog_backend_http.Entity.User;
import com.TrungTinhFullStack.blog_backend_http.Repository.CommentRepository;
import com.TrungTinhFullStack.blog_backend_http.Repository.PostRepository;
import jakarta.persistence.EntityNotFoundException;
import org.hibernate.sql.model.internal.OptionalTableUpdate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class CommentServiceImpl implements CommentService{

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    public Comment createComment(Post post, User postedBy, String content) {
        if (post == null || postedBy == null) {
            throw new IllegalArgumentException("Post or User not found");
        }

        Comment comment = new Comment();
        comment.setPost(post);
        comment.setContent(content);
        comment.setPostedBy(postedBy);
        comment.setCreatedAt(new Date());

        return commentRepository.save(comment);
    }
    public List<Comment> getCommentByPostId(Long postId) {
        return commentRepository.findByPostId(postId);
    }
}
