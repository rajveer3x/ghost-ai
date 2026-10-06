"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { CANVAS_TEMPLATES, CanvasTemplate } from "./starter-templates";

interface StarterTemplatesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (template: CanvasTemplate) => void;
}

function TemplatePreview({ template }: { template: CanvasTemplate }) {
  if (template.nodes.length === 0) return null;

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  template.nodes.forEach(n => {
    if (n.position.x < minX) minX = n.position.x;
    if (n.position.y < minY) minY = n.position.y;
    if (n.position.x + 150 > maxX) maxX = n.position.x + 150;
    if (n.position.y + 50 > maxY) maxY = n.position.y + 50;
  });

  const padding = 30;
  const width = maxX - minX + padding * 2;
  const height = maxY - minY + padding * 2;

  const viewBox = `${minX - padding} ${minY - padding} ${width} ${height}`;

  return (
    <svg viewBox={viewBox} className="w-full h-full object-contain">
      {template.edges.map(e => {
        const source = template.nodes.find(n => n.id === e.source);
        const target = template.nodes.find(n => n.id === e.target);
        if (!source || !target) return null;
        
        const x1 = source.position.x + 75;
        const y1 = source.position.y + 25;
        const x2 = target.position.x + 75;
        const y2 = target.position.y + 25;
        
        return (
      <line key={e.id} x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-border" strokeWidth={2} />
        );
      })}
      
      {template.nodes.map(n => {
        const w = 150;
        const h = 50;
        const x = n.position.x;
        const y = n.position.y;
        const fill = String(n.data.color) || "#1F1F1F";
        const shape = String(n.data.shape) || "rectangle";
        
        let shapeElem;
        if (shape === "circle") {
          shapeElem = <ellipse cx={x + w/2} cy={y + h/2} rx={w/2} ry={h/2} fill={fill} className="stroke-border" />;
        } else if (shape === "diamond") {
          const pts = `${x + w/2},${y} ${x + w},${y + h/2} ${x + w/2},${y + h} ${x},${y + h/2}`;
          shapeElem = <polygon points={pts} fill={fill} className="stroke-border" />;
        } else if (shape === "hexagon") {
          const q = w * 0.15;
          const pts = `${x + q},${y} ${x + w - q},${y} ${x + w},${y + h/2} ${x + w - q},${y + h} ${x + q},${y + h} ${x},${y + h/2}`;
          shapeElem = <polygon points={pts} fill={fill} className="stroke-border" />;
        } else if (shape === "pill") {
          shapeElem = <rect x={x} y={y} width={w} height={h} rx={h/2} fill={fill} className="stroke-border" />;
        } else if (shape === "cylinder") {
          const ry = 8;
          shapeElem = (
            <g>
              <rect x={x} y={y + ry} width={w} height={h - ry*2} fill={fill} strokeWidth={0} />
              <path d={`M ${x},${y + ry} v ${h - ry*2} a ${w/2},${ry} 0 0,0 ${w},0 v -${h - ry*2} z`} fill={fill} className="stroke-border" />
              <ellipse cx={x + w/2} cy={y + ry} rx={w/2} ry={ry} fill={fill} className="stroke-border" />
            </g>
          );
        } else {
          shapeElem = <rect x={x} y={y} width={w} height={h} rx={4} fill={fill} className="stroke-border" />;
        }

        return (
          <g key={n.id}>
            {shapeElem}
          </g>
        );
      })}
    </svg>
  );
}

export function StarterTemplatesModal({ open, onOpenChange, onImport }: StarterTemplatesModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-5xl lg:max-w-[1100px] max-h-[90vh] flex flex-col p-0 rounded-3xl bg-[#18181c]/95 backdrop-blur-xl border-zinc-800 text-zinc-100 shadow-2xl">
        <DialogHeader className="p-8 pb-4">
          <DialogTitle className="text-2xl text-zinc-100 font-semibold tracking-tight">Import Template</DialogTitle>
          <p className="text-base text-zinc-400 mt-2">
            Choose a starter template to pre-populate your canvas. Any existing nodes will be replaced — use ⌘Z to undo.
          </p>
        </DialogHeader>
        <ScrollArea className="flex-1 p-8 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CANVAS_TEMPLATES.map(template => (
              <div key={template.id} className="group flex flex-col bg-black/20 border border-zinc-800/50 rounded-2xl overflow-hidden hover:border-[#00c8d4]/50 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-[#00c8d4]/5">
                <div className="h-64 border-b border-zinc-800/50 p-6 bg-[#080809] flex items-center justify-center relative overflow-hidden">
                  {/* Subtle grid background */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-50"></div>
                  <div className="relative z-10 w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                    <TemplatePreview template={template} />
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-semibold text-zinc-100 text-lg mb-2 tracking-tight">{template.name}</h3>
                  <p className="text-sm text-zinc-400 flex-1 mb-6 leading-relaxed">{template.description}</p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      onImport(template);
                      onOpenChange(false);
                    }}
                    className="w-full font-medium border-zinc-700/50 bg-[#111114] text-zinc-300 hover:bg-[#00c8d4] hover:text-black hover:border-[#00c8d4] dark:hover:bg-[#00c8d4] dark:hover:text-black dark:hover:border-[#00c8d4] transition-all rounded-xl"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
