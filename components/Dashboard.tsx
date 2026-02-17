import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GlassCard } from './GlassCard';
import { Activity, Zap, TrendingUp, DollarSign, ArrowUpRight, Trash2, RefreshCw, Cpu, ShieldCheck } from 'lucide-react';
import { InventoryItem } from '../types';

// Mock Data for the chart (Time series data is complex to mock from simple array)
const performanceData = [
  { name: 'Mon', revenue: 4000, scans: 24 },
  { name: 'Tue', revenue: 3000, scans: 13 },
  { name: 'Wed', revenue: 5000, scans: 38 },
  { name: 'Thu', revenue: 2780, scans: 39 },
  { name: 'Fri', revenue: 6890, scans: 48 },
  { name: 'Sat', revenue: 8390, scans: 58 },
  { name: 'Sun', revenue: 7490, scans: 43 },
];

interface DashboardProps {
    inventory: InventoryItem[];
    onDelete: (id: string) => void;
    onToggleStatus: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ inventory, onDelete, onToggleStatus }) => {
  // Dynamic Calculations
  const totalRevenue = inventory
    .filter(i => i.status === 'SOLD')
    .reduce((sum, item) => sum + item.price, 0);
  
  const activeListings = inventory.filter(i => i.status === 'FOR_SALE').length;
  const soldItems = inventory.filter(i => i.status === 'SOLD').length;
  const totalItems = inventory.length;
  
  // Calculate efficiency (arbitrary metric based on ratio of sold vs total)
  const efficiency = totalItems > 0 ? ((soldItems / totalItems) * 100).toFixed(1) : "0.0";

  return (
    <div className="flex flex-col gap-6">
      
      {/* KPI Section - Dynamic Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="flex flex-col p-5 border-l-4 border-l-emerald-500">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Revenue</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1 font-mono">${totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="p-1.5 bg-slate-50 border border-slate-200 rounded text-emerald-600">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
             <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                <TrendingUp size={12} /> Live
             </span>
             <span className="text-xs text-slate-400">Total generated</span>
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col p-5 border-l-4 border-l-cobalt-600">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Inventory Count</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1 font-mono">{totalItems}</h3>
            </div>
            <div className="p-1.5 bg-slate-50 border border-slate-200 rounded text-cobalt-600">
              <Activity size={18} />
            </div>
          </div>
          <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
             <span className="flex items-center gap-1.5 text-xs text-cobalt-700 font-semibold bg-cobalt-50 px-2 py-0.5 rounded border border-cobalt-100">
                <ArrowUpRight size={12} /> {activeListings} Active
             </span>
             <span className="text-xs text-slate-400">{soldItems} Sold</span>
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col p-5 border-l-4 border-l-amber-500">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Sales Rate</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1 font-mono">{efficiency}%</h3>
            </div>
            <div className="p-1.5 bg-slate-50 border border-slate-200 rounded text-amber-600">
              <Zap size={18} />
            </div>
          </div>
          <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
             <span className="text-xs text-slate-600 font-medium">Conversion</span>
             <span className="text-xs text-slate-400">Global Ratio</span>
          </div>
        </GlassCard>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Chart */}
        <div className="lg:col-span-2">
          <GlassCard className="h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Revenue Analytics</h2>
                <p className="text-xs text-slate-500">Simulated projection based on current inventory</p>
              </div>
              <div className="flex rounded-md shadow-sm border border-slate-300 divide-x divide-slate-300">
                 <button className="px-3 py-1 bg-slate-100 text-slate-900 text-xs font-semibold">Weekly</button>
                 <button className="px-3 py-1 bg-white text-slate-600 text-xs hover:bg-slate-50 font-medium">Monthly</button>
              </div>
            </div>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontFamily: 'monospace'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontFamily: 'monospace'}} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      borderRadius: '4px',
                      border: 'none',
                      color: '#f8fafc',
                      fontSize: '12px',
                      padding: '8px 12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }} 
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Area 
                    type="step" 
                    dataKey="revenue" 
                    stroke="#2563EB" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                    activeDot={{ r: 4, strokeWidth: 0, fill: '#2563EB' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* Inventory Summary */}
        <div className="lg:col-span-1 flex flex-col gap-6">
           <GlassCard className="flex-1 flex flex-col">
              <div className="mb-4 pb-4 border-b border-slate-100">
                  <h2 className="text-base font-bold text-slate-900">Inventory Health</h2>
              </div>
              
              <div className="space-y-4 flex-1">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md border border-slate-100">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-sm bg-emerald-500"></div>
                      <span className="text-slate-700 text-sm font-medium">Sold Items</span>
                   </div>
                   <span className="font-bold text-slate-900 font-mono">{soldItems}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md border border-slate-100">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-sm bg-cobalt-600"></div>
                      <span className="text-slate-700 text-sm font-medium">Active Listings</span>
                   </div>
                   <span className="font-bold text-slate-900 font-mono">{activeListings}</span>
                </div>
                 <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md border border-slate-100">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-sm bg-amber-500"></div>
                      <span className="text-slate-700 text-sm font-medium">Total Assets</span>
                   </div>
                   <span className="font-bold text-slate-900 font-mono">{totalItems}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-100">
                 <button className="w-full py-2 bg-white text-slate-700 rounded-md text-sm font-semibold hover:bg-slate-50 transition-colors border border-slate-300 shadow-sm">
                    Generate Report (PDF)
                 </button>
              </div>
           </GlassCard>
        </div>
      </div>

      {/* Inventory List - Functional Actions */}
      <GlassCard className="overflow-hidden" noPadding>
        <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50/50">
           <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Live Inventory</h2>
           <span className="text-slate-400 text-xs font-mono">{inventory.length} records found</span>
        </div>
        {inventory.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">No items found matching your criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-semibold">Item Details</th>
                  <th className="px-6 py-3 font-semibold">Category</th>
                  <th className="px-6 py-3 font-semibold">Price</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold text-right">Timestamp</th>
                  <th className="px-6 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {inventory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-3 font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-slate-200 border border-slate-300 flex-shrink-0 overflow-hidden">
                          {item.imageUrl && <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex flex-col">
                            <span>{item.title}</span>
                            {item.attributes && item.attributes.length > 0 && (
                                <div className="flex items-center gap-2 mt-1">
                                    <Cpu size={10} className="text-slate-400" />
                                    <span className="text-[10px] text-slate-500">
                                        {item.attributes.slice(0, 2).map(a => `${a.key}: ${a.value}`).join(' • ')}
                                        {item.attributes.length > 2 && '...'}
                                    </span>
                                </div>
                            )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-slate-600">
                        <div className="flex flex-col">
                            <span>{item.category}</span>
                            <div className="flex items-center gap-1 mt-0.5">
                                <ShieldCheck size={10} className="text-slate-400" />
                                <span className="text-[10px] text-slate-500 font-medium">{item.condition}</span>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-3 font-mono text-slate-900">
                      ${item.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-3">
                      {item.status === 'SOLD' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200 uppercase tracking-wider">
                            Sold
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold border border-sky-200 uppercase tracking-wider">
                            Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-right text-slate-500 font-mono text-xs">
                      {item.dateAdded}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => onToggleStatus(item.id)}
                          className="p-1.5 text-slate-500 hover:text-cobalt-600 hover:bg-slate-100 rounded border border-transparent hover:border-slate-300 transition-all"
                          title="Toggle Status"
                        >
                          <RefreshCw size={14} />
                        </button>
                        <button 
                          onClick={() => onDelete(item.id)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded border border-transparent hover:border-red-200 transition-all"
                          title="Delete Item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
};