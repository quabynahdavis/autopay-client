"use client";

import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface VolumeChartProps {
  data: { month: string; volume: number }[];
}

export function PaymentVolumeChart({ data }: VolumeChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1D4ED8" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12 }}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          formatter={(value) => [formatCurrency(Number(value ?? 0)), "Volume"]}
          contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0" }}
        />
        <Area
          type="monotone"
          dataKey="volume"
          stroke="#1D4ED8"
          strokeWidth={2}
          fill="url(#volumeGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

interface DistributionChartProps {
  data: { name: string; value: number; color: string }[];
}

export function PaymentDistributionChart({ data }: DistributionChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value ?? 0}%`, "Share"]} />
      </PieChart>
    </ResponsiveContainer>
  );
}
