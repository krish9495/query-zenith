import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Activity,
  FileText,
  Upload,
  MessageSquare,
  BarChart3,
  RefreshCw,
  Zap,
  Database,
  Cpu,
  Server,
  ArrowRight,
} from "lucide-react";
import { apiService, SystemHealth, formatUptime } from "@/lib/api";
import { toast } from "sonner";
import heroImage from "@/assets/hero-dashboard.jpg";

// Animation styles
const dashboardStyles = `
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-slide-in-up {
    animation: slideInUp 0.5s ease-out forwards;
  }
`;

interface DashboardProps {
  user?: {
    name: string;
    email: string;
  };
  onNavigate?: (section: string) => void;
}

export const Dashboard = ({ user, onNavigate }: DashboardProps) => {
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSystemHealth = async () => {
    try {
      setLoading(true);
      const health = await apiService.getSystemHealth();
      setSystemHealth(health);
    } catch (error) {
      toast.error("Failed to fetch system health");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemHealth();
    // Refresh every 30 seconds
    const interval = setInterval(fetchSystemHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStats = () => {
    if (!systemHealth) {
      return [
        {
          title: "Active Sessions",
          value: "Loading...",
          change: "",
          icon: Activity,
          color: "text-accent",
        },
        {
          title: "System Status",
          value: "Loading...",
          change: "",
          icon: FileText,
          color: "text-muted-foreground",
        },
      ];
    }

    return [
      {
        title: "Active Sessions",
        value: systemHealth.active_sessions.toString(),
        change: systemHealth.active_sessions > 0 ? "+Active" : "Idle",
        icon: Activity,
        color: "text-accent",
      },
      {
        title: "System Status",
        value: systemHealth.status,
        change: `Up ${formatUptime(systemHealth.uptime)}`,
        icon: FileText,
        color:
          systemHealth.status === "healthy"
            ? "text-green-500"
            : "text-yellow-500",
      },
    ];
  };

  const stats = getStats();

  const quickActions = [
    {
      title: "Upload Documents",
      description: "Add new documents to your knowledge base",
      icon: Upload,
      action: "upload",
    },
    {
      title: "Start Query",
      description: "Ask questions about your documents",
      icon: MessageSquare,
      action: "query",
    },
  ];

  return (
    <div className="space-y-8">
      <style>{dashboardStyles}</style>

      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden rounded-2xl glass-card border group">
        <div
          className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />

        <div className="relative p-8 md:p-16">
          <div className="max-w-3xl">
            <div className="mb-6 inline-block px-4 py-2 rounded-full bg-primary/20 border border-primary/30 animate-slide-in-up">
              <span className="text-sm font-semibold text-primary flex items-center gap-2">
                <Zap className="h-4 w-4" />
                AI-Powered Document Intelligence
              </span>
            </div>

            <h1
              className="text-5xl md:text-6xl font-bold mb-6 leading-tight animate-slide-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              Welcome back,{" "}
              <span className="gradient-text block mt-2">
                {user?.name?.split(" ")[0] || "User"}
              </span>
            </h1>

            <p
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed animate-slide-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Your intelligent document assistant is ready. Upload documents,
              ask questions, and get instant insights powered by advanced AI
              technology.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 items-start animate-slide-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              <Button
                size="lg"
                className="btn-gradient group/btn"
                onClick={() => onNavigate?.("upload")}
              >
                <Upload className="mr-2 h-5 w-5 group-hover/btn:translate-y-0.5 transition-transform" />
                Upload Documents
                <ArrowRight className="ml-2 h-5 w-5 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-primary/30 hover:bg-primary/10 hover:border-primary/50 group/btn"
                onClick={() => onNavigate?.("query")}
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Start Querying
                <ArrowRight className="ml-2 h-5 w-5 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
              </Button>
            </div>

            {/* Feature highlights */}
            <div
              className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-left animate-slide-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                <div className="p-2 rounded-lg bg-accent/20">
                  <Zap className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Fast Processing</p>
                  <p className="text-xs text-muted-foreground">
                    Sub-second responses
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Database className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Any Document</p>
                  <p className="text-xs text-muted-foreground">
                    PDF, DOCX, Email
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                <div className="p-2 rounded-lg bg-accent/20">
                  <Server className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Always Online</p>
                  <p className="text-xs text-muted-foreground">Reliable 24/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid - Enhanced */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">System Overview</h2>
            <p className="text-muted-foreground mt-1">
              Real-time performance metrics
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSystemHealth}
            disabled={loading}
            className="border-primary/30 hover:bg-primary/10"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group animate-slide-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Card className="glass-card border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 h-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <div className="p-2 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-2 gradient-text">
                      {stat.value}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {stat.change}
                    </p>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance Metrics - Enhanced */}
      {systemHealth && (
        <Card
          className="glass-card border-primary/20 animate-slide-in-up"
          style={{ animationDelay: "0.5s" }}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>
                    System health and resource utilization
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* CPU Usage */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">CPU Usage</span>
                </div>
                <span className="text-sm font-bold text-primary">
                  {systemHealth.memory_usage.cpu_percent.toFixed(1)}%
                </span>
              </div>
              <Progress
                value={systemHealth.memory_usage.cpu_percent}
                className="h-3 bg-muted"
              />
            </div>

            {/* Memory Usage */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-accent" />
                  <span className="text-sm font-semibold">Memory Usage</span>
                </div>
                <span className="text-sm font-bold text-accent">
                  {systemHealth.memory_usage.rss.toFixed(1)} MB
                </span>
              </div>
              <Progress
                value={Math.min(
                  (systemHealth.memory_usage.rss / 1000) * 100,
                  100
                )}
                className="h-3 bg-muted"
              />
            </div>

            {/* System Status Cards */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 hover:border-primary/40 transition-colors">
                <div className="text-2xl font-bold text-primary mb-1">
                  {formatUptime(systemHealth.uptime)}
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Activity className="h-3 w-3" />
                  Uptime
                </div>
              </div>
              <div className="p-4 rounded-lg bg-accent/10 border border-accent/20 hover:border-accent/40 transition-colors">
                <div className="text-2xl font-bold text-accent mb-1">
                  {systemHealth.total_requests.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <MessageSquare className="h-3 w-3" />
                  Requests
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions - Enhanced */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div
                key={index}
                className="group animate-slide-in-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <Card
                  className="glass-card border-primary/20 hover:border-primary/40 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 h-full"
                  onClick={() => onNavigate?.(action.action)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 group-hover:from-primary/40 group-hover:to-primary/20 transition-all duration-300">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                    <div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {action.title}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {action.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
