
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown } from "lucide-react";

const topStocksData = [
  { symbol: "AAPL", name: "Apple Inc.", price: 188.22, change: 1.78, changePercent: 0.95 },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 386.64, change: 5.32, changePercent: 1.39 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 142.53, change: -1.02, changePercent: -0.71 },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 177.59, change: 3.21, changePercent: 1.84 },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 824.18, change: 15.36, changePercent: 1.9 }
];

const TopStocks = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <Card className="stock-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Top Stocks</CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-2">
          {topStocksData.map((stock) => (
            <div key={stock.symbol} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="font-mono">
                  {stock.symbol}
                </Badge>
                <span className="text-xs text-muted-foreground hidden md:inline">
                  {stock.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span>{formatCurrency(stock.price)}</span>
                <span 
                  className={`flex items-center ${
                    stock.change > 0 ? "text-finance-chart-positive" : "text-finance-chart-negative"
                  }`}
                >
                  {stock.change > 0 ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  {stock.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopStocks;
