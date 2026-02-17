import React, { useState, useRef } from 'react';
import { Upload, Sparkles, Check, DollarSign, Tag, RefreshCw, X, ArrowRight, Loader2, Image as ImageIcon, Sliders, Plus, Trash2, ShieldCheck } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { analyzeImage } from '../services/geminiService';
import { ListingData, InventoryItem, Attribute } from '../types';

interface InstantListingProps {
  onPublish: (item: InventoryItem) => void;
}

export const InstantListing: React.FC<InstantListingProps> = ({ onPublish }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [listingData, setListingData] = useState<ListingData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImage(base64String);
        startAnalysis(base64String, file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async (base64Full: string, mimeType: string) => {
    setIsScanning(true);
    setListingData(null);
    const base64Data = base64Full.split(',')[1];

    try {
      const data = await analyzeImage(base64Data, mimeType);
      setTimeout(() => {
        setListingData(data);
        setIsScanning(false);
      }, 1500);
    } catch (error) {
      console.error("Analysis failed", error);
      setIsScanning(false);
    }
  };

  const resetProcess = () => {
    setImage(null);
    setListingData(null);
    setIsScanning(false);
    setIsPublishing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (listingData) {
        setListingData({
            ...listingData,
            [name]: name === 'price' ? parseFloat(value) || 0 : value
        });
    }
  };

  const handleAttributeChange = (index: number, field: 'key' | 'value', value: string) => {
    if (listingData) {
      const newAttributes = [...listingData.attributes];
      newAttributes[index] = { ...newAttributes[index], [field]: value };
      setListingData({ ...listingData, attributes: newAttributes });
    }
  };

  const addAttribute = () => {
    if (listingData) {
      setListingData({
        ...listingData,
        attributes: [...listingData.attributes, { key: '', value: '' }]
      });
    }
  };

  const removeAttribute = (index: number) => {
    if (listingData) {
      const newAttributes = listingData.attributes.filter((_, i) => i !== index);
      setListingData({ ...listingData, attributes: newAttributes });
    }
  };

  const handlePublish = () => {
      if (!listingData || !image) return;
      setIsPublishing(true);
      const newItem: InventoryItem = {
          id: Date.now().toString(),
          title: listingData.title,
          category: listingData.category,
          condition: listingData.condition,
          price: listingData.price,
          status: 'FOR_SALE',
          dateAdded: 'Just Now',
          imageUrl: image,
          attributes: listingData.attributes
      };
      setTimeout(() => {
          onPublish(newItem);
      }, 1000);
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <GlassCard className="flex items-center justify-between bg-white border-slate-200">
        <div>
           <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
             <Sparkles className="text-cobalt-600" size={20} />
             Instant Snapshot Listing
           </h2>
           <p className="text-slate-500 text-sm mt-1">
             AI-Assisted Inventory Ingestion Protocol.
           </p>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full items-start">
        {/* Upload / Image Area */}
        <div className="bg-slate-200/50 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center min-h-[400px] lg:h-full relative overflow-hidden group hover:bg-slate-200 hover:border-slate-400 transition-all">
          
          {!image ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer flex flex-col items-center p-12 text-center"
            >
              <div className="w-16 h-16 bg-white rounded-md border border-slate-300 flex items-center justify-center mb-4 shadow-sm">
                <Upload size={24} className="text-slate-500" />
              </div>
              <h3 className="text-base font-bold text-slate-700 mb-1">Upload Source Image</h3>
              <p className="text-xs text-slate-500 max-w-xs">
                Drag & drop or click to select file. System accepts JPG/PNG.
              </p>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center bg-slate-900">
              <img 
                src={image} 
                alt="Product analysis" 
                className="max-h-full max-w-full object-contain opacity-90" 
              />
              
              {isScanning && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60">
                   <div className="bg-slate-900 text-white px-4 py-2 rounded-md border border-slate-700 flex items-center gap-3 shadow-xl">
                      <Loader2 size={16} className="animate-spin text-cobalt-500" />
                      <span className="text-sm font-mono">Processing binary data...</span>
                   </div>
                </div>
              )}

              {!isScanning && !isPublishing && (
                <button 
                  onClick={resetProcess}
                  className="absolute top-4 right-4 p-2 bg-slate-800 text-white rounded hover:bg-red-600 transition-colors border border-slate-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          )}
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>

        {/* Form / Results Area */}
        <GlassCard className="flex flex-col h-full bg-white border-slate-200">
           {!listingData ? (
             <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
               <ImageIcon size={48} className="text-slate-300 mb-4" />
               <p className="text-slate-400 text-sm font-medium">Waiting for input stream...</p>
             </div>
           ) : (
             <div className="flex flex-col h-full">
               <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                 <h3 className="text-base font-bold text-slate-900">Extracted Data</h3>
                 <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded border border-emerald-200 font-bold uppercase tracking-wide flex items-center gap-1">
                   <Check size={12} strokeWidth={3} /> Verified
                 </span>
               </div>

               <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                 <div>
                   <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Title</label>
                   <input 
                     type="text" 
                     name="title"
                     value={listingData.title}
                     onChange={handleInputChange}
                     className="block w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-md focus:ring-cobalt-500 focus:border-cobalt-500 p-2.5 font-medium"
                   />
                 </div>

                 <div>
                   <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Description</label>
                   <textarea 
                     name="description"
                     value={listingData.description}
                     onChange={handleInputChange}
                     rows={3}
                     className="block w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-md focus:ring-cobalt-500 focus:border-cobalt-500 p-2.5 font-mono text-xs leading-relaxed"
                   />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Price (USD)</label>
                     <div className="relative">
                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                         <DollarSign size={14} />
                       </div>
                       <input 
                         type="number" 
                         name="price"
                         value={listingData.price}
                         onChange={handleInputChange}
                         className="block w-full pl-8 bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-md focus:ring-cobalt-500 focus:border-cobalt-500 p-2.5 font-mono"
                       />
                     </div>
                   </div>
                   
                   <div>
                     <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Category</label>
                     <div className="relative">
                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                         <Tag size={14} />
                       </div>
                       <input 
                         type="text" 
                         name="category"
                         value={listingData.category}
                         onChange={handleInputChange}
                         className="block w-full pl-8 bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-md focus:ring-cobalt-500 focus:border-cobalt-500 p-2.5"
                       />
                     </div>
                   </div>
                 </div>

                 <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Condition / State</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                            <ShieldCheck size={14} />
                        </div>
                        <input 
                            type="text" 
                            name="condition"
                            value={listingData.condition}
                            onChange={handleInputChange}
                            placeholder="e.g. New, Like New, Good, Fair"
                            className="block w-full pl-8 bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-md focus:ring-cobalt-500 focus:border-cobalt-500 p-2.5 font-medium"
                        />
                    </div>
                 </div>

                 {/* Dynamic Technical Specs Section */}
                 <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <Sliders size={14} /> Dynamic Technical Specs
                        </label>
                        <button 
                            onClick={addAttribute}
                            className="text-xs flex items-center gap-1 text-cobalt-600 hover:text-cobalt-800"
                        >
                            <Plus size={12} /> Add Field
                        </button>
                    </div>
                    
                    <div className="bg-slate-50 border border-slate-200 rounded-md p-3 space-y-2">
                        {listingData.attributes.length === 0 && (
                            <p className="text-xs text-slate-400 italic text-center py-2">No specs generated.</p>
                        )}
                        {listingData.attributes.map((attr, idx) => (
                            <div key={idx} className="flex gap-2 items-center">
                                <input 
                                    type="text"
                                    value={attr.key}
                                    onChange={(e) => handleAttributeChange(idx, 'key', e.target.value)}
                                    placeholder="Attribute"
                                    className="w-1/3 bg-white border border-slate-300 rounded px-2 py-1 text-xs font-bold text-slate-700 focus:border-cobalt-500 focus:outline-none"
                                />
                                <input 
                                    type="text"
                                    value={attr.value}
                                    onChange={(e) => handleAttributeChange(idx, 'value', e.target.value)}
                                    placeholder="Value"
                                    className="flex-1 bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-700 font-mono focus:border-cobalt-500 focus:outline-none"
                                />
                                <button 
                                    onClick={() => removeAttribute(idx)}
                                    className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                 </div>

               </div>

               <div className="pt-6 mt-6 border-t border-slate-200 flex gap-3">
                 <button 
                   onClick={handlePublish}
                   disabled={isPublishing}
                   className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-cobalt-600 text-white rounded-md font-semibold text-sm shadow-sm hover:bg-cobalt-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed border border-cobalt-700"
                 >
                   {isPublishing ? (
                       <>
                         <Loader2 size={16} className="animate-spin" /> Publishing...
                       </>
                   ) : (
                       <>
                         Confirm & Publish <ArrowRight size={16} />
                       </>
                   )}
                 </button>
                 <button 
                    disabled={isPublishing}
                    className="px-4 py-2.5 bg-white text-slate-700 rounded-md font-semibold text-sm border border-slate-300 hover:bg-slate-50 transition-colors disabled:opacity-50"
                 >
                   Draft
                 </button>
               </div>
             </div>
           )}
        </GlassCard>
      </div>
    </div>
  );
};