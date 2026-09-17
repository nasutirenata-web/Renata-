export const MARKETING_WORDS = [
  "FUNNEL",
  "PIPELINE",
  "OUTBOUND",
  "INBOUND",
  "GROWTH",
  "LEADGEN",
  "CONVERSION",
  "BRANDING",
  "INSIGHT",
  "LAUNCH",
  "TARGETING",
  "REACH",
  "ENGAGEMENT",
  "CLOSING",
  "PROSPECTO",
  "PLAYBOOK",
  "BRIEFING",
  "NURTURING",
  "CHURN",
  "UPSELL",
];

export function randomMarketingCode() {
  const a = MARKETING_WORDS[Math.floor(Math.random() * MARKETING_WORDS.length)];
  let b = MARKETING_WORDS[Math.floor(Math.random() * MARKETING_WORDS.length)];
  while (b === a) {
    b = MARKETING_WORDS[Math.floor(Math.random() * MARKETING_WORDS.length)];
  }
  return `${a}-${b}`;
}
