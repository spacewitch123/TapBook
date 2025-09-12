'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useHotkeys } from 'react-hotkeys-hook';
import { gsap } from 'gsap';
import { supabase } from '@/lib/supabase';
import { validateWhatsApp, formatWhatsAppNumber } from '@/lib/utils';
import { THEME_PRESETS } from '@/lib/themes';
import { Business, Theme, Profile, CustomLink, Layout } from '@/types';
import AdvancedThemeEditor from '@/components/editor/AdvancedThemeEditor';
import ProfileEditor from '@/components/editor/ProfileEditor';
import LinkManager from '@/components/editor/LinkManager';
import ServiceEditor from '@/components/editor/ServiceEditor';
import AnimatedPreview from '@/components/editor/AnimatedPreview';
import MicroAnimations, { HoverAnimation } from '@/components/editor/MicroAnimations';
import { 
  Save, 
  Eye, 
  Settings, 
  Link as LinkIcon, 
  Palette, 
  User, 
  Briefcase, 
  Share2, 
  ArrowLeft,
  Zap,
  Sparkles,
  Command,
  Undo,
  Redo,
  Copy
} from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'appearance' | 'links' | 'services' | 'settings'>('links');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Keyboard shortcuts
  useHotkeys('cmd+s, ctrl+s', (e) => {
    e.preventDefault();
    if (business) autoSave(business);
  });

  useHotkeys('cmd+shift+p, ctrl+shift+p', () => {
    window.open(`/${params.slug}`, '_blank');
  });

  useHotkeys('cmd+k, ctrl+k', (e) => {
    e.preventDefault();
    copyPublicLink();
  });

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
          layout: updatedBusiness.layout,
          // New advanced features
          custom_css: updatedBusiness.theme?.customCSS || null,
          background_pattern: updatedBusiness.theme?.backgroundPattern || null,
          custom_shadow: updatedBusiness.theme?.customShadow || null,
          particle_effect: updatedBusiness.theme?.particleEffect || null,
          filters: updatedBusiness.theme?.filters || null
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
    }, 2000); // Auto-save after 2 seconds of inactivity

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
        theme: {
          ...(data.theme || THEME_PRESETS.modern),
          // Load advanced features from separate columns
          customCSS: data.custom_css || undefined,
          backgroundPattern: data.background_pattern || undefined,
          customShadow: data.custom_shadow || undefined,
          particleEffect: data.particle_effect || undefined,
          filters: data.filters || undefined
        },
        profile: data.profile || { avatar: null, bio: null },
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
    setSuccess('Link copied to clipboard!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const tabs = [
    { id: 'links', label: 'Links', icon: LinkIcon, description: 'Add and organize your links', color: 'from-blue-500 to-cyan-500' },
    { id: 'appearance', label: 'Design', icon: Palette, description: 'Advanced styling & themes', color: 'from-purple-500 to-pink-500' },
    { id: 'services', label: 'Services', icon: Briefcase, description: 'Manage your services', color: 'from-green-500 to-emerald-500' },
    { id: 'settings', label: 'Profile', icon: User, description: 'Profile and contact info', color: 'from-orange-500 to-red-500' }
  ] as const;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your page...</p>
        </div>
      </div>
    );
  }

  if (error && !business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors font-medium"
          >
            Create New Page
          </button>
        </div>
      </div>
    );
  }

  if (!business) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      {/* Linktree-style Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side */}
            <div className="flex items-center gap-4">
              <HoverAnimation hoverScale={1.1}>
                <button
                  onClick={() => router.push(`/${params.slug}`)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all duration-300 hover:bg-gray-100 px-3 py-2 rounded-lg"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">Back</span>
                </button>
              </HoverAnimation>
              
              <div className="h-6 w-px bg-gray-200"></div>
              
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  {business.name}
                </h1>
                <p className="text-xs text-gray-500 font-mono">tapbook.com/{business.slug}</p>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Keyboard shortcuts hint */}
              <div className="hidden lg:flex items-center gap-2 text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                <Command className="w-3 h-3" />
                <span>+S to save • +K to share</span>
              </div>
              
              {/* Auto-save status */}
              <div className="flex items-center gap-2">
                {autoSaving ? (
                  <MicroAnimations type="scaleIn">
                    <div className="flex items-center gap-2 text-xs text-gray-500 bg-blue-50 px-3 py-1 rounded-full">
                      <div className="w-3 h-3 border-2 border-blue-300 border-t-blue-500 rounded-full animate-spin"></div>
                      <span className="font-medium">Saving...</span>
                    </div>
                  </MicroAnimations>
                ) : lastSaved ? (
                  <MicroAnimations type="fadeIn">
                    <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="font-medium">Saved</span>
                    </div>
                  </MicroAnimations>
                ) : null}
              </div>

              {/* Share button */}
              <HoverAnimation hoverScale={1.05}>
                <button
                  onClick={copyPublicLink}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-300 hover:shadow-md"
                >
                  <Copy className="w-4 h-4" />
                  <span className="font-medium">Share</span>
                </button>
              </HoverAnimation>

              {/* Preview button */}
              <HoverAnimation hoverScale={1.05}>
                <button
                  onClick={() => window.open(`/${business.slug}`, '_blank')}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </button>
              </HoverAnimation>
            </div>
          </div>
        </div>
      </header>

      {/* Success/Error Messages */}
      {success && (
        <MicroAnimations type="slideUp">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-green-800 font-semibold">{success}</p>
              </div>
            </div>
          </div>
        </MicroAnimations>
      )}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Left Panel - Navigation */}
          <div className="xl:col-span-3">
            <MicroAnimations type="slideUp" delay={0.1}>
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-6 sticky top-24 shadow-lg">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-2">Editor</h2>
                  <p className="text-sm text-gray-500">Customize your page</p>
                </div>
                
                <nav className="space-y-3">
                  {tabs.map((tab, index) => {
                    const IconComponent = tab.icon;
                    return (
                      <HoverAnimation key={tab.id} hoverScale={1.02}>
                        <button
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 group ${
                            activeTab === tab.id
                              ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-md'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                            activeTab === tab.id 
                              ? 'bg-white/20' 
                              : 'bg-gray-100 group-hover:bg-gray-200'
                          }`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold">{tab.label}</div>
                            <div className="text-xs opacity-75">{tab.description}</div>
                          </div>
                          {activeTab === tab.id && (
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          )}
                        </button>
                      </HoverAnimation>
                    );
                  })}
                </nav>
                
                {/* Quick Actions */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => window.open(`/${params.slug}`, '_blank')}
                      className="w-full flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
                    >
                      <Eye className="w-4 h-4" />
                      Preview Page
                    </button>
                    <button
                      onClick={copyPublicLink}
                      className="w-full flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
                    >
                      <Copy className="w-4 h-4" />
                      Copy Link
                    </button>
                  </div>
                </div>
              </div>
            </MicroAnimations>
          </div>

          {/* Center Panel - Editor */}
          <div className="xl:col-span-5">
            <MicroAnimations type="slideUp" delay={0.2}>
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-lg">
                {/* Enhanced Tab Content */}
                <div className="p-8">
                  {activeTab === 'links' && (
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <LinkIcon className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Links</h2>
                        <p className="text-gray-600">Add buttons that link to all of your content in one place.</p>
                      </div>
                      <LinkManager 
                        links={business.links}
                        onLinksChange={updateLinks}
                      />
                    </div>
                  )}
                
                  {activeTab === 'appearance' && (
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <Palette className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Design Studio</h2>
                        <p className="text-gray-600">Advanced styling and customization options.</p>
                      </div>
                      <AdvancedThemeEditor
                        theme={business.theme}
                        onThemeChange={updateTheme}
                      />
                    </div>
                  )}
                
                  {activeTab === 'services' && (
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <Briefcase className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Services</h2>
                        <p className="text-gray-600">Showcase your services with prices and booking options.</p>
                      </div>
                      <ServiceEditor
                        services={business.services}
                        layout={business.layout}
                        onServicesChange={updateServices}
                        onLayoutChange={updateLayout}
                      />
                    </div>
                  )}
                
                  {activeTab === 'settings' && (
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile & Settings</h2>
                        <p className="text-gray-600">Update your profile information and contact details.</p>
                      </div>
                      
                      <ProfileEditor
                        businessName={business.name}
                        profile={business.profile}
                        onNameChange={updateBusinessName}
                        onProfileChange={updateProfile}
                      />
                      
                      {/* Contact Information */}
                      <div className="space-y-4">
                        <h3 className="font-medium text-gray-900">Contact Information</h3>
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
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
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
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                              placeholder="@yourbusiness"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </MicroAnimations>
          </div>

          {/* Right Panel - Live Preview */}
          <div className="xl:col-span-4">
            <MicroAnimations type="slideUp" delay={0.3}>
              <AnimatedPreview business={business} />
            </MicroAnimations>
          </div>
          
        </div>
      </div>
    </div>
  );
}