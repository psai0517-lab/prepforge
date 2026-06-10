import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ArchitectureSection } from "@/components/ArchitectureSection";
import { DashboardSection } from "@/components/DashboardSection";
import { PracticeSection } from "@/components/PracticeSection";
import { SystemDesignSection } from "@/components/SystemDesignSection";
import { DrillSection } from "@/components/DrillSection";
import { TechStackSection } from "@/components/TechStackSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <HeroSection />
        <ArchitectureSection />
        <DashboardSection />
        <PracticeSection />
        <SystemDesignSection />
        <DrillSection />
        <TechStackSection />
      </main>
      <Footer />
    </div>
  );
}
