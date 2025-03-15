
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { X, TrendingUp, TrendingDown, ChevronRight } from "lucide-react";
import { getStockQuote, getHistoricalData, StockQuote, HistoricalData } from "@/services/yahooFinanceApi";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface StockDisplayProps {
  symbol: string;
  onClose: () => void;
}

const StockDisplay = ({ symbol, onClose }: StockDisplayProps) => {
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState<"5d" | "1mo" | "3mo" | "6mo" | "1y">("1mo");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [quoteData, histData] = await Promise.all([
          getStockQuote(symbol),
          getHistoricalData(symbol, timePeriod)
        ]);
        
        setQuote(quoteData);
        setHistoricalData(histData);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol, timePeriod]);

  const handlePeriodChange = (value: string) => {
    setTimePeriod(value as "5d" | "1mo" | "3mo" | "6mo" | "1y");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const formatLargeNumber = (value: number) => {
    if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    return value.toString();
  };

  const getStockChangeClass = (change: number) => {
    return change > 0 ? "stock-positive" : change < 0 ? "stock-negative" : "stock-neutral";
  };

  const chartColor = quote?.change && quote.change > 0 ? "#10B981" : "#EF4444";

  return (
    <Card className="stock-card animate-fade-in border-border/50">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl font-bold">
                {loading ? <Skeleton className="h-7 w-24" /> : quote?.symbol}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
            {loading ? (
              <Skeleton className="h-5 w-36 mt-1" />
            ) : (
              <p className="text-sm text-muted-foreground">{quote?.name}</p>
            )}
          </div>
          
          {loading ? (
            <Skeleton className="h-9 w-28" />
          ) : quote ? (
            <div className="text-right">
              <div className="text-lg font-semibold">{formatCurrency(quote.price)}</div>
              <div className={`flex items-center justify-end text-sm ${getStockChangeClass(quote.change)}`}>
                {quote.change > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {formatCurrency(quote.change)} ({quote.changePercent.toFixed(2)}%)
              </div>
            </div>
          ) : null}
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        <Tabs defaultValue="price" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="price" className="flex-1">Price</TabsTrigger>
            <TabsTrigger value="volume" className="flex-1">Volume</TabsTrigger>
            <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="price" className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">Time Range</div>
                <div className="flex space-x-1">
                  {["5d", "1mo", "3mo", "6mo", "1y"].map((period) => (
                    <Button
                      key={period}
                      variant={period === timePeriod ? "secondary" : "ghost"}
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => handlePeriodChange(period)}
                    >
                      {period}
                    </Button>
                  ))}
                </div>
              </div>
              
              {loading ? (
                <Skeleton className="h-[200px] w-full rounded-md" />
              ) : (
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={historicalData}
                      margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={chartColor} stopOpacity={0.8} />
                          <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 10 }}
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        }}
                        axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                        tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                      />
                      <YAxis 
                        domain={['auto', 'auto']}
                        tick={{ fontSize: 10 }}
                        tickFormatter={(value) => `$${value.toFixed(0)}`}
                        axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                        tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                      />
                      <Tooltip 
                        formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                        labelFormatter={(value) => {
                          const date = new Date(value);
                          return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="close" 
                        stroke={chartColor} 
                        fillOpacity={1} 
                        fill="url(#colorPrice)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="volume" className="space-y-4">
            {loading ? (
              <Skeleton className="h-[200px] w-full rounded-md" />
            ) : (
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={historicalData}
                    margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      }}
                      axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                      tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) => formatLargeNumber(value)}
                      axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                      tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                    />
                    <Tooltip 
                      formatter={(value: number) => [formatLargeNumber(value), 'Volume']}
                      labelFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
                      }}
                    />
                    <Bar dataKey="volume" fill="#60A5FA" barSize={6} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="details">
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            ) : quote ? (
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Open</span>
                  <span>{formatCurrency(quote.open)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prev Close</span>
                  <span>{formatCurrency(quote.previousClose)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Day High</span>
                  <span>{formatCurrency(quote.dayHigh)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Day Low</span>
                  <span>{formatCurrency(quote.dayLow)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Volume</span>
                  <span>{formatLargeNumber(quote.volume)}</span>
                </div>
                {quote.marketCap && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Market Cap</span>
                    <span>{formatLargeNumber(quote.marketCap)}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">No data available</div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StockDisplay;
