import Footer from '../ui/Footer';
import AboutBrand from '../ui/home/AboutBrand';
import AboutUs from '../ui/home/AboutUs';
import Features from '../ui/home/Features';
import Header from '../ui/home/Header';
import Hero from '../ui/home/Hero';

export default function Page() {
  //TODO: refactor svg blocks to components

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <AboutBrand />
        <AboutUs />
      </main>
      <Footer />
    </>
  );
}
