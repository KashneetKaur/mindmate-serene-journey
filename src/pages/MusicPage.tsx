
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Music, Play, Pause, SkipForward, SkipBack, Volume2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

// Mock data for playlists and tracks
// Each track now has an audioSrc property pointing to sample audio files
const mockPlaylists = {
  "relaxation": [
    { id: "r1", title: "Ocean Waves", artist: "Nature Sounds", duration: "5:23", coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", audioSrc: "https://soundbible.com/mp3/Ocean_Waves-Mike_Koenig-980635527.mp3" },
    { id: "r2", title: "Forest Ambience", artist: "Nature Sounds", duration: "4:15", coverImage: "https://images.unsplash.com/photo-1448375240586-882707db888b", audioSrc: "https://soundbible.com/mp3/forest_ambience-6164.mp3" },
    { id: "r3", title: "Gentle Rain", artist: "Nature Sounds", duration: "6:05", coverImage: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0", audioSrc: "https://soundbible.com/mp3/rain_inside-6225.mp3" },
    { id: "r4", title: "Mountain Stream", artist: "Peaceful Melodies", duration: "7:18", coverImage: "https://images.unsplash.com/photo-1506260408121-e353d10b87c7", audioSrc: "https://soundbible.com/mp3/Creek-SoundBible.com-2101952713.mp3" },
  ],
  "meditation": [
    { id: "m1", title: "Mindful Breathing", artist: "Zen Masters", duration: "10:00", coverImage: "https://images.unsplash.com/photo-1474418397713-7ede21d49118", audioSrc: "https://soundbible.com/mp3/Zen_Meditation_Deep-Thunder-538925481.mp3" },
    { id: "m2", title: "Inner Peace", artist: "Meditation Guide", duration: "15:30", coverImage: "https://images.unsplash.com/photo-1528495612343-9ca9f4a4de28", audioSrc: "https://soundbible.com/mp3/Tibetan_Singing_Bowl-SoundBible.com-887744694.mp3" },
    { id: "m3", title: "Body Scan", artist: "Calm Mind", duration: "12:45", coverImage: "https://images.unsplash.com/photo-1469474968028-56623f02e42e", audioSrc: "https://soundbible.com/mp3/soothing-meditation-118107.mp3" },
  ],
  "sleep": [
    { id: "s1", title: "Dreams", artist: "Sleep Easy", duration: "8:30", coverImage: "https://images.unsplash.com/photo-1531353826977-0941b4779a1c", audioSrc: "https://soundbible.com/mp3/Campfire_1-Mike_Koenig-1388957054.mp3" },
    { id: "s2", title: "Night Whispers", artist: "Deep Sleep", duration: "9:15", coverImage: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8", audioSrc: "https://soundbible.com/mp3/Wind_Chimes-Mike_Koenig-1539486244.mp3" },
    { id: "s3", title: "Starlight Serenade", artist: "Lullaby", duration: "7:50", coverImage: "https://images.unsplash.com/photo-1532767153582-b1a0e5145009", audioSrc: "https://soundbible.com/mp3/harp-2-daniel_simon.mp3" },
  ]
}

export default function MusicPage() {
  const [activeTrack, setActiveTrack] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([80]);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showNowPlaying, setShowNowPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Create audio element when component mounts
  useEffect(() => {
    const audio = new Audio();
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadMetadata);
    audio.addEventListener('ended', handleTrackEnded);
    audioRef.current = audio;
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadMetadata);
      audio.removeEventListener('ended', handleTrackEnded);
      audio.pause();
    };
  }, []);
  
  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);
  
  // Handle audio time updates
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration || 0;
      setCurrentTime(currentTime);
      setProgress(duration > 0 ? (currentTime / duration) * 100 : 0);
    }
  };
  
  // Handle metadata loading (duration)
  const handleLoadMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };
  
  // Handle track ending
  const handleTrackEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  };
  
  // Handle play/pause
  const handlePlayPause = () => {
    if (!activeTrack) {
      // If no track is selected, play the first one from relaxation
      const firstTrack = mockPlaylists.relaxation[0];
      handleTrackSelect(firstTrack);
      return;
    }
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          toast({
            title: "Playback Error",
            description: "Unable to play audio. Please try again.",
            variant: "destructive",
          });
          console.error("Playback error:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // Handle track selection
  const handleTrackSelect = (track: any) => {
    // If selecting the same track that's already playing
    if (activeTrack && activeTrack.id === track.id) {
      handlePlayPause();
      return;
    }
    
    // Load new track
    setActiveTrack(track);
    setProgress(0);
    setCurrentTime(0);
    
    if (audioRef.current) {
      audioRef.current.src = track.audioSrc;
      audioRef.current.load();
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setShowNowPlaying(true);
        setTimeout(() => {
          setShowNowPlaying(false);
        }, 5000); // Hide "Now Playing" after 5 seconds
      }).catch(error => {
        toast({
          title: "Playback Error",
          description: "Unable to play audio. Please try again.",
          variant: "destructive",
        });
        console.error("Playback error:", error);
        setIsPlaying(false);
      });
    }
  };
  
  // Handle progress bar interaction
  const handleProgressChange = (values: number[]) => {
    if (audioRef.current && duration > 0) {
      const newPosition = (values[0] / 100) * duration;
      audioRef.current.currentTime = newPosition;
      setProgress(values[0]);
    }
  };
  
  // Format time for display (mm:ss)
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
                  <div className="relative w-48 h-48 mb-6 group">
                    <img 
                      src={`${activeTrack.coverImage}/&auto=format&fit=crop&w=600&q=80`} 
                      alt={activeTrack.title}
                      className={cn(
                        "w-full h-full object-cover rounded-lg shadow-lg transition-all duration-500",
                        isPlaying ? "shadow-lg shadow-primary/20" : ""
                      )}
                    />
                    {isPlaying && (
                      <div className="absolute inset-0 bg-black/10 rounded-lg flex items-center justify-center">
                        <div className="flex gap-1">
                          <div className="w-1 h-8 bg-white animate-[pulse_1s_ease-in-out_infinite] rounded-full"></div>
                          <div className="w-1 h-12 bg-white animate-[pulse_1s_ease-in-out_0.2s_infinite] rounded-full"></div>
                          <div className="w-1 h-10 bg-white animate-[pulse_1s_ease-in-out_0.4s_infinite] rounded-full"></div>
                          <div className="w-1 h-6 bg-white animate-[pulse_1s_ease-in-out_0.6s_infinite] rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold">{activeTrack.title}</h3>
                  <p className="text-muted-foreground">{activeTrack.artist}</p>
                  
                  <div className="w-full mt-4 px-2">
                    <div className="flex justify-between text-sm">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                    <Slider 
                      value={[progress]} 
                      onValueChange={handleProgressChange} 
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
                <Button 
                  variant="outline" 
                  size="icon" 
                  disabled={!activeTrack}
                  aria-label="Previous track"
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                
                <Button 
                  onClick={handlePlayPause} 
                  variant={activeTrack ? "default" : "secondary"} 
                  size="icon" 
                  className="h-12 w-12 rounded-full"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying && activeTrack ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5 ml-0.5" />
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  disabled={!activeTrack}
                  aria-label="Next track"
                >
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
      
      {/* Now Playing Toast/Modal */}
      {showNowPlaying && activeTrack && (
        <div className="fixed bottom-6 right-6 bg-card border shadow-lg rounded-lg p-4 flex items-center gap-4 max-w-xs animate-fade-in z-50">
          <img 
            src={`${activeTrack.coverImage}/&auto=format&fit=crop&w=100&q=80`}
            alt={activeTrack.title}
            className="w-16 h-16 rounded object-cover"
          />
          <div className="flex-1">
            <h4 className="font-medium">Now Playing</h4>
            <p className="text-sm text-muted-foreground">{activeTrack.title}</p>
            <p className="text-xs text-muted-foreground">{activeTrack.artist}</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="self-start" 
            onClick={() => setShowNowPlaying(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
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
    audioSrc: string;
  };
  isActive: boolean;
  isPlaying: boolean;
  onSelect: (track: any) => void;
}

function TrackItem({ track, isActive, isPlaying, onSelect }: TrackItemProps) {
  return (
    <div 
      className={cn(
        "flex items-center gap-3 p-2 rounded-md hover:bg-muted/60 cursor-pointer transition-colors",
        isActive ? "bg-muted" : ""
      )}
      onClick={() => onSelect(track)}
    >
      <div className="relative w-12 h-12 flex-shrink-0 overflow-hidden rounded">
        <img 
          src={`${track.coverImage}/&auto=format&fit=crop&w=100&q=80`}
          alt={track.title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        {isActive && isPlaying && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded">
            <div className="flex gap-0.5">
              <div className="w-0.5 h-3 bg-white animate-[pulse_1s_ease-in-out_infinite] rounded-full"></div>
              <div className="w-0.5 h-4 bg-white animate-[pulse_1s_ease-in-out_0.2s_infinite] rounded-full"></div>
              <div className="w-0.5 h-3 bg-white animate-[pulse_1s_ease-in-out_0.4s_infinite] rounded-full"></div>
            </div>
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

