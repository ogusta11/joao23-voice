
import React, { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { users, currentUser, followUser, unfollowUser } = useUser();
  const navigate = useNavigate();

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMessageClick = (userId: string) => {
    const tabsElement = document.querySelector('[role="tablist"]') as HTMLElement;
    const messagesTab = tabsElement?.querySelector('[value="messages"]') as HTMLElement;
    messagesTab?.click();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Buscar usuários..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12">
                <img
                  src={user.profileImage}
                  alt={user.username}
                  className="object-cover"
                />
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{user.username}</span>
                  {user.isVerified && (
                    <Badge variant="secondary" className="verified-badge">
                      Verificado
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500">{user.bio}</p>
                <div className="text-sm text-gray-500">
                  {user.followers.length} seguidores • {user.following.length}{" "}
                  seguindo
                </div>
              </div>
            </div>

            {currentUser && currentUser.id !== user.id && (
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleMessageClick(user.id)}
                >
                  <MessageCircle className="h-5 w-5" />
                </Button>
                <Button
                  variant={
                    currentUser.following.includes(user.id)
                      ? "outline"
                      : "default"
                  }
                  onClick={() =>
                    currentUser.following.includes(user.id)
                      ? unfollowUser(user.id)
                      : followUser(user.id)
                  }
                >
                  {currentUser.following.includes(user.id)
                    ? "Deixar de Seguir"
                    : "Seguir"}
                </Button>
              </div>
            )}
          </div>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhum usuário encontrado
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
