
// Service to interact with the Yahoo Finance API
import { toast } from "sonner";

const API_KEY = "KEHOOWA7ENRX8SSE";
const BASE_URL = "https://yfapi.net";

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  previousClose: number;
  open: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  marketCap?: number;
}

export interface HistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Get real-time stock quote
export const getStockQuote = async (symbol: string): Promise<StockQuote | null> => {
  try {
    const url = `${BASE_URL}/v6/finance/quote?region=US&lang=en&symbols=${symbol}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-api-key": API_KEY,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch stock quote: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.quoteResponse?.result || data.quoteResponse.result.length === 0) {
      toast.error(`No data found for symbol: ${symbol}`);
      return null;
    }

    const quote = data.quoteResponse.result[0];
    
    return {
      symbol: quote.symbol,
      name: quote.shortName || quote.longName || quote.symbol,
      price: quote.regularMarketPrice,
      change: quote.regularMarketChange,
      changePercent: quote.regularMarketChangePercent,
      previousClose: quote.regularMarketPreviousClose,
      open: quote.regularMarketOpen,
      dayHigh: quote.regularMarketDayHigh,
      dayLow: quote.regularMarketDayLow,
      volume: quote.regularMarketVolume,
      marketCap: quote.marketCap
    };
  } catch (error) {
    console.error("Error fetching stock quote:", error);
    toast.error("Failed to fetch stock data");
    
    // For development, return mock data
    return getMockStockData(symbol);
  }
};

// Get historical stock data
export const getHistoricalData = async (
  symbol: string,
  period: "1d" | "5d" | "1mo" | "3mo" | "6mo" | "1y" | "5y" = "1mo"
): Promise<HistoricalData[]> => {
  try {
    const url = `${BASE_URL}/v8/finance/chart/${symbol}?range=${period}&interval=1d&region=US&lang=en`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-api-key": API_KEY,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch historical data: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.chart?.result || data.chart.result.length === 0) {
      toast.error(`No historical data found for symbol: ${symbol}`);
      return [];
    }

    const result = data.chart.result[0];
    const timestamps = result.timestamp;
    const quotes = result.indicators.quote[0];
    
    return timestamps.map((time: number, index: number) => ({
      date: new Date(time * 1000).toISOString().split('T')[0],
      open: quotes.open[index],
      high: quotes.high[index],
      low: quotes.low[index],
      close: quotes.close[index],
      volume: quotes.volume[index]
    }));
  } catch (error) {
    console.error("Error fetching historical data:", error);
    toast.error("Failed to fetch historical stock data");
    
    // For development, return mock data
    return getMockHistoricalData(symbol);
  }
};

// Mock data for development/fallback
const getMockStockData = (symbol: string): StockQuote => {
  const randomChange = (Math.random() * 10 - 5).toFixed(2);
  const price = Math.random() * 100 + 50;
  const change = parseFloat(randomChange);
  
  return {
    symbol: symbol.toUpperCase(),
    name: `${symbol.toUpperCase()} Inc.`,
    price: parseFloat(price.toFixed(2)),
    change: change,
    changePercent: (change / price) * 100,
    previousClose: price - change,
    open: price - (change / 2),
    dayHigh: price + (Math.random() * 5),
    dayLow: price - (Math.random() * 5),
    volume: Math.floor(Math.random() * 10000000)
  };
};

const getMockHistoricalData = (symbol: string): HistoricalData[] => {
  const data: HistoricalData[] = [];
  const today = new Date();
  let price = Math.random() * 100 + 50;
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const change = (Math.random() * 5) - 2.5;
    price += change;
    
    data.push({
      date: date.toISOString().split('T')[0],
      open: price - (Math.random() * 2),
      high: price + (Math.random() * 2),
      low: price - (Math.random() * 2),
      close: price,
      volume: Math.floor(Math.random() * 10000000)
    });
  }
  
  return data;
};

// Search for stocks
export const searchStocks = async (query: string): Promise<any[]> => {
  try {
    const url = `${BASE_URL}/v6/finance/autocomplete?region=US&lang=en&query=${encodeURIComponent(query)}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-api-key": API_KEY,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to search stocks: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.ResultSet || !data.ResultSet.Result) {
      return [];
    }

    return data.ResultSet.Result;
  } catch (error) {
    console.error("Error searching stocks:", error);
    
    // Mock data for development
    return [
      { symbol: "AAPL", name: "Apple Inc." },
      { symbol: "MSFT", name: "Microsoft Corporation" },
      { symbol: "AMZN", name: "Amazon.com Inc." },
      { symbol: "GOOGL", name: "Alphabet Inc." },
      { symbol: "META", name: "Meta Platforms Inc." }
    ].filter(item => 
      item.symbol.toLowerCase().includes(query.toLowerCase()) || 
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  }
};
