export type HeadcountRow = {
  label: string;
  hire: string;
  sprint: string;
};

export const headcountKicker = "The Headcount Reframe";

export const headcountHeadline = "Your next hire costs more than our Sprint.";

export const headcountBody =
  "Every CEO we meet is trying to fill a role... VP of Ops, sales manager, integrator, CTO. What if we installed the system that role would build... in 10 days... for less than two months of that salary? It delivers faster, it needs no onboarding, and the system outlasts any employee.";

export const headcountCta = {
  label: "See the Sprint",
  href: "#formats",
};

export const headcountColumns = { hire: "The Hire", sprint: "The Sprint" };

export const headcountRows: HeadcountRow[] = [
  { label: "Time to productivity", hire: "6+ months", sprint: "10 business days" },
  { label: "Onboarding required", hire: "Months", sprint: "None" },
  { label: "If they leave", hire: "Starts over", sprint: "The system stays" },
  { label: "Runs", hire: "40 hours a week", sprint: "24/7" },
];
