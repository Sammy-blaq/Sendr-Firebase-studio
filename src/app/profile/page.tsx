"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, Mail, Calendar, Wallet, Edit, Save, UploadCloud } from 'lucide-react';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockUsers } from '@/lib/mockData';

export default function ProfilePage() {
  const { currentUser, isLoading, login } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'Sender' as 'Sender' | 'Traveler' | 'Admin',
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please log in to view your profile.",
        variant: "destructive",
      });
      router.push('/');
    }
    if (currentUser) {
      setFormData({
        name: currentUser.name,
        email: currentUser.email,
        type: currentUser.type,
      });
      setAvatarPreview(currentUser.avatarUrl || null);
    }
  }, [currentUser, isLoading, router, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value: 'Sender' | 'Traveler' | 'Admin') => {
    setFormData(prev => ({ ...prev, type: value }));
  };
  
  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!currentUser) return;
    
    toast({
      title: "Saving Profile...",
      description: "Please wait while we update your details.",
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedUser = {
        ...currentUser,
        ...formData,
        avatarUrl: avatarPreview || currentUser.avatarUrl,
    };
    
    const userInDb = mockUsers.find(u => u.id === currentUser.id);
    if (userInDb) {
        Object.assign(userInDb, updatedUser);
        login(currentUser.id);
    }

    toast({
      title: "Profile Updated!",
      description: "Your profile information has been saved successfully.",
    });
    setIsEditing(false);
  };

  if (isLoading || !currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div>
            <h1 className="font-headline text-4xl font-bold text-primary">Your Profile</h1>
            <p className="text-muted-foreground mt-2">View and edit your personal information.</p>
        </div>
        <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "default" : "outline"}>
            {isEditing ? 'Cancel' : <><Edit className="mr-2 h-4 w-4" /> Edit Profile</>}
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-1 shadow-lg h-fit">
          <CardHeader className="items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
              <AvatarFallback className="text-3xl">{currentUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">{currentUser.name}</CardTitle>
            <CardDescription>{currentUser.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
             <div className="flex items-center">
                <User className="h-4 w-4 mr-3 text-muted-foreground" />
                <span>User Type: <span className="font-semibold">{currentUser.type}</span></span>
             </div>
             <div className="flex items-center">
                <Wallet className="h-4 w-4 mr-3 text-muted-foreground" />
                <span>Wallet: <span className="font-semibold text-green-600">${currentUser.walletBalance.toFixed(2)}</span></span>
             </div>
             <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-3 text-muted-foreground" />
                <span>Joined: <span className="font-semibold">{format(new Date(currentUser.createdAt), 'MMMM d, yyyy')}</span></span>
             </div>
          </CardContent>
        </Card>

        <div className={`md:col-span-2 ${!isEditing ? 'hidden' : 'block'}`}>
          <Card className={`shadow-lg`}>
              <CardHeader>
                  <CardTitle>Edit Information</CardTitle>
                  <CardDescription>Make changes to your profile here. Click save when you're done.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                  <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="userType">User Type</Label>
                      <Select value={formData.type} onValueChange={handleSelectChange}>
                          <SelectTrigger id="userType">
                              <SelectValue placeholder="Select user type" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="Sender">Sender</SelectItem>
                              <SelectItem value="Traveler">Traveler</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="avatar">Profile Picture</Label>
                      <div className="mt-1 flex items-center gap-4">
                          <Avatar className="h-16 w-16">
                             <AvatarImage src={avatarPreview || ''} alt="Avatar preview" />
                             <AvatarFallback><User className="h-8 w-8"/></AvatarFallback>
                          </Avatar>
                          <div className="flex-1 text-sm text-muted-foreground border-2 border-dashed rounded-md p-4 text-center">
                              <label htmlFor="avatar" className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80">
                                  <UploadCloud className="mx-auto h-8 w-8"/>
                                  <span>Upload a new photo</span>
                                  <input id="avatar" name="avatar" type="file" className="sr-only" accept="image/*" onChange={handleAvatarUpload} />
                              </label>
                              <p className="text-xs">PNG, JPG, GIF up to 1MB</p>
                          </div>
                      </div>
                  </div>

                  <Button onClick={handleSave} className="w-full">
                      <Save className="mr-2 h-4 w-4" /> Save Changes
                  </Button>
              </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
