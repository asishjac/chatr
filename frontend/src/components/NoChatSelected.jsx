import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-16 bg-dark/30">
      <div className="max-w-md text-center space-y-6">
        {/* Icon Display */}
        <div className="flex justify-center mb-8">
          <div className="size-20 rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse">
            <MessageSquare className="size-10 text-primary" />
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-bold tracking-tight">Welcome to Chatr</h2>
        <p className="text-text-muted leading-relaxed">
          Select a professional contact from the sidebar to start a secure real-time conversation.
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
