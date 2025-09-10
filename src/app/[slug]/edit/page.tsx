'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { validateWhatsApp, formatWhatsAppNumber } from '@/lib/utils';
import { THEME_PRESETS } from '@/lib/themes';
import { Business, Theme, Profile, CustomLink, Layout } from '@/types';
import ThemePicker from '@/components/editor/ThemePicker';
import ColorPicker from '@/components/editor/ColorPicker';
import ProfileEditor from '@/components/editor/ProfileEditor';
import LinkManager from '@/components/editor/LinkManager';
import ServiceEditor from '@/components/editor/ServiceEditor';
import LivePreview from '@/components/editor/LivePreview';
import { Save, Undo, Redo, Copy, Smartphone } from 'lucide-react';

interface EditPageProps {
  params: { slug: string };
}

export default function EditPage({ params }: EditPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'theme' | 'profile' | 'links' | 'services'>('theme');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Auto-save functionality
  const autoSave = useCallback(async (updatedBusiness: Business) => {
    if (!token || !updatedBusiness) return;
    
    setAutoSaving(true);
    try {
      await supabase
        .from('businesses')
        .update({
          name: updatedBusiness.name,
          whatsapp: updatedBusiness.whatsapp,
          instagram: updatedBusiness.instagram,
          services: updatedBusiness.services,
          theme: updatedBusiness.theme,
          profile: updatedBusiness.profile,
          links: updatedBusiness.links,
          layout: updatedBusiness.layout
        })
        .eq('slug', params.slug)
        .eq('edit_token', token);
      
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setAutoSaving(false);
    }
  }, [params.slug, token]);

  // Debounced auto-save
  useEffect(() => {
    if (!business || loading) return;
    
    const timeoutId = setTimeout(() => {
      autoSave(business);
    }, 3000); // Auto-save after 3 seconds of inactivity

    return () => clearTimeout(timeoutId);
  }, [business, autoSave, loading]);

  useEffect(() => {
    if (!token) {
      setError('Edit token is required');
      setLoading(false);
      return;
    }
    fetchBusiness();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.slug, token]);

  const fetchBusiness = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('businesses')
        .select('*')
        .eq('slug', params.slug)
        .eq('edit_token', token)
        .single();

      if (fetchError) {
        setError('Invalid edit token or business not found');
        return;
      }

      // Ensure business has all required fields with defaults
      const businessData: Business = {
        ...data,
        theme: data.theme || THEME_PRESETS.minimal,
        profile: data.profile || { avatar: null, bio: null, coverImage: null },
        links: data.links || [],
        layout: data.layout || { showServices: true, servicesStyle: 'cards', linkOrder: [] }
      };

      setBusiness(businessData);
    } catch (err) {
      setError('Failed to load business data');
    } finally {
      setLoading(false);
    }
  };

  // Update handlers
  const updateTheme = (theme: Theme) => {
    if (!business) return;
    setBusiness({ ...business, theme });
  };

  const updateProfile = (profile: Profile) => {
    if (!business) return;
    setBusiness({ ...business, profile });
  };

  const updateBusinessName = (name: string) => {
    if (!business) return;
    setBusiness({ ...business, name });
  };

  const updateLinks = (links: CustomLink[]) => {
    if (!business) return;
    setBusiness({ ...business, links });
  };

  const updateLayout = (layout: Layout) => {
    if (!business) return;
    setBusiness({ ...business, layout });
  };

  const updateServices = (services: any[]) => {
    if (!business) return;
    setBusiness({ ...business, services });
  };

  const updateWhatsApp = (whatsapp: string) => {
    if (!business) return;
    setBusiness({ ...business, whatsapp });
  };

  const updateInstagram = (instagram: string) => {
    if (!business) return;
    setBusiness({ ...business, instagram: instagram || null });
  };

  const copyPublicLink = () => {
    const publicUrl = `${window.location.origin}/${params.slug}`;
    navigator.clipboard.writeText(publicUrl);
    setSuccess('Public page link copied to clipboard!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const tabs = [
    { id: 'theme', label: 'Theme', icon: '🎨' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'links', label: 'Links', icon: '🔗' },
    { id: 'services', label: 'Services', icon: '💼' }
  ] as const;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error && !business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!business) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Clean Professional Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">T</span>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-slate-900">TapBook</h1>
                  <p className="text-xs text-slate-500 -mt-0.5">Link in Bio Editor</p>
                </div>
              </div>
              
              <div className="h-6 w-px bg-slate-200"></div>
              
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-700">{business.name}</span>
                
                {autoSaving && (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <div className="w-3 h-3 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                    Saving...
                  </div>
                )}
                
                {lastSaved && !autoSaving && (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={copyPublicLink}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:border-slate-400 transition-colors"
              >
                <Copy className="w-4 h-4" />
                Copy Link
              </button>
              
              <a
                href={`/${business.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium"
              >
                <Smartphone className="w-4 h-4" />
                Preview
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Success/Error Messages */}
      {success && (
        <div className="mx-6 lg:mx-8 mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
            </div>
            <p className="text-emerald-800 font-medium text-sm">{success}</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mx-6 lg:mx-8 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
            </div>
            <p className="text-red-800 font-medium text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Professional Row Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* Left Panel - Editor */}
          <div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              {/* Clean Tab Navigation */}
              <div className="border-b border-slate-200">
                <nav className="flex" aria-label="Tabs">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`${
                        activeTab === tab.id
                          ? 'border-slate-900 text-slate-900 bg-slate-50'
                          : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                      } flex-1 py-4 px-6 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2`}
                    >
                      <span>{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
              
              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'theme' && (
                  <div className="space-y-6">
                    <ThemePicker 
                      currentTheme={business.theme}
                      onThemeChange={updateTheme}
                    />
                    
                    <div className="grid grid-cols-1 gap-4">
                      <ColorPicker
                        label="Primary Color"
                        color={business.theme.primaryColor}
                        onChange={(color) => updateTheme({ ...business.theme, primaryColor: color })}
                      />
                      <ColorPicker
                        label="Background Color"
                        color={business.theme.backgroundColor}
                        onChange={(color) => updateTheme({ ...business.theme, backgroundColor: color })}
                      />
                      <ColorPicker
                        label="Text Color"
                        color={business.theme.textColor}
                        onChange={(color) => updateTheme({ ...business.theme, textColor: color })}
                      />
                    </div>
                    
                    {/* Font and Button Style Selectors */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Font</label>
                        <select
                          value={business.theme.font}
                          onChange={(e) => updateTheme({ 
                            ...business.theme, 
                            font: e.target.value as Theme['font']
                          })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        >
                          <option value="inter">Inter</option>
                          <option value="outfit">Outfit</option>
                          <option value="space-mono">Space Mono</option>
                          <option value="playfair">Playfair Display</option>
                          <option value="caveat">Caveat</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Button Style</label>
                        <select
                          value={business.theme.buttonStyle}
                          onChange={(e) => updateTheme({ 
                            ...business.theme, 
                            buttonStyle: e.target.value as Theme['buttonStyle']
                          })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        >
                          <option value="rounded">Rounded</option>
                          <option value="pill">Pill</option>
                          <option value="square">Square</option>
                          <option value="brutal">Brutal</option>
                          <option value="ghost">Ghost</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <ProfileEditor
                      businessName={business.name}
                      profile={business.profile}
                      onNameChange={updateBusinessName}
                      onProfileChange={updateProfile}
                    />
                    
                    {/* WhatsApp and Instagram */}
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-2">
                          WhatsApp Number *
                        </label>
                        <input
                          type="tel"
                          id="whatsapp"
                          value={business.whatsapp}
                          onChange={(e) => updateWhatsApp(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="+1234567890"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-2">
                          Instagram Handle (optional)
                        </label>
                        <input
                          type="text"
                          id="instagram"
                          value={business.instagram || ''}
                          onChange={(e) => updateInstagram(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="@yourbusiness"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'links' && (
                  <LinkManager
                    links={business.links}
                    onLinksChange={updateLinks}
                  />
                )}
                
                {activeTab === 'services' && (
                  <ServiceEditor
                    services={business.services}
                    layout={business.layout}
                    onServicesChange={updateServices}
                    onLayoutChange={updateLayout}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Live Preview */}
          <div className="lg:sticky lg:top-24">
            <LivePreview business={business} />
          </div>
          
        </div>
      </div>
    </div>
  );
}