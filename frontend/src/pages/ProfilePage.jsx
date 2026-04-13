import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="min-h-screen pt-20 pb-10 bg-bg-darkest">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-bg-surface rounded-2xl overflow-hidden shadow-sm border border-bg-dark">
          <div className="bg-primary/5 p-8 border-b border-bg-dark text-center">
            <h1 className="text-2xl font-bold tracking-tight text-text-main">Profile Settings</h1>
            <p className="mt-1 text-sm text-text-muted font-medium">Manage your professional identity</p>
          </div>

          <div className="p-8 space-y-10">
            {/* Avatar Upload Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <img
                  src={selectedImg || authUser.profilePic || "/avatar.png"}
                  alt="Profile"
                  className="size-32 rounded-full object-cover border-4 border-bg-surface shadow-xl transition-all group-hover:opacity-90"
                />
                <label
                  htmlFor="avatar-upload"
                  className={`
                    absolute bottom-0 right-0 
                    bg-primary hover:bg-primary-hover
                    p-2.5 rounded-full cursor-pointer 
                    transition-all duration-200 shadow-lg border-4 border-bg-surface
                    ${isUpdatingProfile ? "animate-pulse pointer-events-none" : "hover:scale-110"}
                  `}
                >
                  <Camera className="size-5 text-white" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider">
                  {isUpdatingProfile ? "Uploading..." : "Click icon to change photo"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="text-xs font-bold text-text-muted flex items-center gap-2 uppercase tracking-widest">
                  <User className="size-4" />
                  Full Name
                </div>
                <div className="px-4 py-3 bg-bg-darker rounded-xl border border-bg-dark text-sm font-medium text-text-main">
                  {authUser?.fullName}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-text-muted flex items-center gap-2 uppercase tracking-widest">
                  <Mail className="size-4" />
                  Email Address
                </div>
                <div className="px-4 py-3 bg-bg-darker rounded-xl border border-bg-dark text-sm font-medium text-text-main">
                  {authUser?.email}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-bg-dark">
              <h2 className="text-sm font-bold text-text-main mb-4 uppercase tracking-widest">Account Details</h2>
              <div className="bg-bg-darker/40 rounded-xl border border-bg-dark overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-bg-dark bg-bg-darker/20">
                  <span className="text-xs text-text-muted font-medium">Member Since</span>
                  <span className="text-xs font-bold text-text-main">{authUser.createdAt?.split("T")[0]}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-bg-darker/10">
                  <span className="text-xs text-text-muted font-medium">Security Status</span>
                  <span className="text-xs font-bold text-success flex items-center gap-1.5">
                    <span className="size-2 bg-success rounded-full animate-pulse" />
                    Verified Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
