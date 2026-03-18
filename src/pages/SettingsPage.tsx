import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Rocket, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border glass-strong sticky top-0 z-50">
        <div className="container max-w-3xl mx-auto px-4 h-16 flex items-center gap-3">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <Rocket className="w-5 h-5 text-primary" />
          <span className="font-bold text-foreground">Settings</span>
        </div>
      </header>

      <main className="container max-w-3xl mx-auto px-4 py-8 space-y-8">
        <div className="glass rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Site Settings</h2>
          <div className="space-y-2">
            <Label>Site Name</Label>
            <Input placeholder="My DeFi Project" />
          </div>
          <div className="space-y-2">
            <Label>Subdomain</Label>
            <div className="flex items-center gap-2">
              <Input placeholder="myproject" />
              <span className="text-sm text-muted-foreground whitespace-nowrap">.launchpad3.io</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Custom Domain</Label>
            <Input placeholder="www.yourproject.com" />
          </div>
        </div>

        <div className="glass rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Subscription</h2>
          <p className="text-sm text-muted-foreground">You are on the <span className="text-primary font-medium">Free Trial</span> — 12 days remaining.</p>
          <Button variant="gradient">Upgrade Plan</Button>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
