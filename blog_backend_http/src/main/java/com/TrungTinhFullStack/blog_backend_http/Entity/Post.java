package com.TrungTinhFullStack.blog_backend_http.Entity;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.List;

@Entity
@Data
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    @Column(length = 5000)
    private String content;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User postedBy;

    private String img;

    private Date date;

    private int likeCount;

    private int viewCount;

    private List<String> tags;

}
