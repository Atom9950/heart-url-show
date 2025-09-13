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
        
        // Check if it's a service-based URL (with ID)
        const pathMatch = window.location.hash.match(/#\/surprise\/(.+)/);
        if (pathMatch) {
          const binId = pathMatch[1];
          await loadFromService(binId);
          return;
        }
        
        // Fallback to compressed URL method
        let compressedData = null;
        
        // Check hash-based URL first (for HashRouter)
        if (window.location.hash) {
          const hashParts = window.location.hash.split('?');
          if (hashParts.length > 1) {
            const hashParams = new URLSearchParams(hashParts[1]);
            compressedData = hashParams.get('data');
          }
        }
        
        // Fallback to regular search params
        if (!compressedData) {
          compressedData = searchParams.get('data');
        }
        
        if (compressedData) {
          await loadFromCompressedData(compressedData);
        } else {
          setError('No surprise data found in the URL. The link may be incomplete.');
        }
        
      } catch (err) {
        console.error('Error loading surprise data:', err);
        setError(`Failed to load surprise: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    const loadFromService = async (binId: string) => {
      try {
        console.log('Loading from service with ID:', binId);
        
        const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
          headers: {
            'X-Master-Key': '$2a$10$yimA3ZQ2YVI1z8LsOa/a.ujkq5yQ.Q92wnXBUr5XgC2JjYeLPrRDC' // You'll need to get a free API key
          }
        });

        if (!response.ok) {
          throw new Error(`Service error: ${response.status}`);
        }

        const result = await response.json();
        const parsed = result.record;
        
        console.log('Loaded high-quality surprise data:', {
          name: parsed.name,
          imageCount: parsed.images?.length || 0,
          hasMessage: !!parsed.message,
          hasMusic: !!parsed.music
        });
        
        // Validate required fields
        if (!parsed.name || !parsed.message || !parsed.images || parsed.images.length === 0) {
          throw new Error('The surprise data is incomplete.');
        }

        setSurpriseData(parsed);
        
      } catch (error) {
        console.error('Service loading failed:', error);
        setError('Failed to load the surprise. The link may be expired or invalid.');
      }
    };

    const loadFromCompressedData = async (compressedData: string) => {
      try {
        console.log('Loading from compressed data, length:', compressedData.length);
        
        // Try LZString decompression first
        let decompressedData;
        try {
          decompressedData = LZString.decompressFromEncodedURIComponent(compressedData);
        } catch {
          // Fallback to base64 decoding
          decompressedData = decodeURIComponent(atob(compressedData));
        }
        
        if (!decompressedData) {
          throw new Error('Failed to decode the surprise data.');
        }
        
        const parsed = JSON.parse(decompressedData) as SurpriseData;
        
        // Validate required fields
        if (!parsed.name || !parsed.message || !parsed.images || parsed.images.length === 0) {
          throw new Error('The surprise data is incomplete.');
        }

        // Validate image data
        const validImages = parsed.images.filter(img => 
          typeof img === 'string' && img.startsWith('data:image/')
        );
        
        if (validImages.length === 0) {
          throw new Error('No valid images found in the surprise data.');
        }

        parsed.images = validImages;
        setSurpriseData(parsed);
        
      } catch (error) {
        console.error('Compressed data loading failed:', error);
        setError('The surprise link appears to be corrupted or invalid.');
      }
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