"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Copy, Loader2, UserMinus } from "lucide-react";

interface Collaborator {
  id: string;
  email: string;
  displayName: string | null;
  avatarImage: string | null;
}

interface ShareDialogProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
  isOwner: boolean;
}

export function ShareDialog({ projectId, isOpen, onClose, isOwner }: ShareDialogProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchCollaborators = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`);
      if (res.ok) {
        const data = await res.json();
        setCollaborators(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchCollaborators();
    }
  }, [isOpen, fetchCollaborators]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    setInviting(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail }),
      });

      if (res.ok) {
        const newCollab = await res.json();
        setCollaborators((prev) => [...prev, newCollab]);
        setInviteEmail("");
      } else {
        const text = await res.text();
        alert(text);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators/${id}`, {
        method: "DELETE",
      });
      if (res.ok || res.status === 204) {
        setCollaborators((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Project</DialogTitle>
          <DialogDescription>
            {isOwner ? "Invite others to collaborate on this project." : "View project collaborators."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center gap-2">
            <Input
              readOnly
              value={typeof window !== "undefined" ? window.location.href : ""}
              className="flex-1 text-sm"
            />
            <Button size="icon" variant="outline" onClick={handleCopyLink} className="shrink-0">
              {copied ? <span className="text-xs">Copied!</span> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          {isOwner && (
            <form onSubmit={handleInvite} className="flex items-center gap-2">
              <Input
                placeholder="Email address..."
                type="email"
                required
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1"
                disabled={inviting}
              />
              <Button type="submit" disabled={inviting}>
                {inviting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Invite
              </Button>
            </form>
          )}

          <div className="flex flex-col gap-3 mt-2">
            <h4 className="text-sm font-medium leading-none">Collaborators</h4>
            {loading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : collaborators.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-2">
                No collaborators yet.
              </p>
            ) : (
              <div className="max-h-[240px] overflow-y-auto pr-2 space-y-3">
                {collaborators.map((c) => (
                  <div key={c.id} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage src={c.avatarImage || undefined} alt={c.displayName || c.email} />
                        <AvatarFallback>{(c.displayName || c.email).charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-medium truncate">
                          {c.displayName || c.email}
                        </span>
                        {c.displayName && (
                          <span className="text-xs text-muted-foreground truncate">{c.email}</span>
                        )}
                      </div>
                    </div>
                    {isOwner && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive h-8 w-8 shrink-0"
                        onClick={() => handleRemove(c.id)}
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

