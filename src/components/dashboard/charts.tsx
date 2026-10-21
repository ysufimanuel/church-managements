'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

const COLORS = ['#00E5FF', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'];

export function AttendanceBarChart({ data }: { data: { label: string; total: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <XAxis dataKey="label" stroke="#A0AEC0" fontSize={12} />
        <YAxis stroke="#A0AEC0" fontSize={12} allowDecimals={false} />
        <Tooltip contentStyle={{ background: '#1A1D24', border: '1px solid #2D3748', borderRadius: 8 }} />
        <Bar dataKey="total" fill="#00E5FF" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function MemberPieChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} label>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip contentStyle={{ background: '#1A1D24', border: '1px solid #2D3748', borderRadius: 8 }} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function FinanceLineChart({ data }: { data: { label: string; pemasukan: number; pengeluaran: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <XAxis dataKey="label" stroke="#A0AEC0" fontSize={12} />
        <YAxis stroke="#A0AEC0" fontSize={12} />
        <Tooltip contentStyle={{ background: '#1A1D24', border: '1px solid #2D3748', borderRadius: 8 }} />
        <Legend />
        <Line type="monotone" dataKey="pemasukan" stroke="#10B981" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="pengeluaran" stroke="#EF4444" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function CategoryPieChart({ data }: { data: { name: string; value: number }[] }) {
  return <MemberPieChart data={data} />;
}
