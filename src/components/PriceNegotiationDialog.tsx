"use client";

import { useState } from 'react';
import type { PackageRequest, User } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Send, Edit3, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { formatDistanceToNow } from 'date-fns';

interface PriceNegotiationDialogProps {
  packageRequest: PackageRequest | null;
  currentUser: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNegotiationSubmit: (packageId: string, newPrice: number, offerBy: 'sender' | 'traveler') => void;
}

export default function PriceNegotiationDialog({
  packageRequest,
  currentUser,
  open,
  onOpenChange,
  onNegotiationSubmit,
}: PriceNegotiationDialogProps) {
  const [negotiatedPrice, setNegotiatedPrice] = useState('');
  const { toast } = useToast();

  if (!packageRequest || !currentUser) return null;

  const currentOffers = packageRequest.negotiation?.offers || [];
  const lastOffer = currentOffers.length > 0 ? currentOffers[currentOffers.length - 1] : null;
  const canMakeOffer = !lastOffer || lastOffer.userId !== currentUser.id;

  const handleSubmit = () => {
    const price = parseFloat(negotiatedPrice);
    if (isNaN(price) || price <= 0) {
      toast({ title: "Invalid Price", description: "Please enter a valid price.", variant: "destructive" });
      return;
    }
    // Determine if current user is sender or traveler for this package.
    // This logic is simplified; in a real app, you'd have clearer roles.
    const offerBy: 'sender' | 'traveler' = packageRequest.senderId === currentUser.id ? 'sender' : 'traveler';
    
    onNegotiationSubmit(packageRequest.id, price, offerBy);
    setNegotiatedPrice('');
    onOpenChange(false);
  };
  
  const initialPrice = packageRequest.negotiation?.currentPrice || packageRequest.proposedPrice;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center font-headline text-2xl">
            <Edit3 className="mr-2 h-6 w-6 text-primary" />
            Negotiate Price
          </DialogTitle>
          <DialogDescription>
            Package: {packageRequest.description || "Untitled Package"}. <br/>
            Current asking price is ₦{initialPrice.toFixed(2)}.
            Propose a new price or discuss with the {packageRequest.senderId === currentUser.id ? 'traveler' : 'sender'}.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4 max-h-[40vh] overflow-y-auto pr-2">
          <h4 className="font-semibold text-md">Offer History</h4>
          {currentOffers.length === 0 && (
            <p className="text-sm text-muted-foreground">No offers yet. Original price by sender: ₦{packageRequest.proposedPrice.toFixed(2)}</p>
          )}
          {currentOffers.map((offer, index) => (
            <div key={index} className={`flex items-start gap-3 p-3 rounded-lg ${offer.userId === currentUser.id ? 'bg-primary/10 ml-auto' : 'bg-muted/80 mr-auto'} max-w-[85%]`}>
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser.id === offer.userId ? currentUser.avatarUrl : packageRequest.senderId === offer.userId ? 'https://placehold.co/100x100.png' : 'https://placehold.co/100x100.png'} /> {/* Simplified avatar logic */}
                <AvatarFallback>{offer.userName.substring(0,1)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{offer.userName} {offer.userId === currentUser.id ? '(You)' : ''}</p>
                  <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(offer.timestamp), { addSuffix: true })}</p>
                </div>
                <p className="text-lg font-bold text-primary">₦{offer.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        {canMakeOffer && (
          <div className="grid gap-4 py-4">
            <div className="items-center gap-4">
              <Label htmlFor="negotiatedPrice" className="text-right mb-2 block">
                Your Offer (NGN)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground flex items-center">₦</span>
                <Input
                  id="negotiatedPrice"
                  type="number"
                  value={negotiatedPrice}
                  onChange={(e) => setNegotiatedPrice(e.target.value)}
                  placeholder={`e.g., ${(initialPrice * 0.9).toFixed(2)}`}
                  className="pl-10"
                  step="100"
                  min="100"
                />
              </div>
            </div>
          </div>
        )}
        {!canMakeOffer && (
           <p className="text-sm text-center text-muted-foreground py-4">Waiting for the other party to respond to your last offer.</p>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          {canMakeOffer && (
            <Button type="button" onClick={handleSubmit} disabled={!negotiatedPrice}>
              <Send className="mr-2 h-4 w-4" /> Submit Offer
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
