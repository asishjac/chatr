import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user.userId))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-bg-dark flex flex-col transition-all duration-200 bg-bg-surface">
      <div className="border-b border-bg-dark w-full p-5 bg-bg-darker/30">
        <div className="flex items-center gap-3">
          <Users className="size-6 text-primary" />
          <span className="font-bold hidden lg:block tracking-tight text-text-main">Messages</span>
        </div>
        <div className="mt-4 hidden lg:flex items-center justify-between gap-2">
          <span className="text-[13px] font-medium text-text-muted">Show Online Only</span>
          <label className="toggle-switch">
             <input
               type="checkbox"
               checked={showOnlineOnly}
               onChange={(e) => setShowOnlineOnly(e.target.checked)}
             />
             <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div className="overflow-y-auto w-full">
        {filteredUsers.map((user) => (
          <button
            key={user.userId}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-4 flex items-center gap-4
              hover:bg-bg-dark transition-all duration-200 cursor-pointer border-none bg-transparent
              ${selectedUser?.userId === user.userId ? "sidebar-item-active" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0 shrink-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.fullName}
                className="size-11 object-cover rounded-full border border-bg-dark shadow-sm bg-bg-dark"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/avatar.png";
                }}
              />
            </div>

            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`shrink-0 size-2 rounded-full ${onlineUsers.includes(user.userId) ? "bg-success shadow-[0_0_8px_var(--success)]" : "bg-status-offline"}`} />
                  <div className="font-bold text-[15.5px] truncate text-text-main pr-1">{user.fullName}</div>
                </div>
                
                {useChatStore.getState().unreadCounts[user.userId] > 0 && (
                  <div className="size-5 rounded-full bg-primary flex items-center justify-center animate-pulse shrink-0">
                    <span className="text-[10px] text-white font-bold">{useChatStore.getState().unreadCounts[user.userId]}</span>
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-text-muted py-12 px-4 text-sm font-medium">
            No contacts currently {showOnlineOnly ? "online" : "available"}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
