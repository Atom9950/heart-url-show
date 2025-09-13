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
        
        // Check for JSONBin.io URL format: #/surprise/BIN_ID
        const pathMatch = window.location.hash.match(/#\/surprise\/([^?]+)/);
        
        if (pathMatch) {
          const binId = pathMatch[1];
          console.log('Loading surprise from JSONBin.io, ID:', binId);
          await loadFromJSONBin(binId);
          return;
        }
        
        // Fallback to old compressed URL method for backwards compatibility
        await loadFromCompressedURL();
        
      } catch (err) {
        console.error('Error loading surprise data:', err);
        setError(`Failed to load surprise: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    const loadFromJSONBin = async (binId: string) => {
      try {
        console.log('Fetching surprise data from JSONBin.io...');
        
        const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
          headers: {
            'X-Master-Key': '$2a$10$LQuT..l68bk1z0aT899ea.xEh8LtDQTnu9rutrWK6hYwRS83Apvci' // Same key as in the form
          }
        });

        if (!response.ok) {
          if (response.status === 404) {
            setError('Surprise not found. The link may be expired or incorrect.');
          } else if (response.status === 401) {
            setError('Access denied. The surprise link may be private.');
          } else {
            setError(`Failed to load surprise (Error ${response.status}). Please try again.`);
          }
          return;
        }

        const result = await response.json();
        const surpriseData = result.record;
        
        console.log('✅ Successfully loaded surprise data!');
        console.log('Surprise details:', {
          name: surpriseData.name,
          imageCount: surpriseData.images?.length || 0,
          hasMessage: !!surpriseData.message,
          hasMusic: !!surpriseData.music,
          createdAt: surpriseData.createdAt,
          version: surpriseData.version
        });

        // Validate the data
        if (!surpriseData.name || !surpriseData.message || !surpriseData.images || surpriseData.images.length === 0) {
          setError('The surprise data appears to be incomplete.');
          return;
        }

        // Validate images
        const validImages = surpriseData.images.filter((img: string) => 
          typeof img === 'string' && img.startsWith('data:image/')
        );
        
        if (validImages.length === 0) {
          setError('No valid images found in this surprise.');
          return;
        }

        // Set the valid data
        setSurpriseData({
          name: surpriseData.name,
          age: surpriseData.age || '',
          message: surpriseData.message,
          images: validImages,
          music: surpriseData.music
        });
        
      } catch (error) {
        console.error('JSONBin.io loading error:', error);
        setError('Failed to load the surprise. Please check your internet connection and try again.');
      }
    };

    const loadFromCompressedURL = async () => {
      // This is for backwards compatibility with old URL-encoded links
      let compressedData = null;
      
      if (window.location.hash) {
        const hashParts = window.location.hash.split('?');
        if (hashParts.length > 1) {
          const hashParams = new URLSearchParams(hashParts[1]);
          compressedData = hashParams.get('d') || hashParams.get('data');
        }
      }
      
      if (!compressedData) {
        compressedData = searchParams.get('d') || searchParams.get('data');
      }
      
      if (!compressedData) {
        setError('No surprise data found in the URL. Please check the link and try again.');
        return;
      }

      console.log('Loading from compressed URL (legacy format)...');
      
      try {
        // Try LZString decompression
        let decompressedData;
        try {
          decompressedData = LZString.decompressFromEncodedURIComponent(compressedData);
        } catch {
          // Fallback to base64
          decompressedData = decodeURIComponent(atob(compressedData));
        }
        
        if (!decompressedData) {
          setError('Unable to decode the surprise data. The link may be corrupted.');
          return;
        }
        
        const parsed = JSON.parse(decompressedData) as SurpriseData;
        
        if (!parsed.name || !parsed.message || !parsed.images || parsed.images.length === 0) {
          setError('The surprise data is incomplete.');
          return;
        }

        const validImages = parsed.images.filter(img => 
          typeof img === 'string' && img.startsWith('data:image/')
        );
        
        if (validImages.length === 0) {
          setError('No valid images found.');
          return;
        }

        setSurpriseData({
          ...parsed,
          images: validImages
        });
        
      } catch (error) {
        console.error('Legacy URL parsing error:', error);
        setError('The surprise link appears to be corrupted. Please ask for a new link.');
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