"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, Loader2, Search, Calendar, Filter, Inbox } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";

interface AttendanceRow {
  id: string;
  userId: string;
  timestamp: string;
  status: "PRESENT" | "LATE";
  confidence: number;
  user: { id: string; nim: string; name: string; email: string };
}

export default function AttendancePage() {
  const [search, setSearch] = React.useState("");
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");

  // Debounced filter that actually drives the query.
  const [filter, setFilter] = React.useState({ search: "", from: "", to: "" });
  React.useEffect(() => {
    const t = setTimeout(() => setFilter({ search, from, to }), 300);
    return () => clearTimeout(t);
  }, [search, from, to]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["attendance", filter],
    queryFn: async (): Promise<AttendanceRow[]> => {
      const params = new URLSearchParams();
      if (filter.search) params.set("search", filter.search);
      if (filter.from) params.set("from", new Date(filter.from).toISOString());
      if (filter.to) params.set("to", new Date(filter.to).toISOString());
      const res = await fetch(`/api/attendance?${params.toString()}`);
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      return json.data;
    },
  });

  function exportCsv() {
    if (!data || data.length === 0) return;
    const header = ["NIM", "Nama", "Email", "Timestamp", "Status", "Confidence"];
    const rows = data.map((r) => [
      r.user.nim,
      r.user.name,
      r.user.email,
      new Date(r.timestamp).toISOString(),
      r.status,
      r.confidence.toFixed(4),
    ]);
    const csv = [header, ...rows]
      .map((r) =>
        r
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="animate-fade-in-up">
        <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">
          Attendance
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Riwayat seluruh absensi yang tercatat di sistem.
        </p>
      </div>

      <Card className="animate-fade-in-up stagger-1 overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 ring-1 ring-inset ring-violet-100">
              <Filter className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="font-display">Filter Data</CardTitle>
              <CardDescription>
                Filter per tanggal atau cari berdasarkan nama / NIM.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 p-6 sm:grid-cols-4">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="search">Pencarian</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="search"
                className="pl-9"
                placeholder="Cari nama atau NIM..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="from">Dari Tanggal</Label>
            <div className="relative">
              <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="from"
                type="date"
                className="pl-9"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="to">Sampai Tanggal</Label>
            <div className="relative">
              <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="to"
                type="date"
                className="pl-9"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="animate-fade-in-up stagger-2 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white">
          <div>
            <CardTitle className="font-display">Records</CardTitle>
            <CardDescription>
              {data ? `${data.length} catatan ditemukan` : "\u2014"}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={exportCsv}
            disabled={!data?.length}
            className="rounded-full"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center gap-2 p-6 text-slate-600">
              <Loader2 className="h-4 w-4 animate-spin" /> Memuat data...
            </div>
          ) : error ? (
            <p className="p-6 text-sm text-red-600">Gagal memuat data absensi.</p>
          ) : !data || data.length === 0 ? (
            <div className="flex flex-col items-center gap-3 p-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Inbox className="h-7 w-7" />
              </div>
              <p className="text-sm font-medium text-slate-900">
                Tidak ada data
              </p>
              <p className="text-xs text-slate-500">
                Coba ubah filter atau periksa rentang tanggal.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                  <TableHead>Waktu</TableHead>
                  <TableHead>NIM</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Confidence</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="text-slate-700">
                      {formatDateTime(r.timestamp)}
                    </TableCell>
                    <TableCell className="font-medium text-slate-900">
                      {r.user.nim}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-white">
                          {r.user.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{r.user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={r.status === "PRESENT" ? "success" : "warning"}
                        className="rounded-full"
                      >
                        {r.status === "PRESENT" ? "Tepat Waktu" : "Terlambat"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all"
                            style={{ width: `${r.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-slate-600">
                          {(r.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
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