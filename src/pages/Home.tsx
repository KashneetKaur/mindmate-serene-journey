
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { MapPin, MessageCircle, Music, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

const moodOptions = [
  { value: "great", label: "Great", color: "bg-green-500" },
  { value: "good", label: "Good", color: "bg-mint-400" },
  { value: "okay", label: "Okay", color: "bg-blue-400" },
  { value: "low", label: "Low", color: "bg-amber-400" },
  { value: "bad", label: "Bad", color: "bg-red-500" }
];

export default function Home() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{greeting()}</h1>
          <p className="text-lg text-muted-foreground">How are you feeling today?</p>
        </div>
        
        <div className="flex gap-2">
          {moodOptions.map((mood) => (
            <button
              key={mood.value}
              onClick={() => setSelectedMood(mood.value)}
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                selectedMood === mood.value 
                  ? `${mood.color} text-white ring-2 ring-offset-2 ring-offset-background ring-${mood.color}` 
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              <span className={selectedMood === mood.value ? "text-white" : ""}>
                {mood.label.charAt(0)}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard 
          title="Find Medication" 
          description="Locate nearby pharmacies and mental health medications."
          icon={MapPin}
          path="/medicine"
          color="from-mindmate-400 to-mindmate-600"
        />
        
        <FeatureCard 
          title="Talk to AI Therapist" 
          description="Chat with our AI companion for emotional support."
          icon={MessageCircle}
          path="/chatbot"
          color="from-cyan-500 to-blue-600"
        />
        
        <FeatureCard 
          title="Calming Music" 
          description="Listen to relaxing sounds for stress relief."
          icon={Music}
          path="/music"
          color="from-violet-500 to-purple-600"
        />
        
        <FeatureCard 
          title="Sleep Aid" 
          description="Sounds and meditations for better sleep."
          icon={Moon}
          path="/sleep"
          color="from-indigo-500 to-indigo-700"
        />
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Your Wellness Journey</CardTitle>
          <CardDescription>Track your progress and achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Daily Check-ins</span>
                <span className="font-medium">3/5</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Meditation Minutes</span>
                <span className="font-medium">15/20</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Mood Tracking</span>
                <span className="font-medium">4/7</span>
              </div>
              <Progress value={57} className="h-2" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">View Full Stats</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
  color: string;
}

function FeatureCard({ title, description, icon: Icon, path, color }: FeatureCardProps) {
  return (
    <Card className="overflow-hidden border hover:shadow-md transition-all group">
      <Link to={path} className="block h-full">
        <div className={`bg-gradient-to-r ${color} h-2 w-full`} />
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={`bg-gradient-to-r ${color} h-10 w-10 rounded-full flex items-center justify-center text-white`}>
              <Icon className="h-5 w-5" />
            </div>
            <CardTitle>{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>{description}</CardDescription>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" size="sm" className="ml-auto group-hover:translate-x-1 transition-transform">
            Open →
          </Button>
        </CardFooter>
      </Link>
    </Card>
  )
}
