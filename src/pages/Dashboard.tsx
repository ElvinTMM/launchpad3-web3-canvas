import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ExternalLink, Settings, Rocket, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface Site {
  id: string;
  name: string;
  subdomain: string;
  published: boolean;
  updatedAt: string;
}

const mockSites: Site[] = [
  { id: "1", name: "DeFi Protocol Launch", subdomain: "defiprotocol", published: true, updatedAt: "2 hours ago" },
  { id: "2", name: "NFT Collection", subdomain: "nftdrop", published: false, updatedAt: "1 day ago" },
];

const Dashboard = () => {
  const [sites] = useState<Site[]>(mockSites);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border glass-strong sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-primary" />
            <span className="font-bold text-foreground">LaunchPad3</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/settings">
              <Button variant="ghost" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Your Sites</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your Web3 landing pages</p>
          </div>
          <Link to="/editor/new">
            <Button variant="gradient">
              <Plus className="w-4 h-4" />
              New Site
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sites.map((site, i) => (
            <motion.div
              key={site.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-lg overflow-hidden hover:border-primary/30 transition-all duration-150 group"
            >
              <div className="h-36 dot-grid flex items-center justify-center bg-secondary/30">
                <Rocket className="w-8 h-8 text-muted-foreground/30" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-foreground truncate">{site.name}</h3>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      site.published
                        ? "bg-success/10 text-success"
                        : "bg-warning/10 text-warning"
                    }`}
                  >
                    {site.published ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  {site.subdomain}.launchpad3.io · Updated {site.updatedAt}
                </p>
                <div className="flex gap-2">
                  <Link to={`/editor/${site.id}`} className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full">
                      Edit
                    </Button>
                  </Link>
                  {site.published && (
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {/* New site card */}
          <Link to="/editor/new">
            <div className="glass rounded-lg h-full min-h-[240px] flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/30 transition-all duration-150 border-dashed">
              <div className="p-3 rounded-full bg-secondary">
                <Plus className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Create new site</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
