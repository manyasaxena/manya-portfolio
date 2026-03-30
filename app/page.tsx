import { Header } from '@/components/portfolio/header';
import { ProjectsSection } from '@/components/portfolio/projects-section';
import AboutSection from '@/components/portfolio/about-section';
import { ThoughtsSection } from '@/components/portfolio/thoughts-section';
import ArtSection from '@/components/portfolio/art-section';
import { MoviesSection } from '@/components/portfolio/movies-section';
import Footer from '@/components/portfolio/footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <ProjectsSection />
      <AboutSection />
      <ThoughtsSection />
      <ArtSection />
      <MoviesSection />
      <Footer />
    </main>
  );
}