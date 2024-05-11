import AboutBrand from './ui/home/AboutBrand';
import AboutUs from './ui/home/AboutUs';
import Features from './ui/home/Features';
import Hero from './ui/home/Hero';

export default function Page() {
  //TODO: refactor svg blocks to components
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
