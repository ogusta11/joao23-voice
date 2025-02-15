
import React, { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const { currentUser, setCurrentUser, users, setUsers } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username);
      setBio(currentUser.bio);
      setProfileImage(currentUser.profileImage);
    }
  }, [currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      toast({
        title: "Erro",
        description: "Nome de usuário é obrigatório",
        variant: "destructive",
      });
      return;
    }

    const isUsernameExists = users.some(
      (user) => user.username === username && user.id !== currentUser?.id
    );

    if (isUsernameExists) {
      toast({
        title: "Erro",
        description: "Este nome de usuário já está em uso",
        variant: "destructive",
      });
      return;
    }

    const isVerified = username.toLowerCase() === "ogusta";
    const isAdmin = username.toLowerCase() === "ogusta";

    const updatedUser = {
      id: currentUser?.id || Date.now().toString(),
      username,
      bio,
      profileImage:
        profileImage ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${username}`,
      isVerified,
      isAdmin,
      followers: currentUser?.followers || [],
      following: currentUser?.following || [],
    };

    if (currentUser) {
      setUsers(users.map((user) => (user.id === currentUser.id ? updatedUser : user)));
    } else {
      setUsers([...users, updatedUser]);
    }

    setCurrentUser(updatedUser);

    toast({
      title: "Sucesso",
      description: "Perfil atualizado com sucesso!",
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-24 h-24">
              <img
                src={
                  profileImage ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${username}`
                }
                alt="Profile"
                className="object-cover"
              />
            </Avatar>
            {currentUser?.isVerified && (
              <Badge variant="secondary" className="verified-badge">
                Verificado
              </Badge>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Nome de usuário
              </label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Seu nome de usuário"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                URL da Imagem de Perfil
              </label>
              <Input
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
                placeholder="URL da sua foto de perfil"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Biografia</label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Conte um pouco sobre você"
                className="min-h-[100px]"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            {currentUser ? "Atualizar Perfil" : "Criar Perfil"}
          </Button>
        </form>

        {currentUser && (
          <div className="mt-6 flex justify-center space-x-8">
            <div className="text-center">
              <div className="text-2xl font-bold">{currentUser.followers.length}</div>
              <div className="text-gray-500">Seguidores</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{currentUser.following.length}</div>
              <div className="text-gray-500">Seguindo</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
