import { useEffect, useRef, useState } from "react";
import ChatWindow from "./ChatWindow";
import SideBar from "./SideBar";
import { useI18n } from "@/i18n";

const chatTranslations: Record<string, string> = {
  "All Chats": "كل المحادثات",
  "كل المحادثات": "All Chats",
  "Loading...": "جاري التحميل...",
  "جاري التحميل...": "Loading...",
  "Search Here...": "ابحث هنا...",
  "ابحث هنا...": "Search Here...",
  "🔍 Search Here...": "🔍 ابحث هنا...",
  "🔍 ابحث هنا...": "🔍 Search Here...",
  "Search For The Name....": "ابحث عن الاسم....",
  "ابحث عن الاسم....": "Search For The Name....",
  "Search for a person...": "ابحث عن شخص...",
  "ابحث عن شخص...": "Search for a person...",
  "Contact them on chat...": "تواصل معهم عبر الدردشة...",
  "تواصل معهم عبر الدردشة...": "Contact them on chat...",
  "Searching...": "جاري البحث...",
  "جاري البحث...": "Searching...",
  "No users found.": "لم يتم العثور على مستخدمين.",
  "لم يتم العثور على مستخدمين.": "No users found.",
  "No users found": "لم يتم العثور على مستخدمين",
  "لم يتم العثور على مستخدمين": "No users found",
  "Start typing to search for users.": "ابدأ بكتابة اسم للبحث عن المستخدمين.",
  "ابدأ بكتابة اسم للبحث عن المستخدمين.": "Start typing to search for users.",
  "Ready to Chat?": "جاهز للدردشة؟",
  "جاهز للدردشة؟": "Ready to Chat?",
  "Type your message.....": "اكتب رسالتك.....",
  "اكتب رسالتك.....": "Type your message.....",
  "Sending...": "جاري الإرسال...",
  "جاري الإرسال...": "Sending...",
  "Send": "إرسال",
  "إرسال": "Send",
  "Close Chat": "إغلاق الدردشة",
  "إغلاق الدردشة": "Close Chat",
  "Delete Chat": "حذف الدردشة",
  "حذف الدردشة": "Delete Chat",
  "Delete Conversation?": "هل تريد حذف المحادثة؟",
  "هل تريد حذف المحادثة؟": "Delete Conversation?",
  "Failed to start a new chat. Please try again.": "تعذر بدء محادثة جديدة. يرجى المحاولة مرة أخرى.",
  "تعذر بدء محادثة جديدة. يرجى المحاولة مرة أخرى.": "Failed to start a new chat. Please try again.",
  "Failed to send message. Please try again.": "تعذر إرسال الرسالة. يرجى المحاولة مرة أخرى.",
  "تعذر إرسال الرسالة. يرجى المحاولة مرة أخرى.": "Failed to send message. Please try again.",
  "Start a new chat": "بدء محادثة جديدة",
  "بدء محادثة جديدة": "Start a new chat",
};

const Chat = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const chatRootRef = useRef<HTMLDivElement | null>(null);
  const { language } = useI18n();

  const handleCloseChat = () => {
    setSelectedConversationId(null);
  };

  useEffect(() => {
    const root = chatRootRef.current;
    if (!root) return;

    const localize = () => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const textNodes: Text[] = [];
      let node: Node | null = walker.nextNode();

      while (node) {
        textNodes.push(node as Text);
        node = walker.nextNode();
      }

      textNodes.forEach((textNode) => {
        const value = textNode.nodeValue?.trim();
        if (!value || !(value in chatTranslations)) return;

        const parent = textNode.parentElement;
        if (parent?.closest("svg")) return;

        const translated = chatTranslations[value];
        const shouldTranslateToArabic = language === "ar" && !/[\u0600-\u06FF]/.test(value);
        const shouldTranslateToEnglish = language === "en" && /[\u0600-\u06FF]/.test(value);

        if (shouldTranslateToArabic || shouldTranslateToEnglish) {
          textNode.nodeValue = translated;
        }
      });

      root.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input, textarea").forEach((field) => {
        const placeholder = field.getAttribute("placeholder");
        if (!placeholder || !(placeholder in chatTranslations)) return;

        const translated = chatTranslations[placeholder];
        const shouldTranslateToArabic = language === "ar" && !/[\u0600-\u06FF]/.test(placeholder);
        const shouldTranslateToEnglish = language === "en" && /[\u0600-\u06FF]/.test(placeholder);

        if (shouldTranslateToArabic || shouldTranslateToEnglish) {
          field.setAttribute("placeholder", translated);
        }
      });
    };

    localize();
    const observer = new MutationObserver(localize);
    observer.observe(root, { childList: true, subtree: true, characterData: true });

    return () => observer.disconnect();
  }, [language, selectedConversationId]);

  return (
    <div
      ref={chatRootRef}
      dir={language === "ar" ? "rtl" : "ltr"}
      className="grid grid-cols-1 md:grid-cols-3 gap-10 bg-white rounded-lg py-10 px-10"
    >
      <SideBar setSelectedConversationId={setSelectedConversationId} />
      <ChatWindow conversationId={selectedConversationId} onClose={handleCloseChat} />
    </div>
  );
};

export default Chat;
