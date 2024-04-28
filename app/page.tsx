import AboutBrand from './ui/home/AboutBrand';
import AboutUs from './ui/home/AboutUs';
import Features from './ui/home/Features';
import HeaderFace from './ui/home/HeaderFace';
import Hero from './ui/home/Hero';

export default function Page() {
  return (
    <>
      <HeaderFace />
      <main>
        <Hero />
        <Features />
        <AboutBrand />
        <AboutUs />
      </main>
    </>
  );
}
