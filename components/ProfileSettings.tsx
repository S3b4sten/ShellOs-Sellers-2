import React, { useState, useRef } from 'react';
import { User, Mail, Camera, Save, X, Briefcase, FileText, Check } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { UserProfile } from '../types';

interface ProfileSettingsProps {
  user: UserProfile;
  onSave: (updatedUser: UserProfile) => void;
  onCancel: () => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState<UserProfile>(user);
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    // Simulate API delay
    setTimeout(() => {
        onSave(formData);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <GlassCard className="overflow-visible" noPadding>
        <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-slate-50 rounded-t-lg">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Edit Profile</h2>
            <p className="text-slate-500 text-sm mt-1">Update user account information.</p>
          </div>
          <button 
            onClick={onCancel}
            className="p-2 hover:bg-white rounded border border-transparent hover:border-slate-300 text-slate-500 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            {/* Avatar - More strict shape */}
            <div className="flex-shrink-0">
               <div className="group relative w-32 h-32">
                  <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-slate-200 bg-slate-100">
                    <img 
                      src={formData.avatarUrl} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 p-2 bg-slate-800 text-white rounded-md shadow-md hover:bg-slate-700 transition-colors border border-white"
                  >
                    <Camera size={16} />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
               </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Inputs with technical labels */}
                <div className="group">
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User size={16} />
                    </div>
                    <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="block w-full pl-10 bg-white border border-slate-300 text-slate-900 text-sm rounded-md focus:ring-cobalt-500 focus:border-cobalt-500 block p-2.5 shadow-sm"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail size={16} />
                    </div>
                    <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="block w-full pl-10 bg-white border border-slate-300 text-slate-900 text-sm rounded-md focus:ring-cobalt-500 focus:border-cobalt-500 block p-2.5 shadow-sm"
                    />
                  </div>
                </div>

                <div className="group md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                    Role / Position
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Briefcase size={16} />
                    </div>
                    <input 
                        type="text" 
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="block w-full pl-10 bg-white border border-slate-300 text-slate-900 text-sm rounded-md focus:ring-cobalt-500 focus:border-cobalt-500 block p-2.5 shadow-sm"
                    />
                  </div>
                </div>

                <div className="group md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                    Bio / Notes
                  </label>
                   <div className="relative">
                     <textarea 
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={4}
                        className="block w-full p-3 bg-white border border-slate-300 text-slate-900 text-sm rounded-md focus:ring-cobalt-500 focus:border-cobalt-500 shadow-sm font-mono text-xs"
                    />
                   </div>
                </div>
            </div>
          </div>

          <div className="flex justify-end items-center gap-3 pt-6 border-t border-slate-200">
            <button 
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-md text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 font-medium text-sm transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSaved}
              className={`
                px-6 py-2 rounded-md font-medium text-sm shadow-sm flex items-center gap-2 transition-all
                ${isSaved 
                    ? 'bg-emerald-600 text-white border border-emerald-700' 
                    : 'bg-cobalt-600 text-white border border-cobalt-700 hover:bg-cobalt-700'
                }
              `}
            >
              {isSaved ? (
                  <>
                    <Check size={16} /> Saved
                  </>
              ) : (
                  <>
                    <Save size={16} /> Save Changes
                  </>
              )}
            </button>
          </div>

        </form>
      </GlassCard>
    </div>
  );
};