import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="text-center max-w-md">
        <p className="text-sm font-medium text-[#666666] uppercase tracking-widest mb-4">Error</p>
        <h1 className="text-6xl font-semibold text-white mb-2 tracking-tight">404</h1>
        <p className="text-[#888888] mb-8">This page doesn&apos;t exist or was moved.</p>
        <Link to="/">
          <Button variant="gradient" className="rounded-lg font-semibold px-8">
            Back to home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
