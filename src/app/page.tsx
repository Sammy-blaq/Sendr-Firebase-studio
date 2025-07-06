
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Truck, Users, ShieldCheck, Zap, Send, Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container px-4 md:px-6 text-center">
          <div className="space-y-6">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-primary">
              Sendr: Your Package, Your Price, Your Way.
            </h1>
            <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl">
              Connect with travelers heading your way. Send packages reliably and affordably.
              Or, become a traveler and earn on your journeys!
            </p>
            <div className="space-x-4">
              <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Link href="/send">
                  Send a Package <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Link href="/packages">
                  Browse Packages <Truck className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">How It Works</div>
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">Simple Steps to Send or Earn</h2>
            <p className="max-w-[900px] text-foreground/70 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Sendr makes package delivery intuitive and community-driven.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
            <div className="grid gap-1 p-4 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-primary text-primary-foreground rounded-full p-2">
                  <Send className="h-6 w-6" />
                </div>
                <h3 className="font-headline text-xl font-bold">1. Post Your Package</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Describe your item, set your desired price, and specify the destination. Our AI can even help suggest a fair price!
              </p>
            </div>
            <div className="grid gap-1 p-4 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-primary text-primary-foreground rounded-full p-2">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="font-headline text-xl font-bold">2. Connect with Travelers</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Travelers view your request. They can accept your price or negotiate. You stay in control.
              </p>
            </div>
            <div className="grid gap-1 p-4 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-primary text-primary-foreground rounded-full p-2">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="font-headline text-xl font-bold">3. Secure & Track</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Once agreed, payment is held securely. Track your package until it reaches its destination.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-primary text-primary-foreground px-3 py-1 text-sm">Features</div>
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Why Choose Sendr?</h2>
            <ul className="grid gap-4">
              <li className="flex items-start gap-3">
                <Zap className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold">Smart Pricing</h4>
                  <p className="text-sm text-muted-foreground">AI-powered suggestions to help you set competitive prices.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Truck className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold">Flexible Delivery</h4>
                  <p className="text-sm text-muted-foreground">Find travelers already heading to your package's destination.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Wallet className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold">Integrated Wallet</h4>
                  <p className="text-sm text-muted-foreground">Easily manage payments, add funds, and withdraw earnings.</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="flex items-center justify-center">
            <Image
              src="https://placehold.co/600x400.png"
              alt="Sendr in action"
              width={600}
              height={400}
              className="rounded-xl shadow-2xl"
              data-ai-hint="delivery network"
            />
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 text-center">
          <Card className="max-w-2xl mx-auto shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline text-3xl">Ready to Get Started?</CardTitle>
              <CardDescription>
                Join the Sendr community today and experience a new way to send and earn.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="flex-1">
                  <Link href="/send">
                    Send Your First Package
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg" className="flex-1">
                  <Link href="/packages">
                    Become a Sendr Traveler
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
