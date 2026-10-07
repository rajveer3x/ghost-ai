import { useState, useEffect, useCallback } from "react";
import { Bot, X, Send, FileText, Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useBroadcastEvent, useEventListener, useOthers, useSelf } from "@liveblocks/react";
import { useRealtimeRun } from "@trigger.dev/react-hooks";
import { aiStatusFeedSchema, type AiStatusFeedMessage, aiChatFeedSchema, type AiChatFeedMessage } from "@/types/tasks";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from 'react-markdown';

interface AiSidebarProps {
  projectId: string;
  onClose: () => void;
}

export function AiSidebar({ projectId, onClose }: AiSidebarProps) {
  const [messages, setMessages] = useState<AiChatFeedMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [statusFeed, setStatusFeed] = useState<AiStatusFeedMessage | null>(null);
  const [runId, setRunId] = useState<string | null>(null);
  const [publicToken, setPublicToken] = useState<string | null>(null);
  const [isGeneratingSpecState, setIsGeneratingSpecState] = useState(false);
  
  const [specs, setSpecs] = useState<any[]>([]);
  const [loadingSpecs, setLoadingSpecs] = useState(false);
  const [selectedSpec, setSelectedSpec] = useState<any>(null);
  const [specContent, setSpecContent] = useState<string>("");
  const [loadingSpecContent, setLoadingSpecContent] = useState(false);
  const [specError, setSpecError] = useState<string | null>(null);

  const fetchSpecs = useCallback(async () => {
    setLoadingSpecs(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/specs`);
      if (res.ok) {
        const data = await res.json();
        setSpecs(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSpecs(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchSpecs();
  }, [fetchSpecs]);

  const handleViewSpec = async (specId: string) => {
    const spec = specs.find(s => s.id === specId);
    if (!spec) return;
    
    setSelectedSpec(spec);
    setLoadingSpecContent(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/specs/${specId}/download`);
      if (res.ok) {
        const text = await res.text();
        setSpecContent(text);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSpecContent(false);
    }
  };

  const handleDownloadSpec = (specId: string) => {
    window.location.href = `/api/projects/${projectId}/specs/${specId}/download`;
  };

  const broadcast = useBroadcastEvent();
  const others = useOthers();
  const self = useSelf();

  const { run } = useRealtimeRun(runId ?? "", {
    accessToken: publicToken ?? "",
    enabled: !!runId && !!publicToken
  });

  const isGeneratingRun = !!run && !['COMPLETED', 'CANCELED', 'FAILED', 'SYSTEM_FAILURE'].includes(run.status);
  const isGeneratingChat = isGeneratingRun || others.some((other) => other.presence.thinking);
  const isGeneratingSpec = isGeneratingSpecState;

  useEffect(() => {
    if (run && ['COMPLETED', 'CANCELED', 'FAILED', 'SYSTEM_FAILURE'].includes(run.status)) {
      setRunId(null);
      setPublicToken(null);
      if (run.status === 'COMPLETED') {
        fetchSpecs();
      }
    }
  }, [run, fetchSpecs]);

  useEventListener(({ event }) => {
    const e = event as any;
    if (e.type === "ai-chat") {
      const parsed = aiChatFeedSchema.safeParse(e);
      if (parsed.success) {
        setMessages(prev => [...prev, parsed.data]);
      }
    } else if (e.type === "ai-status-feed") {
      const parsed = aiStatusFeedSchema.safeParse(e);
      if (parsed.success) {
        setStatusFeed(parsed.data);
      }
    }
  });

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    // Optimistic UI and Broadcast
    const newMsg: AiChatFeedMessage = { 
      type: "ai-chat",
      sender: self?.info?.name || "User", 
      role: "user", 
      content: text,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, newMsg]);
    broadcast(newMsg);
    setInputValue("");

    try {
      const res = await fetch('/api/ai/design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text, roomId: projectId, projectId })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to start design task');
      }

      if (data.runId && data.publicToken) {
        setRunId(data.runId);
        setPublicToken(data.publicToken);
      }
    } catch (error: any) {
      console.error("Failed to trigger design agent:", error);
      const errorMsg: AiChatFeedMessage = { 
        type: "ai-chat",
        sender: "System",
        role: "system",
        content: `Error: ${error?.message || "I encountered an error starting the design task."}`,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
      broadcast(errorMsg);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputValue);
    }
  };

  return (
    <aside className="h-full w-full bg-[#18181c]/95 backdrop-blur-xl rounded-xl border border-zinc-800 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800/50">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-indigo-500/20 flex items-center justify-center shrink-0">
            <Bot className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold text-zinc-100 text-sm">AI Workspace</h3>
            <p className="text-xs text-zinc-500">Collaborate with Ghost AI</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabs Layout */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <Tabs defaultValue="architect" className="h-full flex flex-col">
          <div className="px-4 pt-4">
            <TabsList className="grid w-full grid-cols-2 bg-zinc-900/80 p-1 border border-zinc-800/50 rounded-lg">
              <TabsTrigger
                value="architect"
                className="text-xs data-[state=active]:bg-[#62C073]/10 data-[state=active]:text-[#62C073] text-zinc-400"
              >
                AI Architect
              </TabsTrigger>
              <TabsTrigger
                value="specs"
                className="text-xs data-[state=active]:bg-[#62C073]/10 data-[state=active]:text-[#62C073] text-zinc-400"
              >
                Specs
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="architect" className="flex-1 overflow-hidden flex flex-col m-0 mt-4 data-[state=active]:flex">
            {/* Scrollable Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col">
              {messages.length === 0 ? (
                <div className="flex flex-col justify-center items-center text-center h-full">
                  <div className="h-12 w-12 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4">
                    <Bot className="h-6 w-6 text-indigo-400" />
                  </div>
                  <p className="text-sm text-zinc-300 mb-6 max-w-[200px]">
                    I can help you design architectures, solve problems, or generate specs.
                  </p>
                  
                  <div className="flex flex-col gap-2 w-full">
                    {[
                      "Design an e-commerce backend",
                      "Create a chat app architecture",
                      "Build a CI/CD pipeline"
                    ].map((prompt) => (
                      <button 
                        key={prompt}
                        onClick={() => handleSend(prompt)}
                        className="text-xs py-2 px-3 rounded-full bg-zinc-800/50 text-[#62C073] border border-zinc-700/50 hover:bg-zinc-800 transition-colors text-left w-full"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {messages.map((msg, i) => {
                    const isUser = msg.role === 'user';
                    return (
                      <div 
                        key={i} 
                        className={`flex flex-col w-full ${isUser ? 'items-end' : 'items-start'}`}
                      >
                        <div className="text-[10px] text-zinc-500 mb-1 px-1 flex gap-2">
                          <span>{msg.sender}</span>
                          <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className={`max-w-[85%] rounded-xl p-3 text-sm ${
                          isUser 
                            ? 'bg-[#62C073] text-black rounded-tr-sm' 
                            : 'bg-[#18181c] border border-zinc-800 text-zinc-100 rounded-tl-sm'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex flex-col border-t border-zinc-800/50 bg-black/20">
              {isGeneratingChat && (
                <div className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900/80 px-4 py-2 border-b border-zinc-800/50">
                  <div className="h-2 w-2 rounded-full bg-[#62C073] animate-pulse" />
                  <span>{statusFeed?.text || statusFeed?.status || "AI is working..."}</span>
                </div>
              )}
              <div className="p-4">
                <div className="relative">
                  <Textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isGeneratingChat}
                    placeholder={isGeneratingChat ? "AI is thinking..." : "Ask AI Architect..."}
                    className="min-h-[72px] max-h-[160px] resize-none pr-12 bg-zinc-900/50 border-zinc-800 focus-visible:ring-1 focus-visible:ring-zinc-700 text-sm py-3 disabled:opacity-50"
                  />
                  <Button
                    size="icon"
                    onClick={() => handleSend(inputValue)}
                    disabled={!inputValue.trim() || isGeneratingChat}
                    className={`absolute right-2 bottom-2 h-8 w-8 rounded-lg disabled:opacity-50 ${isGeneratingChat || !inputValue.trim() ? 'bg-zinc-800 text-zinc-500' : 'bg-[#62C073] hover:bg-[#62C073]/90 text-black'}`}
                  >
                    {isGeneratingChat ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="text-[10px] text-zinc-500 mt-2 text-center">
                  <kbd className="font-sans px-1 py-0.5 bg-zinc-800 rounded border border-zinc-700">Enter</kbd> to send, <kbd className="font-sans px-1 py-0.5 bg-zinc-800 rounded border border-zinc-700">Shift</kbd> + <kbd className="font-sans px-1 py-0.5 bg-zinc-800 rounded border border-zinc-700">Enter</kbd> for new line
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="specs" className="flex-1 overflow-y-auto p-4 m-0 mt-4 data-[state=active]:block">
            <div className="flex flex-col gap-4">
              <Button 
                className="w-full bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-black font-semibold h-10" 
                disabled={isGeneratingSpec}
                onClick={async () => {
                  const { getNodes, getEdges } = (window as any).reactFlowInstance || { getNodes: () => [], getEdges: () => [] };
                  setIsGeneratingSpecState(true);
                  setSpecError(null);
                  try {
                    const res = await fetch('/api/ai/spec', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ roomId: projectId, projectId, chatHistory: messages, nodes: getNodes(), edges: getEdges() })
                    });
                    if (res.ok) {
                      await fetchSpecs();
                    } else {
                      const err = await res.text();
                      console.error('Failed to generate spec:', err);
                      setSpecError(err || 'Failed to generate spec');
                    }
                  } catch (e: any) {
                    console.error('Error generating spec:', e);
                    setSpecError(e.message || 'An unexpected error occurred');
                  } finally {
                    setIsGeneratingSpecState(false);
                  }
                }}
              >
                {isGeneratingSpec ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isGeneratingSpec ? "Generating..." : "Generate Spec"}
              </Button>
              
              {specError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg whitespace-pre-wrap">
                  {specError}
                </div>
              )}

              {loadingSpecs ? (
                <div className="text-sm text-zinc-500 text-center py-4">Loading specs...</div>
              ) : specs.length === 0 ? (
                <div className="text-sm text-zinc-500 text-center py-4">No specs generated yet.</div>
              ) : (
                specs.map((spec) => (
                  <div key={spec.id} className="rounded-lg border border-zinc-800 bg-[#18181c] p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-zinc-400" />
                      <span className="font-medium text-sm text-zinc-200 truncate">
                        spec-{spec.id.substring(0, 8)}.md
                      </span>
                    </div>
                    <div className="text-xs text-zinc-500">
                      {new Date(spec.createdAt).toLocaleString()}
                    </div>
                    <div className="flex gap-2 mt-1">
                      <Dialog open={selectedSpec?.id === spec.id} onOpenChange={(open) => {
                        if (open) handleViewSpec(spec.id);
                        else setSelectedSpec(null);
                      }}>
                        <DialogTrigger 
                          render={<Button variant="outline" size="sm" className="flex-1 border-zinc-700 text-zinc-400 hover:text-zinc-200">Preview</Button>}
                        />
                        <DialogContent className="w-[95vw] max-w-4xl max-h-[85vh] h-[85vh] flex flex-col bg-[#0d0d0f] border-zinc-800/80 text-zinc-100 rounded-2xl p-0 overflow-hidden shadow-2xl">
                          <DialogHeader className="px-6 py-4 border-b border-zinc-800/60 bg-[#141417] flex flex-row items-center justify-between sticky top-0 z-10 shrink-0 m-0">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                                <FileText className="h-5 w-5 text-indigo-400" />
                              </div>
                              <div className="flex flex-col items-start gap-0.5">
                                <DialogTitle className="text-base font-semibold text-zinc-100 leading-tight">
                                  Technical Specification
                                </DialogTitle>
                                <span className="text-xs text-zinc-500 font-medium">
                                  spec-{spec.id.substring(0, 8)}.md
                                </span>
                              </div>
                            </div>
                            <Button 
                              onClick={() => handleDownloadSpec(spec.id)} 
                              size="sm"
                              className="bg-zinc-100 hover:bg-white text-zinc-900 shadow-sm font-medium gap-2 hidden sm:flex h-9 rounded-lg px-4"
                            >
                              <Download className="h-4 w-4" />
                              Download Markdown
                            </Button>
                          </DialogHeader>
                          
                          <div className="flex-1 overflow-hidden relative bg-[#0d0d0f]">
                            {loadingSpecContent ? (
                              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d0d0f]/80 backdrop-blur-sm z-10 gap-4">
                                <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
                                <p className="text-sm text-zinc-400 font-medium animate-pulse">Reading specification...</p>
                              </div>
                            ) : null}
                            
                            <ScrollArea className="h-full w-full">
                              <div className="mx-auto max-w-3xl p-6 sm:p-10 pb-20">
                                <div className="prose prose-invert max-w-none prose-zinc 
                                  prose-headings:text-zinc-100 prose-headings:font-semibold tracking-tight
                                  prose-h1:text-3xl prose-h1:mb-8 prose-h1:border-b prose-h1:border-zinc-800/60 prose-h1:pb-4
                                  prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                                  prose-h3:text-xl prose-h3:mt-8
                                  prose-p:text-zinc-300 prose-p:leading-relaxed
                                  prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline
                                  prose-strong:text-zinc-100 prose-strong:font-semibold
                                  prose-code:text-[#62C073] prose-code:bg-[#62C073]/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none prose-code:font-medium
                                  prose-pre:bg-[#141417] prose-pre:border prose-pre:border-zinc-800/60 prose-pre:shadow-sm prose-pre:rounded-xl prose-pre:p-4
                                  prose-blockquote:border-l-indigo-500 prose-blockquote:bg-indigo-500/5 prose-blockquote:py-2 prose-blockquote:px-5 prose-blockquote:not-italic prose-blockquote:rounded-r-xl prose-blockquote:text-zinc-300
                                  prose-ul:text-zinc-300 prose-li:marker:text-zinc-600 prose-ul:my-6
                                  prose-table:border-collapse prose-th:border-b prose-th:border-zinc-800 prose-th:py-3 prose-th:text-left prose-td:border-b prose-td:border-zinc-800/50 prose-td:py-3
                                  prose-hr:border-zinc-800/60 prose-hr:my-8
                                ">
                                  <ReactMarkdown>{specContent}</ReactMarkdown>
                                </div>
                              </div>
                            </ScrollArea>
                          </div>
                          
                          {/* Mobile fallback download button */}
                          <div className="sm:hidden p-4 border-t border-zinc-800/60 bg-[#141417] shrink-0">
                            <Button 
                              onClick={() => handleDownloadSpec(spec.id)} 
                              className="w-full bg-zinc-100 hover:bg-white text-zinc-900 gap-2 h-10 rounded-lg font-medium"
                            >
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="sm" onClick={() => handleDownloadSpec(spec.id)} className="flex-1 border-zinc-700 text-zinc-400 hover:text-zinc-200">
                        Download
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </aside>
  );
}
