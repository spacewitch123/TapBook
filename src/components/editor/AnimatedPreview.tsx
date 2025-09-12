'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Business } from '@/types';
import { getBackgroundStyle, getTextStyle, getButtonStyle, getFontClass } from '@/lib/themes';
import { ExternalLink, Phone, Mail, Instagram, Globe, Eye, Smartphone } from 'lucide-react';

interface AnimatedPreviewProps {
  business: Business;
}

export default function AnimatedPreview({ business }: AnimatedPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (previewRef.current && phoneRef.current && contentRef.current) {
      // Initial animation
      gsap.fromTo(phoneRef.current, 
        { scale: 0.8, opacity: 0, rotationY: -15 },
        { scale: 1, opacity: 1, rotationY: 0, duration: 1, ease: "power3.out" }
      );

      // Content stagger animation
      const elements = contentRef.current.children;
      gsap.fromTo(elements,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, delay: 0.3, ease: "power2.out" }
      );
    }
  }, []);

  useEffect(() => {
    // Re-animate content when business data changes
    if (contentRef.current) {
      const elements = contentRef.current.children;
      gsap.fromTo(elements,
        { scale: 0.95, opacity: 0.7 },
        { scale: 1, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" }
      );
    }
  }, [business.theme, business.profile, business.links]);

  const { theme, profile, links, services, layout } = business;

  const handleLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Add click animation
    gsap.to(e.currentTarget, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    });
  };

  return (
    <div ref={previewRef} className="sticky top-6">
      <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Enhanced Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Live Preview</h3>
                <p className="text-white/80 text-sm">Real-time updates</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Live</span>
            </div>
          </div>
        </div>

        {/* 3D iPhone Mockup */}
        <div className="p-8 bg-gradient-to-br from-slate-100 to-slate-200">
          <div ref={phoneRef} className="relative mx-auto" style={{ width: '280px', perspective: '1000px' }}>
            {/* iPhone Frame with 3D effect */}
            <div className="relative bg-black rounded-[3rem] p-2 shadow-2xl transform-gpu" style={{ 
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)' 
            }}>
              {/* Screen */}
              <div className="bg-white rounded-[2.5rem] overflow-hidden relative" style={{ height: '580px' }}>
                {/* Dynamic Island */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-black rounded-full z-10"></div>
                
                {/* Status Bar */}
                <div className="flex justify-between items-center px-6 pt-8 pb-2 text-black text-sm font-medium">
                  <span>9:41</span>
                  <div className="flex items-center gap-1">
                    <div className="flex gap-1">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className={`w-1 h-3 rounded-full ${i < 3 ? 'bg-black' : 'bg-gray-300'}`} />
                      ))}
                    </div>
                    <div className="w-6 h-3 border border-black rounded-sm ml-1">
                      <div className="w-4 h-1 bg-green-500 rounded-sm m-0.5"></div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div 
                  ref={contentRef}
                  className={`h-full overflow-y-auto ${getBackgroundStyle(theme)} ${getFontClass(theme.font)}`}
                  style={{
                    backgroundColor: theme.style === 'minimal' ? theme.backgroundColor : undefined,
                    height: 'calc(100% - 3rem)'
                  }}
                >
                  {/* Cover Image */}
                  {profile.coverImage && (
                    <div className="relative h-24 overflow-hidden -mx-2 mb-4">
                      <img
                        src={profile.coverImage}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  )}

                  <div className="px-4 pb-8">
                    {/* Profile Section */}
                    <div className="text-center py-4">
                      {profile.avatar && (
                        <div className="mb-3">
                          <img
                            src={profile.avatar}
                            alt="Avatar"
                            className="w-16 h-16 rounded-full mx-auto border-3 border-white shadow-lg hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      )}

                      <h1 
                        className={`text-lg font-bold mb-2 ${getTextStyle(theme)}`}
                        style={{ color: theme.textColor }}
                      >
                        {business.name}
                      </h1>

                      {profile.bio && (
                        <p 
                          className={`text-xs opacity-75 mb-3 ${getTextStyle(theme)}`}
                          style={{ color: theme.textColor }}
                        >
                          {profile.bio}
                        </p>
                      )}

                      {/* Animated divider */}
                      <div 
                        className="w-12 h-0.5 mx-auto mb-4 rounded-full"
                        style={{ backgroundColor: theme.primaryColor }}
                      />
                    </div>

                    {/* Custom Links */}
                    {links.filter(link => link.visible).length > 0 && (
                      <div className="space-y-2 mb-6">
                        {links.filter(link => link.visible).map((link, index) => (
                          <button
                            key={link.id}
                            onClick={handleLinkClick}
                            className={`w-full p-3 text-left transition-all duration-300 hover:scale-105 hover:shadow-lg ${getButtonStyle(theme)}`}
                            style={{
                              backgroundColor: theme.primaryColor,
                              color: theme.style === 'neon' ? theme.textColor : 'white',
                              animationDelay: `${index * 0.1}s`
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 flex items-center justify-center">
                                {link.type === 'url' && <Globe className="w-3 h-3" />}
                                {link.type === 'email' && <Mail className="w-3 h-3" />}
                                {link.type === 'phone' && <Phone className="w-3 h-3" />}
                                {link.type === 'social' && <Instagram className="w-3 h-3" />}
                              </div>
                              <span className="text-sm font-medium flex-1">{link.title}</span>
                              <ExternalLink className="w-3 h-3 opacity-50" />
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Services */}
                    {layout.showServices && services.length > 0 && (
                      <div className="space-y-3 mb-6">
                        <h2 
                          className={`text-sm font-semibold text-center ${getTextStyle(theme)}`}
                          style={{ color: theme.textColor }}
                        >
                          Services
                        </h2>
                        
                        <div className="space-y-2">
                          {services.slice(0, 3).map((service, index) => (
                            <div
                              key={index}
                              className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-white/20 hover:shadow-md transition-all duration-300"
                            >
                              <div className="flex justify-between items-center">
                                <h3 className="font-medium text-xs text-gray-800">{service.name}</h3>
                                <span className="font-bold text-xs" style={{ color: theme.primaryColor }}>
                                  {service.price}
                                </span>
                              </div>
                              <button
                                onClick={handleLinkClick}
                                className="w-full mt-2 py-1.5 px-3 text-xs rounded transition-all duration-300 hover:scale-105"
                                style={{ backgroundColor: theme.primaryColor, color: 'white' }}
                              >
                                Book Now
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Contact Buttons */}
                    <div className="space-y-2">
                      <button
                        onClick={handleLinkClick}
                        className="w-full py-2 px-3 text-xs font-medium rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        style={{ backgroundColor: '#25D366', color: 'white' }}
                      >
                        💬 WhatsApp
                      </button>
                      
                      <button
                        onClick={handleLinkClick}
                        className="w-full py-2 px-3 text-xs font-medium rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        style={{ backgroundColor: theme.textColor, color: theme.backgroundColor }}
                      >
                        📞 Call
                      </button>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-4 pt-3 border-t border-gray-200/30">
                      <p className="text-xs text-gray-400">Made with TapBook</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements for extra flair */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Eye className="w-4 h-4" />
              <span>Live Preview</span>
            </div>
            <div className="text-gray-500">
              {links.filter(l => l.visible).length} links • {services.length} services
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}