import { useState } from "react";
import ChatWindow from "./ChatWindow";
import SideBar from "./SideBar";
import { useI18n } from "@/i18n";

const Chat = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const { language } = useI18n();

  const handleCloseChat = () => {
    setSelectedConversationId(null);
  };

  return (
    <div
      dir={language === "ar" ? "rtl" : "ltr"}
      className="grid min-w-0 grid-cols-1 gap-4 overflow-hidden rounded-lg bg-white px-3 py-6 sm:gap-6 sm:px-6 sm:py-8 lg:grid-cols-3 md:gap-8 md:px-8 md:py-10"
    >
      <div className={(selectedConversationId ? "hidden lg:block" : "block") + " min-w-0 lg:col-span-1"}>
        <SideBar
          selectedConversationId={selectedConversationId}
          setSelectedConversationId={setSelectedConversationId}
        />
      </div>
      <div className={(selectedConversationId ? "block" : "hidden lg:block") + " min-w-0 lg:col-span-2"}>
        <ChatWindow
          conversationId={selectedConversationId}
          onClose={handleCloseChat}
        />
      </div>
    </div>
  );
};

export default Chat;
