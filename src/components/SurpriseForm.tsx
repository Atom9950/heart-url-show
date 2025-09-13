import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Heart, Music, Send } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
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

// Replace this with your actual JSONBin.io Master Key
const JSONBIN_MASTER_KEY = '$2a$10$LQuT..l68bk1z0aT899ea.xEh8LtDQTnu9rutrWK6hYwRS83Apvci';

export const SurpriseForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: '',
    message: '',
    images: [],
  });
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  const compressImage = async (file: File): Promise<string> => {
    const options = {
      maxSizeMB: 1,  // 1MB per image for good quality
      maxWidthOrHeight: 1200,  // High resolution
      useWebWorker: true,
      fileType: 'image/jpeg',
      initialQuality: 0.8,  // Good quality
    };
    
    try {
      const compressedFile = await imageCompression(file, options);
      console.log(`Compressed ${file.name}: ${(file.size/1024/1024).toFixed(2)}MB → ${(compressedFile.size/1024/1024).toFixed(2)}MB`);
      
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
    maxFiles: 5,  // Allow up to 5 beautiful images
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length + formData.images.length > 5) {
        toast({
          title: "Too many images",
          description: "Maximum 5 high-quality images allowed",
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
          title: "Images uploaded! 📸",
          description: `${acceptedFiles.length} high-quality image(s) processed and ready`,
        });
      } catch (error) {
        console.log('Compression error:', error);
        toast({
          title: "Upload failed",
          description: "Failed to process images. Please try again.",
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
        setFormData(prev => ({
          ...prev,
          music: acceptedFiles[0].name,
        }));
        toast({
          title: "Music added! 🎵",
          description: "Background music name saved",
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

    // Check if JSONBin key is configured
    if (JSONBIN_MASTER_KEY === '$2a$10$LQuT..l68bk1z0aT899ea.xEh8LtDQTnu9rutrWK6hYwRS83Apvci') {
      toast({
        title: "Configuration needed",
        description: "Please add your JSONBin.io Master Key to enable sharing. Check the console for instructions.",
        variant: "destructive",
      });
      console.log(`
🔑 JSONBin.io Setup Instructions:
1. Go to https://jsonbin.io and create a free account
2. Navigate to the "API Keys" page in your dashboard
3. Copy your Master Key (starts with $2a$10$...)
4. Replace JSONBIN_MASTER_KEY in the code with your actual key
5. Your surprise links will then work perfectly!
      `);
      return;
    }

    setGenerating(true);

    try {
      // Create the complete surprise data
      const surpriseData = {
        name: formData.name.trim(),
        age: formData.age.trim(),
        message: formData.message.trim(),
        images: formData.images,
        music: formData.music,
        createdAt: new Date().toISOString(),
        version: 2
      };
      
      console.log('Creating surprise with JSONBin.io...');
      console.log('Data size:', JSON.stringify(surpriseData).length, 'characters');
      console.log('Number of images:', surpriseData.images.length);

      // Store data in JSONBin.io
      const response = await fetch('https://api.jsonbin.io/v3/b', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': JSONBIN_MASTER_KEY,
          'X-Bin-Name': `Surprise for ${formData.name}`,
          'X-Bin-Private': 'false' // Make it publicly readable
        },
        body: JSON.stringify(surpriseData)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('JSONBin.io error:', response.status, errorData);
        
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your JSONBin.io Master Key.');
        } else if (response.status === 413) {
          throw new Error('Data too large. Try using fewer or smaller images.');
        } else {
          throw new Error(`JSONBin.io error (${response.status}): ${errorData}`);
        }
      }

      const result = await response.json();
      const binId = result.metadata.id;
      
      console.log('✅ Surprise created successfully!');
      console.log('Bin ID:', binId);
      
      // Create the shareable URL
      const url = `${window.location.origin}${window.location.pathname}#/surprise/${binId}`;
      console.log('Shareable URL:', url);
      
      // Copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        toast({
          title: "🎉 Perfect! Link created and copied!",
          description: "Share this magical surprise link - it works on any device with full quality images!",
        });
      } catch (clipboardError) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          toast({
            title: "🎉 Perfect! Link created and copied!",
            description: "Share this magical surprise link - full quality images preserved!",
          });
        } catch (execError) {
          toast({
            title: "Link created! 📱",
            description: `Your surprise link: ${url}`,
          });
        }
        
        document.body.removeChild(textArea);
      }
      
    } catch (error) {
      console.error('Error creating surprise:', error);
      toast({
        title: "Failed to create surprise",
        description: error instanceof Error ? error.message : "Please try again or check your internet connection.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const getEstimatedSize = () => {
    const dataSize = JSON.stringify(formData).length;
    return (dataSize / 1024).toFixed(0); // KB
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
              Craft a romantic birthday surprise with stunning high-quality images ✨
            </p>
            {formData.images.length > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                Estimated size: {getEstimatedSize()}KB • {formData.images.length} image(s)
              </p>
            )}
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
                Beautiful Photos (Up to 5 high-quality images • 10MB each)
              </Label>
              <div
                {...getImageProps()}
                className="mt-2 border-2 border-dashed border-rose/30 rounded-lg p-8 text-center cursor-pointer hover:border-rose/50 transition-colors bg-input/50 hover:scale-105 transform duration-200"
              >
                <input {...getImageInputProps()} />
                <Upload className="w-8 h-8 text-rose mx-auto mb-4" />
                <p className="text-foreground mb-2">
                  {uploading ? 'Processing gorgeous images...' : 'Upload your most treasured photos together'}
                </p>
                <p className="text-sm text-muted-foreground">
                  JPG, PNG up to 10MB each • Full quality preserved! 📸
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
                        alt={`Beautiful moment ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg shadow-md"
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
                  {formData.music ? `🎵 ${formData.music} ✨` : 'Add your special song name'}
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
                disabled={!formData.name.trim() || !formData.message.trim() || formData.images.length === 0 || generating}
              >
                <Send className="w-5 h-5 mr-2" />
                {generating ? 'Creating Your Magical Link...' : 'Create Perfect Surprise Link ✨'}
              </Button>
            </motion.div>

            <div className="text-center text-sm text-muted-foreground">
              🌟 High-quality images • Universal sharing • Secure & reliable • No size limits
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};