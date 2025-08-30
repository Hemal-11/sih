
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your oceanographic research assistant. I can help you analyze ARGO float data, generate visualizations, and answer questions about ocean conditions. What would you like to explore today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const sampleQueries = [
    "Show me temperature profiles from the Pacific Ocean",
    "Compare salinity data between 2020 and 2023",
    "Find anomalies in recent float data",
    "Generate a report on North Atlantic conditions"
  ];

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (content: string = inputValue) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(content),
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000 + Math.random() * 2000);
  };

  const generateAIResponse = (query: string): string => {
    const responses = [
      `Based on the latest ARGO float data, I've analyzed ${Math.floor(Math.random() * 500 + 100)} profiles. Here are the key findings:\n\n• Temperature anomaly detected at 200m depth\n• Salinity levels show seasonal variation\n• Oxygen concentrations within normal range\n\nWould you like me to generate a detailed visualization?`,
      `I've processed your oceanographic query and found interesting patterns in the data:\n\n• ${Math.floor(Math.random() * 50 + 20)} active floats in the region\n• Temperature range: 4.2°C to 28.6°C\n• Salinity: 34.5 to 36.8 PSU\n\nShall I create a comparative analysis chart?`,
      `Excellent question! The ARGO network has collected over ${Math.floor(Math.random() * 1000000 + 500000)} profiles globally. For your specific query:\n\n• Data quality: 98.5% validated\n• Coverage: ${Math.floor(Math.random() * 30 + 50)} ocean basins\n• Latest update: ${Math.floor(Math.random() * 24 + 1)} hours ago\n\nHow would you like to visualize this data?`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const toggleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsListening(!isListening);
      // Voice recognition implementation would go here
    } else {
      console.log('Speech recognition not supported');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-full flex flex-col data-card">
      {/* Header */}
      <div className="p-4 border-b border-border/20 bg-surface-gradient">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Bot className="w-6 h-6 text-primary animate-float" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Ocean AI Assistant</h3>
            <p className="text-xs text-muted-foreground">Powered by advanced marine analytics</p>
          </div>
        </div>
      </div>

      {/* Sample Queries */}
      <div className="p-4 border-b border-border/20">
        <p className="text-sm text-muted-foreground mb-2">Try asking:</p>
        <div className="flex flex-wrap gap-2">
          {sampleQueries.map((query, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs hover:bg-accent/20 border-accent/30"
              onClick={() => handleSendMessage(query)}
            >
              {query}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.sender === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-accent text-accent-foreground'
              }`}>
                {message.sender === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              <div className={`flex-1 max-w-xs lg:max-w-md ${
                message.sender === 'user' ? 'text-right' : 'text-left'
              }`}>
                <div className={`inline-block p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground border border-border/30'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <div className="bg-muted p-3 rounded-lg border border-border/30">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border/20 bg-background/50">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about ocean data, request analysis, or generate visualizations..."
              className="pr-12 border-accent/30 focus:border-accent"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-accent/20"
              onClick={toggleVoiceInput}
            >
              {isListening ? (
                <MicOff className="w-4 h-4 text-destructive" />
              ) : (
                <Mic className="w-4 h-4 text-muted-foreground" />
              )}
            </Button>
          </div>
          <Button 
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AIChat;
