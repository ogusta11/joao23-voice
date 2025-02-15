
import React, { createContext, useContext, useState, useEffect } from "react";
import { Post, Comment } from "@/types";
import { useUser } from "./UserContext";
import { useToast } from "@/hooks/use-toast";

interface PostContextType {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  addPost: (content: string) => void;
  deletePost: (postId: string) => void;
  likePost: (postId: string) => void;
  unlikePost: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
  likeComment: (postId: string, commentId: string) => void;
  unlikeComment: (postId: string, commentId: string) => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider = ({ children }: { children: React.ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const { currentUser } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    const savedPosts = localStorage.getItem("posts");
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  }, []);

  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem("posts", JSON.stringify(posts));
    }
  }, [posts]);

  const addPost = (content: string) => {
    if (!currentUser) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para publicar.",
        variant: "destructive",
      });
      return;
    }

    const newPost: Post = {
      id: Date.now().toString(),
      content,
      userId: currentUser.id,
      username: currentUser.username,
      profileImage: currentUser.profileImage,
      isVerified: currentUser.isVerified,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString(),
    };

    setPosts([newPost, ...posts]);
  };

  const deletePost = (postId: string) => {
    if (!currentUser?.isAdmin) {
      toast({
        title: "Erro",
        description: "Apenas administradores podem deletar posts.",
        variant: "destructive",
      });
      return;
    }

    setPosts(posts.filter((post) => post.id !== postId));
  };

  const likePost = (postId: string) => {
    if (!currentUser) return;

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likes: [...post.likes, currentUser.id],
          };
        }
        return post;
      })
    );
  };

  const unlikePost = (postId: string) => {
    if (!currentUser) return;

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.likes.filter((id) => id !== currentUser.id),
          };
        }
        return post;
      })
    );
  };

  const addComment = (postId: string, content: string) => {
    if (!currentUser) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      content,
      userId: currentUser.id,
      username: currentUser.username,
      profileImage: currentUser.profileImage,
      isVerified: currentUser.isVerified,
      likes: [],
      createdAt: new Date().toISOString(),
    };

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      })
    );
  };

  const likeComment = (postId: string, commentId: string) => {
    if (!currentUser) return;

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.map((comment) => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  likes: [...comment.likes, currentUser.id],
                };
              }
              return comment;
            }),
          };
        }
        return post;
      })
    );
  };

  const unlikeComment = (postId: string, commentId: string) => {
    if (!currentUser) return;

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.map((comment) => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  likes: comment.likes.filter((id) => id !== currentUser.id),
                };
              }
              return comment;
            }),
          };
        }
        return post;
      })
    );
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        setPosts,
        addPost,
        deletePost,
        likePost,
        unlikePost,
        addComment,
        likeComment,
        unlikeComment,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePost = () => {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error("usePost must be used within a PostProvider");
  }
  return context;
};
