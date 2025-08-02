import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
  Target
} from "lucide-react";

interface Question {
  id: string;
  text: string;
}

export const QueryInterface = () => {
  const [questions, setQuestions] = useState<Question[]>([
    { id: '1', text: '' }
  ]);
  const [domain, setDomain] = useState<string>('');
  const [chunkSize, setChunkSize] = useState('1000');
  const [overlap, setOverlap] = useState('200');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [semanticSearch, setSemanticSearch] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      text: ''
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const updateQuestion = (id: string, text: string) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, text } : q));
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
    }, 3000);
  };

  const domains = [
    { value: 'insurance', label: 'Insurance' },
    { value: 'legal', label: 'Legal' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'compliance', label: 'Compliance' },
    { value: 'finance', label: 'Finance' },
    { value: 'general', label: 'General' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Document Query
          </CardTitle>
          <CardDescription>
            Ask intelligent questions about your document knowledge base
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Query Interface */}
        <div className="lg:col-span-2 space-y-6">
          {/* Questions Section */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Your Questions
              </CardTitle>
              <CardDescription>
                Ask multiple questions to get comprehensive insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {questions.map((question, index) => (
                <div key={question.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`question-${question.id}`} className="text-sm font-medium">
                      Question {index + 1}
                    </Label>
                    {questions.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(question.id)}
                        className="h-8 w-8 p-0 hover:bg-destructive/20"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Textarea
                    id={`question-${question.id}`}
                    placeholder="What would you like to know about your documents?"
                    value={question.text}
                    onChange={(e) => updateQuestion(question.id, e.target.value)}
                    className="min-h-[80px] bg-muted/30 border-border focus:border-primary/50 transition-all"
                  />
                </div>
              ))}
              
              <Button
                variant="outline"
                onClick={addQuestion}
                className="w-full border-dashed border-border hover:border-primary/50 hover:bg-primary/10"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Another Question
              </Button>
            </CardContent>
          </Card>

          {/* Domain Selection */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-accent" />
                Domain Context
              </CardTitle>
              <CardDescription>
                Select your industry domain for specialized analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={domain} onValueChange={setDomain}>
                <SelectTrigger className="w-full bg-muted/30 border-border">
                  <SelectValue placeholder="Select your domain" />
                </SelectTrigger>
                <SelectContent className="glass-card">
                  {domains.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Submit Section */}
          <Card className="glass-card">
            <CardContent className="p-6">
              <Button 
                onClick={handleSubmit}
                disabled={isProcessing || questions.every(q => !q.text.trim())}
                className="w-full btn-gradient h-12 text-lg"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Processing Questions...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Analyze Documents
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Advanced Options */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-muted-foreground" />
                Advanced Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                <AccordionItem value="processing" className="border-border">
                  <AccordionTrigger className="text-sm">Processing Settings</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="chunk-size" className="text-xs">Chunk Size</Label>
                      <Select value={chunkSize} onValueChange={setChunkSize}>
                        <SelectTrigger id="chunk-size" className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="500">500 tokens</SelectItem>
                          <SelectItem value="1000">1000 tokens</SelectItem>
                          <SelectItem value="1500">1500 tokens</SelectItem>
                          <SelectItem value="2000">2000 tokens</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="overlap" className="text-xs">Overlap Size</Label>
                      <Select value={overlap} onValueChange={setOverlap}>
                        <SelectTrigger id="overlap" className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="100">100 tokens</SelectItem>
                          <SelectItem value="200">200 tokens</SelectItem>
                          <SelectItem value="300">300 tokens</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="features" className="border-border">
                  <AccordionTrigger className="text-sm">Feature Toggles</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="metadata" className="text-xs">Include Metadata</Label>
                      <Switch
                        id="metadata"
                        checked={includeMetadata}
                        onCheckedChange={setIncludeMetadata}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="semantic" className="text-xs">Semantic Search</Label>
                      <Switch
                        id="semantic"
                        checked={semanticSearch}
                        onCheckedChange={setSemanticSearch}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-sm">Quick Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Badge variant="outline" className="w-full justify-start text-xs py-1">
                  💡 Be specific in your questions
                </Badge>
                <Badge variant="outline" className="w-full justify-start text-xs py-1">
                  🎯 Use domain context for better results
                </Badge>
                <Badge variant="outline" className="w-full justify-start text-xs py-1">
                  📋 Ask multiple related questions
                </Badge>
                <Badge variant="outline" className="w-full justify-start text-xs py-1">
                  ⚙️ Adjust settings for complex docs
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Recent Queries */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-sm">Recent Queries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
                  What are the key risk factors mentioned?
                </div>
                <div className="p-2 rounded bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
                  Summarize compliance requirements
                </div>
                <div className="p-2 rounded bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
                  Extract financial data points
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};