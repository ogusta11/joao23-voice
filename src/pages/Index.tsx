
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-8 text-center">
              X23
            </h1>
            <Tabs defaultValue="feed" className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-8 bg-card/50 backdrop-blur-lg">
                <TabsTrigger value="feed" className="data-[state=active]:bg-primary/20">Feed</TabsTrigger>
                <TabsTrigger value="profile" className="data-[state=active]:bg-primary/20">Perfil</TabsTrigger>
                <TabsTrigger value="notifications" className="data-[state=active]:bg-primary/20">Notificações</TabsTrigger>
                <TabsTrigger value="messages" className="data-[state=active]:bg-primary/20">Mensagens</TabsTrigger>
                <TabsTrigger value="search" className="data-[state=active]:bg-primary/20">Buscar</TabsTrigger>
              </TabsList>
              <TabsContent value="feed" className="animate-fade-in">
                <Feed />
              </TabsContent>
              <TabsContent value="profile" className="animate-fade-in">
                <Profile />
              </TabsContent>
              <TabsContent value="notifications" className="animate-fade-in">
                <Notifications />
              </TabsContent>
              <TabsContent value="messages" className="animate-fade-in">
                <Messages />
              </TabsContent>
              <TabsContent value="search" className="animate-fade-in">
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
