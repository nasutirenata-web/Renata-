import { jsPDF } from "jspdf";
import { strategyAreas, sectionKey } from "@/lib/strategy-steps";

export function generateStrategyPdf(
  values: Record<string, Record<string, string>>,
  organizationName: string,
) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 56;
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  function ensureSpace(lineHeight: number) {
    if (y + lineHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  }

  function heading(text: string) {
    ensureSpace(28);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(text, margin, y);
    y += 22;
  }

  function subheading(text: string) {
    ensureSpace(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(text, margin, y);
    y += 16;
  }

  function label(text: string) {
    ensureSpace(16);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(text, margin, y);
    y += 13;
  }

  function body(text: string) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const lines: string[] = doc.splitTextToSize(text || "(sin completar)", maxWidth);
    for (const line of lines) {
      ensureSpace(14);
      doc.text(line, margin, y);
      y += 14;
    }
    y += 6;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Estrategia comercial B2B", margin, y);
  y += 28;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(organizationName, margin, y);
  y += 16;
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(new Date().toLocaleDateString("es-AR", { year: "numeric", month: "long", day: "numeric" }), margin, y);
  doc.setTextColor(0);
  y += 30;

  for (const area of strategyAreas) {
    heading(area.label);
    for (const section of area.sections) {
      const key = sectionKey(area.pathname, section.title);
      const sectionValues = values[key] ?? {};
      subheading(section.title);
      for (const field of section.fields) {
        label(field.label);
        body(sectionValues[field.name] ?? "");
      }
    }
    y += 10;
  }

  const fileName = `estrategia-${organizationName.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}.pdf`;
  doc.save(fileName);
}
