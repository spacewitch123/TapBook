'use client';

import { useState } from 'react';
import { Profile } from '@/types';
import { User, Image as ImageIcon, Upload, X } from 'lucide-react';

interface ProfileEditorProps {
  businessName: string;
  profile: Profile;
  onNameChange: (name: string) => void;
  onProfileChange: (profile: Profile) => void;
}

export default function ProfileEditor({ 
  businessName,
  profile, 
  onNameChange,
  onProfileChange 
}: ProfileEditorProps) {
  const [uploadType, setUploadType] = useState<'avatar' | 'cover' | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    const file = event.target.files?.[0];
    if (!file) return;

    const maxSize = type === 'avatar' ? 500 * 1024 : 1024 * 1024; // 500KB for avatar, 1MB for cover
    if (file.size > maxSize) {
      alert(`Image must be less than ${type === 'avatar' ? '500KB' : '1MB'}`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onProfileChange({
        ...profile,
        [type === 'avatar' ? 'avatar' : 'coverImage']: base64String
      });
      setUploadType(null);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (type: 'avatar' | 'cover') => {
    onProfileChange({
      ...profile,
      [type === 'avatar' ? 'avatar' : 'coverImage']: null
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <User className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-semibold text-gray-900">Profile</h3>
      </div>

      {/* Business Name */}
      <div>
        <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
          Business Name
        </label>
        <input
          type="text"
          id="businessName"
          value={businessName}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Your Business Name"
        />
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
          Bio (optional)
        </label>
        <textarea
          id="bio"
          value={profile.bio || ''}
          onChange={(e) => onProfileChange({ ...profile, bio: e.target.value || null })}
          maxLength={160}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          placeholder="Tell customers about your business..."
        />
        <p className="text-xs text-gray-500 mt-1">
          {(profile.bio || '').length}/160 characters
        </p>
      </div>

      {/* Avatar Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profile Picture
        </label>
        
        <div className="flex items-center gap-4">
          {profile.avatar ? (
            <div className="relative">
              <img
                src={profile.avatar}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <button
                onClick={() => removeImage('avatar')}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center text-gray-400">
              <User className="w-8 h-8" />
            </div>
          )}
          
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'avatar')}
              className="hidden"
              id="avatar-upload"
            />
            <label
              htmlFor="avatar-upload"
              className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm cursor-pointer hover:bg-gray-50"
            >
              <Upload className="w-4 h-4" />
              {profile.avatar ? 'Change' : 'Upload'} Picture
            </label>
            <p className="text-xs text-gray-500 mt-1">Max 500KB</p>
          </div>
        </div>
      </div>

      {/* Cover Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cover Image (optional)
        </label>
        
        {profile.coverImage ? (
          <div className="relative">
            <img
              src={profile.coverImage}
              alt="Cover"
              className="w-full h-32 object-cover rounded-lg"
            />
            <button
              onClick={() => removeImage('cover')}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
            <div className="text-center">
              <ImageIcon className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">No cover image</p>
            </div>
          </div>
        )}
        
        <div className="mt-3">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, 'cover')}
            className="hidden"
            id="cover-upload"
          />
          <label
            htmlFor="cover-upload"
            className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm cursor-pointer hover:bg-gray-50"
          >
            <Upload className="w-4 h-4" />
            {profile.coverImage ? 'Change' : 'Upload'} Cover Image
          </label>
          <p className="text-xs text-gray-500 mt-1">Max 1MB • Recommended: 1200x400px</p>
        </div>
      </div>
    </div>
  );
}