import { useEffect } from 'react';
import type { FitViewOptions } from '@xyflow/react';

interface UseKeyboardShortcutsProps {
  reactFlowInstance: { 
    zoomIn: (options?: { duration?: number }) => void; 
    zoomOut: (options?: { duration?: number }) => void;
    fitView: (options?: FitViewOptions) => void;
  };
  undo: () => void;
  redo: () => void;
}

export function useKeyboardShortcuts({ reactFlowInstance, undo, redo }: UseKeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input, textarea, or contenteditable
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Check for Zoom Shortcuts
      if (e.key === '+' || e.key === '=') {
        reactFlowInstance.zoomIn({ duration: 200 });
      } else if (e.key === '-') {
        reactFlowInstance.zoomOut({ duration: 200 });
      }

      // Check for Undo/Redo Shortcuts
      const isMac = typeof window !== 'undefined' ? navigator.platform.toUpperCase().indexOf('MAC') >= 0 : false;
      const cmdCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (cmdCtrl) {
        if (e.key.toLowerCase() === 'z') {
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
        } else if (e.key.toLowerCase() === 'y') {
          redo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [undo, redo, reactFlowInstance]);
}
