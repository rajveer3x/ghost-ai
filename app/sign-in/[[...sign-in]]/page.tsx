import { SignIn } from '@clerk/nextjs';
import { Sparkles, Share2, FileText } from 'lucide-react';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-[#0F1117] text-white border-r border-white/5">
        
        {/* Logo */}
        <div className="flex items-center gap-3 font-medium text-lg">
          <div className="w-6 h-6 bg-[#2CE4D6] rounded-md" />
          <span>Ghost AI</span>
        </div>
        
        {/* Main Content */}
        <div className="max-w-lg mx-auto w-full flex flex-col justify-center flex-1">
          <h1 className="text-4xl font-semibold tracking-tight mb-6 leading-tight">
            Design systems at the<br />speed of thought.
          </h1>
          
          <p className="text-zinc-400 text-[17px] mb-12 max-w-[460px] leading-relaxed">
            Describe your architecture in plain English. Ghost AI maps it to a shared canvas your whole team can refine in real time.
          </p>
          
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-[#2CE4D6]/10 border border-[#2CE4D6]/20 mt-1">
                <Sparkles className="w-5 h-5 text-[#2CE4D6]" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">AI Architecture Generation</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Describe your system, AI maps it to nodes and edges on a live canvas.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-[#2CE4D6]/10 border border-[#2CE4D6]/20 mt-1">
                <Share2 className="w-5 h-5 text-[#2CE4D6]" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Real-time Collaboration</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Live cursors, presence indicators, and shared node editing across your team.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-[#2CE4D6]/10 border border-[#2CE4D6]/20 mt-1">
                <FileText className="w-5 h-5 text-[#2CE4D6]" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Instant Spec Generation</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Export a complete Markdown technical spec directly from the canvas graph.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-zinc-600 text-sm font-medium">
          © 2026 Ghost AI. All rights reserved.
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col justify-center items-center bg-[#0A0A0A] p-4 sm:p-8">
        <SignIn />
      </div>
    </div>
  );
}

