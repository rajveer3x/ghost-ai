import { useState, useEffect, useCallback } from "react";
import { Bot, X, Send, FileText, Loader2 } from "lucide-react";
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
  
  const [specs, setSpecs] = useState<any[]>([]);
  const [loadingSpecs, setLoadingSpecs] = useState(false);
  const [selectedSpec, setSelectedSpec] = useState<any>(null);
  const [specContent, setSpecContent] = useState<string>("");
  const [loadingSpecContent, setLoadingSpecContent] = useState(false);

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

  const isGenerating = (!!run && !['COMPLETED', 'CANCELED', 'FAILED', 'SYSTEM_FAILURE'].includes(run.status)) || others.some((other) => other.presence.thinking);

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
      if (data.runId && data.publicToken) {
        setRunId(data.runId);
        setPublicToken(data.publicToken);
      }
    } catch (error) {
      console.error("Failed to trigger design agent:", error);
      const errorMsg: AiChatFeedMessage = { 
        type: "ai-chat",
        sender: "System",
        role: "system",
        content: "Sorry, I encountered an error starting the design task.",
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
    <aside className="h-full w-full bg-[#141415]/95 backdrop-blur-md rounded-xl border border-zinc-800 flex flex-col overflow-hidden">
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

            {/* Input Area */}
            <div className="flex flex-col border-t border-zinc-800/50 bg-[#141415]">
              {isGenerating && (
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
                    disabled={isGenerating}
                    placeholder={isGenerating ? "AI is thinking..." : "Ask AI Architect..."}
                    className="min-h-[72px] max-h-[160px] resize-none pr-12 bg-zinc-900/50 border-zinc-800 focus-visible:ring-1 focus-visible:ring-zinc-700 text-sm py-3 disabled:opacity-50"
                  />
                  <Button
                    size="icon"
                    onClick={() => handleSend(inputValue)}
                    disabled={!inputValue.trim() || isGenerating}
                    className={`absolute right-2 bottom-2 h-8 w-8 rounded-lg disabled:opacity-50 ${isGenerating || !inputValue.trim() ? 'bg-zinc-800 text-zinc-500' : 'bg-[#62C073] hover:bg-[#62C073]/90 text-black'}`}
                  >
                    {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
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
                disabled={isGenerating}
                onClick={async () => {
                  const { getNodes, getEdges } = (window as any).reactFlowInstance || { getNodes: () => [], getEdges: () => [] };
                  try {
                    const res = await fetch('/api/ai/spec', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ roomId: projectId, projectId, chatHistory: messages, nodes: getNodes(), edges: getEdges() })
                    });
                    const data = await res.json();
                    if (data.runId) {
                      const tokenRes = await fetch('/api/ai/spec/token', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ runId: data.runId })
                      });
                      const tokenData = await tokenRes.json();
                      if (tokenData.token) {
                        setRunId(data.runId);
                        setPublicToken(tokenData.token);
                      }
                    }
                  } catch (e) {
                    console.error(e);
                  }
                }}
              >
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isGenerating ? "Generating..." : "Generate Spec"}
              </Button>

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
                        <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col bg-[#141415] border-zinc-800 text-zinc-100">
                          <DialogHeader>
                            <DialogTitle>spec-{spec.id.substring(0, 8)}.md</DialogTitle>
                          </DialogHeader>
                          <ScrollArea className="flex-1 mt-4 p-4 rounded-md border border-zinc-800 bg-[#18181c]">
                            {loadingSpecContent ? (
                              <div className="flex items-center justify-center p-8">
                                <Loader2 className="h-6 w-6 text-zinc-400 animate-spin" />
                              </div>
                            ) : (
                              <div className="prose prose-invert prose-sm max-w-none">
                                <ReactMarkdown>{specContent}</ReactMarkdown>
                              </div>
                            )}
                          </ScrollArea>
                          <div className="flex justify-end mt-4">
                            <Button onClick={() => handleDownloadSpec(spec.id)} className="bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-black">
                              Download Markdown
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
