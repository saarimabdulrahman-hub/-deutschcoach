"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TabBar } from "@/components/ui/TabBar";
import { CommandBar } from "@deutschcoach/shared/ui/CommandBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [commandOpen, setCommandOpen] = useState(false);

  // Ctrl+K keyboard shortcut for command bar
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isLoading && !user) router.push("/");
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-zinc-50">
      <TabBar onOpenCommand={() => setCommandOpen(true)} />
      <main className="max-w-6xl mx-auto p-4 md:p-6 pb-20 md:pb-6">{children}</main>
      <CommandBar
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
      />
    </div>
  );
}
