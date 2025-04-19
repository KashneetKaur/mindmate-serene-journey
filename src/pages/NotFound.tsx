
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6 px-4">
        <div className="space-y-2">
          <h1 className="text-6xl md:text-8xl font-bold text-mindmate-500">404</h1>
          <p className="text-xl md:text-2xl font-medium">Page not found</p>
          <p className="text-muted-foreground max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div>
          <Button asChild className="bg-mindmate-500 hover:bg-mindmate-600">
            <Link to="/">Return to home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
