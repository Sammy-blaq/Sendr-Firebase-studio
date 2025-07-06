
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="text-center">
        <h1 className="font-headline text-4xl font-bold text-primary">Privacy Policy</h1>
        <p className="text-muted-foreground mt-2">Last updated: July 24, 2024</p>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Your Privacy is Important</CardTitle>
          <CardDescription>
            This Privacy Policy describes how your personal information is collected, used, and shared when you use Sendr.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <h3 className="font-semibold text-lg pt-4">Personal Information We Collect</h3>
          <p>
            When you register for an account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number. We use this information to provide our services and to communicate with you.
          </p>
           <h3 className="font-semibold text-lg pt-4">How We Use Your Personal Information</h3>
           <p>
            We use the information we collect in various ways, including to:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li>Provide, operate, and maintain our website</li>
            <li>Improve, personalize, and expand our website</li>
            <li>Understand and analyze how you use our website</li>
            <li>Develop new products, services, features, and functionality</li>
            <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
            <li>Send you emails</li>
            <li>Find and prevent fraud</li>
          </ul>
          <p className="pt-6 text-muted-foreground">
            This is a placeholder document. Please replace this with your full Privacy Policy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
