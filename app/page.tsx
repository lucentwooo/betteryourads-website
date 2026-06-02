import { Nav } from '@/components/Nav/Nav';
import { Hero } from '@/components/Hero/Hero';
import { PilotProof } from '@/components/PilotProof/PilotProof';
import { Showcase } from '@/components/Showcase/Showcase';
import { Manifesto } from '@/components/Manifesto/Manifesto';
import { Problem } from '@/components/Problem/Problem';
import { HowItWorks } from '@/components/HowItWorks/HowItWorks';
import { Compare } from '@/components/Compare/Compare';
import { Faq } from '@/components/Faq/Faq';
import { FinalCta } from '@/components/FinalCta/FinalCta';
import { Footer } from '@/components/Footer/Footer';

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <PilotProof />
      <Showcase />
      <Manifesto />
      <Problem />
      <HowItWorks />
      <Compare />
      <Faq />
      <FinalCta />
      <Footer />
    </>
  );
}
