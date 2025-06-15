export interface PackageRequest {
  id: string;
  senderId: string;
  senderName: string;
  travelerId?: string;
  travelerName?: string;
  originCity: string;
  destinationCity: string;
  size: 'Small' | 'Medium' | 'Large';
  weight: number; // in kg
  proposedPrice: number; // in USD
  status: 'Posted' | 'Negotiating' | 'Accepted' | 'En Route' | 'Delivered' | 'Cancelled';
  trackingId: string;
  imageUrl?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  negotiation?: {
    originalPrice: number;
    offers: { userId: string; userName: string, price: number; timestamp: Date; type: 'sender' | 'traveler' }[];
    currentPrice: number;
    lastOfferBy: 'sender' | 'traveler';
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  type: 'Sender' | 'Traveler' | 'Admin'; // Simplified
  walletBalance: number; // in USD
  createdAt: Date;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: 'Deposit' | 'Withdrawal' | 'TransferSent' | 'TransferReceived' | 'PaymentSent' | 'PaymentReceived';
  amount: number; // in USD
  description: string;
  relatedUserId?: string;
  relatedPackageId?: string;
  timestamp: Date;
  status: 'Pending' | 'Completed' | 'Failed';
}
