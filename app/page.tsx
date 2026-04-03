import VideoScrollCanvas from "./components/VideoScrollCanvas";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <VideoScrollCanvas />
      <section className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-900">
        <div className="max-w-4xl mx-auto px-8 py-32 text-center">
          <h2 className="text-4xl font-bold mb-6 text-black dark:text-white">
            Your Content Here
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Add your content below the scroll-driven video hero section.
          </p>
        </div>
      </section>
    </div>
  );
}
