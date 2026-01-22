import { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export type SystemType = 
  | "EHS" 
  | "eQMS" 
  | "ESG" 
  | "GRC" 
  | "BCM" 
  | "OHSM" 
  | "EMS-ENV" 
  | "EMS-ENERGY" 
  | "Advanced AI" 
  | "Cross Modules & Platform Services";

interface SystemTabsProps {
  activeSystem: SystemType;
  onSystemChange: (system: SystemType) => void;
}

const systems: SystemType[] = [
  "EHS",
  "eQMS",
  "ESG",
  "GRC",
  "BCM",
  "OHSM",
  "EMS-ENV",
  "EMS-ENERGY",
  "Advanced AI",
  "Cross Modules & Platform Services",
];

const systemDescriptions: Record<SystemType, string> = {
  "EHS": "Comprehensive tools to manage environmental, health, and safety operations.",
  "eQMS": "Digitized, audit-ready quality management powered by intelligent workflows.",
  "ESG": "Enterprise sustainability, carbon accounting, and regulatory disclosure management.",
  "GRC": "Governance, risk, and compliance management with automated controls.",
  "BCM": "Business continuity management for organizational resilience.",
  "OHSM": "Occupational health and safety management system for workforce protection.",
  "EMS-ENV": "Environmental management system for monitoring and compliance.",
  "EMS-ENERGY": "Energy management system for efficiency and sustainability.",
  "Advanced AI": "AI-powered analytics, automation, and intelligent insights.",
  "Cross Modules & Platform Services": "Core platform capabilities and cross-functional services.",
};

const SystemTabs = ({ activeSystem, onSystemChange }: SystemTabsProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (ref) ref.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="py-6 px-6">
      <div className="container mx-auto">
        {/* Tabs with scroll */}
        <div className="relative">
          {canScrollLeft && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 shadow-md hover:bg-white"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          
          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide py-2 px-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {systems.map((system) => (
              <button
                key={system}
                onClick={() => onSystemChange(system)}
                className={`
                  whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium 
                  transition-all duration-300 border
                  ${
                    activeSystem === system
                      ? "bg-primary text-primary-foreground border-primary shadow-lg"
                      : "bg-white/70 text-muted-foreground border-white/50 hover:bg-white hover:text-foreground"
                  }
                `}
                style={
                  activeSystem === system
                    ? { boxShadow: "0 4px 20px hsl(158 64% 40% / 0.3)" }
                    : {}
                }
              >
                {system}
              </button>
            ))}
          </div>
          
          {canScrollRight && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 shadow-md hover:bg-white"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Dynamic Description */}
        <div className="mt-4 text-center">
          <p 
            key={activeSystem}
            className="text-muted-foreground text-sm animate-fade-in"
          >
            {systemDescriptions[activeSystem]}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SystemTabs;
