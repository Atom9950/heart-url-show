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

  useEffect(() => {
    const data = searchParams.get('data');
    console.log('URL data parameter length:', data?.length || 0);
    
    if (!data) {
      setError('No surprise data found in the URL');
      return;
    }

    try {
      console.log('Attempting to decompress data...');
      const decompressed = LZString.decompressFromEncodedURIComponent(data);
      console.log('Decompression result:', decompressed ? 'Success' : 'Failed');
      
      if (!decompressed) {
        console.error('LZString decompression returned null/empty');
        setError('Failed to decompress surprise data - the link may be corrupted or too large');
        return;
      }

      console.log('Parsing JSON data...');
      const parsed = JSON.parse(decompressed) as SurpriseData;
      console.log('Parsed data:', {
        name: parsed.name,
        imageCount: parsed.images?.length || 0,
        hasMessage: !!parsed.message,
        hasMusic: !!parsed.music
      });
      
      if (!parsed.name || !parsed.message || !parsed.images || parsed.images.length === 0) {
        setError('Invalid surprise data format - missing required fields');
        return;
      }

      setSurpriseData(parsed);
    } catch (err) {
      console.error('Error parsing surprise data:', err);
      setError(`Failed to load surprise data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-romantic-dark via-background to-romantic-darker flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto bg-card/80 backdrop-blur-sm border-destructive/20">
          <CardContent className="p-8 text-center">
            <div className="text-4xl mb-4">💔</div>
            <h2 className="text-xl font-bold text-foreground mb-4">
              Oops! Something went wrong
            </h2>
            <p className="text-muted-foreground mb-6">
              {error}
            </p>
            <Button
              onClick={() => window.location.href = '/'}
              className="romantic-button"
            >
              <Home className="w-4 h-4 mr-2" />
              Create a New Surprise
            </Button>
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
          <p className="text-foreground text-xl">Loading your magical surprise...</p>
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
              onClick={() => window.location.href = '/'}
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