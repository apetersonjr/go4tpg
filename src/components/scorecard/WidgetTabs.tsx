"use client";

import { cn } from "@/lib/cn";

export type WidgetTab = {
  id: string;
  label: string;
  /**
   * Renders as a muted badge after the label. Present on a tab that is visible
   * but not yet live, so the state reads as deliberate rather than broken.
   */
  badge?: string;
  disabled?: boolean;
};

type WidgetTabsProps = {
  tabs: WidgetTab[];
  activeId: string;
  onSelect: (id: string) => void;
};

/**
 * The tab bar.
 *
 * Both tabs go through this one component. Turning the second one on in V2 is
 * dropping its `disabled` and mounting a panel — there is no separate markup
 * path for the disabled state to diverge from, which is exactly the point:
 * a one-off "coming soon" block is the thing that rots.
 *
 * A disabled tab here is inert in every sense. It is not focusable, it is
 * skipped by arrow-key navigation, it has no hover or active treatment, and
 * clicking it does nothing at all — no toast, no alert, no console warning.
 * The only thing distinguishing it is reduced opacity and the badge.
 */
export function WidgetTabs({ tabs, activeId, onSelect }: WidgetTabsProps) {
  const enabled = tabs.filter((tab) => !tab.disabled);

  /*
   * Arrow keys move between enabled tabs only, wrapping at both ends. The
   * disabled tab is not a stop on that path — a keyboard reader should never
   * land somewhere that does nothing.
   */
  function onKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;

    const index = enabled.findIndex((tab) => tab.id === activeId);
    if (index === -1) return;

    event.preventDefault();
    const step = event.key === "ArrowRight" ? 1 : -1;
    const next = enabled[(index + step + enabled.length) % enabled.length];
    onSelect(next.id);
  }

  return (
    <div role="tablist" aria-label="Scorecard widget" className="border-tpg-border flex border-b">
      {tabs.map((tab) => {
        const active = tab.id === activeId && !tab.disabled;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tpg-tab-${tab.id}`}
            aria-controls={`tpg-panel-${tab.id}`}
            aria-selected={active}
            aria-disabled={tab.disabled || undefined}
            // Disabled tabs leave the tab order entirely; the active tab is the
            // single stop for the group, which is the standard tablist pattern.
            tabIndex={tab.disabled ? -1 : active ? 0 : -1}
            onKeyDown={tab.disabled ? undefined : onKeyDown}
            onClick={tab.disabled ? undefined : () => onSelect(tab.id)}
            className={cn(
              "flex flex-1 items-center gap-2 px-4 py-3.5 text-left text-[13px]",
              /*
               * `border-color` is in the transition list so the underline
               * cross-fades rather than snapping when the selection moves.
               * With one enabled tab in V1 this is never seen; it costs
               * nothing and means switching tabs in V2 is not a jump cut.
               */
              "transition-[color,background-color,border-color] duration-200 ease-out",
              active
                ? "border-tpg-cta text-tpg-ink border-b-2 font-semibold"
                : "border-b-2 border-transparent",
              tab.disabled
                ? // No pointer, no hover, no focus treatment. Muted with an
                  // existing token rather than a new grey.
                  "text-tpg-muted/60 bg-tpg-tint cursor-default"
                : !active && "text-tpg-muted hover:text-tpg-ink cursor-pointer",
            )}
          >
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="text-tpg-accent border-tpg-border rounded-sm border px-1.5 py-0.5 text-[9.5px] font-bold tracking-[0.1em] uppercase">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
