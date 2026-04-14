import VideoScrollCanvas from "./components/VideoScrollCanvas";
import Navbar from "./components/Navbar";
import WaveDivider from "./components/WaveDivider";
import BrandStatement from "./components/BrandStatement";
import About from "./components/About";
import StatsBar from "./components/StatsBar";
import ServicesGrid from "./components/ServicesGrid";
import TrustProcess from "./components/TrustProcess";
import GlobalReach from "./components/GlobalReach";
import WhyTrident from "./components/WhyTrident";
import Certifications from "./components/Certifications";
import Testimonials from "./components/Testimonials";
import CTAStrip from "./components/CTAStrip";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import KeyPoints from "./components/KeyPoints";
import Benefits from "./components/Benefits";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <VideoScrollCanvas />
      {/* <WaveDivider /> */}
      <BrandStatement />
      <KeyPoints />
      <About />
      <Benefits />
      {/* <StatsBar /> */}
      <ServicesGrid />
      <TrustProcess />
      <GlobalReach />
      <WhyTrident />
      <Certifications />
      <Testimonials />
      <CTAStrip />
      <Contact />
      <Footer />
    </div>
  );
}
