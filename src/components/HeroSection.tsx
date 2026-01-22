import { 
  BarChart3, 
  Shield, 
  Users, 
  Layers, 
  CheckCircle2,
  ArrowRight 
} from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative py-12 px-6 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-primary/10 rounded-full blur-2xl" />
      </div>
      
      <div className="container mx-auto">
        <div className="glass-hero p-8 md:p-10 shadow-xl">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Left: Text Content */}
            <div className="space-y-6">
            <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                  Welcome to{" "}
                  <span className="text-primary" style={{ fontFamily: "'Orbitron', sans-serif" }}>Soapbox</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  Engineering the Operating System for Regulated Industries.
                </p>
              </div>
              
              {/* Feature pills */}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Enterprise-grade
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full">
                  <Shield className="h-3.5 w-3.5" />
                  AI-ready
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full">
                  <Users className="h-3.5 w-3.5" />
                  Compliance-focused
                </span>
              </div>
            </div>
            
            {/* Right: Abstract Dashboard Illustration */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Main dashboard mockup */}
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-5 border border-white/50">
                  {/* Mini header */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    <div className="flex-1 h-3 bg-muted rounded ml-3" />
                  </div>
                  
                  {/* Dashboard grid */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-primary/10 rounded-lg p-3 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      <div className="h-2 w-12 bg-primary/30 rounded" />
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-500" />
                      <div className="h-2 w-10 bg-blue-200 rounded" />
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 flex items-center gap-2">
                      <Layers className="h-5 w-5 text-purple-500" />
                      <div className="h-2 w-8 bg-purple-200 rounded" />
                    </div>
                  </div>
                  
                  {/* Chart area placeholder */}
                  <div className="bg-muted/50 rounded-lg p-4 flex items-end gap-1.5 h-24">
                    <div className="flex-1 bg-primary/40 rounded-t h-8" />
                    <div className="flex-1 bg-primary/60 rounded-t h-12" />
                    <div className="flex-1 bg-primary/50 rounded-t h-10" />
                    <div className="flex-1 bg-primary/70 rounded-t h-16" />
                    <div className="flex-1 bg-primary rounded-t h-20" />
                    <div className="flex-1 bg-primary/80 rounded-t h-14" />
                    <div className="flex-1 bg-primary/60 rounded-t h-11" />
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-3 -right-3 bg-white shadow-lg rounded-lg p-3 border animate-float">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <div className="text-xs font-medium">Compliance</div>
                      <div className="text-xs text-green-600">98.5%</div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -bottom-2 -left-3 bg-white shadow-lg rounded-lg p-2.5 border animate-float animation-delay-200">
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-primary" />
                    <span className="text-xs font-medium">12 modules active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
