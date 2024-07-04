package com.TrungTinhFullStack.blog_backend_http.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;

import java.util.Date;

@Getter
@Entity
@Data
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;

    private Date createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User postedBy;


    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    public void setId(Long id) {
        this.id = id;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public void setPostedBy(User postedBy) {
        this.postedBy = postedBy;
    }

    public void setPost(Post post) {
        this.post = post;
    }
}
