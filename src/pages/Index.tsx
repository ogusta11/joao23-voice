
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Feed from "@/components/Feed";
import Profile from "@/components/Profile";
import Notifications from "@/components/Notifications";
import Messages from "@/components/Messages";
import { UserProvider } from "@/contexts/UserContext";
import { PostProvider } from "@/contexts/PostContext";
import Search from "@/components/Search";

const Index = () => {
  return (
    <UserProvider>
      <PostProvider>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-primary mb-8 text-center">João 23 - Comunidade</h1>
            <Tabs defaultValue="feed" className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-8">
                <TabsTrigger value="feed">Feed</TabsTrigger>
                <TabsTrigger value="profile">Perfil</TabsTrigger>
                <TabsTrigger value="notifications">Notificações</TabsTrigger>
                <TabsTrigger value="messages">Mensagens</TabsTrigger>
                <TabsTrigger value="search">Buscar</TabsTrigger>
              </TabsList>
              <TabsContent value="feed">
                <Feed />
              </TabsContent>
              <TabsContent value="profile">
                <Profile />
              </TabsContent>
              <TabsContent value="notifications">
                <Notifications />
              </TabsContent>
              <TabsContent value="messages">
                <Messages />
              </TabsContent>
              <TabsContent value="search">
                <Search />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </PostProvider>
    </UserProvider>
  );
};

export default Index;
