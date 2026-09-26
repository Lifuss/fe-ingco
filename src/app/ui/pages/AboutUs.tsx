import React from 'react';
import Hero from '../about-us/Hero';
import Features from '../about-us/Features';
import AboutBrand from '../about-us/AboutBrand';
import AboutUs from '../about-us/AboutUs';
import B2BCallout from '../about-us/B2BCallout';

const AboutUsPage = () => {
  return (
    <div className="font-sans">
      <Hero />
      <Features />
      <AboutBrand />
      <AboutUs />
      <B2BCallout />
    </div>
  );
};

export default AboutUsPage;
