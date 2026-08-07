import type { PricingTier } from "@/content/retreats";

type PricingTiersProps = {
  tiers: PricingTier[];
  /** Single qualifying line under the grid — add-ons, bespoke arrangements. */
  note?: string;
};

/**
 * Equal-weight tier grid. Used for both retreat cohorts and Lighthouse
 * retainers, so the two priced ladders on the page read as one system.
 */
export function PricingTiers({ tiers, note }: PricingTiersProps) {
  return (
    <>
      <div className="border-tpg-border mt-9 overflow-hidden rounded-md border">
        <ul className="bg-tpg-border grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-px">
          {tiers.map((tier) => (
            <li key={tier.name} className="flex flex-col bg-white px-6 py-7">
              <span className="text-tpg-primary block font-serif text-[21px] leading-[1.2]">
                {tier.name}
              </span>
              {tier.price && (
                <span className="text-tpg-ink mt-3 block font-serif text-[27px] leading-none">
                  {tier.price}
                </span>
              )}
              {tier.detail && (
                <span className="text-tpg-muted mt-2.5 block text-[14.5px]">{tier.detail}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
      {note && <p className="text-tpg-muted mt-5 max-w-[860px] text-[16px]">{note}</p>}
    </>
  );
}
