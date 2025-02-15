
export interface User {
  id: string;
  username: string;
  profileImage: string;
  bio: string;
  isVerified: boolean;
  isAdmin: boolean;
  followers: string[];
  following: string[];
}

export interface Post {
  id: string;
  content: string;
  userId: string;
  username: string;
  profileImage: string;
  isVerified: boolean;
  likes: string[];
  comments: Comment[];
  createdAt: string;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  username: string;
  profileImage: string;
  isVerified: boolean;
  likes: string[];
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow';
  userId: string;
  targetId: string;
  read: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

export interface Chat {
  userId: string;
  lastMessage: Message;
  unreadCount: number;
}
