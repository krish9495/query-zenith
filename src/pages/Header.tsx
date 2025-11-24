import { useState } from "react";
import { Sparkles } from "lucide-react";

interface HeaderProps {
  user?: {
    name: string;
    email: string;
    image?: string;
  };
  onSignOut?: () => void;
}

// Header styles
const headerStyles = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-slide-down {
    animation: slideDown 0.3s ease-out forwards;
  }
`;

export const Header = ({ user, onSignOut }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const initials = user
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <>
      <style>{headerStyles}</style>
      <header className="sticky top-0 z-50 w-full glass-card border-b border-primary/20 backdrop-blur-xl">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4 flex-shrink-0">
              <div className="flex items-center space-x-3 hover:scale-105 transition-transform duration-200 cursor-pointer">
                <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-shadow">
                  <span className="text-white font-bold text-base">C</span>
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse"></span>
                </div>
                <div className="hidden sm:block">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold gradient-text">CitRAG</h1>
                    <Sparkles className="h-4 w-4 text-accent animate-pulse" />
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">
                    AI Document Intelligence
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Actions */}
          </div>
        </div>
      </header>
    </>
  );
};
