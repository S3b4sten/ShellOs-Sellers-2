import React, { useState, useMemo } from 'react';
import { LayoutDashboard, MessageSquare, Settings, PieChart, Bell, Search, Menu, CirclePlus, Command, LogOut, ChevronRight, X } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { AIChatWidget } from './components/AIChatWidget';
import { InstantListing } from './components/InstantListing';
import { ProfileSettings } from './components/ProfileSettings';
import { Analytics } from './components/Analytics';
import { SettingsView } from './components/SettingsView';
import { DashboardView, NavItem, UserProfile, InventoryItem, AppSettings, Notification } from './types';
import { GlassCard } from './components/GlassCard';

const NAV_ITEMS: NavItem[] = [
  { id: DashboardView.OVERVIEW, label: 'Overview', icon: <LayoutDashboard size={18} /> },
  { id: DashboardView.NEW_LISTING, label: 'Instant List', icon: <CirclePlus size={18} /> },
  { id: DashboardView.ANALYTICS, label: 'Analytics', icon: <PieChart size={18} /> },
  { id: DashboardView.ASSISTANT, label: 'AI Assistant', icon: <MessageSquare size={18} /> },
  { id: DashboardView.SETTINGS, label: 'Settings', icon: <Settings size={18} /> },
];

const INITIAL_INVENTORY: InventoryItem[] = [
  { 
    id: '1', 
    title: 'Vintage Leica Camera', 
    category: 'Photography', 
    condition: 'Vintage - Good',
    price: 1250, 
    status: 'SOLD', 
    dateAdded: '2 hrs ago', 
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=100&q=80',
    attributes: [{key: 'Lens', value: 'Summicron 50mm'}, {key: 'Year', value: '1954'}]
  },
  { 
    id: '2', 
    title: 'Eames Lounge Chair', 
    category: 'Furniture', 
    condition: 'Like New',
    price: 4500, 
    status: 'FOR_SALE', 
    dateAdded: '5 hrs ago', 
    imageUrl: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=100&q=80',
    attributes: [{key: 'Material', value: 'Rosewood/Leather'}, {key: 'Style', value: 'Mid-Century'}]
  },
  { 
    id: '3', 
    title: 'MacBook Pro M2', 
    category: 'Electronics', 
    condition: 'Used - Excellent',
    price: 1800, 
    status: 'FOR_SALE', 
    dateAdded: '1 day ago', 
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&w=100&q=80',
    attributes: [{key: 'Processor', value: 'M2 Pro'}, {key: 'RAM', value: '16GB'}, {key: 'Battery Cycle', value: '45'}]
  },
  { 
    id: '4', 
    title: 'Mechanical Keyboard', 
    category: 'Electronics', 
    condition: 'Used - Good',
    price: 250, 
    status: 'SOLD', 
    dateAdded: '2 days ago', 
    imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=100&q=80',
    attributes: [{key: 'Switch Type', value: 'Cherry MX Brown'}, {key: 'Keycaps', value: 'PBT Double-shot'}]
  },
  { 
    id: '5', 
    title: 'Ceramic Vase Set', 
    category: 'Home Decor', 
    condition: 'New',
    price: 120, 
    status: 'FOR_SALE', 
    dateAdded: '2 days ago', 
    imageUrl: 'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?auto=format&fit=crop&w=100&q=80',
    attributes: [{key: 'Material', value: 'Stoneware'}, {key: 'Set Count', value: '3 pcs'}]
  },
];

export default function App() {
  const [activeView, setActiveView] = useState<DashboardView>(DashboardView.OVERVIEW);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [user, setUser] = useState<UserProfile>({
    name: 'Alex Rivera',
    email: 'alex.rivera@shellos.ai',
    role: 'System Architect',
    bio: 'System maintenance and deployment lead.',
    avatarUrl: 'https://picsum.photos/200'
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  
  const [settings, setSettings] = useState<AppSettings>({
    emailNotifications: true,
    autoPublish: false,
    darkMode: false,
    compactMode: false,
    currency: 'USD'
  });

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: 'System Update', message: 'Core v2.4 installed successfully.', time: '10m ago', read: false },
    { id: '2', title: 'Sale Confirmed', message: 'Vintage Leica Camera marked as SOLD.', time: '2h ago', read: true },
  ]);

  // Derived state for Search
  const filteredInventory = useMemo(() => {
    const lowerQ = searchQuery.toLowerCase();
    return inventory.filter(item => 
      item.title.toLowerCase().includes(lowerQ) ||
      item.category.toLowerCase().includes(lowerQ)
    );
  }, [inventory, searchQuery]);

  // Actions
  const handlePublishListing = (newItem: InventoryItem) => {
    setInventory(prev => [newItem, ...prev]);
    addNotification('New Listing', `${newItem.title} added to inventory.`);
    setTimeout(() => {
        setActiveView(DashboardView.OVERVIEW);
    }, 1000);
  };

  const handleDeleteItem = (id: string) => {
    const item = inventory.find(i => i.id === id);
    if (confirm('Are you sure you want to delete this record?')) {
        setInventory(prev => prev.filter(i => i.id !== id));
        if(item) addNotification('Item Deleted', `${item.title} removed from database.`);
    }
  };

  const handleToggleStatus = (id: string) => {
    setInventory(prev => prev.map(item => {
        if (item.id === id) {
            const newStatus = item.status === 'FOR_SALE' ? 'SOLD' : 'FOR_SALE';
            addNotification('Status Updated', `${item.title} is now ${newStatus}.`);
            return { ...item, status: newStatus };
        }
        return item;
    }));
  };

  const addNotification = (title: string, message: string) => {
      const newNotif: Notification = {
          id: Date.now().toString(),
          title,
          message,
          time: 'Just now',
          read: false
      };
      setNotifications(prev => [newNotif, ...prev]);
  };

  const clearNotifications = () => {
      setNotifications([]);
      setShowNotifications(false);
  };

  const renderContent = () => {
    switch (activeView) {
      case DashboardView.OVERVIEW:
        return <Dashboard 
            inventory={filteredInventory} 
            onDelete={handleDeleteItem} 
            onToggleStatus={handleToggleStatus} 
        />;
      case DashboardView.NEW_LISTING:
        return <InstantListing onPublish={handlePublishListing} />;
      case DashboardView.ASSISTANT:
        return (
            <div className="h-[calc(100vh-140px)]">
                <AIChatWidget />
            </div>
        );
      case DashboardView.ANALYTICS:
        return <Analytics inventory={inventory} />;
      case DashboardView.PROFILE:
        return (
            <ProfileSettings 
                user={user} 
                onSave={(updatedUser) => {
                    setUser(updatedUser);
                    addNotification('Profile Updated', 'User details saved successfully.');
                    setTimeout(() => setActiveView(DashboardView.OVERVIEW), 500);
                }}
                onCancel={() => setActiveView(DashboardView.OVERVIEW)}
            />
        );
      default:
        return (
            <SettingsView 
                settings={settings}
                onUpdate={(newSettings) => {
                    setSettings(newSettings);
                    addNotification('Configuration Saved', 'System preferences updated.');
                }}
            />
        );
    }
  };

  return (
    <div className={`min-h-screen bg-slate-100 flex font-sans text-slate-800 ${settings.darkMode ? 'dark-mode-simulated' : ''}`}>
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full z-50 bg-slate-900 text-white border-b border-slate-700 p-3 flex justify-between items-center shadow-md">
        <div className="font-bold tracking-tight">SHELL<span className="text-cobalt-500">OS</span></div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-300">
          <Menu size={20} />
        </button>
      </div>

      {/* Dark Professional Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-700
        transition-transform duration-300 ease-in-out md:translate-x-0 md:relative
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Area */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
           <Command className="text-cobalt-500 mr-2" size={20} />
           <span className="font-bold text-white tracking-wide text-lg">SHELL<span className="text-cobalt-500">OS</span></span>
           <span className="ml-auto text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">v2.4</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Workspace</div>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id as DashboardView);
                setMobileMenuOpen(false);
              }}
              className={`
                w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors
                ${activeView === item.id 
                  ? 'bg-cobalt-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }
              `}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {activeView === item.id && <ChevronRight size={14} className="opacity-70" />}
            </button>
          ))}
        </nav>
        
        {/* User Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
           <div 
             onClick={() => setActiveView(DashboardView.PROFILE)}
             className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-800 cursor-pointer transition-colors"
           >
              <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-md bg-slate-700 object-cover border border-slate-600" />
              <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
              <LogOut size={14} className="text-slate-500 hover:text-white" />
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50">
        {/* Professional Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex justify-between items-center px-6 sticky top-0 z-30 shadow-sm relative">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-slate-800">
              {activeView === DashboardView.PROFILE ? 'Profile Configuration' : NAV_ITEMS.find(i => i.id === activeView)?.label || 'Dashboard'}
            </h2>
            <span className="h-4 w-px bg-slate-300 mx-2 hidden md:block"></span>
            <span className="text-xs text-slate-500 hidden md:block font-mono">WS-1092 / PROD</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search inventory..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-100 border border-slate-200 pl-9 pr-4 py-1.5 rounded-md text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-cobalt-500 focus:border-cobalt-500 w-64 transition-all"
              />
            </div>
            
            <div className="relative">
                <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 text-slate-500 hover:bg-slate-100 rounded-md relative border border-transparent hover:border-slate-200 transition-colors"
                >
                    <Bell size={18} />
                    {notifications.some(n => !n.read) && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    )}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 shadow-xl rounded-md z-50 animate-fade-in-up">
                        <div className="flex items-center justify-between p-3 border-b border-slate-100 bg-slate-50">
                            <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Notifications</span>
                            <button onClick={clearNotifications} className="text-xs text-cobalt-600 hover:underline">Clear all</button>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-4 text-center text-xs text-slate-400 italic">No new notifications</div>
                            ) : (
                                notifications.map(notif => (
                                    <div key={notif.id} className="p-3 border-b border-slate-100 hover:bg-slate-50 transition-colors relative">
                                        {!notif.read && <span className="absolute left-1 top-4 w-1.5 h-1.5 bg-cobalt-500 rounded-full"></span>}
                                        <div className="pl-2">
                                            <p className="text-sm font-semibold text-slate-800">{notif.title}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{notif.message}</p>
                                            <p className="text-[10px] text-slate-400 mt-2 text-right font-mono">{notif.time}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}