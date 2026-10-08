import { ICreateMessage, IMessage } from "@/interfaces/chat/chat";
import QueryKeys from "@/enums";
import getEcho from "@/lib/echo/echo";
import {
  useCreateMessage,
  useDeleteConversation,
  useDeleteMessage,
  useFlagMessage,
  useGetConversationById,
} from "@/lib/react-query/chat/chat";
import cookieService from "@/utils/cookieService";
import { useI18n } from "@/i18n";
import { formatTime } from "@/utils/dateTime";
import { ArrowLeft, ArrowRight, Flag, MessageCircle, MoreVertical, Send, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

function ChatWindow({
  conversationId,
  onClose,
}: {
  conversationId: string | null;
  onClose: () => void;
}) {
  const token = cookieService.getToken()!;
  const [messageText, setMessageText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { language } = useI18n();
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [openMessageMenuId, setOpenMessageMenuId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { mutate: sendMessage, isPending: isSending } = useCreateMessage();
  const {
    mutate: deleteConversation,
    isPending: isDeletingConversation,
  } = useDeleteConversation();
  const { mutate: deleteMessage, isPending: isDeletingMessage } = useDeleteMessage();
  const { mutate: flagMessage, isPending: isFlaggingMessage } = useFlagMessage();
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const previousMessageCountRef = useRef(0);
  const previousConversationIdRef = useRef<string | null>(null);

  const {
    data: conv,
    isLoading: isConversationLoading,
    isError: isConversationError,
    refetch: refetchConversation,
  } = useGetConversationById({
    token,
    id: conversationId!,
  });

  // Keep the scroll position stable while receiving new messages.
  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

  useEffect(() => {
    if (!imageFile) {
      setImagePreviewUrl(null);
      return;
    }

    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreviewUrl(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [imageFile]);

  useEffect(() => {
    if (!conversationId) return;

    let cancelled = false;
    let echo: Awaited<ReturnType<typeof getEcho>> = null;
    const channelName = `chat-conversation.${conversationId}`;

    const subscribe = async () => {
      const instance = await getEcho();

      if (cancelled || !instance) return;

      echo = instance;

      echo
        .private(channelName)
        .listen("ConversationEvent", (data: { conversation_id?: string | number }) => {
          if (String(data.conversation_id) === String(conversationId)) {
            void refetchConversation();
            void queryClient.invalidateQueries({
              queryKey: [QueryKeys.CONVERSATIONS],
            });
          }
        })
        .error((error: unknown) => {
          console.error("Pusher channel error:", error);
        });
    };

    void subscribe();

    return () => {
      cancelled = true;
      if (echo) {
        echo.leave(channelName);
      }
    };
  }, [conversationId, refetchConversation, queryClient]);

  useEffect(() => {
    if (!conversationId) {
      previousConversationIdRef.current = null;
      previousMessageCountRef.current = 0;
      return;
    }

    const container = messagesContainerRef.current;
    const messageCount = conv?.data.messages?.length ?? 0;
    const isConversationChange =
      previousConversationIdRef.current !== String(conversationId);
    const wasNearBottom = container
      ? container.scrollHeight - container.scrollTop - container.clientHeight <= 96
      : true;

    if (container && (isConversationChange || (messageCount > previousMessageCountRef.current && wasNearBottom))) {
      requestAnimationFrame(scrollToBottom);
    }

    previousConversationIdRef.current = String(conversationId);
    previousMessageCountRef.current = messageCount;
  }, [conversationId, conv?.data.messages?.length]);

  const handleImageSelection = (file: File | null) => {
    if (!file) {
      setImageFile(null);
      return;
    }

    const maxImageSize = 2 * 1024 * 1024;
    const allowedTypes = new Set([
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ]);

    if (!allowedTypes.has(file.type)) {
      toast.error(
        language === "ar"
          ? "يسمح فقط بصور JPG وPNG وGIF وWebP."
          : "Only JPG, PNG, GIF and WebP images are allowed."
      );
      setImageFile(null);
      return;
    }

    if (file.size > maxImageSize) {
      toast.error(
        language === "ar"
          ? "حجم الصورة يجب ألا يتجاوز 2MB."
          : "Image size must not exceed 2MB."
      );
      setImageFile(null);
      return;
    }

    setImageFile(file);
  };

  const handleSend = () => {
    if (!messageText.trim() && !imageFile) return;

    const message: ICreateMessage = {
      body: messageText.trim(),
      ...(imageFile && { image: imageFile }),
    };

    sendMessage(
      {
        token,
        conversationId: conversationId!,
        message,
      },
      {
        onSuccess: () => {
          setMessageText("");
          setImageFile(null);
        },
        onError: (error) => {
          console.error("Failed to send message:", error);
          toast.error(
            language === "ar"
              ? "تعذر إرسال الرسالة. يرجى المحاولة مرة أخرى."
              : "Failed to send message. Please try again."
          );
        },
      }
    );
  };

  const handleRemoveConversation = () => {
    const confirmed = window.confirm(
      language === "ar"
        ? "هل تريد إزالة المحادثة من قائمتك؟"
        : "Remove this conversation from your list?"
    );

    if (!confirmed) return;

    deleteConversation(
      {
        token,
        conversationId: conversationId!,
      },
      {
        onSuccess: onClose,
        onError: () => {
          toast.error(
            language === "ar"
              ? "تعذر إزالة المحادثة. حاول مرة أخرى."
              : "Failed to remove the conversation. Please try again."
          );
        },
      }
    );
  };

  if (conversationId && (isConversationLoading || isConversationError)) {
    return (
      <div className="col-span-1 flex h-[clamp(420px,calc(100svh-220px),560px)] min-h-[420px] min-w-0 items-center justify-center rounded-md bg-white px-6 py-10 text-center shadow-md lg:h-[500px] lg:min-h-0 lg:col-span-2">
        <div className="flex max-w-sm flex-col items-center justify-center gap-4">
          <MessageCircle className="h-16 w-16 text-main" aria-hidden="true" />
          <h3 className="font-sora text-xl font-bold text-main">
            {isConversationLoading
              ? (language === "ar" ? "جاري تحميل المحادثة..." : "Loading conversation...")
              : (language === "ar" ? "تعذر تحميل المحادثة" : "Could not load conversation")}
          </h3>
          {isConversationError && (
            <button
              type="button"
              onClick={() => void refetchConversation()}
              className="inline-flex min-h-10 items-center justify-center rounded-lg bg-main px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2"
            >
              {language === "ar" ? "إعادة المحاولة" : "Retry"}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!conversationId) {
    return (
      <div className="col-span-1 flex h-[clamp(420px,calc(100svh-220px),560px)] min-h-[420px] min-w-0 items-center justify-center rounded-md bg-white px-6 py-10 text-center shadow-md md:h-[500px] md:min-h-0 md:col-span-2">
        <div className="flex max-w-sm flex-col items-center justify-center gap-4">
          <MessageCircle className="h-20 w-20 text-main" aria-hidden="true" />
          <h3 className="font-sora text-2xl font-bold text-main sm:text-3xl">
            {language === "ar" ? "جاهز للدردشة؟" : "Ready to Chat?"}
          </h3>
          <p className="font-sora text-sm text-gray-500">
            {language === "ar" ? "اختر محادثة من القائمة لبدء التواصل." : "Choose a conversation from the list to start chatting."}
          </p>
        </div>
      </div>
    );
  }
  const allMessages: IMessage[] = (conv?.data.messages || [])
    .map((msg) => ({
      ...msg,
    }))
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

  return (
    <div className="relative col-span-1 flex h-[clamp(420px,calc(100svh-220px),560px)] min-h-[420px] min-w-0 flex-col rounded-md bg-white shadow-md md:h-[500px] md:min-h-0 md:col-span-2">
      {/* chat header */}
      <div className="flex min-w-0 items-center gap-2 px-3 py-3 sm:px-6 md:px-8">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-black-blue transition-colors hover:bg-white-gray focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main md:hidden"
          aria-label={language === "ar" ? "العودة إلى المحادثات" : "Back to conversations"}
        >
          {language === "ar" ? <ArrowRight size={20} aria-hidden="true" /> : <ArrowLeft size={20} aria-hidden="true" />}
        </button>

        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full">
            <img
              className="h-full w-full object-cover"
              src={conv?.data.participant.profile_image || "/images/profile-avatar.webp"}
              alt={language === "ar" ? "صورة المستخدم" : "User profile"}
            />
          </div>
          <h4 className="min-w-0 truncate font-sora text-base font-semibold text-black">
            {conv?.data.participant.name}
          </h4>
        </div>

        <button
          type="button"
          onClick={handleRemoveConversation}
          disabled={isDeletingConversation}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-red-500 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={language === "ar" ? "إزالة المحادثة" : "Remove conversation"}
          title={language === "ar" ? "إزالة المحادثة" : "Remove conversation"}
        >
          {isDeletingConversation ? <span className="text-xs">…</span> : <Trash2 size={18} aria-hidden="true" />}
        </button>
      </div>      <hr />
      {/* chat messages */}
      <div
        ref={messagesContainerRef}
        className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-6 md:px-10 md:py-5"
      >
        {allMessages.map((msg, index) => {
          const isOwnMessage = msg.side === "left";
          const canAct = !msg.deleted_at;
          const isMenuOpen = openMessageMenuId === msg.id;

          return (
            <div
              key={msg.id || index}
              className={`group relative flex ${
                isOwnMessage ? "justify-end" : "justify-start"
              } mb-4`}
            >
              <div
                className={`flex min-w-0 max-w-[92%] items-start gap-1 sm:max-w-[78%] md:max-w-[70%] ${
                  isOwnMessage ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {canAct && (
                  <div className="relative mt-1 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMessageMenuId((current) =>
                          current === msg.id ? null : msg.id
                        )
                      }
                      aria-label={
                        language === "ar" ? "خيارات الرسالة" : "Message options"
                      }
                      aria-expanded={isMenuOpen}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-black-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main"
                    >
                      <MoreVertical size={16} aria-hidden="true" />
                    </button>

                    {isMenuOpen && (
                      <div
                        className={`absolute top-8 z-20 w-44 rounded-lg border border-gray-200 bg-white p-1 shadow-lg ${
                          isOwnMessage ? "right-0" : "left-0"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            deleteMessage(
                              {
                                token,
                                conversationId: conversationId!,
                                messageId: String(msg.id),
                                type: "0",
                              },
                              {
                                onSuccess: () => {
                                  setOpenMessageMenuId(null);
                                  toast.success(
                                    language === "ar"
                                      ? "تم حذف الرسالة من محادثتك."
                                      : "Message removed from your chat."
                                  );
                                },
                                onError: () => {
                                  toast.error(
                                    language === "ar"
                                      ? "تعذر حذف الرسالة."
                                      : "Could not delete the message."
                                  );
                                },
                              }
                            );
                          }}
                          disabled={isDeletingMessage}
                          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-start text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <Trash2 size={14} aria-hidden="true" />
                          {language === "ar" ? "حذف لديّ" : "Delete for me"}
                        </button>

                        {isOwnMessage && (
                          <button
                            type="button"
                            onClick={() => {
                              const confirmed = window.confirm(
                                language === "ar"
                                  ? "هل تريد حذف الرسالة للجميع؟"
                                  : "Delete this message for everyone?"
                              );

                              if (!confirmed) return;

                              deleteMessage(
                                {
                                  token,
                                  conversationId: conversationId!,
                                  messageId: String(msg.id),
                                  type: "1",
                                },
                                {
                                  onSuccess: () => {
                                    setOpenMessageMenuId(null);
                                    toast.success(
                                      language === "ar"
                                        ? "تم حذف الرسالة للجميع."
                                        : "Message deleted for everyone."
                                    );
                                  },
                                  onError: () => {
                                    toast.error(
                                      language === "ar"
                                        ? "تعذر حذف الرسالة للجميع."
                                        : "Could not delete the message for everyone."
                                    );
                                  },
                                }
                              );
                            }}
                            disabled={isDeletingMessage}
                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-start text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            <Trash2 size={14} aria-hidden="true" />
                            {language === "ar" ? "حذف للجميع" : "Delete for everyone"}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            flagMessage(
                              {
                                token,
                                conversationId: conversationId!,
                                messageId: String(msg.id),
                              },
                              {
                                onSuccess: () => {
                                  setOpenMessageMenuId(null);
                                  toast.success(
                                    language === "ar"
                                      ? msg.flagged
                                        ? "تم إلغاء الإبلاغ."
                                        : "تم الإبلاغ عن الرسالة."
                                      : msg.flagged
                                        ? "Message unflagged."
                                        : "Message flagged."
                                  );
                                },
                                onError: () => {
                                  toast.error(
                                    language === "ar"
                                      ? "تعذر تحديث حالة الإبلاغ."
                                      : "Could not update the flag."
                                  );
                                },
                              }
                            );
                          }}
                          disabled={isFlaggingMessage}
                          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-start text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <Flag size={14} aria-hidden="true" />
                          {msg.flagged
                            ? language === "ar"
                              ? "إلغاء الإبلاغ"
                              : "Unflag"
                            : language === "ar"
                              ? "إبلاغ"
                              : "Flag message"}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div
                  className={`min-w-0 flex-1 rounded-lg p-2 font-sora text-xs sm:p-3 sm:text-sm ${
                    isOwnMessage
                      ? "bg-main text-white"
                      : "border border-main bg-white text-main"
                  }`}
                >
                  <div
                    className={`${
                      isOwnMessage ? "text-white" : "text-black"
                    } min-w-0 break-words`}
                  >
                    {msg.data.image && !msg.deleted_at ? (
                      <>
                        <img
                          src={msg.data.image.url}
                          className="block max-h-72 max-w-full rounded-lg object-contain object-center"
                          alt={
                            language === "ar"
                              ? "صورة مرفقة"
                              : "Shared image"
                          }
                          loading="lazy"
                        />
                        {msg.data.body}
                      </>
                    ) : (
                      <>{msg.data.body}</>
                    )}
                  </div>
                  <div className="mt-1 flex items-center justify-end gap-2">
                    <span className="text-[10px] opacity-70">
                      {formatTime(msg.created_at, language)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* send */}
      <div className="flex w-full shrink-0 flex-wrap items-center justify-center gap-2 border-t border-gray-100 px-3 py-3 sm:gap-3 sm:px-6">
        <button
          type="button"
          aria-label={language === "ar" ? "إرفاق صورة" : "Attach image"}
          onClick={() => document.getElementById("hiddenFileInput")?.click()}
          className="order-2 inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-main p-2 transition-colors hover:bg-white-gray focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2 sm:order-none"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M23.3983 2.66602H2.99845C2.83923 2.66577 2.6865 2.73599 2.57395 2.86103C2.46141 2.98608 2.39822 3.15579 2.39844 3.3327V23.3331C2.39821 23.51 2.46141 23.6797 2.57395 23.8048C2.68649 23.9298 2.83923 24 2.99845 23.9998H23.3983C23.5575 24 23.7102 23.9298 23.8228 23.8048C23.9353 23.6797 23.9985 23.51 23.9983 23.3331V3.3327C23.9985 3.15579 23.9353 2.98609 23.8228 2.86103C23.7103 2.73598 23.5575 2.66577 23.3983 2.66602ZM22.7983 3.99938V15.5875L18.8667 13.4031C18.6358 13.2743 18.3564 13.3247 18.1742 13.5281L14.9223 17.1415L11.7314 14.7782H11.7311C11.5076 14.6119 11.2117 14.632 11.0081 14.827L3.5984 21.8838V3.99921L22.7983 3.99938ZM4.61987 22.6665L11.4442 16.1681L14.6657 18.5547C14.9036 18.7316 15.2209 18.6968 15.4227 18.4713L18.7168 14.8111L22.7985 17.0786V22.6667L4.61987 22.6665Z"
              fill="#0AB99D"
            />
            <path
              d="M8.40007 12.0006C9.03648 12.0006 9.64695 11.7194 10.0972 11.2195C10.5471 10.7193 10.8001 10.0409 10.8001 9.33378C10.8001 8.62638 10.5471 7.94808 10.0972 7.44807C9.647 6.94787 9.03648 6.66699 8.40007 6.66699C7.76342 6.66699 7.15296 6.94786 6.70296 7.44807C6.25278 7.94802 6 8.62638 6 9.33378C6.00067 10.0407 6.25367 10.7185 6.70364 11.2185C7.15362 11.7184 7.76365 11.9995 8.40007 12.0005V12.0006ZM8.40007 8.00042C8.71827 8.00042 9.02351 8.14085 9.24862 8.39095C9.47349 8.64105 9.60009 8.97997 9.60009 9.3338C9.60009 9.68737 9.47349 10.0265 9.24862 10.2767C9.02354 10.5265 8.71829 10.6672 8.40007 10.6672C8.08164 10.6672 7.77663 10.5265 7.55151 10.2767C7.32642 10.0266 7.20004 9.68739 7.20004 9.3338C7.20026 8.98024 7.32688 8.64133 7.55173 8.3912C7.77682 8.14135 8.08185 8.00066 8.40007 8.00066Z"
              fill="#0AB99D"
            />
            <path
              d="M21.5999 0.666688C21.6001 0.489779 21.5369 0.320072 21.4244 0.195018C21.3118 0.069965 21.1591 -0.000247063 20.9999 6.55216e-07H0.600008C0.440792 -0.000247444 0.288059 0.0699714 0.175513 0.195018C0.062967 0.320065 0 0.489779 0 0.666688V20.6671C0 21.0353 0.268629 21.3338 0.600003 21.3338C0.931376 21.3338 1.2 21.0353 1.2 20.6671V1.33362H21.0002C21.1594 1.33362 21.3121 1.2634 21.4247 1.13836C21.5372 1.01331 21.6004 0.843844 21.6002 0.666935L21.5999 0.666688Z"
              fill="#0AB99D"
            />
          </svg>
        </button>
        <input
          type="file"
          id="hiddenFileInput"
          className="hidden"
          accept=".jpg,.jpeg,.png,.gif,.webp,image/jpeg,image/png,image/gif,image/webp"
          onChange={(e) => {
            handleImageSelection(e.target.files?.[0] || null);
            e.currentTarget.value = "";
          }}
        />
        {imageFile && (
          <div className="order-3 flex w-full min-w-0 items-center gap-2 rounded-lg border border-main/20 bg-[#F0FEFC] px-2 py-2 text-xs text-black-blue sm:order-none sm:w-auto sm:max-w-[260px]">
            {imagePreviewUrl && (
              <img
                src={imagePreviewUrl}
                alt={language === "ar" ? "معاينة الصورة المرفقة" : "Attached image preview"}
                className="h-14 w-14 shrink-0 rounded-md object-cover"
              />
            )}
            <span className="min-w-0 flex-1 truncate">{imageFile.name}</span>
            <button
              type="button"
              onClick={() => setImageFile(null)}
              aria-label={
                language === "ar"
                  ? "إزالة الصورة المرفقة"
                  : "Remove attached image"
              }
              className="shrink-0 rounded p-1 text-red-500 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main"
            >
              ×
            </button>
          </div>
        )}
        <input
          type="text"
          placeholder={language === "ar" ? "اكتب رسالتك....." : "Type your message....."}
          className="w-full min-w-0 flex-1 rounded-2xl border border-main px-3 py-2 text-sm placeholder:text-sm focus:outline-none sm:max-w-[300px]"
          value={messageText}
          maxLength={1000}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={isSending || (!messageText.trim() && !imageFile)}
          className="order-2 shrink-0 bg-main text-white font-sora text-[16px] flex items-center gap-2 px-3 py-2 rounded-lg disabled:opacity-50 sm:order-none"
        >
          {isSending ? (language === "ar" ? "جاري الإرسال..." : "Sending...") : (language === "ar" ? "إرسال" : "Send")} <Send size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;
