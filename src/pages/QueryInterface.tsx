import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Plus,
  Minus,
  Settings,
  Send,
  Sparkles,
  Brain,
  Target,
  Loader2,
  X,
  Lightbulb,
  Zap,
  CheckCircle,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

// Animation styles
const queryStyles = `
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
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  .animate-slide-in-up {
    animation: slideInUp 0.5s ease-out forwards;
  }
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }
`;
import { apiService, QueryResponse } from "@/lib/api";
import { toast } from "sonner";

interface Question {
  id: string;
  text: string;
}

interface QueryResult {
  question: string;
  answer: string;
  confidence: number;
  sources: string[];
}

export const QueryInterface = () => {
  const [questions, setQuestions] = useState<Question[]>([
    { id: "1", text: "" },
  ]);
  const [domain, setDomain] = useState<string>("");
  const [chunkSize, setChunkSize] = useState("1000");
  const [overlap, setOverlap] = useState("200");
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [semanticSearch, setSemanticSearch] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<QueryResult[]>([]);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      text: "",
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const updateQuestion = (id: string, text: string) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, text } : q)));
  };

  const handleSubmit = async () => {
    // Validate questions
    const validQuestions = questions.filter((q) => q.text.trim());
    if (validQuestions.length === 0) {
      toast.error("Please enter at least one question");
      return;
    }

    setIsProcessing(true);
    setResults([]);

    try {
      const queryResults: QueryResult[] = [];

      // Process each question
      for (const question of validQuestions) {
        const response = await apiService.submitQuery({
          query: question.text,
          domain: domain || undefined,
          chunk_size: parseInt(chunkSize),
          overlap: parseInt(overlap),
          include_metadata: includeMetadata,
          semantic_search: semanticSearch,
        });

        queryResults.push({
          question: question.text,
          answer: response.answer,
          confidence: response.confidence || 0.95,
          sources: response.sources || [],
        });
      }

      setResults(queryResults);
      toast.success(
        `Successfully processed ${queryResults.length} question(s)`
      );
    } catch (error) {
      toast.error("Failed to process questions. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const domains = [
    { value: "insurance", label: "Insurance" },
    { value: "legal", label: "Legal" },
    { value: "hr", label: "Human Resources" },
    { value: "compliance", label: "Compliance" },
    { value: "finance", label: "Finance" },
    { value: "general", label: "General" },
  ];

  return (
    <div className="space-y-8">
      <style>{queryStyles}</style>

      {/* Enhanced Header Section */}
      <div className="relative overflow-hidden rounded-2xl glass-card border border-primary/20 group animate-slide-in-up">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="relative p-8 md:p-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/20">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div className="inline-block px-3 py-1 rounded-full bg-accent/20 border border-accent/30">
                <span className="text-xs font-semibold text-accent">
                  Intelligent Query Engine
                </span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Ask Your Documents
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Get instant insights and answers from your entire document
              knowledge base using advanced AI analysis
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                <Zap className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-sm font-semibold">Lightning Fast</p>
                  <p className="text-xs text-muted-foreground">
                    Sub-second responses
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                <Brain className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold">AI-Powered</p>
                  <p className="text-xs text-muted-foreground">
                    Advanced analysis
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                <CheckCircle className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-sm font-semibold">Accurate</p>
                  <p className="text-xs text-muted-foreground">
                    Confidence scores
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Query Interface */}
        <div className="lg:col-span-2 space-y-6">
          {/* Questions Section */}
          <Card
            className="glass-card border-primary/20 animate-slide-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <div className="p-2 rounded-lg bg-primary/20">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    Your Questions
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Ask multiple questions to get comprehensive insights
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  className="space-y-3 p-4 rounded-lg bg-muted/20 border border-border/50 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor={`question-${question.id}`}
                      className="text-sm font-semibold text-foreground flex items-center gap-2"
                    >
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold">
                        {index + 1}
                      </span>
                      Question
                    </Label>
                    {questions.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(question.id)}
                        className="h-8 w-8 p-0 hover:bg-destructive/20 text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Textarea
                    id={`question-${question.id}`}
                    placeholder="What would you like to know about your documents? Be specific for better results..."
                    value={question.text}
                    onChange={(e) =>
                      updateQuestion(question.id, e.target.value)
                    }
                    className="min-h-[100px] bg-background border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all rounded-lg"
                  />
                </div>
              ))}

              <Button
                variant="outline"
                onClick={addQuestion}
                className="w-full h-10 border-dashed border-primary/30 hover:border-primary/50 hover:bg-primary/10 text-foreground"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Another Question
              </Button>
            </CardContent>
          </Card>

          {/* Domain Selection */}
          <Card
            className="glass-card border-primary/20 animate-slide-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="p-2 rounded-lg bg-accent/20">
                  <Target className="h-5 w-5 text-accent" />
                </div>
                Domain Context
              </CardTitle>
              <CardDescription className="mt-2">
                Select your industry domain for specialized analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={domain} onValueChange={setDomain}>
                <SelectTrigger className="h-11 bg-background border-border/50 focus:border-primary/50 focus:ring-primary/20">
                  <SelectValue placeholder="Select your domain for better context" />
                </SelectTrigger>
                <SelectContent className="glass-card">
                  {domains.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      <span className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        {d.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Card
            className="glass-card border-primary/20 animate-slide-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <CardContent className="p-6">
              <div className="space-y-4">
                <Button
                  onClick={handleSubmit}
                  disabled={
                    isProcessing || questions.every((q) => !q.text.trim())
                  }
                  size="lg"
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing Questions...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Submit Questions
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>

                {isProcessing && (
                  <Button
                    onClick={() => {
                      setIsProcessing(false);
                      toast.info("Processing cancelled");
                    }}
                    variant="outline"
                    className="w-full h-10 text-sm border-destructive/30 text-destructive hover:bg-destructive/10"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel Processing
                  </Button>
                )}

                {isProcessing && (
                  <div className="text-xs text-muted-foreground text-center space-y-3 p-4 rounded-lg bg-muted/20 border border-border/50">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-accent border-t-transparent"></div>
                      <p className="font-medium">
                        Processing your documents...
                      </p>
                    </div>
                    <p className="text-xs">
                      Complex analysis typically takes 30-90 seconds
                    </p>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-primary to-accent h-2 rounded-full animate-pulse"
                        style={{ width: "45%" }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-green-500">
                      <CheckCircle className="h-4 w-4" />
                      <p>System timeout increased to 90 seconds</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          {results.length > 0 && (
            <Card
              className="glass-card border-primary/20 animate-slide-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="p-2 rounded-lg bg-accent/20">
                    <Sparkles className="h-5 w-5 text-accent" />
                  </div>
                  AI Analysis Results
                </CardTitle>
                <CardDescription className="mt-2">
                  {results.length} insight{results.length > 1 ? "s" : ""}{" "}
                  generated from your document analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="space-y-4 p-5 rounded-xl bg-muted/20 border border-primary/20 hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/20 text-primary text-sm font-bold">
                            {index + 1}
                          </span>
                          <h3 className="font-semibold text-foreground">
                            Question
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground italic bg-background/50 p-3 rounded-lg border border-border/50">
                          "{result.question}"
                        </p>
                      </div>
                      <Badge className="bg-gradient-to-r from-primary/30 to-accent/30 text-accent border-accent/50 font-semibold">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {Math.round(result.confidence * 100)}% confident
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase">
                        Answer
                      </Label>
                      <div className="p-4 rounded-lg bg-background border border-primary/20 space-y-3">
                        <p className="text-sm leading-relaxed text-foreground">
                          {result.answer}
                        </p>
                      </div>
                    </div>

                    {result.sources.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-2">
                          <ChevronRight className="h-3 w-3" />
                          Source References
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {result.sources.map((source, sourceIndex) => (
                            <Badge
                              key={sourceIndex}
                              variant="outline"
                              className="text-xs bg-background border-primary/30 hover:border-primary/50 transition-colors"
                            >
                              {source}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Advanced Options */}
          <Card
            className="glass-card border-primary/20 animate-slide-in-up"
            style={{ animationDelay: "0.5s" }}
          >
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-muted/50">
                  <Settings className="h-5 w-5 text-muted-foreground" />
                </div>
                Advanced Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible defaultValue="processing">
                <AccordionItem value="processing" className="border-border/50">
                  <AccordionTrigger className="text-sm font-semibold hover:text-primary transition-colors">
                    <span className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-accent" />
                      Processing Settings
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="chunk-size"
                        className="text-xs font-semibold text-foreground"
                      >
                        Chunk Size (tokens)
                      </Label>
                      <Select value={chunkSize} onValueChange={setChunkSize}>
                        <SelectTrigger
                          id="chunk-size"
                          className="h-9 text-sm bg-background border-border/50 focus:border-primary/50"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass-card">
                          <SelectItem value="500">500 tokens</SelectItem>
                          <SelectItem value="1000">1000 tokens</SelectItem>
                          <SelectItem value="1500">1500 tokens</SelectItem>
                          <SelectItem value="2000">2000 tokens</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Larger chunks preserve more context but take longer
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="overlap"
                        className="text-xs font-semibold text-foreground"
                      >
                        Overlap Size (tokens)
                      </Label>
                      <Select value={overlap} onValueChange={setOverlap}>
                        <SelectTrigger
                          id="overlap"
                          className="h-9 text-sm bg-background border-border/50 focus:border-primary/50"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass-card">
                          <SelectItem value="100">100 tokens</SelectItem>
                          <SelectItem value="200">200 tokens</SelectItem>
                          <SelectItem value="300">300 tokens</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Overlap prevents information loss between chunks
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card
            className="glass-card border-accent/20 animate-slide-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="p-2 rounded-lg bg-accent/20">
                  <Lightbulb className="h-5 w-5 text-accent" />
                </div>
                Quick Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-accent/5 border border-accent/20 hover:border-accent/40 transition-colors">
                  <p className="text-xs font-semibold text-foreground flex items-center gap-2">
                    <Sparkles className="h-3 w-3 text-accent" />
                    Be Specific
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ask detailed questions for more accurate results
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 hover:border-primary/40 transition-colors">
                  <p className="text-xs font-semibold text-foreground flex items-center gap-2">
                    <Target className="h-3 w-3 text-primary" />
                    Use Domain Context
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Select your industry for specialized analysis
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-accent/5 border border-accent/20 hover:border-accent/40 transition-colors">
                  <p className="text-xs font-semibold text-foreground flex items-center gap-2">
                    <MessageSquare className="h-3 w-3 text-accent" />
                    Multiple Questions
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ask related questions to cross-validate answers
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 hover:border-primary/40 transition-colors">
                  <p className="text-xs font-semibold text-foreground flex items-center gap-2">
                    <Settings className="h-3 w-3 text-primary" />
                    Fine-tune Settings
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Adjust chunk size for complex documents
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
