import { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  FileText,
  File,
  Mail,
  CheckCircle,
  AlertCircle,
  X,
  Cloud,
  Zap,
  Database,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { apiService, UploadResponse } from "@/lib/api";
import { toast } from "sonner";

// Animation styles
const uploadStyles = `
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
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }
  .animate-slide-in-up {
    animation: slideInUp 0.5s ease-out forwards;
  }
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
`;

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "uploading" | "processing" | "completed" | "error";
  progress: number;
  filePath?: string;
  uploadResponse?: UploadResponse;
}

export const UploadSection = () => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  }, []);

  const handleFiles = (fileList: FileList) => {
    Array.from(fileList).forEach((file) => {
      // Check file type
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
        "text/plain",
        "message/rfc822",
      ];

      if (
        !allowedTypes.some(
          (type) =>
            file.type === type ||
            file.name.toLowerCase().endsWith(".pdf") ||
            file.name.toLowerCase().endsWith(".docx") ||
            file.name.toLowerCase().endsWith(".doc")
        )
      ) {
        toast.error(
          `Unsupported file type: ${file.name}. Please upload PDF, DOCX, or email files.`
        );
        return;
      }

      const newFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        status: "uploading",
        progress: 0,
      };

      setFiles((prev) => [...prev, newFile]);

      // Upload to backend
      uploadFile(file, newFile.id);
    });
  };

  const uploadFile = async (file: File, fileId: string) => {
    // Timer handles must be declared in outer scope so they can be
    // cleared from catch/finally. Initialize to null.
    let progressInterval: ReturnType<typeof setInterval> | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    try {
      // Start upload
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, status: "uploading", progress: 10 } : f
        )
      );

      // Simulate progress during upload - faster and more responsive
      progressInterval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId && f.progress < 85
              ? {
                  ...f,
                  progress: Math.min(f.progress + Math.random() * 8 + 3, 85),
                }
              : f
          )
        );
      }, 200);

      // Reduce timeout to 15 seconds for better UX
      timeoutId = setTimeout(() => {
        if (progressInterval) clearInterval(progressInterval);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, status: "error", progress: 0 } : f
          )
        );
        toast.error(
          `Upload timeout for ${file.name}. Please check your connection and try again.`
        );
      }, 15000);

      // Upload to backend
      const response = await apiService.uploadDocument(file);

      if (progressInterval) clearInterval(progressInterval);
      if (timeoutId) clearTimeout(timeoutId);

      // Mark as completed
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                status: "completed",
                progress: 100,
                filePath: response.file_path,
                uploadResponse: response,
              }
            : f
        )
      );

      toast.success(`Successfully uploaded ${file.name}`);
    } catch (error) {
      // Clear any running intervals/timeouts
      if (progressInterval) clearInterval(progressInterval);
      if (timeoutId) clearTimeout(timeoutId);

      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, status: "error", progress: 0 } : f
        )
      );

      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      toast.error(`Failed to upload ${file.name}: ${errorMessage}`);
      console.error("Upload error:", error);
    }
  };

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return FileText;
    if (type.includes("word") || type.includes("document")) return File;
    if (type.includes("email")) return Mail;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-8">
      <style>{uploadStyles}</style>

      {/* Enhanced Header Section */}
      <div className="relative overflow-hidden rounded-2xl glass-card border border-primary/20 group animate-slide-in-up">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="relative p-8 md:p-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/20 animate-float">
                <Cloud className="h-6 w-6 text-primary" />
              </div>
              <div className="inline-block px-3 py-1 rounded-full bg-accent/20 border border-accent/30">
                <span className="text-xs font-semibold text-accent">
                  Document Knowledge Base
                </span>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Upload Documents
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Build your knowledge base by uploading documents. Our AI will
              automatically process and index them for intelligent querying.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                <Zap className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-sm font-semibold">Fast Processing</p>
                  <p className="text-xs text-muted-foreground">
                    Quick indexing
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                <Database className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold">Multiple Formats</p>
                  <p className="text-xs text-muted-foreground">
                    PDF, DOCX, Email
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                <Lock className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-sm font-semibold">Secure</p>
                  <p className="text-xs text-muted-foreground">
                    Encrypted storage
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <Card
        className="glass-card border-primary/20 animate-slide-in-up"
        style={{ animationDelay: "0.1s" }}
      >
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-primary/20">
              <Cloud className="h-5 w-5 text-primary" />
            </div>
            Drop Your Documents Here
          </CardTitle>
          <CardDescription>
            Drag and drop files or click to browse. Supports PDF, DOCX, and
            email files.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              "relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 group",
              dragActive
                ? "border-primary bg-primary/15 scale-105 shadow-lg shadow-primary/20"
                : "border-primary/30 hover:border-primary/60 hover:bg-primary/5"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleChange}
              multiple
              accept=".pdf,.docx,.doc,.eml,.msg"
            />

            <div className="text-center">
              <div className="mx-auto mb-6 p-4 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full w-fit group-hover:from-primary/30 group-hover:to-primary/20 transition-all animate-pulse-glow">
                <Upload className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">
                Drop your documents here
              </h3>
              <p className="text-muted-foreground mb-6 text-lg">
                or{" "}
                <span className="text-primary font-semibold cursor-pointer hover:text-primary/80 transition-colors">
                  browse from your device
                </span>
              </p>
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <Badge className="bg-primary/20 text-primary border-primary/30 font-semibold px-3 py-1.5">
                  <FileText className="h-3 w-3 mr-2" />
                  PDF
                </Badge>
                <Badge className="bg-primary/20 text-primary border-primary/30 font-semibold px-3 py-1.5">
                  <File className="h-3 w-3 mr-2" />
                  DOCX
                </Badge>
                <Badge className="bg-primary/20 text-primary border-primary/30 font-semibold px-3 py-1.5">
                  <Mail className="h-3 w-3 mr-2" />
                  Email
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Maximum file size: 50MB per document
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card
          className="glass-card border-primary/20 animate-slide-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  Upload Progress
                </CardTitle>
                <CardDescription className="mt-2">
                  {files.filter((f) => f.status === "completed").length} of{" "}
                  {files.length} files processed
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold gradient-text">
                  {files.length > 0
                    ? Math.round(
                        (files.filter((f) => f.status === "completed").length /
                          files.length) *
                          100
                      )
                    : 0}
                  %
                </div>
                <p className="text-xs text-muted-foreground">Complete</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {files.map((file) => {
                const FileIcon = getFileIcon(file.type);

                return (
                  <div
                    key={file.id}
                    className="group flex items-center gap-4 p-4 rounded-xl bg-muted/20 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="flex-shrink-0">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 group-hover:from-primary/40 group-hover:to-primary/20 transition-all">
                        <FileIcon className="h-5 w-5 text-primary" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold truncate text-foreground">
                          {file.name}
                        </p>
                        <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                          {formatFileSize(file.size)}
                        </span>
                      </div>

                      {file.status === "uploading" && (
                        <div className="space-y-2">
                          <Progress
                            value={file.progress}
                            className="h-2 bg-muted"
                          />
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">
                              Uploading...
                            </p>
                            <p className="text-xs font-semibold text-primary">
                              {Math.round(file.progress)}%
                            </p>
                          </div>
                        </div>
                      )}

                      {file.status === "processing" && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                            <p className="text-xs text-muted-foreground">
                              Processing document...
                            </p>
                          </div>
                          <Progress
                            value={60}
                            className="h-2 bg-muted animate-pulse"
                          />
                        </div>
                      )}

                      {file.status === "completed" && file.uploadResponse && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <p className="text-xs text-green-600 font-medium">
                              Successfully processed
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {file.uploadResponse.message}
                          </p>
                        </div>
                      )}

                      {file.status === "error" && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                            <p className="text-xs text-destructive font-medium">
                              Upload failed
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Please try again
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {file.status === "completed" && (
                        <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Done
                        </Badge>
                      )}
                      {file.status === "error" && (
                        <Badge className="bg-destructive/20 text-destructive border-destructive/30">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Failed
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="h-8 w-8 p-0 hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Stats */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            className="glass-card border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 animate-slide-in-up group"
            style={{ animationDelay: "0.3s" }}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground font-medium mb-2">
                    Total Documents
                  </p>
                  <div className="text-4xl font-bold gradient-text">
                    {files.filter((f) => f.status === "completed").length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Successfully uploaded
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-accent/20 group-hover:bg-accent/30 transition-colors">
                  <FileText className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="glass-card border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 animate-slide-in-up group"
            style={{ animationDelay: "0.4s" }}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground font-medium mb-2">
                    Currently Processing
                  </p>
                  <div className="text-4xl font-bold text-primary">
                    {
                      files.filter(
                        (f) =>
                          f.status === "uploading" || f.status === "processing"
                      ).length
                    }
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Files in queue
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="glass-card border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 animate-slide-in-up group"
            style={{ animationDelay: "0.5s" }}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground font-medium mb-2">
                    Success Rate
                  </p>
                  <div className="text-4xl font-bold text-accent">
                    {files.length > 0
                      ? Math.round(
                          (files.filter((f) => f.status === "completed")
                            .length /
                            files.length) *
                            100
                        )
                      : 0}
                    <span className="text-xl">%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Upload reliability
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-accent/20 group-hover:bg-accent/30 transition-colors">
                  <CheckCircle className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
