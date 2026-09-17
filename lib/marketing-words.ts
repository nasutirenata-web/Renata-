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
  "MARKETING",
  "ICP",
  "SEO",
  "ADS",
  "CTA",
  "KPI",
  "ROI",
];

export function randomMarketingCode() {
  const word = MARKETING_WORDS[Math.floor(Math.random() * MARKETING_WORDS.length)];
  if (word.length < 4) {
    const digit = Math.floor(1 + Math.random() * 9);
    return `${word}${digit}`;
  }
  return word;
}
