
import React from "react";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, Info } from "lucide-react";

const Header = () => {
  return (
    <header className="py-4 px-6 bg-card border-b border-border flex justify-between items-center">
      <div className="flex items-center gap-2">
        <DollarSign className="h-6 w-6 text-finance-accent" />
        <h1 className="text-xl font-bold">FinanceGenie</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="hidden sm:inline-flex">
          <TrendingUp className="h-4 w-4 mr-2" />
          Market Overview
        </Button>
        <Button variant="ghost" size="icon">
          <Info className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
