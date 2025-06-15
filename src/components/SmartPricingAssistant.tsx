"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Lightbulb, AlertTriangle } from "lucide-react";
import { suggestPackagePrice, SuggestPackagePriceInput, SuggestPackagePriceOutput } from '@/ai/flows/suggest-package-price';
import { useToast } from "@/hooks/use-toast";

interface SmartPricingAssistantProps {
  onPriceSuggested: (price: number) => void;
  initialValues?: Partial<SuggestPackagePriceInput>;
}

export default function SmartPricingAssistant({ onPriceSuggested, initialValues }: SmartPricingAssistantProps) {
  const [size, setSize] = useState(initialValues?.size || '');
  const [weight, setWeight] = useState(initialValues?.weight || '');
  const [originCity, setOriginCity] = useState(initialValues?.originCity || '');
  const [destinationCity, setDestinationCity] = useState(initialValues?.destinationCity || '');
  
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<SuggestPackagePriceOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuggestion(null);
    setError(null);

    if (!size || !weight || !originCity || !destinationCity) {
      setError("All fields are required for a price suggestion.");
      setIsLoading(false);
      toast({
        title: "Missing Information",
        description: "Please fill all fields to get a price suggestion.",
        variant: "destructive",
      });
      return;
    }

    try {
      const inputData: SuggestPackagePriceInput = {
        size,
        weight: parseFloat(weight as string),
        originCity,
        destinationCity,
      };
      const result = await suggestPackagePrice(inputData);
      setSuggestion(result);
      if (result.suggestedPrice) {
        onPriceSuggested(result.suggestedPrice);
      }
       toast({
        title: "Price Suggested!",
        description: `AI suggests $${result.suggestedPrice.toFixed(2)}. Reasoning: ${result.reasoning}`,
      });
    } catch (err) {
      console.error("Error suggesting price:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to get price suggestion: ${errorMessage}`);
      toast({
        title: "Error",
        description: `Could not fetch price suggestion. ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center font-headline">
          <Lightbulb className="mr-2 h-6 w-6 text-accent" />
          Smart Pricing Assistant
        </CardTitle>
        <CardDescription>
          Let our AI help you find the optimal price for your package. Fill in the details below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="originCity">Origin City</Label>
              <Input id="originCity" placeholder="e.g., New York" value={originCity} onChange={(e) => setOriginCity(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destinationCity">Destination City</Label>
              <Input id="destinationCity" placeholder="e.g., Los Angeles" value={destinationCity} onChange={(e) => setDestinationCity(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="packageSize">Package Size</Label>
              <Select value={size} onValueChange={setSize} required>
                <SelectTrigger id="packageSize">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="packageWeight">Package Weight (kg)</Label>
              <Input id="packageWeight" type="number" placeholder="e.g., 2.5" value={weight} onChange={(e) => setWeight(e.target.value)} step="0.1" min="0.1" required />
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Lightbulb className="mr-2 h-4 w-4" />
            )}
            Get Price Suggestion
          </Button>

          {error && (
            <div className="mt-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" /> {error}
            </div>
          )}

          {suggestion && (
            <Card className="mt-6 bg-primary/5 border-primary">
              <CardHeader>
                <CardTitle className="text-lg text-primary">AI Suggested Price: ${suggestion.suggestedPrice.toFixed(2)}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80"><span className="font-semibold">Reasoning:</span> {suggestion.reasoning}</p>
                <Button variant="outline" className="mt-4 w-full" onClick={() => onPriceSuggested(suggestion.suggestedPrice)}>
                  Use This Price
                </Button>
              </CardContent>
            </Card>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
