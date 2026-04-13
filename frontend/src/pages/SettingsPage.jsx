import { MessageSquare } from "lucide-react";

const SettingsPage = () => {
  return (
    <div className="min-h-screen pt-20 bg-darkest">
      <div className="max-w-2xl mx-auto px-4">
        <div className="glass rounded-2xl overflow-hidden">
          <div className="bg-primary/5 p-8 border-b border-glass-border text-center">
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            <p className="mt-1 text-sm text-text-muted font-medium">Customize your application experience</p>
          </div>

          <div className="p-8 space-y-10">
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-text-main uppercase tracking-widest">Theme</h2>
              <p className="text-sm text-text-muted">Currently using the default professional dark theme. More themes coming soon.</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border-2 border-primary bg-bg-surface flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-widest">Premium Dark</span>
                    <div className="size-3 bg-primary rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-white/10 rounded" />
                    <div className="h-2 w-3/4 bg-white/10 rounded" />
                  </div>
                </div>
                
                <div className="p-4 rounded-xl border border-glass-border bg-white/5 opacity-50 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Light Mode</span>
                    <div className="size-3 bg-text-muted rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-black/10 rounded" />
                    <div className="h-2 w-3/4 bg-black/10 rounded" />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-glass-border">
              <h2 className="text-sm font-bold text-text-main mb-4 uppercase tracking-widest">Preview</h2>
              <div className="glass rounded-xl p-4 flex gap-3 items-center">
                <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <MessageSquare className="size-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="h-3 w-24 bg-white/10 rounded mb-1.5" />
                  <div className="h-2 w-full bg-white/5 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
