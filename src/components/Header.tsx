import { Video, User, Users, DollarSign } from 'lucide-react';

export default function Header() {
  return (
    <header className="max-w-[860px] mx-auto mb-8 border-b border-border pb-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
        </div>
        <h1 className="text-2xl md:text-3xl font-sans font-extrabold tracking-tight text-text-main flex items-center gap-2">
          Peptonix <span className="text-accent underline decoration-accent/30">Ad Videos</span> — Work Log
        </h1>
      </div>

      <div className="flex flex-wrap gap-4 md:gap-6 mt-4 text-xs font-mono text-muted items-center">
        <div className="flex items-center gap-2 bg-surface border border-border px-3 py-1.5 rounded-lg">
          <User className="w-3.5 h-3.5 text-accent2" />
          <span>Creator</span>
          <span className="text-muted/50">→</span>
          <span className="text-text-main font-medium">Sahand Najmaden</span>
        </div>

        <div className="hidden md:block text-border select-none">//</div>

        <div className="flex items-center gap-2 bg-surface border border-border px-3 py-1.5 rounded-lg">
          <Users className="w-3.5 h-3.5 text-accent" />
          <span>Client</span>
          <span className="text-muted/50">→</span>
          <span className="text-text-main font-medium">Karbin Yasin</span>
        </div>

        <div className="hidden md:block text-border select-none">//</div>

        <div className="flex items-center gap-2 bg-surface/80 border border-accent/20 px-3 py-1.5 rounded-lg">
          <DollarSign className="w-3.5 h-3.5 text-accent" />
          <span>Rate</span>
          <span className="text-muted/50">→</span>
          <span className="text-accent font-semibold">10,000 IQD / video</span>
        </div>
      </div>
    </header>
  );
}
