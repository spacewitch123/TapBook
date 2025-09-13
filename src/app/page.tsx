'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { generateUniqueSlug, generateEditToken, validateWhatsApp, formatWhatsAppNumber } from '@/lib/utils';
import { THEME_PRESETS, BUSINESS_TYPES, getSmartDefaultTheme } from '@/lib/themes';
import { Upload, ArrowRight, ArrowLeft, Check, Instagram, Facebook, Twitter, Youtube, Linkedin, Music, Globe, Sparkles } from 'lucide-react';

const SOCIAL_PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'from-purple-500 to-pink-500', placeholder: '@yourbusiness' },
  { id: 'tiktok', name: 'TikTok', icon: Music, color: 'from-black to-red-500', placeholder: '@yourbusiness' },
  { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'from-blue-400 to-blue-600', placeholder: '@yourbusiness' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'from-red-500 to-red-600', placeholder: 'YourChannel' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'from-blue-600 to-blue-700', placeholder: 'yourpage' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'from-blue-500 to-blue-600', placeholder: 'yourprofile' },
  { id: 'website', name: 'Website', icon: Globe, color: 'from-gray-600 to-gray-700', placeholder: 'https://yourwebsite.com' }
];

export default function HomePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '' as keyof typeof BUSINESS_TYPES | '',
    bio: '',
    avatar: null as string | null,
    whatsapp: '',
    selectedPlatforms: [] as string[],
    handles: {} as Record<string, string>
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      setError('Image must be less than 1MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData({ ...formData, avatar: base64String });
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const togglePlatform = (platformId: string) => {
    const updatedPlatforms = formData.selectedPlatforms.includes(platformId)
      ? formData.selectedPlatforms.filter(id => id !== platformId)
      : [...formData.selectedPlatforms, platformId];
    
    setFormData({ 
      ...formData, 
      selectedPlatforms: updatedPlatforms,
      handles: platformId in formData.handles ? formData.handles : { ...formData.handles }
    });
  };

  const updateHandle = (platformId: string, value: string) => {
    setFormData({
      ...formData,
      handles: { ...formData.handles, [platformId]: value }
    });
  };

  const nextStep = () => {
    setError('');
    
    if (currentStep === 1) {
      if (!formData.businessName.trim()) {
        setError('Business name is required');
        return;
      }
      if (!formData.businessType) {
        setError('Please select your business type');
        return;
      }
    }
    
    if (currentStep === 2) {
      if (formData.selectedPlatforms.length === 0) {
        setError('Select at least one platform');
        return;
      }
    }
    
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    setError('');
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      // Final validation
      if (!formData.whatsapp.trim()) {
        throw new Error('WhatsApp number is required');
      }

      if (!validateWhatsApp(formData.whatsapp)) {
        throw new Error('Please enter a valid WhatsApp number');
      }

      // Generate unique slug and edit token
      const slug = await generateUniqueSlug(formData.businessName);
      const editToken = generateEditToken();

      // Create links from selected platforms
      const links = formData.selectedPlatforms.map((platformId, index) => ({
        id: `link-${Date.now()}-${index}`,
        title: SOCIAL_PLATFORMS.find(p => p.id === platformId)?.name || platformId,
        url: formData.handles[platformId] || '',
        type: platformId === 'website' ? 'url' : 'social',
        icon: platformId,
        visible: true
      }));

      // Save to database
      const { data, error: dbError } = await supabase
        .from('businesses')
        .insert({
          slug,
          name: formData.businessName.trim(),
          whatsapp: formatWhatsAppNumber(formData.whatsapp),
          services: [], // Start with no services
          theme: getSmartDefaultTheme(formData.businessType || undefined), // Smart theme based on business type
          profile: {
            avatar: formData.avatar,
            bio: formData.bio.trim() || null
          },
          links,
          layout: {
            showServices: false, // Hide services by default
            servicesStyle: 'cards',
            linkOrder: []
          },
          edit_token: editToken
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Redirect to public page with success message
      router.push(`/${slug}?success=true&edit=${editToken}`);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">TapBook</h1>
            </div>
            <p className="text-xl text-gray-700 font-medium">Create your link in bio page</p>
            <p className="text-gray-500 mt-1">Get started in under 2 minutes • Free forever</p>
          </div>

          {/* Progress Stepper */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                  currentStep > step ? 'bg-emerald-500 text-white shadow-lg' :
                  currentStep === step ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-lg' :
                  'bg-slate-200 text-slate-500'
                }`}>
                  {currentStep > step ? <Check className="w-5 h-5" /> : step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 rounded-full transition-all duration-300 ${
                    currentStep > step ? 'bg-emerald-500' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Labels */}
          <div className="flex justify-center mb-8">
            <div className="flex gap-8 text-sm">
              <span className={`text-center transition-colors ${
                currentStep >= 1 ? 'text-indigo-600 font-medium' : 'text-slate-400'
              }`}>Basic Info</span>
              <span className={`text-center transition-colors ${
                currentStep >= 2 ? 'text-indigo-600 font-medium' : 'text-slate-400'
              }`}>Social Platforms</span>
              <span className={`text-center transition-colors ${
                currentStep >= 3 ? 'text-indigo-600 font-medium' : 'text-slate-400'
              }`}>Your Handles</span>
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Let&apos;s start with the basics</h2>
                  <p className="text-gray-600">Tell us about your business and add a profile picture</p>
                </div>

                <div className="space-y-6">
                  {/* Business Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg bg-white/80"
                      placeholder="Your Business Name"
                    />
                  </div>

                  {/* Business Type Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      What type of business is this? *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(BUSINESS_TYPES).map(([key, businessType]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setFormData({ ...formData, businessType: key as keyof typeof BUSINESS_TYPES })}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 text-left ${
                            formData.businessType === key
                              ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                              : 'border-slate-200 hover:border-slate-300 bg-white/80'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="text-2xl">{businessType.icon}</div>
                            <div>
                              <h3 className="font-semibold text-gray-900 text-sm">{businessType.name}</h3>
                              <p className="text-xs text-gray-500 mt-1">{businessType.description}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    {formData.businessType && (
                      <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                        <p className="text-sm text-blue-700">
                          <span className="font-medium">Perfect!</span> We'll set up your page with the{' '}
                          <span className="font-semibold">{BUSINESS_TYPES[formData.businessType].recommendedTheme}</span> theme 
                          that works great for {BUSINESS_TYPES[formData.businessType].name.toLowerCase()}.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Profile Picture */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Profile Picture (optional)
                    </label>
                    <div className="flex items-center gap-4">
                      {formData.avatar ? (
                        <img
                          src={formData.avatar}
                          alt="Profile"
                          className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                      ) : (
                        <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center text-gray-400">
                          <Upload className="w-8 h-8" />
                        </div>
                      )}
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="avatar-upload"
                        />
                        <label
                          htmlFor="avatar-upload"
                          className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                          {formData.avatar ? 'Change Photo' : 'Upload Photo'}
                        </label>
                        <p className="text-xs text-gray-500 mt-1">Max 1MB • JPG, PNG</p>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bio (optional)
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm resize-none bg-white/80"
                      placeholder="Tell people about your business..."
                      rows={3}
                      maxLength={150}
                    />
                    <p className="text-xs text-gray-500 mt-1">{formData.bio.length}/150 characters</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Social Platforms */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Which platforms do you use?</h2>
                  <p className="text-gray-600">Select the social media platforms you want to include</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {SOCIAL_PLATFORMS.map((platform) => {
                    const IconComponent = platform.icon;
                    const isSelected = formData.selectedPlatforms.includes(platform.id);
                    
                    return (
                      <button
                        key={platform.id}
                        onClick={() => togglePlatform(platform.id)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                            : 'border-slate-200 hover:border-slate-300 bg-white/80'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${platform.color} flex items-center justify-center`}>
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-gray-900">{platform.name}</div>
                            {isSelected && (
                              <div className="text-xs text-indigo-600 font-medium">✓ Selected</div>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="text-center text-sm text-gray-500">
                  Selected {formData.selectedPlatforms.length} platform{formData.selectedPlatforms.length !== 1 ? 's' : ''}
                </div>
              </div>
            )}

            {/* Step 3: Handles */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter your handles</h2>
                  <p className="text-gray-600">Add your usernames and contact information</p>
                </div>

                <div className="space-y-4">
                  {/* WhatsApp (Required) */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/80"
                      placeholder="+1234567890"
                    />
                    <p className="text-xs text-gray-500 mt-1">This will be used for customer contact</p>
                  </div>

                  {/* Selected Platforms */}
                  {formData.selectedPlatforms.map((platformId) => {
                    const platform = SOCIAL_PLATFORMS.find(p => p.id === platformId);
                    if (!platform) return null;

                    const IconComponent = platform.icon;
                    
                    return (
                      <div key={platformId}>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-5 h-5 rounded bg-gradient-to-r ${platform.color} flex items-center justify-center`}>
                              <IconComponent className="w-3 h-3 text-white" />
                            </div>
                            {platform.name}
                          </div>
                        </label>
                        <input
                          type="text"
                          value={formData.handles[platformId] || ''}
                          onChange={(e) => updateHandle(platformId, e.target.value)}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/80"
                          placeholder={platform.placeholder}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-xs">!</span>
                  </div>
                  <p className="text-red-800 font-medium text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  currentStep === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              {currentStep < 3 ? (
                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Create My Page
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              🚀 Free forever • ⚡ No signup required • 📱 Mobile optimized
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}