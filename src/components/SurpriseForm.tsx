import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Heart, Music, Send } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import LZString from 'lz-string';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface FormData {
  name: string;
  age: string;
  message: string;
  images: string[];
  music?: string;
}

// IndexedDB utility functions
const openDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('SurpriseAppDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('surprises')) {
        db.createObjectStore('surprises', { keyPath: 'id' });
      }
    };
  });
};

const storeSurpriseData = async (id: string, data: string): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction('surprises', 'readwrite');
    const store = transaction.objectStore('surprises');
    
    return new Promise((resolve, reject) => {
      const request = store.put({ id, data, timestamp: Date.now() });
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error storing data in IndexedDB:', error);
    throw error;
  }
};

export const SurpriseForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: '',
    message: '',
    images: [],
  });
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const compressImage = async (file: File): Promise<string> => {
    const options = {
      maxSizeMB: 0.1,  // Reduced even further
      maxWidthOrHeight: 400,  // Reduced even further
      useWebWorker: true,
      fileType: 'image/jpeg',
      initialQuality: 0.6,  // Reduced quality even more
    };
    
    try {
      const compressedFile = await imageCompression(file, options);
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(compressedFile);
      });
    } catch (error) {
      console.error('Image compression failed:', error);
      throw error;
    }
  };

  const { getRootProps: getImageProps, getInputProps: getImageInputProps } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 3,  // Reduced to 3 images
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length + formData.images.length > 3) {
        toast({
          title: "Too many images",
          description: "Maximum 3 images allowed",
          variant: "destructive",
        });
        return;
      }

      setUploading(true);
      try {
        const compressedImages = await Promise.all(
          acceptedFiles.map(compressImage)
        );
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...compressedImages],
        }));
        toast({
          title: "Images uploaded",
          description: `${acceptedFiles.length} image(s) added successfully`,
        });
      } catch (error) {
        toast({
          title: "Upload failed",
          description: "Failed to process images",
          variant: "destructive",
        });
      } finally {
        setUploading(false);
      }
    },
  });

  const { getRootProps: getMusicProps, getInputProps: getMusicInputProps } = useDropzone({
    accept: { 'audio/*': [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        // Don't store music as data URL, just store the file name
        setFormData(prev => ({
          ...prev,
          music: acceptedFiles[0].name, // Store only the file name
        }));
        toast({
          title: "Music uploaded",
          description: "Background music added successfully (note: music files are not stored for sharing)",
        });
      }
    },
  });

  const generateSurpriseUrl = async () => {
    if (!formData.name.trim() || !formData.message.trim() || formData.images.length === 0) {
      toast({
        title: "Missing information",
        description: "Please fill in name, message, and add at least one image",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create a simplified version without music data URLs
      const dataToStore = {
        ...formData,
        music: formData.music ? 'has_music' : undefined // Don't store actual music data
      };
      
      const dataString = JSON.stringify(dataToStore);
      console.log('Data size to store:', dataString.length, 'characters');
      
      // Generate a unique ID for this surprise
      const surpriseId = Date.now().toString(36) + Math.random().toString(36).substr(2);
      
      // Store the data in IndexedDB
      await storeSurpriseData(surpriseId, dataString);
      
      // Create the URL with just the ID
      const url = `${window.location.origin}/#/surprise?id=${surpriseId}`;
      console.log('Final URL length:', url.length, 'characters');
      console.log('Final URL:', url);
      
      navigator.clipboard.writeText(url).then(() => {
        toast({
          title: "Link copied!",
          description: "Share this magical surprise link with your loved one",
        });
      }).catch(() => {
        // Fallback if clipboard API fails
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        toast({
          title: "Link generated!",
          description: "Copy the URL from your browser address bar",
        });
      });
    } catch (error) {
      console.error('Error generating URL:', error);
      toast({
        title: "Generation failed",
        description: "Failed to create surprise link. Try using fewer or smaller images.",
        variant: "destructive",
      });
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-romantic-dark via-background to-romantic-darker p-4">
      <div className="floating-hearts"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="bg-card/80 backdrop-blur-sm border-rose/20 shadow-2xl">
          <CardHeader className="text-center pb-8">
            <motion.div
              className="flex justify-center mb-4"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart className="w-12 h-12 text-rose fill-current" />
            </motion.div>
            <CardTitle className="text-3xl font-bold text-foreground">
              Create a Magical Surprise
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Craft a romantic birthday surprise that will make their heart flutter
            </p>
          </CardHeader>

          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className="text-foreground font-medium">
                  Their Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-2 bg-input border-rose/20 focus:border-rose"
                  placeholder="Enter their beautiful name"
                />
              </div>

              <div>
                <Label htmlFor="age" className="text-foreground font-medium">
                  Age (Optional)
                </Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                  className="mt-2 bg-input border-rose/20 focus:border-rose"
                  placeholder="How old are they turning?"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="message" className="text-foreground font-medium">
                Your Romantic Message
              </Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                className="mt-2 bg-input border-rose/20 focus:border-rose min-h-[120px] resize-none"
                placeholder="Pour your heart out... tell them how much they mean to you ❤️"
              />
            </div>

            <div>
              <Label className="text-foreground font-medium">
                Romantic Photos (Up to 3)
              </Label>
              <div
                {...getImageProps()}
                className="mt-2 border-2 border-dashed border-rose/30 rounded-lg p-8 text-center cursor-pointer hover:border-rose/50 transition-colors bg-input/50 hover:scale-105 transform duration-200"
              >
                <input {...getImageInputProps()} />
                <Upload className="w-8 h-8 text-rose mx-auto mb-4" />
                <p className="text-foreground mb-2">
                  {uploading ? 'Processing images...' : 'Drag & drop your favorite photos together'}
                </p>
                <p className="text-sm text-muted-foreground">
                  JPG, PNG up to 20MB each
                </p>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {formData.images.map((image, index) => (
                    <motion.div
                      key={index}
                      className="relative group"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <img
                        src={image}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label className="text-foreground font-medium">
                Background Music (Optional)
              </Label>
              <div
                {...getMusicProps()}
                className="mt-2 border-2 border-dashed border-gold/30 rounded-lg p-6 text-center cursor-pointer hover:border-gold/50 transition-colors bg-input/50 hover:scale-105 transform duration-200"
              >
                <input {...getMusicInputProps()} />
                <Music className="w-6 h-6 text-gold mx-auto mb-2" />
                <p className="text-foreground text-sm">
                  {formData.music ? 'Music uploaded ✨' : 'Add a romantic song (name only)'}
                </p>
              </div>
            </div>

            <motion.div
              className="pt-6"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={generateSurpriseUrl}
                className="w-full romantic-button py-6 text-lg font-semibold"
                disabled={!formData.name.trim() || !formData.message.trim() || formData.images.length === 0}
              >
                <Send className="w-5 h-5 mr-2" />
                Create Magical Surprise Link
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};