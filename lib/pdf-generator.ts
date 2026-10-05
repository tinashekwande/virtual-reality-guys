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
        // 1. COMPLETELY REMOVE all toasts, alerts, and banners from clonedDoc so they NEVER appear on the PDF
        const toasts = clonedDoc.querySelectorAll(
          "[data-sonner-toaster], [data-sonner-toast], [aria-label*='Notification'], [class*='toaster'], .toaster, [role='status'], [role='alert'], [data-portal]"
        );
        toasts.forEach((node) => node.remove());

        // Remove any siblings outside clonedEl that might overlap
        clonedDoc.querySelectorAll("nav, header, footer, [class*='print:hidden']").forEach((node) => {
          if (!node.contains(clonedEl) && !clonedEl.contains(node)) {
            node.remove();
          }
        });

        // 2. Set clean desktop dimensions on root clone with 100% pure white background and NO borders
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
        clonedEl.style.outline = "none";

        // Remove dark classes directly from root element
        clonedEl.classList.remove("bg-[#040817]", "border", "border-cyan-900/40", "shadow-2xl", "rounded-3xl");

        // 3. Remove all decorative elements & print:hidden nodes inside the document
        const hideNodes = clonedEl.querySelectorAll(".print\\:hidden, [class*='blur']");
        hideNodes.forEach((node) => node.remove());

        // 4. Thoroughly clean all child elements: eliminate all dark blue backgrounds, cyan borders, and dark corners
        const allNodes = clonedEl.querySelectorAll("*");
        allNodes.forEach((node) => {
          const el = node as HTMLElement;
          const cls = el.className || "";

          // Neutral light background for all cards and boxes
          if (
            typeof cls === "string" &&
            (cls.includes("bg-slate-9") ||
              cls.includes("bg-slate-8") ||
              cls.includes("bg-cyan-9") ||
              cls.includes("bg-cyan-8") ||
              cls.includes("bg-[#040817]"))
          ) {
            el.style.backgroundColor = "#f8fafc";
            el.style.borderColor = "#e2e8f0";
            el.style.color = "#0f172a";
          }

          // Banking details card
          if (typeof cls === "string" && cls.includes("border-amber")) {
            el.style.borderColor = "#fcd34d";
            if (cls.includes("bg-")) {
              el.style.backgroundColor = "#fffbeb";
            }
          }

          // Any cyan, dark blue, or dark slate border -> neutral soft gray border (#e2e8f0)
          if (
            typeof cls === "string" &&
            (cls.includes("border-cyan") ||
              cls.includes("divide-cyan") ||
              cls.includes("border-slate-8") ||
              cls.includes("border-slate-9") ||
              cls.includes("border-slate-7"))
          ) {
            el.style.borderColor = "#e2e8f0";
          }

          // Table borders (rows, cells, headers)
          if (
            el.tagName === "TR" ||
            el.tagName === "TD" ||
            el.tagName === "TH" ||
            el.tagName === "TABLE" ||
            el.tagName === "TBODY" ||
            el.tagName === "THEAD"
          ) {
            el.style.borderColor = "#e2e8f0";
          }

          // High-contrast text colors
          if (typeof cls === "string") {
            if (cls.includes("text-white") || cls.includes("text-slate-1") || cls.includes("text-slate-2")) {
              el.style.color = "#0f172a";
            } else if (cls.includes("text-slate-3") || cls.includes("text-slate-4") || cls.includes("text-slate-5")) {
              el.style.color = "#475569";
            } else if (cls.includes("text-cyan-400") || cls.includes("text-cyan-300")) {
              el.style.color = "#0284c7";
            }
          }

          // Strip all blurs and filters
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

  // Clone all active stylesheets and styles so all CSS is available in the print window
  const styles = Array.from(document.querySelectorAll("link[rel='stylesheet'], style"))
    .map((el) => el.outerHTML)
    .join("\n");

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Document</title>
        ${styles}
        <style>
          body {
            background-color: #ffffff !important;
            color: #0f172a !important;
            font-family: system-ui, -apple-system, sans-serif;
            margin: 0;
            padding: 24px;
          }
          [id^="pdf-document-preview"] {
            background-color: #ffffff !important;
            color: #0f172a !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
          @media print {
            body { padding: 0 !important; background-color: #ffffff !important; }
            [id^="pdf-document-preview"] { border: none !important; box-shadow: none !important; }
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
