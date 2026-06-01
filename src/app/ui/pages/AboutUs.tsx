import React from 'react';
import Hero from '../about-us/Hero';
import Features from '../about-us/Features';
import PartnerGuide from '../about-us/PartnerGuide';
import AboutBrand from '../about-us/AboutBrand';
import AboutUs from '../about-us/AboutUs';
import Footer from '../Footer';
import Header from '../home/Header';

const AboutUsPage = ({ isMainPage = true }: { isMainPage: boolean }) => {
  return isMainPage ? (
    <>
      <Header />
      <Hero />
      <Features />
      <PartnerGuide />
      <AboutBrand />
      <AboutUs />
      <Footer />
    </>
  ) : (
    <>
      <Hero />
      <Features />
      <PartnerGuide />
      <AboutBrand />
      <AboutUs />
    </>
  );
};

export default AboutUsPage;
