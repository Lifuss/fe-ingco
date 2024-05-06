import AboutBrand from './ui/home/AboutBrand';
import AboutUs from './ui/home/AboutUs';
import Features from './ui/home/Features';
import Hero from './ui/home/Hero';

export default function Page() {
  return (
    <>
      <main>
        <Hero />
        <Features />
        <AboutBrand />
        <AboutUs />
      </main>
    </>
  );
}
