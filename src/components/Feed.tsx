
import React, { useState } from "react";
import { usePost } from "@/contexts/PostContext";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { format } from "date-fns";

const Feed = () => {
  const [newPost, setNewPost] = useState("");
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const { posts, addPost, deletePost, likePost, unlikePost, addComment, likeComment, unlikeComment } = usePost();
  const { currentUser } = useUser();

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPost.trim()) {
      addPost(newPost.trim());
      setNewPost("");
    }
  };

  const handleSubmitComment = (postId: string) => {
    const comment = commentText[postId];
    if (comment?.trim()) {
      addComment(postId, comment.trim());
      setCommentText((prev) => ({ ...prev, [postId]: "" }));
    }
  };

  return (
    <div className="max-w 2xl mx-auto space-y-8">
      {currentUser && (
        <form onSubmit={handleSubmitPost} className="space-y-4">
          <Textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="O que está acontecendo?"
            className="min-h-[100px]"
          />
          <Button type="submit">Publicar</Button>
        </form>
      )}

      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-md p-6 post-transition">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <Avatar className="w-10 h-10">
                  <img src={post.profileImage} alt={post.username} className="object-cover" />
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{post.username}</span>
                    {post.isVerified && (
                      <Badge variant="secondary" className="verified-badge">
                        Verificado
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {format(new Date(post.createdAt), "d MMM, yyyy")}
                  </p>
                </div>
              </div>
              {currentUser?.isAdmin && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deletePost(post.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              )}
            </div>

            <p className="mt-4">{post.content}</p>

            <div className="mt-4 flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  post.likes.includes(currentUser?.id || "")
                    ? unlikePost(post.id)
                    : likePost(post.id)
                }
                className={
                  post.likes.includes(currentUser?.id || "")
                    ? "text-red-500"
                    : "text-gray-500"
                }
              >
                <Heart className="h-5 w-5 mr-1" />
                {post.likes.length}
              </Button>
              <div className="flex items-center text-gray-500">
                <MessageCircle className="h-5 w-5 mr-1" />
                {post.comments.length}
              </div>
            </div>

            {currentUser && (
              <div className="mt-4 flex space-x-2">
                <Textarea
                  value={commentText[post.id] || ""}
                  onChange={(e) =>
                    setCommentText((prev) => ({
                      ...prev,
                      [post.id]: e.target.value,
                    }))
                  }
                  placeholder="Adicione um comentário..."
                  className="flex-1"
                />
                <Button onClick={() => handleSubmitComment(post.id)}>
                  Comentar
                </Button>
              </div>
            )}

            {post.comments.length > 0 && (
              <div className="mt-4 space-y-4">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <img
                          src={comment.profileImage}
                          alt={comment.username}
                          className="object-cover"
                        />
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{comment.username}</span>
                          {comment.isVerified && (
                            <Badge variant="secondary" className="verified-badge">
                              Verificado
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {format(new Date(comment.createdAt), "d MMM, yyyy")}
                        </p>
                        <p className="mt-1">{comment.content}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            comment.likes.includes(currentUser?.id || "")
                              ? unlikeComment(post.id, comment.id)
                              : likeComment(post.id, comment.id)
                          }
                          className={
                            comment.likes.includes(currentUser?.id || "")
                              ? "text-red-500 mt-2"
                              : "text-gray-500 mt-2"
                          }
                        >
                          <Heart className="h-4 w-4 mr-1" />
                          {comment.likes.length}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;
