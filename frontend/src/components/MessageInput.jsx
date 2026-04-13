import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, ChevronRight, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    setIsSending(true);
    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-4 w-full bg-bg-surface border-none">
      {imagePreview && (
        <div className="mb-4 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="size-20 object-cover rounded-xl border-none shadow-sm"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 size-6 rounded-full bg-error flex items-center justify-center transition-all hover:scale-110 border-none cursor-pointer shadow-sm text-white"
              type="button"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-3">
        <div className="flex-1 input-group px-2">
          <button
            type="button"
            className={`flex items-center justify-center size-10 rounded-xl transition-all border-none bg-transparent cursor-pointer
                     ${imagePreview ? "text-success bg-success/10" : "text-text-muted hover:bg-bg-dark"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={22} />
          </button>
          
          <input
            type="text"
            className="input-field placeholder:text-text-muted font-medium"
            placeholder="Write a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
        </div>

        <button
          type="submit"
          className="btn-primary h-12 px-6 flex items-center justify-center gap-2 rounded-2xl shadow-md border-none shrink-0 hover:scale-105 transition-transform"
          disabled={(!text.trim() && !imagePreview) || isSending}
        >
          {isSending ? (
            <Loader2 size={24} className="animate-spin text-white" />
          ) : (
            <>
              <span className="font-bold text-[15px] text-white">Enter</span>
              <ChevronRight size={22} strokeWidth={3} className="text-white" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
