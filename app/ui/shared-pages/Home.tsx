import React from 'react';
import Hero from '../home/Hero';
import Features from '../home/Features';
import PartnerGuide from '../home/PartnerGuide';
import AboutBrand from '../home/AboutBrand';
import AboutUs from '../home/AboutUs';
import Footer from '../Footer';
import Header from '../home/Header';

const Home = () => {
  return (
    <>
      <Header />
      <Hero />
      <Features />
      <PartnerGuide />
      <AboutBrand />
      <AboutUs />
      <Footer />
    </>
  );
};

export default Home;
