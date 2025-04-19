
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Music, Play, Pause, SkipForward, SkipBack, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for playlists and tracks
const mockPlaylists = {
  "relaxation": [
    { id: "r1", title: "Ocean Waves", artist: "Nature Sounds", duration: "5:23", coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e" },
    { id: "r2", title: "Forest Ambience", artist: "Nature Sounds", duration: "4:15", coverImage: "https://images.unsplash.com/photo-1448375240586-882707db888b" },
    { id: "r3", title: "Gentle Rain", artist: "Nature Sounds", duration: "6:05", coverImage: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0" },
    { id: "r4", title: "Mountain Stream", artist: "Peaceful Melodies", duration: "7:18", coverImage: "https://images.unsplash.com/photo-1506260408121-e353d10b87c7" },
  ],
  "meditation": [
    { id: "m1", title: "Mindful Breathing", artist: "Zen Masters", duration: "10:00", coverImage: "https://images.unsplash.com/photo-1474418397713-7ede21d49118" },
    { id: "m2", title: "Inner Peace", artist: "Meditation Guide", duration: "15:30", coverImage: "https://images.unsplash.com/photo-1528495612343-9ca9f4a4de28" },
    { id: "m3", title: "Body Scan", artist: "Calm Mind", duration: "12:45", coverImage: "https://images.unsplash.com/photo-1469474968028-56623f02e42e" },
  ],
  "sleep": [
    { id: "s1", title: "Dreams", artist: "Sleep Easy", duration: "8:30", coverImage: "https://images.unsplash.com/photo-1531353826977-0941b4779a1c" },
    { id: "s2", title: "Night Whispers", artist: "Deep Sleep", duration: "9:15", coverImage: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8" },
    { id: "s3", title: "Starlight Serenade", artist: "Lullaby", duration: "7:50", coverImage: "https://images.unsplash.com/photo-1532767153582-b1a0e5145009" },
  ]
}

export default function MusicPage() {
  const [activeTrack, setActiveTrack] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([80]);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const handlePlayPause = () => {
    if (!activeTrack) {
      // If no track is selected, play the first one from relaxation
      setActiveTrack(mockPlaylists.relaxation[0]);
      setIsPlaying(true);
      return;
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const handleTrackSelect = (track: any) => {
    setActiveTrack(track);
    setIsPlaying(true);
    setProgress(0);
    // In a real app, we would load and play the audio file here
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Calming Music</h1>
        <p className="text-muted-foreground">Listen to relaxing sounds for stress relief</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <Card className="h-full">
            <Tabs defaultValue="relaxation">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Playlists</CardTitle>
                  <TabsList>
                    <TabsTrigger value="relaxation">Relaxation</TabsTrigger>
                    <TabsTrigger value="meditation">Meditation</TabsTrigger>
                    <TabsTrigger value="sleep">Sleep</TabsTrigger>
                  </TabsList>
                </div>
                <CardDescription>Select tracks to help you relax and unwind</CardDescription>
              </CardHeader>
              
              <CardContent>
                <TabsContent value="relaxation" className="space-y-4">
                  {mockPlaylists.relaxation.map((track) => (
                    <TrackItem 
                      key={track.id} 
                      track={track} 
                      isActive={activeTrack?.id === track.id}
                      isPlaying={isPlaying && activeTrack?.id === track.id}
                      onSelect={handleTrackSelect}
                    />
                  ))}
                </TabsContent>
                
                <TabsContent value="meditation" className="space-y-4">
                  {mockPlaylists.meditation.map((track) => (
                    <TrackItem 
                      key={track.id} 
                      track={track} 
                      isActive={activeTrack?.id === track.id}
                      isPlaying={isPlaying && activeTrack?.id === track.id}
                      onSelect={handleTrackSelect}
                    />
                  ))}
                </TabsContent>
                
                <TabsContent value="sleep" className="space-y-4">
                  {mockPlaylists.sleep.map((track) => (
                    <TrackItem 
                      key={track.id} 
                      track={track} 
                      isActive={activeTrack?.id === track.id}
                      isPlaying={isPlaying && activeTrack?.id === track.id}
                      onSelect={handleTrackSelect}
                    />
                  ))}
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Now Playing</CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col items-center justify-center">
              {activeTrack ? (
                <>
                  <div className="relative w-48 h-48 mb-6">
                    <img 
                      src={`${activeTrack.coverImage}/&auto=format&fit=crop&w=600&q=80`} 
                      alt={activeTrack.title}
                      className="w-full h-full object-cover rounded-lg shadow-lg"
                    />
                  </div>
                  
                  <h3 className="text-xl font-bold">{activeTrack.title}</h3>
                  <p className="text-muted-foreground">{activeTrack.artist}</p>
                  
                  <div className="w-full mt-4 px-2">
                    <div className="flex justify-between text-sm">
                      <span>{formatTime(progress * 300)}</span>
                      <span>{activeTrack.duration}</span>
                    </div>
                    <Slider 
                      value={[progress * 100]} 
                      onValueChange={(values) => setProgress(values[0] / 100)} 
                      className="mt-2" 
                      max={100}
                      step={1}
                    />
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Music className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No track selected</h3>
                  <p className="text-muted-foreground">Choose a track to begin playing</p>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex flex-col gap-4">
              <div className="flex items-center justify-center gap-4 w-full">
                <Button variant="outline" size="icon" disabled={!activeTrack}>
                  <SkipBack className="h-4 w-4" />
                </Button>
                
                <Button 
                  onClick={handlePlayPause} 
                  variant={activeTrack ? "default" : "secondary"} 
                  size="icon" 
                  className="h-12 w-12 rounded-full"
                >
                  {isPlaying && activeTrack ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5 ml-0.5" />
                  )}
                </Button>
                
                <Button variant="outline" size="icon" disabled={!activeTrack}>
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2 w-full">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <Slider 
                  value={volume} 
                  onValueChange={setVolume} 
                  max={100} 
                  step={1}
                  className="flex-1"
                />
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface TrackItemProps {
  track: {
    id: string;
    title: string;
    artist: string;
    duration: string;
    coverImage: string;
  };
  isActive: boolean;
  isPlaying: boolean;
  onSelect: (track: any) => void;
}

function TrackItem({ track, isActive, isPlaying, onSelect }: TrackItemProps) {
  return (
    <div 
      className={cn(
        "flex items-center gap-3 p-2 rounded-md hover:bg-muted/60 cursor-pointer",
        isActive && "bg-muted"
      )}
      onClick={() => onSelect(track)}
    >
      <div className="relative w-12 h-12 flex-shrink-0">
        <img 
          src={`${track.coverImage}/&auto=format&fit=crop&w=100&q=80`}
          alt={track.title}
          className="w-full h-full object-cover rounded"
        />
        {isActive && isPlaying && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className={cn("truncate font-medium", isActive && "text-primary")}>{track.title}</p>
        <p className="text-xs text-muted-foreground">{track.artist}</p>
      </div>
      
      <div className="text-xs text-muted-foreground">{track.duration}</div>
    </div>
  );
}
