"use client";

import type { PackageRequest } from '@/lib/types';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Scale, Weight, DollarSign, ArrowRightLeft, CheckCircle, Edit3, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PackageCardProps {
  packageRequest: PackageRequest;
  onAccept: (pkg: PackageRequest) => void;
  onNegotiate: (pkg: PackageRequest) => void;
  onViewDetails?: (pkg: PackageRequest) => void; // Optional for future use
  isTraveler?: boolean; // To conditionally show accept/negotiate buttons
}

export default function PackageCard({ packageRequest, onAccept, onNegotiate, onViewDetails, isTraveler = false }: PackageCardProps) {
  const { 
    senderName, originCity, destinationCity, size, weight, proposedPrice, 
    status, imageUrl, description, createdAt, negotiation 
  } = packageRequest;

  let displayPrice = proposedPrice;
  if (status === 'Negotiating' && negotiation?.currentPrice) {
    displayPrice = negotiation.currentPrice;
  }

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <CardHeader className="p-0 relative">
        <Image 
          src={imageUrl || `https://placehold.co/600x400.png?text=${originCity}+to+${destinationCity}`} 
          alt={description || `Package from ${originCity} to ${destinationCity}`}
          width={600} height={250} 
          className="object-cover w-full h-48"
          data-ai-hint="package parcel"
        />
        <Badge variant={status === 'Posted' ? 'default' : (status === 'Accepted' || status === 'En Route' ? 'secondary' : 'outline')} className="absolute top-2 right-2 bg-opacity-80 backdrop-blur-sm">
          {status}
        </Badge>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="font-headline text-xl mb-1 truncate" title={description}>{description || "Package Delivery"}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground mb-3">
          Posted by {senderName} &bull; {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </CardDescription>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-foreground/80">
            <MapPin className="h-4 w-4 mr-2 text-primary" /> 
            <span>{originCity} &rarr; {destinationCity}</span>
          </div>
          <div className="flex items-center text-foreground/80">
            <Scale className="h-4 w-4 mr-2 text-primary" /> Size: {size}
          </div>
          <div className="flex items-center text-foreground/80">
            <Weight className="h-4 w-4 mr-2 text-primary" /> Weight: {weight} kg
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-muted/50 border-t flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center font-bold text-lg text-primary">
          <DollarSign className="h-5 w-5 mr-1" />
          {displayPrice.toFixed(2)}
          {status === 'Negotiating' && <Edit3 className="h-4 w-4 ml-2 text-accent" title="Price under negotiation" />}
        </div>
        {isTraveler && (status === 'Posted' || status === 'Negotiating') && (
          <div className="flex gap-2 w-full sm:w-auto">
            <Button size="sm" variant="outline" onClick={() => onNegotiate(packageRequest)} className="flex-1 sm:flex-initial">
              <ArrowRightLeft className="mr-1.5 h-4 w-4" /> Negotiate
            </Button>
            <Button size="sm" onClick={() => onAccept(packageRequest)} className="flex-1 sm:flex-initial">
              <CheckCircle className="mr-1.5 h-4 w-4" /> Accept
            </Button>
          </div>
        )}
        {onViewDetails && (
          <Button size="sm" variant="ghost" onClick={() => onViewDetails(packageRequest)} className="w-full sm:w-auto mt-2 sm:mt-0">
            <Eye className="mr-1.5 h-4 w-4" /> View Details
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
