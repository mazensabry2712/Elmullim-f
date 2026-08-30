import { useState } from "react";
import ChatWindow from "./ChatWindow";

import SideBar from "./SideBar";
const Chat = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
 const handleCloseChat = () => {
    setSelectedConversationId(null);
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 bg-white rounded-lg py-10 px-10">
      <SideBar setSelectedConversationId={setSelectedConversationId}/>
      <ChatWindow conversationId={selectedConversationId} onClose={handleCloseChat} />
    </div>
  );
};

export default Chat;
