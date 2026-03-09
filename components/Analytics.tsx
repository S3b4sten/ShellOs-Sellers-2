import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import { GlassCard } from './GlassCard';
import { InventoryItem } from '../types';
import { TrendingUp, DollarSign, Package, Activity } from 'lucide-react';

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

  // Calculate Revenue by Category
  const revenueByCategory = inventory.reduce((acc, item) => {
    if (item.status === 'SOLD') {
      const existing = acc.find(x => x.name === item.category);
      if (existing) {
        existing.revenue += item.price;
      } else {
        acc.push({ name: item.category, revenue: item.price });
      }
    }
    return acc;
  }, [] as { name: string; revenue: number }[]);

  const totalValue = inventory.reduce((sum, item) => sum + item.price, 0);
  const avgPrice = inventory.length > 0 ? Math.round(totalValue / inventory.length) : 0;
  const totalItems = inventory.length;
  const itemsSold = inventory.filter(i => i.status === 'SOLD').length;

  // Mock recent activity based on inventory
  const recentActivity = [...inventory].sort((a, b) => {
    // Just a mock sort to show some items
    return b.id.localeCompare(a.id);
  }).slice(0, 5);

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      {/* Mini Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <p className="text-slate-500 text-xs font-bold uppercase">Total Items</p>
            <p className="text-xl font-bold text-slate-900 font-mono">{totalItems}</p>
          </div>
        </GlassCard>
        <GlassCard className="p-4 flex items-center gap-4">
          <div className="p-3 bg-pink-100 text-pink-600 rounded-md border border-pink-200">
            <Activity size={20} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase">Items Sold</p>
            <p className="text-xl font-bold text-slate-900 font-mono">{itemsSold}</p>
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

        {/* Revenue by Category */}
        <GlassCard className="h-[400px] flex flex-col">
           <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Revenue by Category (Sold Items)</h3>
           <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByCategory} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} angle={-45} textAnchor="end" />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(value) => `$${value}`} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '4px', color: '#fff' }} formatter={(value: number) => [`$${value}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#6366F1" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
           </div>
        </GlassCard>

        {/* Recent Activity */}
        <GlassCard className="h-[400px] flex flex-col">
           <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Recent Activity</h3>
           <div className="flex-1 overflow-y-auto pr-2 space-y-3">
             {recentActivity.map((item) => (
               <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                 <img src={item.imageUrl} alt={item.title} className="w-10 h-10 rounded object-cover border border-slate-200" />
                 <div className="flex-1 min-w-0">
                   <p className="text-sm font-semibold text-slate-800 truncate">{item.title}</p>
                   <p className="text-xs text-slate-500 truncate">{item.category} • {item.dateAdded}</p>
                 </div>
                 <div className="text-right">
                   <p className="text-sm font-bold text-slate-900 font-mono">${item.price}</p>
                   <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${item.status === 'SOLD' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                     {item.status}
                   </span>
                 </div>
               </div>
             ))}
           </div>
        </GlassCard>
      </div>
    </div>
  );
};