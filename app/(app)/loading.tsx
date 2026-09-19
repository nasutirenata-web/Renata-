// Se muestra al instante al cambiar de sección, mientras el servidor prepara la pantalla real.
// Sin esto, el clic parece no hacer nada hasta que llegan los datos.
export default function AppLoading() {
  const pulse = "animate-pulse motion-reduce:animate-none";
  return (
    <div role="status" aria-live="polite" className="p-8">
      <span className="sr-only">Cargando…</span>
      <div className={`h-8 w-56 rounded-full bg-surface-2 ${pulse}`} />
      <div className={`mt-3 h-4 w-80 max-w-full rounded-full bg-surface-2 ${pulse}`} />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`glass-panel h-32 rounded-3xl ${pulse}`} />
        ))}
      </div>
      <div className={`glass-panel mt-5 h-64 rounded-3xl ${pulse}`} />
    </div>
  );
}
