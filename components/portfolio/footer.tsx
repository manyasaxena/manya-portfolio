import { Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-24 w-full border-t border-neutral-200/60 bg-[#fafafa] py-12 md:mt-32 md:py-16">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-8 px-6 md:flex-row md:items-end">
        
        {/* Left Side: Brand, Personality, and Copyright */}
        <div className="flex flex-col items-center gap-3 text-center md:items-start md:text-left">
          <h2 className="font-serif text-2xl text-neutral-800">Manya Saxena</h2>
          <div className="space-y-1 text-sm text-neutral-500">
            <p>Designed & built with 💜 (and many iced mochas)</p>
            {/* Using new Date().getFullYear() keeps the year automatically updated! */}
            <p>© {new Date().getFullYear()} Manya Saxena. All rights reserved.</p>
          </div>
        </div>

        {/* Right Side: Contact & Socials */}
        <div className="flex flex-col items-center gap-4 md:items-end">
          <a 
            // DON'T FORGET: Swap this placeholder out for your real email!
            href="mailto:your.email@example.com" 
            className="group relative font-medium text-neutral-600 transition-colors hover:text-purple-700"
          >
            Say hello ↗
            {/* Animated underline effect */}
            <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-purple-500 transition-all duration-300 group-hover:w-full" />
          </a>

          <div className="flex items-center gap-5">
            <a 
              // DON'T FORGET: Swap this placeholder out for your real email!
              href="mailto:manyasaxena@gmail.com" 
              className="text-neutral-400 transition-colors duration-300 hover:-translate-y-1 hover:text-purple-600"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
            <a 
              href="https://www.linkedin.com/in/manya-saxena/" 
              target="_blank" 
              rel="noreferrer" 
              className="text-neutral-400 transition-colors duration-300 hover:-translate-y-1 hover:text-purple-600"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}