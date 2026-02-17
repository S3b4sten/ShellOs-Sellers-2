import React from 'react';
import { GlassCard } from './GlassCard';
import { AppSettings } from '../types';
import { Bell, Moon, Smartphone, Zap, CreditCard, Save } from 'lucide-react';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdate: (newSettings: AppSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, onUpdate }) => {
  const toggleSetting = (key: keyof AppSettings) => {
    onUpdate({ ...settings, [key]: !settings[key] });
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      <GlassCard className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 mb-2">System Configuration</h2>
        <p className="text-slate-500 text-sm">Manage environment variables and interface protocols.</p>
      </GlassCard>

      <GlassCard noPadding>
        <div className="divide-y divide-slate-200">
            {/* Notifications */}
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-slate-100 rounded-md text-slate-600">
                        <Bell size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">Email Notifications</h3>
                        <p className="text-xs text-slate-500 mt-1">Receive daily digests of inventory movement.</p>
                    </div>
                </div>
                <button 
                    onClick={() => toggleSetting('emailNotifications')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.emailNotifications ? 'bg-cobalt-600' : 'bg-slate-300'}`}
                >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
            </div>

            {/* Auto Publish */}
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-slate-100 rounded-md text-slate-600">
                        <Zap size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">Auto-Publish Listings</h3>
                        <p className="text-xs text-slate-500 mt-1">Automatically push listings live after AI analysis.</p>
                    </div>
                </div>
                <button 
                    onClick={() => toggleSetting('autoPublish')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.autoPublish ? 'bg-cobalt-600' : 'bg-slate-300'}`}
                >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.autoPublish ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
            </div>

            {/* Compact Mode */}
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-slate-100 rounded-md text-slate-600">
                        <Smartphone size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">Compact Data Mode</h3>
                        <p className="text-xs text-slate-500 mt-1">Increase data density in table views.</p>
                    </div>
                </div>
                <button 
                    onClick={() => toggleSetting('compactMode')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.compactMode ? 'bg-cobalt-600' : 'bg-slate-300'}`}
                >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.compactMode ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
            </div>

             {/* Dark Mode (Simulated) */}
             <div className="p-6 flex items-center justify-between">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-slate-100 rounded-md text-slate-600">
                        <Moon size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">Dark Interface</h3>
                        <p className="text-xs text-slate-500 mt-1">Switch to low-light environment theme.</p>
                    </div>
                </div>
                <button 
                    onClick={() => toggleSetting('darkMode')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.darkMode ? 'bg-cobalt-600' : 'bg-slate-300'}`}
                >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
            </div>
            
             {/* Billing */}
             <div className="p-6 flex items-center justify-between opacity-60 cursor-not-allowed bg-slate-50">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-slate-200 rounded-md text-slate-500">
                        <CreditCard size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-700">Billing & Subscription</h3>
                        <p className="text-xs text-slate-500 mt-1">Manage payment methods (Admin Only).</p>
                    </div>
                </div>
                <span className="text-xs font-mono bg-slate-200 text-slate-500 px-2 py-1 rounded">LOCKED</span>
            </div>
        </div>
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                <Save size={16} /> Save Configuration
            </button>
        </div>
      </GlassCard>
    </div>
  );
};