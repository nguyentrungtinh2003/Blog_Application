package com.TrungTinhFullStack.blog_backend_http.Service;

import com.TrungTinhFullStack.blog_backend_http.Entity.Post;

import java.util.List;

public interface PostService {

    Post savePost(Post post);
    List<Post> getAllPosts();
    Post getPostById(Long postId);
    void likePost(Long postId);
    void unLikePost(Long postId);
    List<Post> searchByName(String name);

    Post findById(Long postId);
}
