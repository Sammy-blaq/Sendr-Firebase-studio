"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import SmartPricingAssistant from '@/components/SmartPricingAssistant';
import { PackagePlus, Loader2, UploadCloud } from 'lucide-react';
import Image from 'next/image';

interface FormData {
  originCity: string;
  destinationCity: string;
  packageSize: 'Small' | 'Medium' | 'Large' | '';
  packageWeight: string;
  description: string;
  yourPrice: string;
  imageUrl?: string;
}

export default function SendPackagePage() {
  const { toast } = useToast();
  const { currentUser, isLoading: userLoading } = useUser();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    originCity: '',
    destinationCity: '',
    packageSize: '',
    packageWeight: '',
    description: '',
    yourPrice: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!userLoading && !currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please log in to send a package.",
        variant: "destructive",
      });
      router.push('/'); // Redirect to login or home if not logged in
    }
  }, [currentUser, userLoading, router, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value as FormData['packageSize'] }));
  };

  const handlePriceSuggested = (price: number) => {
    setFormData(prev => ({ ...prev, yourPrice: price.toFixed(2) }));
  };
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        // In a real app, you'd upload this file and get a URL
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string })); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast({ title: "Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    // Basic validation
    for (const key in formData) {
        if (key !== 'imageUrl' && !formData[key as keyof Omit<FormData, 'imageUrl'>]) {
            toast({ title: "Missing field", description: `Please fill in ${key}.`, variant: "destructive"});
            setIsSubmitting(false);
            return;
        }
    }

    // Mock submission
    console.log("Submitting package request:", { ...formData, senderId: currentUser.id });
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call

    toast({
      title: "Package Posted!",
      description: "Your package request has been successfully posted.",
    });
    setIsSubmitting(false);
    // Reset form or redirect
    router.push('/packages'); 
  };

  if (userLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  if (!currentUser) {
     return (
      <div className="text-center py-10">
        <p className="text-xl text-muted-foreground">Please log in to send a package.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="text-center">
        <h1 className="font-headline text-4xl font-bold text-primary">Send a Package</h1>
        <p className="text-muted-foreground mt-2">Fill in the details below to post your package request.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6 p-6 sm:p-8 bg-card rounded-xl shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="originCity">Origin City</Label>
              <Input id="originCity" name="originCity" value={formData.originCity} onChange={handleInputChange} placeholder="e.g., New York" required />
            </div>
            <div>
              <Label htmlFor="destinationCity">Destination City</Label>
              <Input id="destinationCity" name="destinationCity" value={formData.destinationCity} onChange={handleInputChange} placeholder="e.g., Los Angeles" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="packageSize">Package Size</Label>
              <Select name="packageSize" value={formData.packageSize} onValueChange={(value) => handleSelectChange('packageSize', value)} required>
                <SelectTrigger id="packageSize">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Small">Small (e.g., envelope, small box)</SelectItem>
                  <SelectItem value="Medium">Medium (e.g., shoebox, backpack)</SelectItem>
                  <SelectItem value="Large">Large (e.g., suitcase, large box)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="packageWeight">Package Weight (kg)</Label>
              <Input id="packageWeight" name="packageWeight" type="number" value={formData.packageWeight} onChange={handleInputChange} placeholder="e.g., 2.5" step="0.1" min="0.1" required />
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Package Description</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Briefly describe your package contents, any special handling instructions, etc." required rows={4} />
          </div>

          <div>
            <Label htmlFor="packageImage">Package Image (Optional)</Label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {imagePreview ? (
                  <Image src={imagePreview} alt="Package preview" width={128} height={128} className="mx-auto h-32 w-32 object-cover rounded-md" />
                ) : (
                  <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                )}
                <div className="flex text-sm text-muted-foreground">
                  <label
                    htmlFor="packageImage"
                    className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                  >
                    <span>Upload a file</span>
                    <input id="packageImage" name="packageImage" type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="yourPrice">Your Desired Price (NGN)</Label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-muted-foreground text-base">₦</span>
              </div>
              <Input id="yourPrice" name="yourPrice" type="number" value={formData.yourPrice} onChange={handleInputChange} placeholder="e.g., 15000.00" step="100" min="100" className="pl-10" required />
            </div>
          </div>

          <Button type="submit" className="w-full text-lg py-3" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <PackagePlus className="mr-2 h-5 w-5" />
            )}
            Post Package Request
          </Button>
        </form>

        <div className="lg:col-span-1">
          <SmartPricingAssistant 
            onPriceSuggested={handlePriceSuggested}
            initialValues={{
              size: formData.packageSize || undefined,
              weight: parseFloat(formData.packageWeight) || undefined,
              originCity: formData.originCity || undefined,
              destinationCity: formData.destinationCity || undefined,
            }}
          />
        </div>
      </div>
    </div>
  );
}
