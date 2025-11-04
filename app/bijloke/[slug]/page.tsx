// app/bijloke/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createReader } from "@keystatic/core/reader";
import Markdoc from "@markdoc/markdoc";
import React from "react";
import Image from "next/image";
import keystaticConfig from "../../../keystatic.config";

const reader = createReader(process.cwd(), keystaticConfig);
export const revalidate = 0;
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const metadata: Metadata = {
  title: "Bijloke Popup",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default async function Location({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Next.js in your version exposes params as a Promise
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const rawLang = sp?.lang;
  const requestedLang = Array.isArray(rawLang) ? rawLang[0] : rawLang;
  const lang: 'nl' | 'en' = requestedLang === 'en' ? 'en' : 'nl';
  const fallbackLang: 'nl' | 'en' = lang === 'nl' ? 'en' : 'nl';

  // Helpful debugging in production: list available slugs
  const availableSlugs = await reader.collections.locations.list();
  console.log('[bijloke] requested slug:', slug, 'available:', availableSlugs);
  const location = await reader.collections.locations.read(slug);
  if (!location) {
    console.error('[bijloke] not found for slug:', slug);
    notFound();
  }

  // --- Title & alt text (respect ?lang, fallback to other, then slug)
  const titlePreferred = lang === 'nl' ? location.title?.nl : location.title?.en;
  const titleAlt = fallbackLang === 'nl' ? location.title?.nl : location.title?.en;
  const title = titlePreferred || titleAlt || slug;
  const heroSrc = location.heroImage; // string path from Keystatic (e.g. "/uploads/bijloke/..." )

  // --- Overview (fields.markdoc → async fn returning { node })
  const getOverviewNode = async () => {
    try {
      const primary = lang === 'nl' ? location.overviewText?.nl : location.overviewText?.en;
      if (primary) return (await primary()).node;
    } catch {}
    try {
      const secondary = fallbackLang === 'nl' ? location.overviewText?.nl : location.overviewText?.en;
      if (secondary) return (await secondary()).node;
    } catch {}
    return null;
  };
  const overviewNode = await getOverviewNode();
  let overviewContent: React.ReactNode = null;
  if (overviewNode) {
    const errors = Markdoc.validate(overviewNode);
    if (errors.length) {
      console.error(errors);
    } else {
      const transformed = Markdoc.transform(overviewNode);
      overviewContent = Markdoc.renderers.react(transformed, React);
    }
  }

  // --- Historical (all optional)
  const historicalTitlePreferred =
    (lang === 'nl' ? location.historicalTitle?.nl : location.historicalTitle?.en) || null;
  const historicalTitleAlt =
    (fallbackLang === 'nl' ? location.historicalTitle?.nl : location.historicalTitle?.en) || null;
  const historicalTitle = historicalTitlePreferred || historicalTitleAlt;
  const historicalImg = (location.historicalImage
    ? location.historicalImage.replace('/images/bijloke/historical', '/images/bijloke')
    : null);

  const getHistoricalNode = async () => {
    try {
      const primary = lang === 'nl' ? location.historicalText?.nl : location.historicalText?.en;
      if (primary) return (await primary()).node;
    } catch {}
    try {
      const secondary = fallbackLang === 'nl' ? location.historicalText?.nl : location.historicalText?.en;
      if (secondary) return (await secondary()).node;
    } catch {}
    return null;
  };
  const historicalNode = await getHistoricalNode();
  let historicalContent: React.ReactNode = null;
  if (historicalNode) {
    const errors = Markdoc.validate(historicalNode);
    if (errors.length) {
      console.error(errors);
      // skip rendering historical content on validation errors
    } else {
      const transformed = Markdoc.transform(historicalNode);
      historicalContent = Markdoc.renderers.react(transformed, React);
    }
  }

  const showHistorical = !!(historicalTitle && historicalTitle.trim().length > 0);

  return (
    <main aria-label={title} className="w-full min-h-dvh bg-[#1a0a52] text-white p-6 md:p-10">
      {/* padded content area -> gives breathing room around the 'full-width' image */}
      <div className="mx-auto w-full max-w-5xl space-y-6 md:space-y-8">
        {/* 1) Hero image: full width inside the content area (not edge-to-edge modal) */}
        <div className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl shadow-2xl">
          {heroSrc ? (
            <Image
              src={heroSrc}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 900px"
              className="object-cover"
              priority
            />
          ) : null}
        </div>

        {/* 2) Description */}
        <section aria-labelledby="loc-title" className="max-w-[65ch] [&_p]:font-medium">
          <h1 id="loc-title" className="sr-only">
            {title}
          </h1>
          {overviewContent}
        </section>

        {/* 3) Historical Title */}
        {showHistorical && (
          <h2 id="historical" className="text-lg md:text-xl font-semibold mt-8">
            {historicalTitle}
          </h2>
        )}

        {/* 4) Historical Content */}
        {showHistorical && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
            {historicalImg && (
              <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src={historicalImg}
                  alt={title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            )}
            {historicalContent && (
              <div className="max-w-[65ch] [&_p]:font-medium">
                {historicalContent}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
