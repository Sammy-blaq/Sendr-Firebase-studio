"use client";

import Link from 'next/link';
import { PackageOpen, Search, Send, Wallet, UserCircle, LogIn, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser } from '@/contexts/UserContext';
import { mockUsers } from '@/lib/mockData';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from 'react';

const navLinks = [
  { href: '/send', label: 'Send Package', icon: Send },
  { href: '/packages', label: 'Browse Packages', icon: PackageOpen },
  { href: '/search', label: 'Track Package', icon: Search },
  { href: '/wallet', label: 'Wallet', icon: Wallet },
];

export default function Header() {
  const { currentUser, login, logout, isLoading } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogin = () => {
    // Mock login: cycle through mock users or pick one
    // For simplicity, let's log in as user1 if no one is logged in, or user2 if user1 is logged in.
    if (!currentUser || currentUser.id === mockUsers[1]?.id) {
      login(mockUsers[0]?.id || 'user1');
    } else {
      login(mockUsers[1]?.id || 'user2');
    }
  };

  const UserMenu = () => {
    if (isLoading) {
      return <div className="w-8 h-8 bg-muted rounded-full animate-pulse"></div>;
    }
    if (!currentUser) {
      return (
        <Button variant="outline" onClick={handleLogin}>
          <LogIn className="mr-2 h-4 w-4" /> Login
        </Button>
      );
    }
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
              <AvatarFallback>{currentUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{currentUser.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {currentUser.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <UserCircle className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };
  
  const NavLinksContent = ({isMobile = false} : {isMobile?: boolean}) => (
     <>
      {navLinks.map((link) => (
        <Button key={link.label} asChild variant={isMobile ? "ghost" : "link"} className={isMobile ? "justify-start w-full text-lg py-3" : "text-foreground hover:text-primary transition-colors"}>
          <Link href={link.href} onClick={() => isMobile && setMobileMenuOpen(false)}>
            <link.icon className="mr-2 h-5 w-5" />
            {link.label}
          </Link>
        </Button>
      ))}
     </>
  );


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <PackageOpen className="h-8 w-8 text-primary" />
          <span className="font-headline text-2xl font-bold text-primary">SwiftSend</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
         <NavLinksContent />
        </nav>

        <div className="flex items-center space-x-4">
          <UserMenu />
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] p-6">
                 <Link href="/" className="flex items-center space-x-2 mb-6" onClick={() => setMobileMenuOpen(false)}>
                    <PackageOpen className="h-8 w-8 text-primary" />
                    <span className="font-headline text-2xl font-bold text-primary">SwiftSend</span>
                  </Link>
                <nav className="flex flex-col space-y-3">
                  <NavLinksContent isMobile={true} />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
