import { Nav } from '@/components/Nav/Nav';
import { Hero } from '@/components/Hero/Hero';
import { WhySaas } from '@/components/WhySaas/WhySaas';
import { HowItWorks } from '@/components/HowItWorks/HowItWorks';
import { Loop } from '@/components/Loop/Loop';
import { RealOutput } from '@/components/RealOutput/RealOutput';
import { Faq } from '@/components/Faq/Faq';
import { FinalCta } from '@/components/FinalCta/FinalCta';
import { Footer } from '@/components/Footer/Footer';

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />        {/* 01 — hero + batch cascade */}
      <WhySaas />     {/* 02 — why nothing else works (the resolve) */}
      <HowItWorks />  {/* 03 — the engine */}
      <Loop />        {/* 04 — the self-optimization loop + waitlist */}
      <RealOutput />  {/* 05 — living wall + pilots */}
      <Faq />         {/* 06 — objections */}
      <FinalCta />    {/* 07 — get early access + sign-off */}
      <Footer />
    </>
  );
}
