'use client';

import { useState } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Plus, 
  GripVertical, 
  Eye, 
  EyeOff, 
  Trash2, 
  ExternalLink,
  Mail,
  Phone,
  DollarSign,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  Globe,
  Music
} from 'lucide-react';
import { CustomLink } from '@/types';

interface LinkManagerProps {
  links: CustomLink[];
  onLinksChange: (links: CustomLink[]) => void;
}

interface SortableLinkProps {
  link: CustomLink;
  onUpdate: (link: CustomLink) => void;
  onDelete: (id: string) => void;
}

const LINK_TYPES = [
  { value: 'url', label: 'Website', icon: Globe },
  { value: 'social', label: 'Social', icon: Instagram },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'phone', label: 'Phone', icon: Phone },
  { value: 'payment', label: 'Payment', icon: DollarSign }
];

const SOCIAL_ICONS: Record<string, any> = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
  tiktok: Music, // Using Music icon as TikTok substitute
  default: Globe
};

function SortableLink({ link, onUpdate, onDelete }: SortableLinkProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const IconComponent = SOCIAL_ICONS[link.icon] || Globe;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-slate-200 rounded-lg p-4 space-y-3"
    >
      <div className="flex items-center gap-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab text-slate-400 hover:text-slate-600"
        >
          <GripVertical className="w-4 h-4" />
        </div>
        
        <IconComponent className="w-4 h-4 text-slate-500" />
        
        <input
          type="text"
          value={link.title}
          onChange={(e) => onUpdate({ ...link, title: e.target.value })}
          className="flex-1 text-sm font-medium border-none outline-none bg-transparent"
          placeholder="Link title"
        />
        
        <button
          onClick={() => onUpdate({ ...link, visible: !link.visible })}
          className={`p-1 rounded ${link.visible ? 'text-green-600' : 'text-slate-400'}`}
        >
          {link.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
        
        <button
          onClick={() => onDelete(link.id)}
          className="p-1 text-red-500 hover:text-red-600"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <select
          value={link.type}
          onChange={(e) => onUpdate({ 
            ...link, 
            type: e.target.value as CustomLink['type']
          })}
          className="text-sm border border-slate-200 rounded px-3 py-2 bg-slate-50 focus:bg-white focus:border-slate-400 focus:outline-none"
        >
          {LINK_TYPES.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        
        <select
          value={link.icon}
          onChange={(e) => onUpdate({ ...link, icon: e.target.value })}
          className="text-sm border border-slate-200 rounded px-3 py-2 bg-slate-50 focus:bg-white focus:border-slate-400 focus:outline-none"
        >
          <option value="globe">Globe</option>
          <option value="instagram">Instagram</option>
          <option value="facebook">Facebook</option>
          <option value="twitter">Twitter</option>
          <option value="youtube">YouTube</option>
          <option value="linkedin">LinkedIn</option>
          <option value="tiktok">TikTok</option>
          <option value="mail">Email</option>
          <option value="phone">Phone</option>
          <option value="dollar">Payment</option>
        </select>
      </div>
      
      <input
        type={link.type === 'email' ? 'email' : link.type === 'phone' ? 'tel' : 'url'}
        value={link.url}
        onChange={(e) => onUpdate({ ...link, url: e.target.value })}
        className="w-full text-sm border border-slate-200 rounded px-3 py-2 bg-slate-50 focus:bg-white focus:border-slate-400 focus:outline-none"
        placeholder={
          link.type === 'email' ? 'hello@business.com' :
          link.type === 'phone' ? '+1234567890' :
          link.type === 'payment' ? 'venmo.com/username' :
          'https://example.com'
        }
      />
    </div>
  );
}

export default function LinkManager({ links, onLinksChange }: LinkManagerProps) {
  const [showAddModal, setShowAddModal] = useState(false);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = links.findIndex(link => link.id === active.id);
      const newIndex = links.findIndex(link => link.id === over?.id);
      onLinksChange(arrayMove(links, oldIndex, newIndex));
    }
  };

  const addNewLink = () => {
    const newLink: CustomLink = {
      id: `link-${Date.now()}`,
      title: 'New Link',
      url: '',
      type: 'url',
      icon: 'globe',
      visible: true
    };
    onLinksChange([...links, newLink]);
  };

  const updateLink = (updatedLink: CustomLink) => {
    onLinksChange(links.map(link => 
      link.id === updatedLink.id ? updatedLink : link
    ));
  };

  const deleteLink = (id: string) => {
    onLinksChange(links.filter(link => link.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Links</h3>
        <button
          onClick={addNewLink}
          className="flex items-center gap-2 bg-slate-900 text-white px-3 py-2 rounded-lg text-sm hover:bg-slate-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Link
        </button>
      </div>

      {links.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <ExternalLink className="w-8 h-8 mx-auto mb-2 text-slate-300" />
          <p className="text-sm">No links added yet</p>
          <p className="text-xs text-slate-400">Add custom links to showcase your content</p>
        </div>
      ) : (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={links.map(link => link.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {links.map(link => (
                <SortableLink
                  key={link.id}
                  link={link}
                  onUpdate={updateLink}
                  onDelete={deleteLink}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
      
      {links.length > 0 && (
        <p className="text-xs text-slate-500">
          Drag links to reorder them. Use the eye icon to show/hide links.
        </p>
      )}
    </div>
  );
}