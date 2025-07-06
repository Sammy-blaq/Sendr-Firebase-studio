
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="text-center">
        <h1 className="font-headline text-4xl font-bold text-primary">Terms of Service</h1>
        <p className="text-muted-foreground mt-2">Last updated: July 24, 2024</p>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Welcome to Sendr</CardTitle>
          <CardDescription>
            These terms and conditions outline the rules and regulations for the use of Sendr's Website.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <p>
            By accessing this website we assume you accept these terms and conditions. Do not continue to use Sendr if you do not agree to take all of the terms and conditions stated on this page.
          </p>
          <h3 className="font-semibold text-lg pt-4">1. License</h3>
          <p>
            Unless otherwise stated, Sendr and/or its licensors own the intellectual property rights for all material on Sendr. All intellectual property rights are reserved. You may access this from Sendr for your own personal use subjected to restrictions set in these terms and conditions.
          </p>
           <h3 className="font-semibold text-lg pt-4">2. User Responsibilities</h3>
           <p>
            You are responsible for your own communications and are responsible for the consequences of their posting. You must not, and by using this Website you agree not to, do the following things: post material that is copyrighted, unless you are the copyright owner or have the permission of the copyright owner to post it; post material that reveals trade secrets, unless you own them or have the permission of the owner; post material that infringes on any other intellectual property rights of others or on the privacy or publicity rights of others.
           </p>
          <p className="pt-6 text-muted-foreground">
            This is a placeholder document. Please replace this with your full Terms of Service.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
