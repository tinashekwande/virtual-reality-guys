import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function exportToPDF(elementId: string, filename: string): Promise<void> {
  let element = document.getElementById(elementId);

  if (!element) {
    const elements = document.querySelectorAll(`[id^="${elementId}"]`);
    if (elements.length > 0) {
      element = elements[0] as HTMLElement;
    }
  }

  if (!element) {
    console.warn(`Element '${elementId}' not found. Using window print fallback.`);
    window.print();
    return;
  }

  try {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // Clone & sanitize DOM, formatting as a clean, high-definition white invoice PDF
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: 1024,
      imageTimeout: 15000,
      onclone: (clonedDoc, clonedEl) => {
        // Remove decorative elements & print:hidden nodes from the PDF canvas clone
        const hideNodes = clonedEl.querySelectorAll(".print\\:hidden, [class*='blur']");
        hideNodes.forEach((node) => node.remove());

        // Set clean desktop dimensions on clone for 100% consistent canvas rendering
        clonedEl.style.width = "800px";
        clonedEl.style.maxWidth = "800px";
        clonedEl.style.minWidth = "800px";
        clonedEl.style.minHeight = "auto";
        clonedEl.style.height = "auto";
        clonedEl.style.margin = "0 auto";
        clonedEl.style.padding = "32px";
        clonedEl.style.boxSizing = "border-box";
        clonedEl.style.transform = "none";
        clonedEl.style.backgroundColor = "#ffffff";
        clonedEl.style.color = "#0f172a";
        clonedEl.style.borderRadius = "0px";
        clonedEl.style.border = "none";
        clonedEl.style.boxShadow = "none";

        // Style cards with clean light backgrounds
        const bgDarkCards = clonedEl.querySelectorAll(
          ".bg-slate-900\\/60, .bg-slate-900\\/80, .bg-slate-900\\/40, .bg-slate-950\\/90, .bg-cyan-950\\/80"
        );
        bgDarkCards.forEach((node) => {
          const el = node as HTMLElement;
          el.style.backgroundColor = "#f8fafc";
          el.style.borderColor = "#e2e8f0";
          el.style.color = "#0f172a";
        });

        // Banking card gold / amber styling
        const bankingCards = clonedEl.querySelectorAll(".border-amber-500\\/30");
        bankingCards.forEach((node) => {
          const el = node as HTMLElement;
          el.style.backgroundColor = "#fffbeb";
          el.style.borderColor = "#fcd34d";
        });

        // Text color overrides for high-contrast legible PDF
        const whiteTexts = clonedEl.querySelectorAll(".text-white, .text-slate-100, .text-slate-200");
        whiteTexts.forEach((node) => {
          const el = node as HTMLElement;
          el.style.color = "#0f172a";
        });

        const mutedTexts = clonedEl.querySelectorAll(".text-slate-300, .text-slate-400, .text-slate-500");
        mutedTexts.forEach((node) => {
          const el = node as HTMLElement;
          el.style.color = "#475569";
        });

        const cyanAccents = clonedEl.querySelectorAll(".text-cyan-400, .text-cyan-300");
        cyanAccents.forEach((node) => {
          const el = node as HTMLElement;
          el.style.color = "#0284c7";
        });

        const borders = clonedEl.querySelectorAll(
          ".border-cyan-900\\/40, .border-cyan-900\\/30, .border-cyan-800\\/50, .border-cyan-800\\/60, .divide-cyan-900\\/30"
        );
        borders.forEach((node) => {
          const el = node as HTMLElement;
          el.style.borderColor = "#e2e8f0";
        });

        // Strip filter blurs and backdrop filters from all remaining elements
        const allNodes = clonedEl.querySelectorAll("*");
        allNodes.forEach((node) => {
          const el = node as HTMLElement;
          if (el.style) {
            el.style.filter = "none";
            el.style.backdropFilter = "none";
          }
        });
      },
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    // Fill base A4 background color with pure white (#ffffff)
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pdfWidth, pdfHeight, "F");

    if (imgHeight <= pdfHeight) {
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    } else {
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft >= 10) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, 0, pdfWidth, pdfHeight, "F");
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
    }

    const safeName = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;

    // Mobile specific PDF download strategy for iOS Safari & Android Chrome
    if (isMobile) {
      const blob = pdf.output("blob");
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = safeName;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();

      // Fallback for iOS Safari webviews
      setTimeout(() => {
        document.body.removeChild(a);
        if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
          window.open(blobUrl, "_blank");
        }
      }, 500);
    } else {
      pdf.save(safeName);
    }
  } catch (err) {
    console.error("html2canvas error, falling back to print dialog:", err);
    window.print();
  }
}

export function printPDFDocument(elementId: string): void {
  const element = document.getElementById(elementId);
  if (!element) {
    window.print();
    return;
  }

  // Mobile print fallback
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    window.print();
    return;
  }

  // Open standalone clean print window with only the invoice document
  const printWindow = window.open("", "_blank", "width=900,height=1100");
  if (!printWindow) {
    window.print();
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Document</title>
        <link rel="stylesheet" href="/_next/static/css/app/layout.css" />
        <style>
          body {
            background-color: #ffffff !important;
            color: #0f172a !important;
            font-family: system-ui, -apple-system, sans-serif;
            margin: 0;
            padding: 20px;
          }
          @media print {
            body { padding: 0; background-color: #ffffff !important; }
          }
        </style>
      </head>
      <body>
        ${element.outerHTML}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
