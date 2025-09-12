'use client';

import { Business } from '@/types';
import { getBackgroundStyle, getTextStyle, getButtonStyle, getFontClass } from '@/lib/themes';
import { ExternalLink, Phone, Mail, Instagram, Globe, Eye } from 'lucide-react';

interface LivePreviewProps {
  business: Business;
}

export default function LivePreview({ business }: LivePreviewProps) {
  const { theme, profile, links, services, layout } = business;

  const handleLinkClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent actual navigation in preview
  };

  return (
    <div className="sticky top-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        {/* Clean Preview Header */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center">
                <Eye className="w-4 h-4 text-slate-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Preview</h3>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              Live
            </div>
          </div>
        </div>

        {/* Clean iPhone Mockup */}
        <div className="p-4">
          <div className="relative mx-auto w-[320px]">
            {/* Minimal iPhone Frame */}
            <div className="relative bg-black rounded-[2.5rem] p-1 shadow-xl">
              <div className="bg-white rounded-[2rem] overflow-hidden h-[640px] relative">
                {/* iPhone Notch */}
                <div className="relative bg-black h-5 rounded-b-2xl mx-auto w-32 mb-2 flex items-center justify-center">
                  <div className="w-12 h-0.5 bg-gray-600 rounded-full"></div>
                </div>
                
                {/* Minimal Status Bar */}
                <div className="flex justify-between items-center px-4 mb-2 text-black text-xs">
                  <span className="font-medium">9:41</span>
                  <div className="flex items-center gap-1">
                    <div className="w-6 h-3 border border-black rounded-sm">
                      <div className="w-4 h-1 bg-green-500 rounded-sm m-0.5"></div>
                    </div>
                  </div>
                </div>
            
                {/* Clean Preview Content */}
                <div 
                  className={`h-full overflow-y-auto ${getBackgroundStyle(theme)} ${getFontClass(theme.font)}`}
                  style={{
                    fontFamily: theme.font === 'inter' ? 'Inter, sans-serif' : 
                               theme.font === 'caveat' ? 'Caveat, cursive' : undefined,
                    height: 'calc(100% - 3rem)'
                  }}
                >

                  <div className="px-3 pb-6">
                    {/* Profile Section */}
                    <div className="text-center py-4">
                      {/* Avatar */}
                      {profile.avatar && (
                        <div className="mb-3">
                          <img
                            src={profile.avatar}
                            alt="Avatar"
                            className="w-16 h-16 rounded-full mx-auto border-2 border-white shadow-sm"
                          />
                        </div>
                      )}

                      {/* Business Name */}
                      <h1 
                        className={`text-lg font-bold mb-2 ${getTextStyle(theme)}`}
                        style={{ color: theme.textColor }}
                      >
                        {business.name}
                      </h1>

                      {/* Bio */}
                      {profile.bio && (
                        <p 
                          className={`text-xs opacity-75 mb-3 ${getTextStyle(theme)}`}
                          style={{ color: theme.textColor }}
                        >
                          {profile.bio}
                        </p>
                      )}
                    </div>

                    {/* Custom Links */}
                    {links.filter(link => link.visible).length > 0 && (
                      <div className="space-y-2 mb-6">
                        {links.filter(link => link.visible).map((link) => (
                          <button
                            key={link.id}
                            onClick={handleLinkClick}
                            className={`w-full p-3 text-left transition-all duration-200 ${getButtonStyle(theme)}`}
                            style={{
                              backgroundColor: theme.primaryColor,
                              color: theme.style === 'neon' ? theme.textColor : 'white'
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 flex items-center justify-center">
                                {link.type === 'url' && <Globe className="w-3 h-3" />}
                                {link.type === 'email' && <Mail className="w-3 h-3" />}
                                {link.type === 'phone' && <Phone className="w-3 h-3" />}
                                {link.type === 'social' && <Instagram className="w-3 h-3" />}
                                {link.type === 'payment' && <span className="text-xs">$</span>}
                              </div>
                              <span className="text-sm font-medium">{link.title}</span>
                              <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Services Section */}
                    {layout.showServices && services.length > 0 && (
                      <div className="space-y-3">
                        <h2 
                          className={`text-sm font-semibold text-center ${getTextStyle(theme)}`}
                          style={{ color: theme.textColor }}
                        >
                          Services
                        </h2>
                        
                        <div className={`space-y-2 ${
                          layout.servicesStyle === 'grid' ? 'grid grid-cols-2 gap-2 space-y-0' : ''
                        }`}>
                          {services.map((service, index) => (
                            <div
                              key={index}
                              className={`${
                                layout.servicesStyle === 'minimal' 
                                  ? 'flex justify-between items-center py-1.5 border-b border-gray-200/50' 
                                  : 'bg-white/80 rounded-lg p-2 shadow-sm border border-white/20'
                              }`}
                            >
                              {service.image && layout.servicesStyle === 'cards' && (
                                <img
                                  src={service.image}
                                  alt={service.name}
                                  className="w-full h-12 object-cover rounded mb-1"
                                />
                              )}
                              
                              <div className={layout.servicesStyle === 'minimal' ? 'flex justify-between items-center w-full' : ''}>
                                <h3 
                                  className={`font-medium text-xs ${getTextStyle(theme)}`}
                                  style={{ color: theme.textColor }}
                                >
                                  {service.name}
                                </h3>
                                <span 
                                  className="font-bold text-xs"
                                  style={{ color: theme.primaryColor }}
                                >
                                  {service.price}
                                </span>
                              </div>
                              
                              {layout.servicesStyle !== 'minimal' && (
                                <button
                                  onClick={handleLinkClick}
                                  className="w-full mt-1 py-1 px-2 text-xs rounded transition-all duration-200"
                                  style={{
                                    backgroundColor: theme.primaryColor,
                                    color: 'white'
                                  }}
                                >
                                  Book
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Contact Buttons */}
                    <div className="space-y-1.5 mt-3">
                      <button
                        onClick={handleLinkClick}
                        className={`w-full py-1.5 px-2 text-xs font-medium transition-all duration-200 ${getButtonStyle(theme)}`}
                        style={{
                          backgroundColor: '#25D366',
                          color: 'white'
                        }}
                      >
                        💬 WhatsApp
                      </button>
                      
                      <button
                        onClick={handleLinkClick}
                        className={`w-full py-1.5 px-2 text-xs font-medium transition-all duration-200 ${getButtonStyle(theme)}`}
                        style={{
                          backgroundColor: theme.textColor,
                          color: theme.backgroundColor
                        }}
                      >
                        📞 Call
                      </button>
                    </div>

                    {/* Clean Footer */}
                    <div className="text-center mt-4 pt-3 border-t border-gray-200/30">
                      <p className="text-xs text-gray-400">
                        Made with TapBook
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}