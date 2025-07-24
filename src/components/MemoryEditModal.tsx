import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Camera, Save, Trash2, Heart } from 'lucide-react';

interface Memory {
  id: string;
  title: string;
  description: string;
  date: string;
  photos: string[];
  location?: string;
  tags?: string[];
}

interface MemoryEditModalProps {
  memory: Memory | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (memory: Memory) => void;
  onDelete?: (memoryId: string) => void;
}

export const MemoryEditModal: React.FC<MemoryEditModalProps> = ({
  memory,
  isOpen,
  onClose,
  onSave,
  onDelete
}) => {
  const [editedMemory, setEditedMemory] = useState<Memory | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (memory) {
      setEditedMemory({ ...memory });
    }
  }, [memory]);

  const handleSave = () => {
    if (editedMemory) {
      onSave(editedMemory);
      onClose();
    }
  };

  const handleDelete = () => {
    if (editedMemory && onDelete) {
      onDelete(editedMemory.id);
      onClose();
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && editedMemory) {
      setIsUploading(true);
      
      // Simulate file upload (in real app, upload to server)
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setEditedMemory(prev => prev ? {
            ...prev,
            photos: [...prev.photos, result]
          } : null);
        };
        reader.readAsDataURL(file);
      });
      
      setTimeout(() => setIsUploading(false), 1000);
    }
  };

  const removePhoto = (index: number) => {
    if (editedMemory) {
      setEditedMemory({
        ...editedMemory,
        photos: editedMemory.photos.filter((_, i) => i !== index)
      });
    }
  };

  const addTag = (tag: string) => {
    if (editedMemory && tag.trim()) {
      setEditedMemory({
        ...editedMemory,
        tags: [...(editedMemory.tags || []), tag.trim()]
      });
    }
  };

  const removeTag = (index: number) => {
    if (editedMemory) {
      setEditedMemory({
        ...editedMemory,
        tags: editedMemory.tags?.filter((_, i) => i !== index) || []
      });
    }
  };

  if (!editedMemory) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div
              className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <Heart className="w-6 h-6 text-pink-400" />
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
                    Edit Memory for AKSHITA
                  </h2>
                </div>
                
                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5 text-white/70" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Memory Title
                    </label>
                    <input
                      type="text"
                      value={editedMemory.title}
                      onChange={(e) => setEditedMemory({ ...editedMemory, title: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-transparent transition-all"
                      placeholder="A beautiful moment with AKSHITA..."
                    />
                  </div>

                  {/* Date and Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Date
                      </label>
                      <input
                        type="date"
                        value={editedMemory.date}
                        onChange={(e) => setEditedMemory({ ...editedMemory, date: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-transparent transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={editedMemory.location || ''}
                        onChange={(e) => setEditedMemory({ ...editedMemory, location: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-transparent transition-all"
                        placeholder="Where this happened..."
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Description
                    </label>
                    <textarea
                      value={editedMemory.description}
                      onChange={(e) => setEditedMemory({ ...editedMemory, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-transparent transition-all resize-none"
                      placeholder="Tell the story of this beautiful moment with AKSHITA..."
                    />
                  </div>

                  {/* Photos */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                        <Camera className="w-4 h-4" />
                        Photos
                      </label>
                      
                      <motion.button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm rounded-lg hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isUploading ? 'Uploading...' : 'Add Photos'}
                      </motion.button>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />

                    {/* Photo Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {editedMemory.photos.map((photo, index) => (
                        <motion.div
                          key={index}
                          className="relative group"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <img
                            src={photo}
                            alt={`Memory ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          
                          <motion.button
                            onClick={() => removePhoto(index)}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <X className="w-3 h-3" />
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Tags
                    </label>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {editedMemory.tags?.map((tag, index) => (
                        <motion.span
                          key={index}
                          className="px-3 py-1 bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 text-sm rounded-full border border-pink-400/30 flex items-center gap-2"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {tag}
                          <button
                            onClick={() => removeTag(index)}
                            className="hover:text-pink-200 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </motion.span>
                      ))}
                    </div>
                    
                    <input
                      type="text"
                      placeholder="Add a tag and press Enter..."
                      className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-transparent transition-all text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addTag(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-white/10 bg-black/20">
                <div className="flex gap-3">
                  {onDelete && (
                    <motion.button
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </motion.button>
                  )}
                </div>

                <div className="flex gap-3">
                  <motion.button
                    onClick={onClose}
                    className="px-6 py-2 bg-white/10 text-white/80 rounded-lg hover:bg-white/20 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button
                    onClick={handleSave}
                    className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};