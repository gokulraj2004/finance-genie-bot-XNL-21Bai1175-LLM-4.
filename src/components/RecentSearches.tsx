
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, Search } from "lucide-react";

interface RecentSearchesProps {
  searches: string[];
  onSelect: (symbol: string) => void;
}

const RecentSearches = ({ searches, onSelect }: RecentSearchesProps) => {
  return (
    <Card className="stock-card">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <History className="h-4 w-4 mr-2 text-finance-accent" />
          <CardTitle className="text-base">Recent Searches</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        {searches.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {searches.map((search) => (
              <Badge 
                key={search} 
                variant="secondary" 
                className="cursor-pointer hover:bg-secondary/80"
                onClick={() => onSelect(search)}
              >
                <Search className="h-3 w-3 mr-1" />
                {search}
              </Badge>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            Your recent stock searches will appear here
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentSearches;
