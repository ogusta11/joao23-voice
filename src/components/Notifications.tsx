
import React from "react";
import { useUser } from "@/contexts/UserContext";
import { usePost } from "@/contexts/PostContext";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const Notifications = () => {
  const { currentUser, users } = useUser();
  const { posts } = usePost();

  if (!currentUser) {
    return (
      <div className="text-center py-8">
        <p>Faça login para ver suas notificações</p>
      </div>
    );
  }

  const getLikes = () => {
    return posts
      .filter((post) => post.userId === currentUser.id)
      .flatMap((post) => {
        return post.likes.map((userId) => ({
          type: "like" as const,
          userId,
          targetId: post.id,
          createdAt: post.createdAt,
        }));
      });
  };

  const getComments = () => {
    return posts
      .filter((post) => post.userId === currentUser.id)
      .flatMap((post) => {
        return post.comments.map((comment) => ({
          type: "comment" as const,
          userId: comment.userId,
          targetId: post.id,
          createdAt: comment.createdAt,
          content: comment.content,
        }));
      });
  };

  const getFollowers = () => {
    return currentUser.followers.map((followerId) => ({
      type: "follow" as const,
      userId: followerId,
      targetId: currentUser.id,
      createdAt: new Date().toISOString(),
    }));
  };

  const notifications = [...getLikes(), ...getComments(), ...getFollowers()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md">
        {notifications.length === 0 ? (
          <div className="p-6 text-center">
            <p>Nenhuma notificação</p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification, index) => {
              const user = users.find((u) => u.id === notification.userId);
              if (!user) return null;

              return (
                <div key={index} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-10 h-10">
                      <img
                        src={user.profileImage}
                        alt={user.username}
                        className="object-cover"
                      />
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{user.username}</span>
                        {user.isVerified && (
                          <Badge variant="secondary" className="verified-badge">
                            Verificado
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600">
                        {notification.type === "like" && "curtiu sua publicação"}
                        {notification.type === "comment" &&
                          `comentou: ${(notification as any).content}`}
                        {notification.type === "follow" && "começou a te seguir"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(notification.createdAt), "d MMM, yyyy")}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
