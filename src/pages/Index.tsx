
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import ChatInterface from "@/components/ChatInterface";
import TopStocks from "@/components/TopStocks";
import MarketOverview from "@/components/MarketOverview";
import RecentSearches from "@/components/RecentSearches";

const Index = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const [recentSearches, setRecentSearches] = useState<string[]>(["AAPL", "MSFT", "TSLA"]);

  const handleSearchSelect = (symbol: string) => {
    // Set the active tab to chat when a stock is selected
    setActiveTab("chat");
    // This would trigger a search for the symbol
    console.log(`Searching for ${symbol}`);
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header />
      
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="flex flex-col flex-1 overflow-hidden"
          >
            <div className="bg-card/50 px-4 py-2 border-b border-border">
              <TabsList className="grid grid-cols-2 w-full md:w-[400px]">
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="stocks">Market Data</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="chat" className="flex-1 overflow-hidden m-0 p-0">
              <ChatInterface />
            </TabsContent>
            
            <TabsContent value="stocks" className="flex-1 overflow-auto m-0 p-4 space-y-4">
              <h2 className="text-2xl font-bold mb-4">Market Insights</h2>
              <MarketOverview />
              <TopStocks />
              <RecentSearches searches={recentSearches} onSelect={handleSearchSelect} />
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sidebar - only visible on larger screens */}
        <div className="hidden md:block w-80 overflow-y-auto p-4 bg-finance-card/50 border-l border-border space-y-4">
          <h3 className="font-medium text-sm uppercase text-muted-foreground tracking-wider mb-2">Market Summary</h3>
          <MarketOverview />
          <h3 className="font-medium text-sm uppercase text-muted-foreground tracking-wider mb-2 mt-6">Top Movers</h3>
          <TopStocks />
          <h3 className="font-medium text-sm uppercase text-muted-foreground tracking-wider mb-2 mt-6">Recent Searches</h3>
          <RecentSearches searches={recentSearches} onSelect={handleSearchSelect} />
        </div>
      </main>
    </div>
  );
};

export default Index;
