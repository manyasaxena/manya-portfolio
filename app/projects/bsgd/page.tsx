import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BSGDProjectPage() {
  return (
    <main className="min-h-screen bg-[#fafafa] px-6 py-24 sm:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <Link 
          href="/#projects" 
          className="group mb-10 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-purple-600"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Projects</span>
        </Link>

        <h1 className="font-serif text-5xl text-neutral-800 md:text-7xl">BSGD Club Branding</h1>
        <p className="mt-4 text-xl text-neutral-500">Case study coming soon.</p>
      </div>
    </main>
  );
}