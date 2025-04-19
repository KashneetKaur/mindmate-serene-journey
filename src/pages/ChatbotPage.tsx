
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MessageCircle, Send, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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

// Simple sentiment analysis function as fallback
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
  const [apiKey, setApiKey] = useState<string>("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollToBottom();
    
    // Check if API key is stored in localStorage
    const storedApiKey = localStorage.getItem("openai_api_key");
    if (storedApiKey) {
      setApiKey(storedApiKey);
    } else {
      setShowApiKeyInput(true);
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem("openai_api_key", apiKey);
      setShowApiKeyInput(false);
      toast({
        title: "API Key Saved",
        description: "Your API key has been securely stored in your browser.",
      });
    } else {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid API key.",
        variant: "destructive",
      });
    }
  };

  const callAiModel = async (userMessage: string, conversationHistory: string[]) => {
    try {
      // If no API key, use fallback sentiment analysis
      if (!apiKey) {
        const sentiment = analyzeSentiment(userMessage);
        return {
          success: true,
          content: getBotFallbackResponse(sentiment),
          sentiment
        };
      }

      // Prepare messages for API call
      const messages = [
        { role: "system", content: therapistPrompt },
        ...conversationHistory.map((msg, index) => {
          // Convert conversation history to message objects
          return {
            role: index % 2 === 0 ? "user" : "assistant",
            content: msg.includes(":") ? msg.split(":")[1].trim() : msg
          };
        }),
        { role: "user", content: userMessage }
      ];

      // Make API request to OpenAI
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages,
          temperature: 0.7,
          max_tokens: 500
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to get response from AI");
      }

      // Extract response content
      const aiResponse = data.choices[0]?.message?.content;
      const sentiment = analyzeSentiment(userMessage); // Still analyze sentiment for UI purposes
      
      return {
        success: true,
        content: aiResponse || "I'm not sure how to respond to that.",
        sentiment
      };
    } catch (error) {
      console.error("AI model call failed:", error);
      return {
        success: false,
        content: "I'm having trouble connecting right now. Let's continue our conversation when my connection improves.",
        sentiment: "neutral" as const
      };
    }
  };

  // Fallback responses grouped by sentiment category
  const getBotFallbackResponse = (sentiment: "positive" | "negative" | "neutral") => {
    const responses = {
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
    
    const sentimentResponses = responses[sentiment];
    return sentimentResponses[Math.floor(Math.random() * sentimentResponses.length)];
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    // Analyze sentiment (for UI purposes)
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
    if (updatedContext.length >= 10) updatedContext.shift(); // Keep last 10 exchanges
    updatedContext.push(`User: ${newMessage}`);
    setConversationContext(updatedContext);
    
    setNewMessage("");
    
    // Simulate bot typing
    setIsTyping(true);
    
    // Call AI model
    const aiResponse = await callAiModel(newMessage, updatedContext);
    
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: aiResponse.content,
      sender: "bot",
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, botMessage]);
    
    // Update conversation context with bot's response
    const botContext = [...updatedContext];
    botContext.push(`Lovable: ${aiResponse.content}`);
    setConversationContext(botContext);
    
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">AI Therapist</h1>
        <p className="text-muted-foreground">Chat with our AI companion for emotional support</p>
      </div>
      
      {showApiKeyInput && (
        <Card className="p-4 mb-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="h-5 w-5" />
              <h3 className="font-semibold">API Key Required</h3>
            </div>
            <p className="text-sm">Please enter your OpenAI API key to enable the AI therapist functionality. Your key will be stored locally in your browser.</p>
            <div className="flex gap-2">
              <Input 
                type="password" 
                value={apiKey} 
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your OpenAI API key"
                className="flex-1"
              />
              <Button onClick={saveApiKey}>Save Key</Button>
            </div>
            <p className="text-xs text-muted-foreground">
              No API key? The chatbot will fall back to basic predetermined responses.
            </p>
          </div>
        </Card>
      )}
      
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
