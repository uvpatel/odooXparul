import AnimatedModalDemo from "@/components/animated-modal-demo";
import TravelopHero from "@/components/background-ripple-effect-demo";
import DraggableCardDemo from "@/components/draggable-card-demo-2";
import FeaturesSectionDemo from "@/components/features-section-demo-3";
import TabsDemo from "@/components/tabs-demo";
import TeamShowcase from "@/components/team-section";

export default function Home() {
  return (

    <>
      <TravelopHero />
      <TeamShowcase />
      <TabsDemo />
      <FeaturesSectionDemo />
      <DraggableCardDemo />
      <AnimatedModalDemo />
    </>
  );
}