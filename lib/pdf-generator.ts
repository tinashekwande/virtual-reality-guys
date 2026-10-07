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

  // 1. Temporarily suppress all on-screen toasts so they NEVER appear in any capture
  if (typeof window !== "undefined") {
    const liveToasts = document.querySelectorAll(
      "[data-sonner-toaster], [data-sonner-toast], [aria-label*='Notification'], [class*='toaster'], .toaster, [role='status'], [role='alert'], [data-portal]"
    );
    liveToasts.forEach((t) => ((t as HTMLElement).style.setProperty("display", "none", "important")));
  }

  try {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isRentalAgreement = elementId.includes("rental-agreement") || element.id.includes("rental-agreement");

    // Dynamic safe scale: for tall multi-page legal contracts (> 5,000px), use 1.5 to stay within safe GPU canvas limits
    const elHeight = element.scrollHeight || element.offsetHeight || 2000;
    const safeScale = elHeight > 5000 ? 1.5 : 2;

    // Clone & sanitize DOM, formatting as a clean, high-definition white document PDF
    const canvas = await html2canvas(element, {
      scale: safeScale,
      useCORS: true,
      allowTaint: false,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: 1024,
      scrollX: 0,
      scrollY: 0,
      imageTimeout: 15000,
      onclone: (clonedDoc, clonedEl) => {
        // Completely remove all toasts, alerts, headers, sidebars, and buttons from clonedDoc
        const removeSelectors = [
          "[data-sonner-toaster]",
          "[data-sonner-toast]",
          "[aria-label*='Notification']",
          "[class*='toaster']",
          ".toaster",
          "[role='status']",
          "[role='alert']",
          "[data-portal]",
          "[class*='ai-assistant']",
          "[class*='UniversalAiSearch']",
          "header",
          "nav",
          "footer",
          "aside",
          "button",
          ".print\\:hidden",
          "[class*='print\\:hidden']",
        ];
        clonedDoc.querySelectorAll(removeSelectors.join(", ")).forEach((node) => {
          if (!node.contains(clonedEl) && !clonedEl.contains(node)) {
            node.remove();
          }
        });

        // Ensure clonedDoc body and all ancestor wrappers do not clip or hide clonedEl
        clonedDoc.body.style.overflow = "visible";
        clonedDoc.body.style.height = "auto";
        let curr: HTMLElement | null = clonedEl;
        while (curr && curr !== clonedDoc.body) {
          curr.style.display = "block";
          curr.style.visibility = "visible";
          curr.style.overflow = "visible";
          curr.style.height = "auto";
          curr.style.maxHeight = "none";
          curr = curr.parentElement;
        }

        // Set clean desktop dimensions on root clone with 100% pure white background
        clonedEl.style.width = isRentalAgreement ? "860px" : "800px";
        clonedEl.style.maxWidth = isRentalAgreement ? "860px" : "800px";
        clonedEl.style.minWidth = isRentalAgreement ? "860px" : "800px";
        clonedEl.style.minHeight = "auto";
        clonedEl.style.height = "auto";
        clonedEl.style.margin = "0 auto";
        clonedEl.style.padding = isRentalAgreement ? "24px" : "32px";
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

        // Remove all decorative elements & print:hidden nodes inside the document
        const hideNodes = clonedEl.querySelectorAll(".print\\:hidden, [class*='blur']");
        hideNodes.forEach((node) => node.remove());

        // For invoice dark mode preview, clean cyber colors to paper colors
        if (!isRentalAgreement) {
          const allNodes = clonedEl.querySelectorAll("*");
          allNodes.forEach((node) => {
            const el = node as HTMLElement;
            const cls = el.className || "";

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

            if (typeof cls === "string" && cls.includes("border-amber")) {
              el.style.borderColor = "#fcd34d";
              if (cls.includes("bg-")) {
                el.style.backgroundColor = "#fffbeb";
              }
            }

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

            if (typeof cls === "string") {
              if (cls.includes("text-white") || cls.includes("text-slate-1") || cls.includes("text-slate-2")) {
                el.style.color = "#0f172a";
              } else if (cls.includes("text-slate-3") || cls.includes("text-slate-4") || cls.includes("text-slate-5")) {
                el.style.color = "#475569";
              } else if (cls.includes("text-cyan-400") || cls.includes("text-cyan-300")) {
                el.style.color = "#0284c7";
              }
            }

            if (el.style) {
              el.style.filter = "none";
              el.style.backdropFilter = "none";
            }
          });
        }
      },
    });

    if (!canvas || canvas.width <= 0 || canvas.height <= 0) {
      throw new Error(`Captured canvas has invalid dimensions: ${canvas?.width || 0}x${canvas?.height || 0}`);
    }

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

    // Slice source canvas into distinct A4 page chunks so each page gets its own cropped image.
    // This avoids negative offsets, oversized textures, and Chromium PDFium decoding crashes.
    const pageCanvasHeight = Math.floor(canvas.width * (pdfHeight / pdfWidth));
    if (pageCanvasHeight <= 0) {
      throw new Error("Invalid pageCanvasHeight calculation");
    }
    const totalPages = Math.max(1, Math.ceil(canvas.height / pageCanvasHeight));

    for (let pageIdx = 0; pageIdx < totalPages; pageIdx++) {
      if (pageIdx > 0) {
        pdf.addPage();
      }

      // Create an individual sub-canvas for this specific A4 page
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = pageCanvasHeight;

      const pageCtx = pageCanvas.getContext("2d");
      if (pageCtx) {
        // Pure white background for crisp paper rendering
        pageCtx.fillStyle = "#ffffff";
        pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

        const sourceY = pageIdx * pageCanvasHeight;
        const sourceHeight = Math.min(pageCanvasHeight, canvas.height - sourceY);

        if (sourceHeight > 0) {
          pageCtx.drawImage(
            canvas,
            0,
            sourceY,
            canvas.width,
            sourceHeight,
            0,
            0,
            canvas.width,
            sourceHeight
          );
        }

        const pageImgData = pageCanvas.toDataURL("image/jpeg", 0.95);
        pdf.addImage(pageImgData, "JPEG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
      }
    }

    // Generate ArrayBuffer and Blob to verify valid non-empty byte stream
    const arrayBuffer = pdf.output("arraybuffer");
    if (!arrayBuffer || arrayBuffer.byteLength < 500) {
      throw new Error(`PDF generation produced an empty or truncated byte stream (${arrayBuffer?.byteLength || 0} bytes)`);
    }

    const blob = new Blob([arrayBuffer], { type: "application/pdf" });
    const safeName = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;

    // Download via Blob link with prolonged revoke timeout to prevent Chromium 0-byte abort
    if ((navigator as any).msSaveOrOpenBlob) {
      (navigator as any).msSaveOrOpenBlob(blob, safeName);
    } else {
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = safeName;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();

      // On iOS Safari, also open the blob URL in a new tab so user can share/save
      if (isMobile && /iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        setTimeout(() => {
          window.open(blobUrl, "_blank");
        }, 300);
      }

      // Maintain object URL for 60 seconds so browser download manager finishes streaming bytes to disk
      setTimeout(() => {
        try {
          document.body.removeChild(a);
          URL.revokeObjectURL(blobUrl);
        } catch {}
      }, 60000);
    }
  } catch (err) {
    console.error("Direct PDF generation error, launching clean browser print:", err);
    // Dismiss all toasts before calling window.print() so they never appear on the document
    if (typeof window !== "undefined") {
      const toastEls = document.querySelectorAll(
        "[data-sonner-toaster], [data-sonner-toast], .toaster, [role='status'], [role='alert']"
      );
      toastEls.forEach((t) => ((t as HTMLElement).style.setProperty("display", "none", "important")));
      setTimeout(() => {
        window.print();
      }, 100);
    }
    throw err;
  }
}

export function printPDFDocument(elementId: string): void {
  // Dismiss all toasts so they never print
  if (typeof window !== "undefined") {
    const toastEls = document.querySelectorAll(
      "[data-sonner-toaster], [data-sonner-toast], .toaster, [role='status'], [role='alert']"
    );
    toastEls.forEach((t) => ((t as HTMLElement).style.setProperty("display", "none", "important")));
  }

  // Trigger window print cleanly with unclipped layout
  setTimeout(() => {
    window.print();
  }, 100);
}

