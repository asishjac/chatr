import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-4 border-b border-bg-dark bg-bg-surface">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative">
            <img 
              src={selectedUser.profilePic || "/avatar.png"} 
              alt={selectedUser.fullName} 
              className="size-10 object-cover rounded-full border-2 border-glass-border"
            />
            {onlineUsers.includes(selectedUser.userId) && (
              <span className="absolute bottom-0 right-0 size-2.5 bg-success rounded-full ring-2 ring-bg-dark" />
            )}
          </div>

          {/* User info */}
          <div>
            <h3 className="font-bold text-sm">{selectedUser.fullName}</h3>
            <p className="text-[11px] text-text-muted font-medium">
              {onlineUsers.includes(selectedUser.userId) ? "Active Now" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button 
          onClick={() => setSelectedUser(null)} 
          className="p-2 rounded-lg transition-all hover:bg-bg-dark border-none bg-transparent cursor-pointer text-text-muted hover:text-error shadow-none outline-none"
        >
          <X className="size-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
