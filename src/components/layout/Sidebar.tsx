
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MapPin, MessageCircle, Music, Smile, Settings, Moon, Robot, Users, Info } from "lucide-react";

const navItems = [
  {
    name: "Home",
    path: "/",
    icon: Smile
  },
  {
    name: "Medicine Locator",
    path: "/medicine",
    icon: MapPin
  },
  {
    name: "AI Chatbot",
    path: "/chatbot",
    icon: Robot
  },
  {
    name: "Calming Music",
    path: "/music",
    icon: Music
  },
  {
    name: "Sleep Aid",
    path: "/sleep",
    icon: Moon
  },
  {
    name: "Community",
    path: "/community",
    icon: Users
  }
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Card className={cn(
      "h-screen fixed top-0 left-0 z-40 flex flex-col transition-all duration-300 border-r shadow-sm",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-mindmate-400 to-mint-400 flex items-center justify-center">
              <Smile className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-mindmate-500 to-mint-500 bg-clip-text text-transparent">
              MindMate
            </h1>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-mindmate-400 to-mint-400 flex items-center justify-center">
              <Smile className="h-6 w-6 text-white" />
            </div>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="sm" 
          className="ml-auto" 
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? "→" : "←"}
        </Button>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive 
                    ? "bg-accent text-accent-foreground font-medium" 
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5", collapsed && "mx-auto")} />
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="border-t p-4">
        <NavLink 
          to="/settings" 
          className={({ isActive }) => cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
            isActive 
              ? "bg-accent text-accent-foreground font-medium" 
              : "hover:bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          <Settings className={cn("h-5 w-5", collapsed && "mx-auto")} />
          {!collapsed && <span>Settings</span>}
        </NavLink>

        <NavLink 
          to="/about" 
          className={({ isActive }) => cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
            isActive 
              ? "bg-accent text-accent-foreground font-medium" 
              : "hover:bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          <Info className={cn("h-5 w-5", collapsed && "mx-auto")} />
          {!collapsed && <span>About</span>}
        </NavLink>
      </div>
    </Card>
  );
}
