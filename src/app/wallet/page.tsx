"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useUser } from '@/contexts/UserContext';
import type { WalletTransaction } from '@/lib/types';
import { mockUsers, mockWalletTransactions } from '@/lib/mockData';
import { ArrowDownToLine, ArrowUpFromLine, Send, History, Loader2, Wallet } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

export default function WalletPage() {
  const { toast } = useToast();
  const { currentUser, isLoading: userLoading, login } = useUser(); // Using login to update balance for mock
  const router = useRouter();

  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [amount, setAmount] = useState('');
  const [recipientId, setRecipientId] = useState(''); // For transfers

  useEffect(() => {
    if (!userLoading && !currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please log in to view your wallet.",
        variant: "destructive",
      });
      router.push('/'); // Redirect to login or home if not logged in
      return;
    }
    if (currentUser) {
      setBalance(currentUser.walletBalance);
      // Filter mock transactions for the current user
      const userTransactions = mockWalletTransactions.filter(t => t.userId === currentUser.id)
        .sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setTransactions(userTransactions);
    }
  }, [currentUser, userLoading, router, toast]);

  const handleAction = async (type: 'deposit' | 'withdraw' | 'transfer') => {
    if (!currentUser) return;
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast({ title: "Invalid Amount", description: "Please enter a valid amount.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call

    let newBalance = balance;
    let successMessage = '';

    if (type === 'deposit') {
      newBalance += numericAmount;
      successMessage = `Successfully deposited ₦${numericAmount.toFixed(2)}.`;
    } else if (type === 'withdraw') {
      if (numericAmount > balance) {
        toast({ title: "Insufficient Funds", description: "You don't have enough balance to withdraw.", variant: "destructive" });
        setIsProcessing(false);
        return;
      }
      newBalance -= numericAmount;
      successMessage = `Successfully withdrew ₦${numericAmount.toFixed(2)}.`;
    } else if (type === 'transfer') {
      if (!recipientId) {
        toast({ title: "Recipient Required", description: "Please enter a recipient ID.", variant: "destructive" });
        setIsProcessing(false);
        return;
      }
      if (numericAmount > balance) {
        toast({ title: "Insufficient Funds", description: "You don't have enough balance to transfer.", variant: "destructive" });
        setIsProcessing(false);
        return;
      }
      // Mock check if recipient exists
      const recipientExists = mockUsers.some(u => u.id === recipientId);
      if (!recipientExists) {
          toast({ title: "Recipient Not Found", description: "The recipient ID is invalid.", variant: "destructive" });
          setIsProcessing(false);
          return;
      }
      newBalance -= numericAmount;
      successMessage = `Successfully transferred ₦${numericAmount.toFixed(2)} to user ${recipientId}.`;
    }
    
    // Update mock user balance in context (this is a hack for mock, ideally backend handles this)
    const updatedUser = { ...currentUser, walletBalance: newBalance };
    // This mock login function will update the user state if available
    if (typeof login === 'function') {
       // This is a bit of a hack for mock. In a real app, UserContext would have a updateUserBalance function.
       // We are essentially re-logging in the user with updated details.
       const userToUpdate = mockUsers.find(u => u.id === currentUser.id);
       if(userToUpdate) {
           userToUpdate.walletBalance = newBalance;
           login(currentUser.id); 
       }
    } else {
        setBalance(newBalance); // Fallback if login can't update
    }


    toast({ title: "Success!", description: successMessage });
    setAmount('');
    setRecipientId('');
    setIsProcessing(false);

    // Add to mock transactions (client-side only for demo)
    const newTx: WalletTransaction = {
      id: `txn${Date.now()}`,
      userId: currentUser.id,
      type: type === 'deposit' ? 'Deposit' : type === 'withdraw' ? 'Withdrawal' : 'TransferSent',
      amount: numericAmount,
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} ${type === 'transfer' ? `to ${recipientId}` : ''}`,
      timestamp: new Date(),
      status: 'Completed',
      relatedUserId: type === 'transfer' ? recipientId : undefined
    };
    setTransactions(prev => [newTx, ...prev].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
  };

  if (userLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  if (!currentUser) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-muted-foreground">Please log in to access your wallet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="shadow-xl bg-gradient-to-br from-primary to-blue-700 text-primary-foreground">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center">
            <Wallet className="mr-3 h-8 w-8" /> Your Wallet
          </CardTitle>
          <CardDescription className="text-primary-foreground/80">Manage your funds and view transaction history.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Current Balance</p>
          <p className="text-5xl font-bold tracking-tight">₦{balance.toFixed(2)}</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="deposit" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 h-auto shadow-inner rounded-lg">
          <TabsTrigger value="deposit" className="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-md"><ArrowDownToLine className="mr-2 h-4 w-4 inline-block"/> Add Funds</TabsTrigger>
          <TabsTrigger value="withdraw" className="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-md"><ArrowUpFromLine className="mr-2 h-4 w-4 inline-block"/> Withdraw</TabsTrigger>
          <TabsTrigger value="transfer" className="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-md"><Send className="mr-2 h-4 w-4 inline-block"/> Transfer</TabsTrigger>
        </TabsList>
        
        <div className="mt-4">
        <TabsContent value="deposit">
          <Card>
            <CardHeader><CardTitle>Add Funds to Wallet</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="depositAmount">Amount (NGN)</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground flex items-center">₦</span>
                  <Input id="depositAmount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g., 20000.00" className="pl-10" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Mock payment methods will be used. No real transaction will occur.</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleAction('deposit')} disabled={isProcessing} className="w-full">
                {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowDownToLine className="mr-2 h-4 w-4" />} Deposit Funds
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="withdraw">
          <Card>
            <CardHeader><CardTitle>Withdraw Funds</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="withdrawAmount">Amount (NGN)</Label>
                 <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground flex items-center">₦</span>
                  <Input id="withdrawAmount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g., 10000.00" className="pl-10" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Withdrawals are mock and will update your balance.</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleAction('withdraw')} disabled={isProcessing} className="w-full">
                {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowUpFromLine className="mr-2 h-4 w-4" />} Withdraw Funds
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="transfer">
          <Card>
            <CardHeader><CardTitle>Transfer Funds</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="recipientId">Recipient User ID</Label>
                <Input id="recipientId" value={recipientId} onChange={(e) => setRecipientId(e.target.value)} placeholder="Enter recipient's user ID" />
              </div>
              <div>
                <Label htmlFor="transferAmount">Amount (NGN)</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground flex items-center">₦</span>
                  <Input id="transferAmount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g., 5000.00" className="pl-10" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleAction('transfer')} disabled={isProcessing} className="w-full">
                {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Transfer Funds
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        </div>
      </Tabs>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center font-headline">
            <History className="mr-2 h-6 w-6 text-primary" /> Transaction History
          </CardTitle>
          <CardDescription>Your recent wallet activity.</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No transactions yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount (NGN)</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.slice(0, 10).map((tx) => ( // Display latest 10 transactions
                  <TableRow key={tx.id}>
                    <TableCell>{format(new Date(tx.timestamp), 'MMM dd, yyyy HH:mm')}</TableCell>
                    <TableCell>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            tx.type.includes('Received') || tx.type === 'Deposit' ? 'bg-green-100 text-green-700' :
                            tx.type.includes('Sent') || tx.type === 'Withdrawal' ? 'bg-red-100 text-red-700' :
                            'bg-muted text-muted-foreground'
                        }`}>
                            {tx.type}
                        </span>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{tx.description}</TableCell>
                    <TableCell className={`text-right font-medium ${tx.type.includes('Received') || tx.type === 'Deposit' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.type.includes('Received') || tx.type === 'Deposit' ? '+' : '-'}₦{tx.amount.toFixed(2)}
                    </TableCell>
                     <TableCell>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            tx.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                            tx.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                            tx.status === 'Failed' ? 'bg-destructive/20 text-destructive' :
                            'bg-muted text-muted-foreground'
                        }`}>
                            {tx.status}
                        </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        {transactions.length > 10 && (
             <CardFooter className="justify-center">
                <Button variant="link">View all transactions</Button>
             </CardFooter>
        )}
      </Card>
    </div>
  );
}
