import { useState } from "react";
import { Bot, X, Send, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

interface AiSidebarProps {
  onClose: () => void;
}

export function AiSidebar({ onClose }: AiSidebarProps) {
  const [messages, setMessages] = useState<{role: "user" | "assistant", content: string}[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: "user", content: text }]);
    setInputValue("");
    // Mock assistant response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "assistant", content: "I'm a placeholder bot. I can't really do much yet!" }]);
    }, 500);
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
                className="text-xs data-[state=active]:bg-[#00D4FF]/10 data-[state=active]:text-[#00D4FF] text-zinc-400"
              >
                AI Architect
              </TabsTrigger>
              <TabsTrigger
                value="specs"
                className="text-xs data-[state=active]:bg-[#00D4FF]/10 data-[state=active]:text-[#00D4FF] text-zinc-400"
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
                        className="text-xs py-2 px-3 rounded-full bg-zinc-800/50 text-[#00D4FF] border border-zinc-700/50 hover:bg-zinc-800 transition-colors text-left w-full"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {messages.map((msg, i) => (
                    <div 
                      key={i} 
                      className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] rounded-xl p-3 text-sm ${
                        msg.role === 'user' 
                          ? 'bg-[#00D4FF]/10 border-[#00D4FF]/50 border-2 text-zinc-100 rounded-tr-sm' 
                          : 'bg-[#18181c] border border-zinc-800 text-indigo-400 rounded-tl-sm'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-zinc-800/50 bg-[#141415]">
              <div className="relative">
                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask AI Architect..."
                  className="min-h-[72px] max-h-[160px] resize-none pr-12 bg-zinc-900/50 border-zinc-800 focus-visible:ring-1 focus-visible:ring-zinc-700 text-sm py-3"
                />
                <Button
                  size="icon"
                  onClick={() => handleSend(inputValue)}
                  disabled={!inputValue.trim()}
                  className="absolute right-2 bottom-2 h-8 w-8 bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-black rounded-lg disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-[10px] text-zinc-500 mt-2 text-center">
                <kbd className="font-sans px-1 py-0.5 bg-zinc-800 rounded border border-zinc-700">Enter</kbd> to send, <kbd className="font-sans px-1 py-0.5 bg-zinc-800 rounded border border-zinc-700">Shift</kbd> + <kbd className="font-sans px-1 py-0.5 bg-zinc-800 rounded border border-zinc-700">Enter</kbd> for new line
              </div>
            </div>
          </TabsContent>

          <TabsContent value="specs" className="flex-1 overflow-y-auto p-4 m-0 mt-4 data-[state=active]:block">
            <div className="flex flex-col gap-4">
              <Button className="w-full bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-black font-semibold h-10">
                Generate Spec
              </Button>
              
              <div className="rounded-lg border border-zinc-800 bg-[#18181c] p-4 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-zinc-400" />
                  <span className="font-medium text-sm text-zinc-200">System Architecture Spec</span>
                </div>
                <div className="text-xs text-zinc-500 bg-zinc-900/50 p-2 rounded border border-zinc-800/50 font-mono whitespace-pre-line">
                  {`# Architecture Document
                  ## Components
                  - Next.js Frontend
                  - Liveblocks WebSocket...`}
                </div>
                <Button variant="outline" size="sm" disabled className="w-full border-zinc-700 text-zinc-400 mt-1">
                  Download Markdown
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </aside>
  );
}
