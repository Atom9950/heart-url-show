import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import LZString from 'lz-string';
import { RomanticIntro } from './RomanticIntro';
import { BirthdaySequence } from './BirthdaySequence';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Heart } from 'lucide-react';

interface SurpriseData {
  name: string;
  age: string;
  message: string;
  images: string[];
  music?: string;
}

export const SurpriseViewer = () => {
  const [searchParams] = useSearchParams();
  const [surpriseData, setSurpriseData] = useState<SurpriseData | null>(null);
  const [currentPhase, setCurrentPhase] = useState<'intro' | 'birthday' | 'complete'>('intro');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSurpriseData = async () => {
      try {
        setLoading(true);
        let compressedData = null;
        
        // Check for new format first: #/surprise?d=...
        if (window.location.hash) {
          const hashParts = window.location.hash.split('?');
          if (hashParts.length > 1) {
            const hashParams = new URLSearchParams(hashParts[1]);
            compressedData = hashParams.get('d') || hashParams.get('data');
          }
        }
        
        // Fallback to regular search params
        if (!compressedData) {
          compressedData = searchParams.get('d') || searchParams.get('data');
        }
        
        console.log('Found compressed data:', !!compressedData);
        console.log('Compressed data length:', compressedData?.length || 0);
        
        if (!compressedData) {
          setError('No surprise data found in the URL. The link may be incomplete.');
          return;
        }

        try {
          // Decompress the data using LZString
          console.log('Decompressing data...');
          const decompressedData = LZString.decompressFromEncodedURIComponent(compressedData);
          
          if (!decompressedData) {
            // Try base64 fallback for older links
            try {
              const fallbackData = decodeURIComponent(atob(compressedData));
              const parsed = JSON.parse(fallbackData) as SurpriseData;
              await validateAndSetData(parsed);
              return;
            } catch (fallbackError) {
              setError('Failed to decode the surprise data. The link may be corrupted.');
              return;
            }
          }
          
          console.log('Decompressed data length:', decompressedData.length);
          
          // Parse the JSON
          const parsed = JSON.parse(decompressedData) as SurpriseData;
          await validateAndSetData(parsed);
          
        } catch (decompressError) {
          console.error('Error decompressing or parsing data:', decompressError);
          setError('The surprise link appears to be corrupted or invalid. Please ask for a new link.');
        }
        
      } catch (err) {
        console.error('Error loading surprise data:', err);
        setError(`Failed to load surprise: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    const validateAndSetData = async (parsed: SurpriseData) => {
      console.log('Validating surprise data:', {
        name: parsed.name,
        imageCount: parsed.images?.length || 0,
        hasMessage: !!parsed.message,
        hasMusic: !!parsed.music,
        age: parsed.age,
        version: (parsed as any).v
      });
      
      // Validate required fields
      if (!parsed.name || !parsed.message || !parsed.images || parsed.images.length === 0) {
        setError('The surprise data is incomplete. Please check the link and try again.');
        return;
      }

      // Validate image data
      const validImages = parsed.images.filter(img => 
        typeof img === 'string' && (img.startsWith('data:image/') || img.startsWith('http'))
      );
      
      if (validImages.length === 0) {
        setError('No valid images found in the surprise data.');
        return;
      }

      // Update the parsed data with valid images only
      parsed.images = validImages;
      
      setSurpriseData(parsed);
    };

    loadSurpriseData();
  }, [searchParams]);

  const handleIntroComplete = () => {
    setCurrentPhase('birthday');
  };

  const handleBirthdayComplete = () => {
    setCurrentPhase('complete');
  };

  const handleReplay = () => {
    setCurrentPhase('intro');
  };

  const handleCreateNew = () => {
    // Navigate to home page
    window.location.href = window.location.origin + window.location.pathname;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-romantic-dark via-background to-romantic-darker flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-rose mx-auto mb-4 animate-heart-bounce" />
          <p className="text-foreground text-xl">Loading your magical surprise...</p>
          <p className="text-muted-foreground text-sm mt-2">Preparing something special ✨</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-romantic-dark via-background to-romantic-darker flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto bg-card/80 backdrop-blur-sm border-destructive/20">
          <CardContent className="p-8 text-center">
            <div className="text-4xl mb-4">💔</div>
            <h2 className="text-xl font-bold text-foreground mb-4">
              Oops! Something went wrong
            </h2>
            <p className="text-muted-foreground mb-6 text-sm">
              {error}
            </p>
            <div className="space-y-3">
              <Button
                onClick={handleCreateNew}
                className="w-full romantic-button"
              >
                <Home className="w-4 h-4 mr-2" />
                Create a New Surprise
              </Button>
              <p className="text-xs text-muted-foreground">
                💡 Tip: Make sure you copied the complete link!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!surpriseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-romantic-dark via-background to-romantic-darker flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto bg-card/80 backdrop-blur-sm border-rose/20">
          <CardContent className="p-8 text-center">
            <div className="text-4xl mb-4">🎁</div>
            <h2 className="text-xl font-bold text-foreground mb-4">
              No surprise found
            </h2>
            <p className="text-muted-foreground mb-6">
              This link doesn't contain any surprise data.
            </p>
            <Button
              onClick={handleCreateNew}
              className="w-full romantic-button"
            >
              <Heart className="w-4 h-4 mr-2" />
              Create a Magical Surprise
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentPhase === 'intro') {
    return (
      <RomanticIntro
        images={surpriseData.images}
        name={surpriseData.name}
        music={surpriseData.music}
        onComplete={handleIntroComplete}
      />
    );
  }

  if (currentPhase === 'birthday') {
    return (
      <BirthdaySequence
        name={surpriseData.name}
        age={surpriseData.age}
        message={surpriseData.message}
        onComplete={handleBirthdayComplete}
      />
    );
  }

  // Complete phase - show replay option
  return (
    <div className="min-h-screen bg-gradient-to-br from-romantic-darker via-romantic-dark to-background flex items-center justify-center p-4">
      <Card className="max-w-md mx-auto bg-card/80 backdrop-blur-sm border-rose/20">
        <CardContent className="p-8 text-center">
          <div className="text-6xl mb-6">✨</div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            What a magical experience!
          </h2>
          <p className="text-muted-foreground mb-8">
            Hope {surpriseData.name} loved their romantic birthday surprise! 💖
          </p>
          <div className="space-y-4">
            <Button
              onClick={handleReplay}
              className="w-full romantic-button py-3"
            >
              🔄 Experience Again
            </Button>
            <Button
              onClick={handleCreateNew}
              variant="outline"
              className="w-full border-rose/30 hover:border-rose/50"
            >
              <Heart className="w-4 h-4 mr-2" />
              Create Another Surprise
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-6">
            💡 Share this link with anyone - it works on all devices!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};