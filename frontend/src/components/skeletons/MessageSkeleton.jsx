const MessageSkeleton = () => {
  // Create 6 skeleton messages
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {skeletonMessages.map((_, idx) => (
        <div key={idx} className={`flex ${idx % 2 === 0 ? "justify-start" : "justify-end"}`}>
          <div className="flex flex-col gap-1 max-w-[80%]">
            <div className={`h-12 w-48 rounded-2xl bg-white/5 animate-pulse ${
              idx % 2 === 0 ? "rounded-bl-none" : "rounded-br-none"
            }`} />
            <div className={`h-3 w-12 bg-white/5 rounded animate-pulse ${
              idx % 2 === 0 ? "self-start" : "self-end"
            }`} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;
