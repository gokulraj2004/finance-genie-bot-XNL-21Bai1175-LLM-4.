
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Cpu, ArrowUpCircle } from "lucide-react";
import { ChatMessage, generateResponse } from "@/services/deepseekApi";
import { toast } from "sonner";
import StockDisplay from "./StockDisplay";
import { getStockQuote } from "@/services/yahooFinanceApi";

interface MessageProps {
  role: "user" | "assistant";
  content: string;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<MessageProps[]>([
    {
      role: "assistant",
      content: "Hi, I'm FinanceGenie! Ask me about stocks, financial markets, or investment strategies. I can provide real-time data and insights to help you make informed decisions."
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [stockSymbol, setStockSymbol] = useState<string | null>(null);
  const [stockHistory, setStockHistory] = useState<string[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setInput("");
    
    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    
    // Check for stock request
    const stockRegex = /\b([A-Za-z]{1,5})\b.*(?:stock|price|chart|quote)/i;
    const stockMatch = userMessage.match(stockRegex);
    
    if (stockMatch) {
      const symbol = stockMatch[1].toUpperCase();
      setStockSymbol(symbol);
      
      // Add to stock history if not already present
      if (!stockHistory.includes(symbol)) {
        setStockHistory(prev => [symbol, ...prev].slice(0, 5));
      }
      
      // Fetch stock data and include in AI response
      try {
        const stockData = await getStockQuote(symbol);
        if (stockData) {
          // Add a system message with stock data
          const stockInfo = `${stockData.name} (${stockData.symbol}) is currently trading at ${stockData.price.toFixed(2)}, ${stockData.change > 0 ? 'up' : 'down'} ${Math.abs(stockData.changePercent).toFixed(2)}% today.`;
          setMessages(prev => [...prev, { 
            role: "assistant", 
            content: `I found the latest data for ${symbol}:\n\n${stockInfo}\n\nThe stock chart is displayed below. What else would you like to know about this stock?`
          }]);
          return; // Skip the AI response since we've added our own
        }
      } catch (error) {
        console.error("Error fetching stock data:", error);
        // Continue with AI response if stock fetch fails
      }
    }
    
    // Generate AI response
    setIsLoading(true);
    try {
      // Convert messages to format expected by DeepSeek API
      const apiMessages: ChatMessage[] = messages
        .filter(msg => messages.indexOf(msg) > 0) // Skip the first welcome message
        .map(msg => ({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content
        }));
      
      // Add the new user message
      apiMessages.push({ role: "user", content: userMessage });
      
      const response = await generateResponse(apiMessages);
      
      // Add AI response to chat
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      console.error("Error generating response:", error);
      toast.error("Failed to generate a response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStockHistorySelect = (symbol: string) => {
    setInput(`Tell me about ${symbol} stock`);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pt-4" ref={scrollAreaRef}>
          <div className="space-y-4 px-4">
            {messages.map((message, i) => (
              <div
                key={i}
                className={`
                  ${message.role === "user" ? "chat-message-user" : "chat-message-bot"}
                  animate-fade-in
                `}
              >
                <div className="flex items-start gap-2">
                  {message.role === "assistant" && (
                    <Cpu className="h-5 w-5 mt-1 text-secondary" />
                  )}
                  <div className="leading-relaxed">
                    {message.content.split("\n").map((line, j) => (
                      <React.Fragment key={j}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </div>
                  {message.role === "user" && (
                    <ArrowUpCircle className="h-5 w-5 mt-1 text-primary" />
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="chat-message-bot">
                <div className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-secondary" />
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-secondary animate-pulse delay-75"></div>
                    <div className="w-2 h-2 rounded-full bg-secondary animate-pulse delay-150"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {stockSymbol && (
        <div className="mx-4 my-4">
          <StockDisplay symbol={stockSymbol} onClose={() => setStockSymbol(null)} />
        </div>
      )}

      {stockHistory.length > 0 && (
        <div className="px-4 pt-2">
          <div className="text-xs text-muted-foreground mb-1">Recent stocks:</div>
          <div className="flex flex-wrap gap-1">
            {stockHistory.map((symbol) => (
              <Button 
                key={symbol} 
                variant="outline" 
                size="sm" 
                className="h-6 text-xs px-2 py-0"
                onClick={() => handleStockHistorySelect(symbol)}
              >
                {symbol}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 bg-card/50 border-t border-border rounded-b-lg">
        <div className="flex items-center space-x-2">
          <Input
            ref={inputRef}
            placeholder="Ask about stocks, financial markets, or investment advice..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="bg-muted/50"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading || !input.trim()}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
