import { Nav } from '@/components/Nav/Nav';
import { Hero } from '@/components/Hero/Hero';
import { PilotProof } from '@/components/PilotProof/PilotProof';
import { Showcase } from '@/components/Showcase/Showcase';
import { Manifesto } from '@/components/Manifesto/Manifesto';
import { WhySaas } from '@/components/WhySaas/WhySaas';
import { HowItWorks } from '@/components/HowItWorks/HowItWorks';
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
      <WhySaas />
      <HowItWorks />
      <Faq />
      <FinalCta />
      <Footer />
    </>
  );
}
