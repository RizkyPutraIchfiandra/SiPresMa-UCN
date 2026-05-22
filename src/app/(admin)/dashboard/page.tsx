"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2, Users, CheckCircle2, TrendingUp, BarChart3 } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { AttendanceChart } from "@/components/dashboard/attendance-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StatsResponse {
  data: {
    totalUsers: number;
    presentToday: number;
    attendanceRate: number;
    last7Days: { date: string; count: number }[];
  };
}

export default function DashboardOverviewPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async (): Promise<StatsResponse["data"]> => {
      const res = await fetch("/api/dashboard/stats");
      if (!res.ok) throw new Error("Failed to load stats");
      const json = (await res.json()) as StatsResponse;
      return json.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-slate-600">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading stats...
      </div>
    );
  }
  if (error || !data) {
    return <p className="text-sm text-red-600">Failed to load stats.</p>;
  }

  return (
    <div className="space-y-8">
      <div className="animate-fade-in-up">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-700">
          Dashboard
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-slate-900">
          Ringkasan{" "}
          <span className="font-serif-display italic text-teal-700">
            Hari Ini
          </span>
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Statistik kehadiran terkini di seluruh sistem.
        </p>
      </div>

      <div className="animate-fade-in-up stagger-1 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Pengguna"
          value={data.totalUsers}
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          label="Hadir Hari Ini"
          value={data.presentToday}
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <StatCard
          label="Tingkat Kehadiran"
          value={`${data.attendanceRate}%`}
          hint="Dari total pengguna terdaftar"
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      <Card className="animate-fade-in-up stagger-2 relative overflow-hidden border-teal-100 shadow-lg shadow-teal-500/5">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/60 to-transparent" />
        <CardHeader className="border-b border-teal-100 bg-gradient-to-br from-cyan-50/40 to-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-gradient text-white shadow-md shadow-teal-500/20">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700">
                Tren Mingguan
              </p>
              <CardTitle className="font-display">7 Hari Terakhir</CardTitle>
              <CardDescription>
                Jumlah absensi tercatat per hari.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <AttendanceChart data={data.last7Days} />
        </CardContent>
      </Card>
    </div>
  );
}