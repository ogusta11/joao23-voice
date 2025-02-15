
import React, { useState, useEffect } from 'react';
import { useUser } from "@/contexts/UserContext";
import { Message, Chat } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send } from "lucide-react";

const Messages = () => {
  const { currentUser, users } = useUser();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);

  // Load messages from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('messages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('messages', JSON.stringify(messages));
    }
  }, [messages]);

  const sendMessage = () => {
    if (!currentUser || !selectedChat || !messageText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId: selectedChat,
      content: messageText.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);
    setMessageText("");
  };

  const getChatsForUser = () => {
    if (!currentUser) return [];

    const userChats = new Map<string, Message>();
    
    messages.forEach(message => {
      if (message.senderId === currentUser.id || message.receiverId === currentUser.id) {
        const otherUserId = message.senderId === currentUser.id ? message.receiverId : message.senderId;
        
        if (!userChats.has(otherUserId) || new Date(message.createdAt) > new Date(userChats.get(otherUserId)!.createdAt)) {
          userChats.set(otherUserId, message);
        }
      }
    });

    return Array.from(userChats.entries()).map(([userId, lastMessage]) => ({
      userId,
      lastMessage,
      unreadCount: messages.filter(m => 
        m.senderId === userId && 
        m.receiverId === currentUser.id
      ).length
    }));
  };

  const getMessagesForChat = () => {
    if (!selectedChat || !currentUser) return [];
    
    return messages.filter(message => 
      (message.senderId === currentUser.id && message.receiverId === selectedChat) ||
      (message.senderId === selectedChat && message.receiverId === currentUser.id)
    ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  };

  if (!currentUser) {
    return (
      <div className="text-center py-8">
        <p>Faça login para ver suas mensagens</p>
      </div>
    );
  }

  const chatMessages = getMessagesForChat();
  const userChats = getChatsForUser();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md flex h-[600px]">
        {/* Lista de chats */}
        <div className="w-1/3 border-r">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Mensagens</h2>
          </div>
          <div className="overflow-y-auto h-[calc(100%-64px)]">
            {userChats.map(chat => {
              const user = users.find(u => u.id === chat.userId);
              if (!user) return null;

              return (
                <div
                  key={user.id}
                  onClick={() => setSelectedChat(user.id)}
                  className={`p-4 hover:bg-gray-50 cursor-pointer ${
                    selectedChat === user.id ? 'bg-gray-50' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <img src={user.profileImage} alt={user.username} className="object-cover" />
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold truncate">{user.username}</span>
                        {user.isVerified && (
                          <Badge variant="secondary" className="verified-badge">
                            Verificado
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {chat.lastMessage.content}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Área de mensagens */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              <div className="p-4 border-b">
                <div className="flex items-center space-x-2">
                  {(() => {
                    const user = users.find(u => u.id === selectedChat);
                    if (!user) return null;
                    return (
                      <>
                        <Avatar className="w-8 h-8">
                          <img src={user.profileImage} alt={user.username} className="object-cover" />
                        </Avatar>
                        <span className="font-semibold">{user.username}</span>
                        {user.isVerified && (
                          <Badge variant="secondary" className="verified-badge">
                            Verificado
                          </Badge>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map(message => {
                  const isOwnMessage = message.senderId === currentUser.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          isOwnMessage ? 'bg-primary text-white' : 'bg-gray-100'
                        }`}
                      >
                        <p>{message.content}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Input
                    value={messageText}
                    onChange={e => setMessageText(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    onKeyPress={e => e.key === 'Enter' && sendMessage()}
                  />
                  <Button onClick={sendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-2" />
                <p>Selecione um chat para começar a conversar</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
