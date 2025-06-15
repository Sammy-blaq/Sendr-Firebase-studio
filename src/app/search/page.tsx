"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { PackageRequest } from '@/lib/types';
import { mockPackageRequests } from '@/lib/mockData';
import PackageCard from '@/components/PackageCard'; // Re-use for displaying results
import { Search as SearchIcon, Loader2, ListFilter, XCircle } from 'lucide-react';

export default function SearchPackagePage() {
  const { toast } = useToast();
  const [originCity, setOriginCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [trackingId, setTrackingId] = useState('');
  const [searchResults, setSearchResults] = useState<PackageRequest[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSearching(true);
    setHasSearched(true);
    setSearchResults([]); // Clear previous results

    if (!originCity && !destinationCity && !trackingId) {
      toast({
        title: "Search Criteria Missing",
        description: "Please provide at least one search field (Origin, Destination, or Tracking ID).",
        variant: "destructive",
      });
      setIsSearching(false);
      return;
    }

    // Simulate API call for search
    await new Promise(resolve => setTimeout(resolve, 1000));

    let results = mockPackageRequests;

    if (trackingId) {
      results = results.filter(pkg => pkg.trackingId.toLowerCase() === trackingId.toLowerCase());
    } else { // Only filter by city if tracking ID is not provided
      if (originCity) {
        results = results.filter(pkg => pkg.originCity.toLowerCase().includes(originCity.toLowerCase()));
      }
      if (destinationCity) {
        results = results.filter(pkg => pkg.destinationCity.toLowerCase().includes(destinationCity.toLowerCase()));
      }
    }
    
    setSearchResults(results);
    setIsSearching(false);

    if(results.length === 0) {
        toast({
            title: "No Packages Found",
            description: "Your search did not return any packages. Try different criteria.",
        });
    } else {
         toast({
            title: "Search Complete",
            description: `Found ${results.length} package(s).`,
        });
    }
  };
  
  const clearSearch = () => {
    setOriginCity('');
    setDestinationCity('');
    setTrackingId('');
    setSearchResults([]);
    setHasSearched(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="text-center">
        <h1 className="font-headline text-4xl font-bold text-primary">Track Your Package</h1>
        <p className="text-muted-foreground mt-2">Enter package details to find its status.</p>
      </header>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ListFilter className="mr-2 h-6 w-6 text-accent" /> Search Filters
          </CardTitle>
          <CardDescription>
            Search by Tracking ID for precise results, or use city filters.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="originCity">Origin City</Label>
                <Input id="originCity" value={originCity} onChange={(e) => setOriginCity(e.target.value)} placeholder="e.g., New York" />
              </div>
              <div>
                <Label htmlFor="destinationCity">Destination City</Label>
                <Input id="destinationCity" value={destinationCity} onChange={(e) => setDestinationCity(e.target.value)} placeholder="e.g., Los Angeles" />
              </div>
            </div>
            <div className="space-y-1 text-center text-sm text-muted-foreground">OR</div>
            <div>
              <Label htmlFor="trackingId">Tracking ID</Label>
              <Input id="trackingId" value={trackingId} onChange={(e) => setTrackingId(e.target.value)} placeholder="e.g., SWFT000001" />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
                <Button type="submit" className="w-full sm:flex-1" disabled={isSearching}>
                  {isSearching ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <SearchIcon className="mr-2 h-4 w-4" />
                  )}
                  Search Packages
                </Button>
                {(originCity || destinationCity || trackingId || hasSearched) && (
                    <Button type="button" variant="outline" onClick={clearSearch} className="w-full sm:w-auto">
                        <XCircle className="mr-2 h-4 w-4"/> Clear Search
                    </Button>
                )}
            </div>
          </form>
        </CardContent>
      </Card>

      {hasSearched && !isSearching && (
        <div className="mt-8">
          <h2 className="font-headline text-2xl font-semibold mb-4 text-center">Search Results</h2>
          {searchResults.length === 0 ? (
            <div className="text-center py-10 bg-card rounded-lg shadow">
              <SearchIcon className="mx-auto h-16 w-16 text-muted-foreground/30" />
              <p className="mt-4 text-xl text-muted-foreground">No packages found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {searchResults.map(pkg => (
                // PackageCard expects onAccept and onNegotiate, provide dummy functions or adapt card
                <PackageCard 
                  key={pkg.id} 
                  packageRequest={pkg} 
                  onAccept={() => {}} 
                  onNegotiate={() => {}}
                  isTraveler={false} // Searchers are not necessarily travelers in this context
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
