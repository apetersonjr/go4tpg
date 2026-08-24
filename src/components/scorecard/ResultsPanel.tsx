"use client";

import Image from "next/image";
import { commitCalendlyUrl } from "@/content/commit";
import { brochures } from "@/content/installations";
import {
  bookLabel,
  brochureLabel,
  resultsFailure,
  resultsFollowUp,
  resultsHeardEyebrow,
  resultsInstallEyebrow,
} from "@/content/scorecard";
import { findInstallation } from "@/data/installation-menu";
import { withBasePath } from "@/lib/basePath";
import type { ScorecardRecommendation } from "@/lib/scorecard";

/**
 * The brochure the results screen offers. Deliberately looked up from the same
 * content module `/installations` renders from rather than hard-coded, so the
 * two can never end up offering different PDFs.
 */
const brochure = brochures.find((entry) => entry.downloadAs) ?? brochures.at(-1);

const eyebrowClass = "text-[11px] font-bold tracking-[0.16em] uppercase";

type ResultsPanelProps = {
  summary: string;
  recommendations: ScorecardRecommendation[];
  /** True when the reading could not be produced. */
  failed: boolean;
};

/**
 * What we heard, what we would install, and two ways to act.
 *
 * No prices anywhere on this screen — per-unit pricing is quoted in writing,
 * and a number here would be the one place on the site that breaks that.
 */
export function ResultsPanel({ summary, recommendations, failed }: ResultsPanelProps) {
  return (
    <div className="flex flex-col gap-4 px-5 pt-5 pb-6">
      {failed ? (
        <p className="text-tpg-muted text-[13.5px] leading-relaxed">{resultsFailure}</p>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <span className={`text-tpg-accent ${eyebrowClass}`}>{resultsHeardEyebrow}</span>
            <p className="text-tpg-muted text-[13.5px] leading-relaxed">{summary}</p>
          </div>

          <div className="border-tpg-border flex flex-col gap-3 border-t pt-4">
            <span className={`text-tpg-muted ${eyebrowClass}`}>{resultsInstallEyebrow}</span>
            {recommendations.map((entry, position) => {
              // The number comes from the catalog, not from the model — it is
              // the brochure's stable id and the model is never asked for it.
              const installation = findInstallation(entry.installationId);
              const number = installation ? String(installation.number).padStart(2, "0") : "";

              return (
                <div
                  key={entry.installationId}
                  className="sc-step-in flex gap-3"
                  /*
                   * Staggered so the shortlist arrives as a list being read
                   * out rather than as a block appearing at once. Capped at
                   * five entries by the schema, so the last one is never more
                   * than 280ms behind the first.
                   */
                  style={{ animationDelay: `${position * 70}ms` }}
                >
                  <span className="text-tpg-primary w-6 flex-none font-serif text-[15px]">
                    {number}
                  </span>
                  <div className="flex flex-col gap-1">
                    <span className="text-tpg-ink text-[13.5px] font-semibold">{entry.name}</span>
                    {entry.bucket && (
                      <span className="text-tpg-muted/80 text-[11px] font-semibold tracking-[0.08em] uppercase">
                        {entry.bucket}
                      </span>
                    )}
                    <span className="text-tpg-muted text-[12.5px] leading-relaxed">
                      {entry.reason}
                    </span>
                    {/*
                     * V2 slot. `diagram` is null on every catalog entry today,
                     * so this renders nothing; when the nineteen diagrams
                     * exist they appear here with no schema change.
                     */}
                    {entry.diagram && (
                      <Image
                        // next/image does not prefix `src` with basePath, so
                        // the helper does it — same as everywhere else on the site.
                        src={withBasePath(entry.diagram)}
                        alt={`How the ${entry.name} installation works`}
                        width={320}
                        height={180}
                        className="border-tpg-border mt-1.5 h-auto w-full rounded-md border"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <div className="border-tpg-border flex flex-col gap-2.5 border-t pt-4">
        <a
          href={commitCalendlyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-tpg-cta hover:bg-tpg-cta-hover focus-visible:bg-tpg-cta-hover rounded px-5 py-3.5 text-center text-[13.5px] font-bold text-white transition-[background-color,transform] duration-200 ease-out hover:-translate-y-0.5 focus-visible:-translate-y-0.5"
        >
          {bookLabel}
        </a>

        {brochure && (
          <a
            href={brochure.href}
            aria-label={brochure.ariaLabel}
            {...(brochure.downloadAs ? { download: brochure.downloadAs } : {})}
            className="border-tpg-ink text-tpg-ink hover:bg-tpg-ink rounded border px-5 py-3 text-center text-[13.5px] font-semibold transition-[background-color,color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:text-white focus-visible:-translate-y-0.5"
          >
            {brochureLabel}
          </a>
        )}

        {/* A statement of what already happened, so not a button. */}
        <p className="text-tpg-muted/90 pt-1 text-[12px] leading-relaxed">{resultsFollowUp}</p>
      </div>
    </div>
  );
}
