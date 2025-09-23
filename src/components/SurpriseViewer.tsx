import React, { useState, useEffect } from 'react';
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
  const [surpriseData, setSurpriseData] = useState<SurpriseData | null>(null);
  const [currentPhase, setCurrentPhase] = useState<'intro' | 'birthday' | 'complete'>('intro');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSurpriseData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Parse hash URL parameters
        const hash = window.location.hash;
        console.log('Full hash:', hash);

        if (!hash || !hash.includes('?')) {
          setError('Invalid surprise link - no parameters found');
          return;
        }

        // Extract query string from hash (everything after the ?)
        const queryString = hash.split('?')[1];
        const hashParams = new URLSearchParams(queryString);
        
        const surpriseId = hashParams.get('id');
        const compressedData = hashParams.get('data');
        
        console.log('Surprise ID:', surpriseId);
        console.log('Has compressed data:', !!compressedData);
        console.log('Compressed data length:', compressedData?.length || 0);
        
        if (!surpriseId || !compressedData) {
          setError('Invalid surprise link - missing required parameters');
          return;
        }

        // Make API call to decompress the data
        const apiUrl = `/api/surprise?id=${encodeURIComponent(surpriseId)}&data=${encodeURIComponent(compressedData)}`;
        console.log('Making API call to:', apiUrl);

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        console.log('API response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API error response:', errorText);
          
          try {
            const errorData = JSON.parse(errorText);
            setError(errorData.error || `Server error: ${response.status}`);
          } catch {
            setError(`Failed to decode surprise data (Status: ${response.status})`);
          }
          return;
        }

        const result = await response.json();
        console.log('API response:', result);

        if (!result.success || !result.data) {
          setError('Invalid response from server');
          return;
        }

        // Parse the decompressed data
        const parsed = JSON.parse(result.data) as SurpriseData;
        console.log('Parsed surprise data:', {
          name: parsed.name,
          imageCount: parsed.images?.length || 0,
          hasMessage: !!parsed.message,
          hasMusic: !!parsed.music,
          age: parsed.age
        });
        
        // Validate required fields
        if (!parsed.name || !parsed.message || !parsed.images || parsed.images.length === 0) {
          setError('Invalid surprise data - missing required information');
          return;
        }

        setSurpriseData(parsed);
        
      } catch (err) {
        console.error('Error loading surprise data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load surprise data');
      } finally {
        setLoading(false);
      }
    };

    loadSurpriseData();
  }, []); // Remove searchParams dependency since we're not using useSearchParams

  const handleIntroComplete = () => {
    setCurrentPhase('birthday');
  };

  const handleBirthdayComplete = () => {
    setCurrentPhase('complete');
  };

  const handleReplay = () => {
    setCurrentPhase('intro');
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-romantic-dark via-background to-romantic-darker flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-rose mx-auto mb-4 animate-heart-bounce" />
          <p className="text-foreground text-xl">Loading your magical surprise...</p>
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
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full border-rose/30 hover:border-rose/50"
              >
                🔄 Try Again
              </Button>
              <Button
                onClick={handleGoHome}
                className="w-full romantic-button"
              >
                <Home className="w-4 h-4 mr-2" />
                Create a New Surprise
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!surpriseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-romantic-dark via-background to-romantic-darker flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-rose mx-auto mb-4 animate-heart-bounce" />
          <p className="text-foreground text-xl">Preparing your surprise...</p>
        </div>
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
              onClick={handleGoHome}
              variant="outline"
              className="w-full border-rose/30 hover:border-rose/50"
            >
              <Heart className="w-4 h-4 mr-2" />
              Create Another Surprise
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};