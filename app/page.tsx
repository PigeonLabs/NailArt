import AetherHero from '@/components/main/hero';
import Navbar from '@/components/main/navbar';

export default function Home() {
  return (
    <main>
      <Navbar />
      <AetherHero
        title="Create YouTube Thumbnails Faster with NailArt AI"
        subtitle="Enter your channel style and video title. NailArt AI generates high-CTR thumbnail concepts in seconds so you can pick, refine, and publish faster."
        ctaLabel="Start Generating"
        ctaHref="/"
        secondaryCtaLabel="View Examples"
        secondaryCtaHref="/"
        align="center"
        showPreview={false}
      />
    </main>
  );
}
