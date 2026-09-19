import { cn } from "@/lib/utils";

// Foto de perfil. Sin foto, muestra las iniciales con el estilo de vidrio de la app.
export function Avatar({
  name,
  url,
  size = 40,
  className,
}: {
  name: string;
  url?: string | null;
  size?: number;
  className?: string;
}) {
  const style = { width: size, height: size, fontSize: Math.max(10, Math.round(size * 0.38)) };
  if (url) {
    return (
      // Es una URL externa de almacenamiento: una imagen común alcanza y evita configurar dominios.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={url} alt={name} style={style} className={cn("shrink-0 rounded-full border border-white/70 object-cover", className)} />
    );
  }
  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "?";
  return (
    <span aria-hidden="true" style={style} className={cn("lead-avatar flex shrink-0 items-center justify-center rounded-full font-semibold text-brand", className)}>
      {initials}
    </span>
  );
}
