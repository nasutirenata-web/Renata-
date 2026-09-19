// Perfil de cada persona: nombre, apellido y con qué empresa(s) trabaja. Se guarda en los datos
// de la cuenta (user_metadata), sin tablas nuevas. Lo usan el registro y Configuración → Mi perfil.

export type WorkType = "empresa" | "freelance";

export type ProfileMetadata = {
  full_name: string;
  first_name: string;
  last_name: string;
  work_type: WorkType;
  company: string;
  freelance_companies_count: number | null;
  freelance_companies: string;
};

const text = (form: FormData, key: string) => String(form.get(key) ?? "").trim();

export function parseProfileForm(
  form: FormData,
): { error: string } | { error: null; metadata: ProfileMetadata; organizationName: string } {
  const first = text(form, "first_name");
  const last = text(form, "last_name");
  const workType = text(form, "work_type");

  if (!first || !last) return { error: "Completá tu nombre y apellido." };
  if (first.length > 60 || last.length > 60) return { error: "El nombre y el apellido pueden tener hasta 60 caracteres." };
  if (workType !== "empresa" && workType !== "freelance") return { error: "Contanos si trabajás en una empresa o sos freelance." };

  const fullName = `${first} ${last}`;
  let company = "";
  let count: number | null = null;
  let names = "";
  let organizationName = fullName;

  if (workType === "empresa") {
    company = text(form, "company");
    if (!company) return { error: "Completá el nombre de tu empresa." };
    if (company.length > 120) return { error: "El nombre de la empresa puede tener hasta 120 caracteres." };
    organizationName = company;
  } else {
    const rawCount = text(form, "freelance_count");
    if (rawCount) {
      count = Number(rawCount);
      if (!Number.isInteger(count) || count < 0 || count > 999) return { error: "La cantidad de empresas tiene que ser un número entero entre 0 y 999." };
    }
    names = text(form, "freelance_names");
    if (names.length > 500) return { error: "La lista de empresas puede tener hasta 500 caracteres." };
    organizationName = `${fullName} · Freelance`.slice(0, 120);
  }

  return {
    error: null,
    organizationName,
    metadata: {
      full_name: fullName,
      first_name: first,
      last_name: last,
      work_type: workType,
      company,
      freelance_companies_count: count,
      freelance_companies: names,
    },
  };
}

// Para cuentas creadas antes de este perfil: solo tenían full_name y organization_name.
export function profileDefaults(meta: Record<string, unknown> | undefined) {
  const m = meta ?? {};
  const full = String(m.full_name ?? "").trim();
  const [firstGuess = "", ...rest] = full.split(/\s+/).filter(Boolean);
  const workType: WorkType = m.work_type === "freelance" ? "freelance" : "empresa";
  return {
    first_name: String(m.first_name ?? firstGuess),
    last_name: String(m.last_name ?? rest.join(" ")),
    work_type: workType,
    company: String(m.company ?? m.organization_name ?? ""),
    freelance_count: m.freelance_companies_count == null ? "" : String(m.freelance_companies_count),
    freelance_names: String(m.freelance_companies ?? ""),
  };
}
