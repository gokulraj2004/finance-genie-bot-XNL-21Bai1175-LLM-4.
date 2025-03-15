
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, Activity } from "lucide-react";

const marketData = [
  { name: "S&P 500", value: 5123.45, change: 0.75, changePercent: 0.75 },
  { name: "Dow Jones", value: 38762.89, change: -0.28, changePercent: -0.28 },
  { name: "Nasdaq", value: 16248.52, change: 1.15, changePercent: 1.15 },
  { name: "Russell 2000", value: 2058.47, change: -0.52, changePercent: -0.52 },
  { name: "10-Yr Treasury", value: 4.18, change: 0.05, changePercent: 1.21 }
];

const MarketOverview = () => {
  const formatValue = (value: number, name: string) => {
    if (name.includes("Treasury")) {
      return value.toFixed(2) + "%";
    }
    return new Intl.NumberFormat('en-US').format(value);
  };

  return (
    <Card className="stock-card">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <Activity className="h-4 w-4 mr-2 text-finance-accent" />
          <CardTitle className="text-base">Market Overview</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-2">
          {marketData.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <span>{item.name}</span>
              <div className="flex items-center space-x-2">
                <span>{formatValue(item.value, item.name)}</span>
                <span 
                  className={`flex items-center ${
                    item.change > 0 ? "text-finance-chart-positive" : "text-finance-chart-negative"
                  }`}
                >
                  {item.change > 0 ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  {item.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketOverview;
