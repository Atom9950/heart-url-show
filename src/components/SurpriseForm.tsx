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
      maxSizeMB: 0.05,  // Even more aggressive compression for URL sharing
      maxWidthOrHeight: 300,  // Smaller dimensions
      useWebWorker: true,
      fileType: 'image/jpeg',
      initialQuality: 0.4,  // Lower quality for smaller size
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
    maxFiles: 2,  // Reduced to 2 images for URL size
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length + formData.images.length > 2) {
        toast({
          title: "Too many images",
          description: "Maximum 2 images allowed for shareable links",
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
        // Store only the file name for music
        setFormData(prev => ({
          ...prev,
          music: acceptedFiles[0].name,
        }));
        toast({
          title: "Music noted",
          description: "Background music name saved (audio files cannot be shared via URL)",
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
      // Create the data object without music files (only name)
      const dataToEncode = {
        ...formData,
        music: formData.music ? formData.music : undefined
      };
      
      const dataString = JSON.stringify(dataToEncode);
      console.log('Original data size:', dataString.length, 'characters');
      
      // Compress the data using LZString
      const compressedData = LZString.compressToEncodedURIComponent(dataString);
      console.log('Compressed data size:', compressedData.length, 'characters');
      
      // Create the shareable URL
      const url = `${window.location.origin}${window.location.pathname}#/surprise?data=${compressedData}`;
      console.log('Final URL length:', url.length, 'characters');
      
      // Check if URL is too long (most browsers support ~2000 chars)
      if (url.length > 8000) {
        toast({
          title: "Link too large",
          description: "Please use smaller images or fewer images to create a shareable link",
          variant: "destructive",
        });
        return;
      }
      
      // Copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Shareable link copied! 🎉",
          description: "Share this magical surprise link with your loved one - it works on any device!",
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
            title: "Shareable link generated! 🎉",
            description: "Link copied! Share this magical surprise with your loved one - it works on any device!",
          });
        } catch (execError) {
          toast({
            title: "Link generated! 📱",
            description: "Copy the URL from your browser address bar to share",
          });
        }
        
        document.body.removeChild(textArea);
      }
      
    } catch (error) {
      console.error('Error generating URL:', error);
      toast({
        title: "Generation failed",
        description: "Failed to create surprise link. Try using smaller or fewer images.",
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
              Craft a romantic birthday surprise that works on any device 📱💻
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
                Romantic Photos (Up to 2 for sharing)
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
                  JPG, PNG - automatically optimized for sharing
                </p>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mt-4">
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
                        className="w-full h-24 object-cover rounded-lg"
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
                Background Music (Name Only)
              </Label>
              <div
                {...getMusicProps()}
                className="mt-2 border-2 border-dashed border-gold/30 rounded-lg p-6 text-center cursor-pointer hover:border-gold/50 transition-colors bg-input/50 hover:scale-105 transform duration-200"
              >
                <input {...getMusicInputProps()} />
                <Music className="w-6 h-6 text-gold mx-auto mb-2" />
                <p className="text-foreground text-sm">
                  {formData.music ? `Music: ${formData.music} ✨` : 'Add a romantic song name'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Note: Only song name is saved for sharing
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
                Create Shareable Surprise Link ✨
              </Button>
            </motion.div>

            <div className="text-center text-sm text-muted-foreground">
              💡 Your surprise will be encoded in the URL - works on any device!
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};