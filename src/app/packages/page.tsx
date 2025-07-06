"use client";

import { useState, useEffect, useMemo } from 'react';
import PackageCard from '@/components/PackageCard';
import PriceNegotiationDialog from '@/components/PriceNegotiationDialog';
import type { PackageRequest, User } from '@/lib/types';
import { mockPackageRequests, mockUsers } from '@/lib/mockData'; // Using mock data
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, PackageSearch, FilterX, Search } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';

export default function PackagesPage() {
  const [packages, setPackages] = useState<PackageRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [destinationFilter, setDestinationFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt_desc'); // e.g. price_asc, price_desc, createdAt_asc, createdAt_desc

  const [negotiatingPackage, setNegotiatingPackage] = useState<PackageRequest | null>(null);
  const { currentUser, isLoading: userLoading } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching data
    setIsLoading(true);
    setTimeout(() => {
      setPackages(mockPackageRequests.filter(p => p.status === 'Posted' || p.status === 'Negotiating'));
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleAccept = (pkg: PackageRequest) => {
    if (!currentUser) {
      toast({ title: "Login Required", description: "Please log in to accept packages.", variant: "destructive" });
      return;
    }
    // Mock accept
    setPackages(prev => prev.map(p => p.id === pkg.id ? { ...p, status: 'Accepted', travelerId: currentUser.id, travelerName: currentUser.name } : p));
    toast({ title: "Package Accepted!", description: `You've accepted to deliver ${pkg.description || 'the package'}.` });
  };

  const handleNegotiate = (pkg: PackageRequest) => {
    if (!currentUser) {
      toast({ title: "Login Required", description: "Please log in to negotiate.", variant: "destructive" });
      return;
    }
    setNegotiatingPackage(pkg);
  };

  const handleNegotiationSubmit = (packageId: string, newPrice: number, offerBy: 'sender' | 'traveler') => {
    if (!currentUser) return;
    
    setPackages(prevPackages => prevPackages.map(p => {
      if (p.id === packageId) {
        const newOffers = [
          ...(p.negotiation?.offers || [{ userId: p.senderId, userName: p.senderName, price: p.proposedPrice, timestamp: p.createdAt, type: 'sender' as 'sender' | 'traveler'}]),
          { userId: currentUser.id, userName: currentUser.name, price: newPrice, timestamp: new Date(), type: offerBy }
        ];
        return {
          ...p,
          status: 'Negotiating' as 'Negotiating',
          negotiation: {
            originalPrice: p.negotiation?.originalPrice || p.proposedPrice,
            offers: newOffers,
            currentPrice: newPrice,
            lastOfferBy: offerBy,
          }
        };
      }
      return p;
    }));
    
    toast({ title: "Offer Submitted!", description: `Your offer of ₦${newPrice.toFixed(2)} has been sent.` });
    setNegotiatingPackage(null); // Close dialog
  };

  const filteredAndSortedPackages = useMemo(() => {
    let result = packages;
    if (destinationFilter) {
      result = result.filter(pkg => pkg.destinationCity.toLowerCase().includes(destinationFilter.toLowerCase()));
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return (a.negotiation?.currentPrice || a.proposedPrice) - (b.negotiation?.currentPrice || b.proposedPrice);
        case 'price_desc':
          return (b.negotiation?.currentPrice || b.proposedPrice) - (a.negotiation?.currentPrice || a.proposedPrice);
        case 'createdAt_asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'createdAt_desc':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    return result;
  }, [packages, destinationFilter, sortBy]);

  const clearFilters = () => {
    setDestinationFilter('');
    setSortBy('createdAt_desc');
  };

  if (isLoading || userLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading packages...</p>
      </div>
    );
  }
  
  const isTraveler = currentUser?.type === 'Traveler' || currentUser?.type === 'Admin'; // Simplified logic

  return (
    <div className="space-y-8">
      <header className="text-center py-6 bg-primary/5 rounded-xl shadow-md">
        <h1 className="font-headline text-4xl font-bold text-primary">Available Packages</h1>
        <p className="text-muted-foreground mt-2">Find packages to deliver and earn on your travels.</p>
      </header>

      <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-md py-4 rounded-lg shadow">
        <div className="container mx-auto px-0 sm:px-4">
            <div className="flex flex-col md:flex-row gap-4 items-center p-4 border rounded-lg bg-card">
              <div className="relative w-full md:flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Filter by destination city..."
                  value={destinationFilter}
                  onChange={(e) => setDestinationFilter(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt_desc">Newest First</SelectItem>
                  <SelectItem value="createdAt_asc">Oldest First</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
              {(destinationFilter || sortBy !== 'createdAt_desc') && (
                 <Button variant="ghost" onClick={clearFilters} className="w-full md:w-auto">
                    <FilterX className="mr-2 h-4 w-4"/> Clear Filters
                 </Button>
              )}
            </div>
        </div>
      </div>


      {filteredAndSortedPackages.length === 0 ? (
        <div className="text-center py-16">
          <PackageSearch className="mx-auto h-24 w-24 text-muted-foreground/50" />
          <p className="mt-4 text-xl text-muted-foreground">No packages match your criteria.</p>
          <p className="text-sm text-muted-foreground">Try adjusting your filters or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedPackages.map(pkg => (
            <PackageCard 
              key={pkg.id} 
              packageRequest={pkg} 
              onAccept={handleAccept}
              onNegotiate={handleNegotiate}
              isTraveler={isTraveler} // Pass traveler status
            />
          ))}
        </div>
      )}

      <PriceNegotiationDialog
        packageRequest={negotiatingPackage}
        currentUser={currentUser}
        open={!!negotiatingPackage}
        onOpenChange={(open) => !open && setNegotiatingPackage(null)}
        onNegotiationSubmit={handleNegotiationSubmit}
      />
    </div>
  );
}
