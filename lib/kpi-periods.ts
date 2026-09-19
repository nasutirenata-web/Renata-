// Períodos del Medidor de KPIs: semana (lunes a domingo), mes y trimestre calendario.
// Los límites se calculan en hora de Argentina (UTC-3, sin horario de verano) para que
// "esta semana" o "este mes" no cambien de golpe a las 21:00 en un servidor en UTC.

const AR_OFFSET_MS = 3 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

export type PeriodKey = "week" | "month" | "quarter";

export type PeriodWindow = {
  key: PeriodKey;
  title: string;
  range: string;
  previousLabel: string;
  current: { from: string; to: string };
  previous: { from: string; to: string };
};

// Un "instante local" es un epoch desplazado: sus getUTC* dan la fecha y hora de Argentina.
const fromLocal = (localMs: number) => new Date(localMs + AR_OFFSET_MS).toISOString();

const formatDay = (localMs: number) =>
  new Date(localMs).toLocaleDateString("es-AR", { timeZone: "UTC", day: "numeric", month: "short" });

export function getPeriodWindows(now: Date = new Date()): PeriodWindow[] {
  const nowLocal = now.getTime() - AR_OFFSET_MS;
  const local = new Date(nowLocal);
  const year = local.getUTCFullYear();
  const month = local.getUTCMonth();
  const dayStart = Date.UTC(year, month, local.getUTCDate());
  const mondayOffset = (local.getUTCDay() + 6) % 7; // lunes = 0

  const weekStart = dayStart - mondayOffset * DAY_MS;
  const monthStart = Date.UTC(year, month, 1);
  const quarterMonth = month - (month % 3);
  const quarterStart = Date.UTC(year, quarterMonth, 1);

  // Cada ventana actual llega hasta el final de su período; la anterior es el período completo previo.
  const weekEnd = weekStart + 7 * DAY_MS;
  const monthEnd = Date.UTC(year, month + 1, 1);
  const quarterEnd = Date.UTC(year, quarterMonth + 3, 1);

  return [
    {
      key: "week",
      title: "Semanal",
      range: `${formatDay(weekStart)} al ${formatDay(weekEnd - DAY_MS)}`,
      previousLabel: "semana anterior",
      current: { from: fromLocal(weekStart), to: fromLocal(weekEnd) },
      previous: { from: fromLocal(weekStart - 7 * DAY_MS), to: fromLocal(weekStart) },
    },
    {
      key: "month",
      title: "Mensual",
      range: new Date(monthStart).toLocaleDateString("es-AR", { timeZone: "UTC", month: "long", year: "numeric" }),
      previousLabel: "mes anterior",
      current: { from: fromLocal(monthStart), to: fromLocal(monthEnd) },
      previous: { from: fromLocal(Date.UTC(year, month - 1, 1)), to: fromLocal(monthStart) },
    },
    {
      key: "quarter",
      title: "Trimestral",
      range: `${quarterMonth / 3 + 1}.º trimestre de ${year}`,
      previousLabel: "trimestre anterior",
      current: { from: fromLocal(quarterStart), to: fromLocal(quarterEnd) },
      previous: { from: fromLocal(Date.UTC(year, quarterMonth - 3, 1)), to: fromLocal(quarterStart) },
    },
  ];
}
