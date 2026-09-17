export function isHunterConfigured() {
  return Boolean(process.env.HUNTER_API_KEY);
}

export type HunterEmail = {
  value: string;
  type: string;
  confidence: number;
  first_name: string | null;
  last_name: string | null;
  position: string | null;
};

export async function hunterDomainSearch(domain: string) {
  const apiKey = process.env.HUNTER_API_KEY;
  if (!apiKey) throw new Error("Hunter.io no está configurado (falta HUNTER_API_KEY).");

  const url = new URL("https://api.hunter.io/v2/domain-search");
  url.searchParams.set("domain", domain);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("limit", "20");

  const res = await fetch(url, { cache: "no-store" });
  const json = await res.json();

  if (!res.ok) {
    const message = json?.errors?.[0]?.details ?? "Hunter.io rechazó la búsqueda.";
    throw new Error(message);
  }

  return {
    organization: json.data?.organization as string | null,
    emails: (json.data?.emails ?? []) as HunterEmail[],
  };
}
