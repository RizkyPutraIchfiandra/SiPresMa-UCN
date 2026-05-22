"use client";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Loader2, Trash2, Users as UsersIcon, UserX } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";

interface ListedUser {
  id: string;
  nim: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function UsersPage() {
  const qc = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: async (): Promise<ListedUser[]> => {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      return json.data;
    },
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });

  return (
    <div className="space-y-6">
      <div className="animate-fade-in-up">
        <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">
          Users
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Daftar user yang sudah terdaftar wajahnya.
        </p>
      </div>

      <Card className="animate-fade-in-up stagger-1 overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-100">
              <UsersIcon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <CardTitle className="font-display">Registered Users</CardTitle>
              <CardDescription>
                Menghapus user akan menghapus seluruh riwayat absensinya.
              </CardDescription>
            </div>
            {data && (
              <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 sm:inline-flex">
                {data.length} user
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center gap-2 p-6 text-slate-600">
              <Loader2 className="h-4 w-4 animate-spin" /> Memuat data user...
            </div>
          ) : error ? (
            <p className="p-6 text-sm text-red-600">
              Gagal memuat data user.
            </p>
          ) : !data || data.length === 0 ? (
            <div className="flex flex-col items-center gap-3 p-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <UserX className="h-7 w-7" />
              </div>
              <p className="text-sm font-medium text-slate-900">
                Belum ada user terdaftar
              </p>
              <p className="text-xs text-slate-500">
                Arahkan pengguna ke halaman /register untuk mulai mendaftar.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                  <TableHead>NIM</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Terdaftar</TableHead>
                  <TableHead className="w-24" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((u) => (
                  <TableRow key={u.id} className="transition-colors">
                    <TableCell className="font-medium text-slate-900">
                      {u.nim}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-white">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-900">
                          {u.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">{u.email}</TableCell>
                    <TableCell className="text-slate-600">
                      {formatDateTime(u.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm(`Hapus ${u.name}?`)) del.mutate(u.id);
                        }}
                        disabled={del.isPending}
                        className="rounded-full text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}