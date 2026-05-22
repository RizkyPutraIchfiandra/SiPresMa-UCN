"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-full"
    >
      <LogOut className="h-4 w-4" />
      <span className="hidden sm:inline">Keluar</span>
    </Button>
  );
}