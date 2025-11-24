import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Upload,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NavigationProps {
  activeItem?: string;
  onItemClick?: (item: string) => void;
}

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "upload", label: "Upload", icon: Upload },
  { id: "query", label: "Query", icon: MessageSquare },
];

// Navigation styles
const navigationStyles = `
  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-10px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: inset 0 0 0 2px transparent; }
    50% { box-shadow: inset 0 0 0 2px var(--color-primary); }
  }
  .animate-slide-in-left {
    animation: slideInLeft 0.3s ease-out forwards;
  }
`;

export const Navigation = ({
  activeItem = "dashboard",
  onItemClick,
}: NavigationProps) => {
  return (
    <>
      <style>{navigationStyles}</style>
      <nav className="w-64 h-full glass-card border-r border-primary/20 bg-gradient-to-b from-background to-background/80 flex flex-col">
        {/* Header Section */}

        {/* Navigation Items */}
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <div
                key={item.id}
                className="animate-slide-in-left"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-between h-11 px-4 transition-all duration-300 relative group",
                    isActive
                      ? "bg-gradient-to-r from-primary/25 to-primary/10 text-primary border border-primary/50 shadow-lg shadow-primary/20"
                      : "hover:bg-primary/10 text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => onItemClick?.(item.id)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "p-2 rounded-lg transition-all duration-300",
                        isActive
                          ? "bg-primary/30"
                          : "bg-muted/40 group-hover:bg-primary/20"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 transition-colors",
                          isActive
                            ? "text-primary"
                            : "text-muted-foreground group-hover:text-primary"
                        )}
                      />
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {isActive && (
                    <ChevronRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </Button>
                {/* badge property not used in current nav items; left here commented for future use */}
              </div>
            );
          })}
        </div>
      </nav>
    </>
  );
};
