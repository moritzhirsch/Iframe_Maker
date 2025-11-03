// app/bijloke/page.tsx
import type { Metadata } from "next";
import Image from "next/image";

export const revalidate = 0;

// Keep this popup out of search engines
export const metadata: Metadata = {
  title: "STAM — Entrance hall (Popup)",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function Page() {
  return (
    <main
      aria-label="STAM — Entrance hall"
      className="w-full min-h-dvh bg-[#1a0a52] text-[#fff]"
    >
      {/* padded content area -> gives breathing room around the 'full-width' image */}
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 md:px-10 py-6 md:py-10 space-y-8">
        {/* 1) Hero image: full width inside the content area (not edge-to-edge modal) */}
        <div className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl shadow-2xl">
          <Image
            src="/Bijloke/11_MuziekcentrumDB_Artiesteningang.jpg"
            alt="STAM entrance hall with city map installation"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 900px"
            className="object-cover"
            priority
          />
        </div>

        {/* 2) Location text */}
        <section aria-labelledby="loc-title" className="max-w-prose">
          <h1 id="loc-title" className="sr-only">STAM — Entrance hall</h1>
          <p className="text-[16px] md:text-[17px] leading-[1.65] font-medium">
            Het STAM is het Gentse stadsmuseum dat de geschiedenis van Gent
            brengt en je (nog) warm(er) maakt voor deze hedendaagse stad met
            een eeuwenoude geschiedenis.
          </p>
        </section>

        {/* 3) Historical header */}
        <h2 aria-labelledby="historical"
          className="text-[18px] md:text-[20px] font-semibold tracking-[0.2px]">
          Historische info: Museumtuin
        </h2>

        {/* 4–5) Historical block: mobile stacked, desktop split */}
        <section
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start"
        >
          {/* Historical image */}
          <div className="order-1 md:order-none">
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src="/Bijloke/POI_Museumtuin.jpg"
                alt="De Museumtuin met zicht op de kloostergevel"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Historical text */}
          <div className="order-2 md:order-none self-center">
            <p id="historical" className="text-[16px] md:text-[17px] leading-[1.7] font-medium max-w-prose">
              In de museumtuin, tussen het STAM en de Kunstenbibliotheek, kan je
              kruiden plukken en kleine groenten oogsten. De plukbakken verwijzen
              naar de moestuin van de cisterciënzerzusters. Wist je dat de zusters
              tot 2001 hier hun eigen groenten teelden?
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
