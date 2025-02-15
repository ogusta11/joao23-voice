
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  users: User[];
  setUsers: (users: User[]) => void;
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const savedUsers = localStorage.getItem("users");
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }

    const savedCurrentUser = localStorage.getItem("currentUser");
    if (savedCurrentUser) {
      setCurrentUser(JSON.parse(savedCurrentUser));
    }
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem("users", JSON.stringify(users));
    }
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }
  }, [currentUser]);

  const followUser = (userId: string) => {
    if (!currentUser) return;

    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        return {
          ...user,
          followers: [...user.followers, currentUser.id],
        };
      }
      if (user.id === currentUser.id) {
        return {
          ...user,
          following: [...user.following, userId],
        };
      }
      return user;
    });

    setUsers(updatedUsers);
    const updatedCurrentUser = updatedUsers.find(
      (user) => user.id === currentUser.id
    );
    if (updatedCurrentUser) {
      setCurrentUser(updatedCurrentUser);
    }
  };

  const unfollowUser = (userId: string) => {
    if (!currentUser) return;

    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        return {
          ...user,
          followers: user.followers.filter((id) => id !== currentUser.id),
        };
      }
      if (user.id === currentUser.id) {
        return {
          ...user,
          following: user.following.filter((id) => id !== userId),
        };
      }
      return user;
    });

    setUsers(updatedUsers);
    const updatedCurrentUser = updatedUsers.find(
      (user) => user.id === currentUser.id
    );
    if (updatedCurrentUser) {
      setCurrentUser(updatedCurrentUser);
    }
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        setUsers,
        followUser,
        unfollowUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
