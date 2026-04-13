import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser.userId);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser.userId, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-bg-darkest">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {messages.map((message) => {
          const isSentByMe = message.senderId === authUser.userId;
          return (
            <div
              key={message.messageId}
              className={`flex w-full items-end gap-3 ${
                isSentByMe ? "flex-row-reverse justify-start" : "flex-row justify-start"
              }`}
              ref={messageEndRef}
            >
              {/* Message Avatar */}
              <div className="shrink-0 mb-1">
                <img
                  src={(isSentByMe ? authUser.profilePic : selectedUser.profilePic) || "/avatar.png"}
                  alt="profile pic"
                  className="size-8 object-cover rounded-full bg-bg-darker"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/avatar.png";
                  }}
                />
              </div>

              <div className={`flex flex-col gap-1 max-w-[80%] ${
                isSentByMe ? "items-end" : "items-start"
              }`}>
                <div
                  className={`relative px-4 py-2.5 shadow-sm transition-all ${
                    isSentByMe
                      ? "bg-primary text-white rounded-2xl rounded-br-none"
                      : "bg-white text-text-main rounded-2xl rounded-bl-none border border-bg-dark/5 shadow-sm"
                  }`}
                >
                  {/* Tail: Conditional Left vs Right */}
                  <div className={`absolute bottom-0 size-3 ${
                    isSentByMe 
                      ? "bg-primary -right-1 [clip-path:polygon(0_0,0_100%,100%_100%)]" 
                      : "bg-white -left-1 border-l border-b border-bg-dark/5 [clip-path:polygon(100%_0,100%_100%,0_100%)]"
                  }`} />

                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="max-h-[300px] rounded-lg mb-2 object-cover"
                    />
                  )}
                  {message.text && (
                    <p className="text-[14.5px] leading-relaxed break-words font-medium">
                      {message.text}
                    </p>
                  )}
                </div>
                <div className={`flex items-center gap-1.5 px-1 ${
                  isSentByMe ? "flex-row-reverse" : "flex-row"
                }`}>
                  <span className="text-[9px] text-text-muted font-bold tracking-wider">
                    {formatMessageTime(message.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
