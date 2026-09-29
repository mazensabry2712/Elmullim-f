import {
  useCreateConversation,
  useGetAllConversations,
} from "@/lib/react-query/chat/chat";
import cookieService from "@/utils/cookieService";
import { ChevronDown, ChevronLeft, ChevronRight, MessageCircle, MoreHorizontal, Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { IUserSearch } from "@/interfaces/main";
import { useGetUserSearch } from "@/lib/react-query/main";
import { useI18n } from "@/i18n";
import useDebounce from "@/hooks/useDebounce";

interface SideBarProps {
  setSelectedConversationId: (id: string) => void;
}
function SideBar({ setSelectedConversationId }: SideBarProps) {
  const token = cookieService.getToken()!;
  const { language } = useI18n();
  const text = language === "ar"
    ? {
        search: "🔍 ابحث هنا...",
        allChats: "كل المحادثات",
        loading: "جاري التحميل...",
        noConversations: "لا توجد محادثات بعد",
        noMatches: "لا توجد محادثات مطابقة.",
        newChat: "بدء محادثة جديدة",
        searchPerson: "🔍 ابحث عن الاسم....",
        contact: "تواصل معهم عبر الدردشة...",
        searching: "جاري البحث...",
        noUsers: "لم يتم العثور على مستخدمين.",
        startTyping: "ابدأ بكتابة اسم للبحث عن المستخدمين.",
        closeNewChat: "إغلاق بدء محادثة جديدة",
        previousConversations: "المحادثات السابقة",
        nextConversations: "المحادثات التالية",
      }
    : {
        search: "🔍 Search Here...",
        allChats: "All Chats",
        loading: "Loading...",
        noConversations: "No Conversation .... Yet",
        noMatches: "No Matching Conversations.",
        newChat: "Start a new chat",
        searchPerson: "🔍 Search For The Name....",
        contact: "Contact them on chat...",
        searching: "Searching...",
        noUsers: "No users found.",
        startTyping: "Start typing to search for users.",
        closeNewChat: "Close new chat",
        previousConversations: "Previous conversations",
        nextConversations: "Next conversations",
      };
  const userTypeLabel = (type: IUserSearch["type"]) =>
    type === "teachers"
      ? (language === "ar" ? "معلم" : "Teacher")
      : type === "students"
        ? (language === "ar" ? "طالب" : "Student")
        : (language === "ar" ? "ولي أمر" : "Parent");
  const [conversationPage, setConversationPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedConversationSearch = useDebounce(searchQuery, 400) ?? "";

  const {
    data: conversations,
    isLoading,
    isFetching,
  } = useGetAllConversations({
    token,
    page: conversationPage,
    search: debouncedConversationSearch,
  });
  const [isAddingChat, setIsAddingChat] = useState(false);
  const { mutate: createNewConversation } = useCreateConversation();

  // State and hook for searching new users
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const debouncedUserSearch = useDebounce(userSearchQuery, 400) ?? "";
  const { data: users, isLoading: isLoadingUsers } = useGetUserSearch(
    token,
    debouncedUserSearch
  );

  const handleUserSelect = (user: IUserSearch) => {
    setIsAddingChat(false);
    setUserSearchQuery("");
    if (user.details.conversation!==null) {
      setSelectedConversationId(user.details.conversation);
    } else {
      createNewConversation(
        { token, role: user.type, userId: user.details.id },
        {
          onSuccess: (newConversation) => {
            setConversationPage(1);
            setSearchQuery("");
            setSelectedConversationId(newConversation.data.id);
          },
          onError: (error) => {
            console.error("Failed to create conversation:", error);
            toast.error(
              language === "ar"
                ? "تعذر بدء محادثة جديدة. يرجى المحاولة مرة أخرى."
                : "Failed to start a new chat. Please try again."
            );
          },
        }
      );
    }
  };

  const displayedConversations = conversations?.data ?? [];
  const pagination = conversations?.meta;
  const isPaginating = isFetching && !isLoading;

  return (
    <div className="relative col-span-1 min-h-[360px] overflow-hidden rounded-md bg-[#FFFFFF] shadow-md md:h-[500px]">
      {/* Main View: Conversation List */}
      <div
        className={`h-full flex flex-col transform transition-transform duration-300 ease-in-out ${
          isAddingChat ? (language === "ar" ? "translate-x-full" : "-translate-x-full") : "translate-x-0"
        }`}
      >
        <div className="px-4 pt-4">
          <input
            type="search"
            placeholder={text.search}
            className="w-full p-3 bg-[#F0FEFC] shadow-sm rounded-md text-center focus:outline-none placeholder:text-black placeholder:text-center"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setConversationPage(1);
            }}
            aria-label={text.search}
          />
        </div>
        <hr className="mt-4" />
        <div className="flex justify-center items-center p-4 gap-4">
          <div className="flex gap-1 items-center">
            {conversations && conversations.data.length>0 &&(
              <>
              <h3 className="font-bold font-sora text-[#194C80] text-lg">
              {text.allChats}
            </h3>
            <ChevronDown size={25} className="text-[#194C80]" aria-hidden="true" />
              </>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsAddingChat(true)}
            aria-label={text.newChat}
            title={text.newChat}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#194D80] text-[#194C80] transition-colors duration-300 hover:border-main hover:text-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2"
          >
            <Plus size={20} aria-hidden="true" />
          </button>
        </div>
        {/* conversation list */}
        <div className="flex-grow overflow-y-auto py-5">
          {isLoading ? (
            <p className="text-black text-base text-center" role="status">{text.loading}</p>
          ) : displayedConversations.length === 0 && !debouncedConversationSearch ? (
            <div className="flex flex-col items-center justify-center gap-2">
             <MessageCircle className="h-16 w-16 text-main" aria-hidden="true" />

              <p className="text-[#194D80] text-lg font-sora font-bold text-center">
                {text.noConversations}
              </p>
            </div>
          ) : displayedConversations.length === 0 && debouncedConversationSearch ? (
            <p className="text-black text-base text-center">
              {text.noMatches}
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {displayedConversations.map((conv) => (
                <button
                  type="button"
                  key={conv.conversation_id}
                  onClick={() =>
                    setSelectedConversationId(conv.conversation_id)
                  }
                  aria-label={conv.participant?.name || text.allChats}
                  className="flex w-full flex-row items-center gap-4 rounded-md px-3 py-2 text-start transition-colors duration-200 hover:bg-[#F0FEFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main"
                >
                  <div className="w-10 h-10 rounded-full flex-shrink-0">
                    <img
                      className="w-full h-full rounded-full object-cover"
                      src={
                        conv.participant.profile_image ||
                        "/images/profile-avatar.webp"
                      }
                      alt={conv.participant?.name || text.allChats}
                    />
                  </div>
                  <div className="flex flex-col justify-center gap-1">
                    <div className="flex flex-row items-start gap-5">
                      <h4 className="font-sora font-semibold text-[16px] text-black capitalize">
                        {conv.participant?.name}
                      </h4>
                      <div>
                        <MoreHorizontal size={22} aria-hidden="true" />
                      </div>
                    </div>
                    <p className="font-sora text-sm">
                      {conv.last_message?.data?.body || ""}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add New Chat View */}
      <div
        aria-label={text.newChat}
        className={`absolute top-0 left-0 w-full h-full bg-white flex flex-col transform transition-transform duration-300 ease-in-out ${
          isAddingChat ? "translate-x-0" : language === "ar" ? "-translate-x-full" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
          <h3 className="font-sora text-lg font-bold text-[#194C80]">{text.newChat}</h3>
          <button
            type="button"
            onClick={() => {
              setIsAddingChat(false);
              setUserSearchQuery("");
            }}
            aria-label={text.closeNewChat}
            title={text.closeNewChat}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[#194C80] hover:bg-[#F0FEFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <div className="p-4 flex-shrink-0">
          <input
            type="search"
            placeholder={text.searchPerson}
            value={userSearchQuery}
            onChange={(e) => setUserSearchQuery(e.target.value)}
            aria-label={text.searchPerson}
            className="w-full p-3 bg-[#F0FEFC] shadow-sm rounded-md text-center focus:outline-none placeholder:text-black placeholder:text-center"
          />
        </div>
        <hr />
        <div className="flex justify-center items-center p-4">
          <h3 className="font-bold font-sora text-[#194C80] text-lg capitalize">
            {text.contact}
          </h3>
        </div>
        <div className="flex-grow overflow-y-auto px-2">
          {isLoadingUsers ? (
            <p className="pt-4 text-center text-gray-500" role="status">{text.searching}</p>
          ) : users && users.length > 0 ? (
            users.map((user: IUserSearch) => (
              <button
                type="button"
                key={user.details.id}
                onClick={() => handleUserSelect(user)}
                aria-label={user.details.name + " - " + userTypeLabel(user.type)}
                className="group flex w-full items-center justify-center gap-4 rounded-md p-2 text-start transition-colors hover:bg-[#194D80] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={
                      user.details.profile_image ||
                      "/images/profile-avatar.webp"
                    }
                    alt={user.details.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 group-hover:text-white ">
                    {user.details.name}
                  </span>
                  <span className="text-gray-500 text-xs group-hover:text-white">
                    {userTypeLabel(user.type)}
                  </span>
                </div>
              </button>
            ))
          ) : (
            <p className="pt-4 text-center text-gray-500" role="status">
              {userSearchQuery ? text.noUsers : text.startTyping}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SideBar;
