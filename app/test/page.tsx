// app/test/page.tsx
import Image from "next/image";
export const revalidate = 0;

export default function Page() {
  return (
    <main
      role="dialog"
      aria-modal="true"
      aria-label="Muziekcentrum De Bijloke"
      className="mx-auto max-w-[880px] rounded-2xl shadow-2xl bg-[#1a0a52] text-[#eae7f2] p-8 md:p-10 my-6"
    >
      {/* top: image + copy */}
      <div className="grid grid-cols-[300px_1fr] gap-6 items-start">
        <img
          src="Bijloke\11_MuziekcentrumDB_Artiesteningang.jpg"
          alt="Muziekcentrum De Bijloke exterior"
          className="w-full max-w-[300px] h-[30vh] rounded-2xl shadow-2xl object-cover"
        />

        <div>
          <h1 className="text-[20px] md:text-[22px] font-bold tracking-[0.2px] mb-4">
            Muziekcentrum De Bijloke
          </h1>

          <p className="max-w-[560px] text-[16px] leading-[1.65] opacity-95 mb-6">
            presents classical, jazz, contemporary music and festivals in the oldest concert hall in the world!
          </p>

          <div className="mb-10">
            <a
              href="https://www.debijloke.be"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full px-4 py-2 font-semibold border border-white/40 bg-white/20 text-[#eef] backdrop-blur-sm transition
                         hover:-translate-y-[1px] hover:bg-white/30 hover:border-white/60"
            >
              Website Muziekcentrum De Bijloke
            </a>
          </div>
        </div>
      </div>

      <section aria-labelledby="historical">
        <h2 id="historical" className="text-[17px] font-semibold mt-2 mb-4">
          Historical Info: The Squat House ‘Kraakhuis’:
        </h2>
        <p className="max-w-[560px] text-[16px] leading-[1.65]">
          The Squat House was rebuilt at the beginning of the 16th century as a small infirmary of the Bijloke Hospital.
          Today it is an intimate concert hall.
        </p>
      </section>
    </main>
  );
}
