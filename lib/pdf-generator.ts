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

    // Clone & sanitize DOM, forcing a fixed 850px desktop document width so mobile captures match desktop PDF perfectly!
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: "#040817",
      windowWidth: 1024,
      imageTimeout: 15000,
      onclone: (clonedDoc, clonedEl) => {
        // Force desktop width on clone for mobile devices
        clonedEl.style.width = "850px";
        clonedEl.style.maxWidth = "850px";
        clonedEl.style.minWidth = "850px";
        clonedEl.style.margin = "0 auto";
        clonedEl.style.padding = "32px";
        clonedEl.style.boxSizing = "border-box";
        clonedEl.style.transform = "none";

        // Strip filter blurs and backdrop filters from cloned elements
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

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft >= 10) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
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
            background-color: #040817 !important;
            color: #ffffff !important;
            font-family: system-ui, -apple-system, sans-serif;
            margin: 0;
            padding: 20px;
          }
          @media print {
            body { padding: 0; }
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
