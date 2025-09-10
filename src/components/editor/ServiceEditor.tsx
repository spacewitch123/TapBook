'use client';

import { useState } from 'react';
import { Service, Layout } from '@/types';
import { Plus, Trash2, Image as ImageIcon, Grid3x3, List, LayoutGrid, Minus } from 'lucide-react';

interface ServiceEditorProps {
  services: Service[];
  layout: Layout;
  onServicesChange: (services: Service[]) => void;
  onLayoutChange: (layout: Layout) => void;
}

export default function ServiceEditor({ 
  services, 
  layout, 
  onServicesChange, 
  onLayoutChange 
}: ServiceEditorProps) {
  const [imageUploadIndex, setImageUploadIndex] = useState<number | null>(null);

  const addService = () => {
    const newService: Service = {
      name: '',
      price: '',
      image: undefined
    };
    onServicesChange([...services, newService]);
  };

  const updateService = (index: number, field: keyof Service, value: string) => {
    const updatedServices = [...services];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    onServicesChange(updatedServices);
  };

  const removeService = (index: number) => {
    onServicesChange(services.filter((_, i) => i !== index));
  };

  const handleImageUpload = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) { // 1MB limit
      alert('Image must be less than 1MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      updateService(index, 'image', base64String);
      setImageUploadIndex(null);
    };
    reader.readAsDataURL(file);
  };

  const serviceStyles = [
    { value: 'cards', label: 'Cards', icon: LayoutGrid },
    { value: 'list', label: 'List', icon: List },
    { value: 'grid', label: 'Grid', icon: Grid3x3 },
    { value: 'minimal', label: 'Minimal', icon: Minus }
  ];

  return (
    <div className="space-y-6">
      {/* Service Display Style */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Display</h3>
        
        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            id="showServices"
            checked={layout.showServices}
            onChange={(e) => onLayoutChange({ 
              ...layout, 
              showServices: e.target.checked 
            })}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="showServices" className="text-sm font-medium text-gray-700">
            Show services section
          </label>
        </div>

        {layout.showServices && (
          <div className="grid grid-cols-2 gap-2">
            {serviceStyles.map((style) => {
              const IconComponent = style.icon;
              return (
                <button
                  key={style.value}
                  onClick={() => onLayoutChange({ 
                    ...layout, 
                    servicesStyle: style.value as Layout['servicesStyle'] 
                  })}
                  className={`p-3 border rounded-lg text-sm font-medium transition-all ${
                    layout.servicesStyle === style.value
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="w-4 h-4 mx-auto mb-1" />
                  {style.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Services List */}
      {layout.showServices && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Services</h4>
            <button
              onClick={addService}
              className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Service
            </button>
          </div>

          <div className="space-y-4">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start gap-3">
                  {/* Service Image */}
                  <div className="flex-shrink-0">
                    {service.image ? (
                      <div className="relative group">
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <button
                            onClick={() => setImageUploadIndex(index)}
                            className="text-white text-xs"
                          >
                            Change
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setImageUploadIndex(index)}
                        className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-colors"
                      >
                        <ImageIcon className="w-6 h-6" />
                      </button>
                    )}
                    
                    {/* Hidden file input */}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(index, e)}
                      className="hidden"
                      id={`image-upload-${index}`}
                    />
                    
                    {imageUploadIndex === index && (
                      <div className="absolute z-10">
                        <label
                          htmlFor={`image-upload-${index}`}
                          className="block bg-white border border-gray-300 rounded-md px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 shadow-lg"
                        >
                          Upload Image
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Service Details */}
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={service.name}
                        onChange={(e) => updateService(index, 'name', e.target.value)}
                        placeholder="Service name"
                        className="text-sm border border-gray-300 rounded px-3 py-2"
                      />
                      <input
                        type="text"
                        value={service.price}
                        onChange={(e) => updateService(index, 'price', e.target.value)}
                        placeholder="$50"
                        className="text-sm border border-gray-300 rounded px-3 py-2"
                      />
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => removeService(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {services.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <LayoutGrid className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No services added yet</p>
                <p className="text-xs text-gray-400">Add your first service to get started</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}