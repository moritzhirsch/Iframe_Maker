import { createReader } from '@keystatic/core/reader';
import Link from 'next/link';
import keystaticConfig from '../../../keystatic.config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const reader = createReader(process.cwd(), keystaticConfig);

type Row = {
  slug: string;
  titleNl: string;
  titleEn: string;
  hasHero: boolean;
  hasOverview: boolean;
  hasHistTitle: boolean;
  hasHistImage: boolean;
};

export default async function AdminLocations() {
  const slugs = await reader.collections.locations.list();
  const rows: Row[] = await Promise.all(
    slugs.map(async (slug) => {
      const entry = await reader.collections.locations.read(slug);
      return {
        slug,
        titleNl: entry?.title?.nl ?? '',
        titleEn: entry?.title?.en ?? '',
        hasHero: !!entry?.heroImage,
        hasOverview: !!(entry?.overviewText?.nl || entry?.overviewText?.en),
        hasHistTitle: !!(entry?.historicalTitle?.nl || entry?.historicalTitle?.en),
        hasHistImage: !!entry?.historicalImage,
      };
    })
  );

  return (
    <main className="w-full min-h-dvh bg-white text-black p-6 md:p-10">
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="text-2xl font-semibold mb-4">Bijloke Locations</h1>

        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-3 py-2">Slug</th>
                <th className="px-3 py-2">Title (NL)</th>
                <th className="px-3 py-2">Title (EN)</th>
                <th className="px-3 py-2">Hero</th>
                <th className="px-3 py-2">Overview</th>
                <th className="px-3 py-2">Hist. Title</th>
                <th className="px-3 py-2">Hist. Image</th>
                <th className="px-3 py-2">View</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.slug} className="border-t">
                  <td className="px-3 py-2 font-mono">{r.slug}</td>
                  <td className="px-3 py-2">{r.titleNl}</td>
                  <td className="px-3 py-2">{r.titleEn}</td>
                  <td className="px-3 py-2">{r.hasHero ? '✓' : ''}</td>
                  <td className="px-3 py-2">{r.hasOverview ? '✓' : ''}</td>
                  <td className="px-3 py-2">{r.hasHistTitle ? '✓' : ''}</td>
                  <td className="px-3 py-2">{r.hasHistImage ? '✓' : ''}</td>
                  <td className="px-3 py-2 space-x-2">
                    <Link className="text-blue-600 underline" href={`/bijloke/${encodeURIComponent(r.slug)}?lang=nl`}>
                      NL
                    </Link>
                    <Link className="text-blue-600 underline" href={`/bijloke/${encodeURIComponent(r.slug)}?lang=en`}>
                      EN
                    </Link>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className="px-3 py-6 text-gray-500" colSpan={8}>
                    No entries
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

