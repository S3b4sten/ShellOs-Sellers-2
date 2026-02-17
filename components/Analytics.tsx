import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { GlassCard } from './GlassCard';
import { InventoryItem } from '../types';
import { TrendingUp, DollarSign, Package } from 'lucide-react';

interface AnalyticsProps {
  inventory: InventoryItem[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#6366F1', '#EC4899', '#64748B'];

export const Analytics: React.FC<AnalyticsProps> = ({ inventory }) => {
  // Calculate Category Distribution
  const categoryData = inventory.reduce((acc, item) => {
    const existing = acc.find(x => x.name === item.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: item.category, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Calculate Price vs Status
  const statusData = [
    {
      name: 'Active',
      value: inventory.filter(i => i.status === 'FOR_SALE').length,
      revenue: inventory.filter(i => i.status === 'FOR_SALE').reduce((sum, i) => sum + i.price, 0)
    },
    {
      name: 'Sold',
      value: inventory.filter(i => i.status === 'SOLD').length,
      revenue: inventory.filter(i => i.status === 'SOLD').reduce((sum, i) => sum + i.price, 0)
    }
  ];

  const totalValue = inventory.reduce((sum, item) => sum + item.price, 0);
  const avgPrice = inventory.length > 0 ? Math.round(totalValue / inventory.length) : 0;

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      {/* Mini Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="p-4 flex items-center gap-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-md border border-indigo-200">
            <DollarSign size={20} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase">Total Valuation</p>
            <p className="text-xl font-bold text-slate-900 font-mono">${totalValue.toLocaleString()}</p>
          </div>
        </GlassCard>
        <GlassCard className="p-4 flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-md border border-emerald-200">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase">Avg. Item Price</p>
            <p className="text-xl font-bold text-slate-900 font-mono">${avgPrice.toLocaleString()}</p>
          </div>
        </GlassCard>
        <GlassCard className="p-4 flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-md border border-amber-200">
            <Package size={20} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase">Unique Categories</p>
            <p className="text-xl font-bold text-slate-900 font-mono">{categoryData.length}</p>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <GlassCard className="h-[400px] flex flex-col">
          <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Category Distribution</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '4px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Status Volume */}
        <GlassCard className="h-[400px] flex flex-col">
           <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Inventory Status Volume</h3>
           <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '4px', color: '#fff' }} />
                <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={40}>
                   {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.name === 'Active' ? '#3B82F6' : '#10B981'} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
           </div>
        </GlassCard>
      </div>
    </div>
  );
};