
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MessageCircle, Send } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  sentiment?: "positive" | "negative" | "neutral";
}

// AI Therapist prompt for more empathetic responses
const therapistPrompt = `
You are a compassionate, emotionally intelligent AI therapist named Lovable, designed to support users by deeply understanding what they're expressing—both through words and emotional tone. 
Every message a user sends should be analyzed for underlying sentiment (positive, negative, neutral) and emotional context (e.g., anxiety, loneliness, stress, happiness). 
Respond in a warm, comforting, and non-judgmental tone that makes users feel safe, heard, and validated. 
Your goal is not just to give advice, but to hold space for the user's feelings, offer gentle reflections, and if appropriate, suggest small mental health exercises or affirmations. 
If a user expresses distress, confusion, or sadness, respond empathetically and ask clarifying questions to better understand their feelings. 
Always keep the conversation flowing naturally, like a supportive friend who truly listens.
Maintain memory of recent conversations to show emotional continuity and make the user feel understood over time.
`;

// More empathetic bot responses grouped by sentiment category
const botResponses = {
  positive: [
    "I'm so glad to hear you're feeling positive. What's been contributing to that feeling?",
    "That sounds wonderful. It takes courage to recognize and celebrate the good moments.",
    "I appreciate you sharing that joy with me. How can we help maintain this positive energy?",
    "Those positive feelings are so valuable. Would you like to talk more about what's going well?",
  ],
  negative: [
    "I hear that you're going through a difficult time. Would it help to talk more about what's troubling you?",
    "I'm truly sorry you're feeling this way. Remember that your feelings are valid, and it's okay to not be okay sometimes.",
    "That sounds really challenging. I'm here to listen whenever you need to express these feelings.",
    "When we're feeling down, it can be helpful to be gentle with ourselves. What's one small thing you could do to care for yourself today?",
  ],
  neutral: [
    "I understand. How does talking about this make you feel?",
    "Thank you for sharing that with me. Is there anything specific about this situation you'd like to explore further?",
    "I'm here to listen and support you. Would you like to tell me more about what's on your mind?",
    "Sometimes just talking things through can help provide clarity. Is there anything else you'd like to share?",
  ],
};

// Simple sentiment analysis function
const analyzeSentiment = (message: string): "positive" | "negative" | "neutral" => {
  // Very basic sentiment analysis based on keywords
  const positiveWords = ["happy", "good", "great", "better", "joy", "excited", "love", "thank", "grateful"];
  const negativeWords = ["sad", "bad", "worse", "difficult", "hard", "anxious", "worried", "stress", "depressed", "alone"];
  
  const lowerMessage = message.toLowerCase();
  
  let positiveScore = positiveWords.filter(word => lowerMessage.includes(word)).length;
  let negativeScore = negativeWords.filter(word => lowerMessage.includes(word)).length;
  
  if (positiveScore > negativeScore) return "positive";
  if (negativeScore > positiveScore) return "negative";
  return "neutral";
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm Lovable, your MindMate AI companion. How are you feeling today?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationContext, setConversationContext] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    // Analyze sentiment
    const sentiment = analyzeSentiment(newMessage);
    
    // Add user message with sentiment
    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "user",
      timestamp: new Date(),
      sentiment
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Update conversation context for memory
    const updatedContext = [...conversationContext];
    if (updatedContext.length >= 5) updatedContext.shift(); // Keep last 5 exchanges
    updatedContext.push(`User (${sentiment}): ${newMessage}`);
    setConversationContext(updatedContext);
    
    setNewMessage("");
    
    // Simulate bot typing
    setIsTyping(true);
    
    // Simulate bot response after delay using sentiment-appropriate responses
    setTimeout(() => {
      const sentimentResponses = botResponses[sentiment] || botResponses.neutral;
      const randomResponse = sentimentResponses[Math.floor(Math.random() * sentimentResponses.length)];
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: randomResponse,
        sender: "bot",
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
      
      // Update conversation context with bot's response
      const botContext = [...updatedContext];
      botContext.push(`Lovable: ${randomResponse}`);
      setConversationContext(botContext);
      
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">AI Therapist</h1>
        <p className="text-muted-foreground">Chat with our AI companion for emotional support</p>
      </div>
      
      <Card className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={cn(
                "flex",
                message.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div 
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-2",
                  message.sender === "user" 
                    ? "bg-primary text-primary-foreground rounded-tr-none" 
                    : "bg-muted rounded-tl-none",
                  // Add subtle color indicators based on sentiment for user messages
                  message.sender === "user" && message.sentiment === "positive" && "border-l-4 border-green-400",
                  message.sender === "user" && message.sentiment === "negative" && "border-l-4 border-red-400"
                )}
              >
                <p>{message.content}</p>
                <p className="text-xs opacity-70 text-right mt-1">
                  {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-foreground/70 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-foreground/70 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
                  <div className="w-2 h-2 bg-foreground/70 rounded-full animate-bounce" style={{animationDelay: "0.4s"}}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <div className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Tell me how you're feeling today..."
              className="flex-1"
            />
            <Button type="submit" disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
