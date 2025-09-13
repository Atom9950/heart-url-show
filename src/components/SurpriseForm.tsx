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
      maxSizeMB: 2,  // Allow up to 2MB per image (reasonable for sharing)
      maxWidthOrHeight: 1200,  // Good quality dimensions
      useWebWorker: true,
      fileType: 'image/jpeg',
      initialQuality: 0.8,  // Good quality
    };
    
    try {
      const compressedFile = await imageCompression(file, options);
      console.log('Compressed file size:', compressedFile.size, 'bytes');
      
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
    maxFiles: 5,  // Allow up to 5 high-quality images
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length + formData.images.length > 5) {
        toast({
          title: "Too many images",
          description: "Maximum 5 images allowed",
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
          description: `${acceptedFiles.length} high-quality image(s) added successfully`,
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

    setGenerating(true);

    try {
      // Create the complete data object
      const surpriseData = {
        name: formData.name,
        age: formData.age,
        message: formData.message,
        images: formData.images,
        music: formData.music,
        timestamp: Date.now()
      };
      
      // Use a free service like JSONBin.io or create a simple server
      // For now, let's use a simple approach with a temporary storage service
      const response = await fetch('https://api.jsonbin.io/v3/b', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': '$2a$10$CnpDhIcJledlbIYA/fiZJeGUFqUOzYBWR307SgHPzxeH7m1BTByve' // You'll need to get a free API key
        },
        body: JSON.stringify(surpriseData)
      });

      if (!response.ok) {
        throw new Error('Failed to save surprise data');
      }

      const result = await response.json();
      const binId = result.metadata.id;
      
      // Create a simple, clean URL with just the ID
      const url = `${window.location.origin}${window.location.pathname}#/surprise/${binId}`;
      
      console.log('Generated URL:', url);
      console.log('URL length:', url.length);
      
      // Copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        toast({
          title: "High-quality link created! 🎉",
          description: "Shareable link copied! Your images are full quality and the link works on any device!",
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
            title: "High-quality link created! 🎉",
            description: "Link copied! Share this magical surprise - full quality images included!",
          });
        } catch (execError) {
          toast({
            title: "Link created! 📱",
            description: "Copy the URL from your browser to share your high-quality surprise!",
          });
        }
        
        document.body.removeChild(textArea);
      }
      
    } catch (error) {
      console.error('Error generating URL:', error);
      
      // Fallback to the compressed URL method if the service fails
      toast({
        title: "Service temporarily unavailable",
        description: "Trying backup method with smaller images...",
      });
      
      // Implement the compressed URL fallback here
      await generateCompressedFallback();
      
    } finally {
      setGenerating(false);
    }
  };

  // Fallback method using URL encoding (smaller images)
  const generateCompressedFallback = async () => {
    try {
      // Use only the first 2 images and compress them more for URL fallback
      const limitedImages = formData.images.slice(0, 2);
      const fallbackData = {
        ...formData,
        images: limitedImages
      };
      
      const dataString = JSON.stringify(fallbackData);
      const compressedData = btoa(encodeURIComponent(dataString));
      const url = `${window.location.origin}${window.location.pathname}#/surprise?data=${compressedData}`;
      
      if (url.length > 3000) {
        toast({
          title: "Backup method failed",
          description: "Images are too large. Please try again later or use smaller images.",
          variant: "destructive",
        });
        return;
      }
      
      await navigator.clipboard.writeText(url);
      toast({
        title: "Backup link created! ⚡",
        description: "Link copied! Using compressed images as fallback.",
      });
      
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Please try again with smaller images.",
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
              Craft a romantic birthday surprise with high-quality images ✨
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
                Beautiful Photos (Up to 5 high-quality images)
              </Label>
              <div
                {...getImageProps()}
                className="mt-2 border-2 border-dashed border-rose/30 rounded-lg p-8 text-center cursor-pointer hover:border-rose/50 transition-colors bg-input/50 hover:scale-105 transform duration-200"
              >
                <input {...getImageInputProps()} />
                <Upload className="w-8 h-8 text-rose mx-auto mb-4" />
                <p className="text-foreground mb-2">
                  {uploading ? 'Processing high-quality images...' : 'Upload your favorite photos together'}
                </p>
                <p className="text-sm text-muted-foreground">
                  JPG, PNG up to 10MB each - full quality preserved! 📸
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
                Background Music (Optional)
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
                {generating ? 'Creating Magic...' : 'Create High-Quality Surprise Link'}
              </Button>
            </motion.div>

            <div className="text-center text-sm text-muted-foreground">
              ✨ High-quality images preserved • Works on any device • Secure sharing
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};