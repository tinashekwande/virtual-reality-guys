import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function exportToPDF(elementId: string, filename: string): Promise<void> {
  let element = document.getElementById(elementId);
  
  if (!element) {
    // If element is offscreen or has a fallback id
    const elements = document.querySelectorAll(`[id^="${elementId}"]`);
    if (elements.length > 0) {
      element = elements[0] as HTMLElement;
    }
  }

  if (!element) {
    console.warn(`Element with id '${elementId}' not found. Falling back to print window.`);
    window.print();
    return;
  }

  try {
    // Temporarily scale up for high-DPI rendering
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: "#040817", // match dark premium theme background
      windowWidth: 1200,
      imageTimeout: 15000,
    });

    const imgData = canvas.toDataURL("image/png");

    // Calculate PDF dimensions (A4 page format)
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
  } catch (err) {
    console.error("html2canvas PDF rendering failed:", err);
    // Fallback to print dialog
    window.print();
  }
}
