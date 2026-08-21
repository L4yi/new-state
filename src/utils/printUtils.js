/**
 * Bulletproof Multi-Device Print Engine
 * Works seamlessly across Desktop, iOS Safari, Android Chrome, Tablets, and WebViews.
 */

export function printDocument(elementId, documentTitle = 'Official Document') {
  const element = document.getElementById(elementId);
  if (!element) {
    console.warn(`Print element with ID #${elementId} not found. Falling back to native print.`);
    window.print();
    return;
  }

  // Detect iOS / Android Mobile Browsers
  const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);

  // Collect all styles from the current document
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map((style) => style.outerHTML)
    .join('\n');

  const printHtml = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>${documentTitle}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
        ${styles}
        <style>
          @page {
            size: A4 portrait;
            margin: 6mm 6mm;
          }
          *, *::before, *::after {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
            box-sizing: border-box !important;
          }
          html, body {
            font-family: 'Poppins', sans-serif !important;
            background: #FFFFFF !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
          }
          .mobile-print-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #06452C;
            color: #FFFFFF;
            padding: 12px 16px;
            margin-bottom: 16px;
            border-radius: 12px;
            font-family: 'Poppins', sans-serif;
          }
          .mobile-print-btn {
            background: #10B981;
            color: #06452C;
            font-weight: 800;
            border: none;
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 13px;
          }
          .print-wrapper {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 auto !important;
            padding: 10px !important;
            background: #FFFFFF !important;
          }
          @media print {
            .mobile-print-header {
              display: none !important;
            }
            .print-wrapper {
              padding: 0 !important;
              margin: 0 !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="mobile-print-header no-print">
          <div>
            <div style="font-weight: 800; font-size: 14px;">${documentTitle}</div>
            <div style="font-size: 11px; opacity: 0.85;">Tap "Print / Save PDF" below to print or save to your phone</div>
          </div>
          <button class="mobile-print-btn" onclick="window.print()">Print / Save PDF</button>
        </div>
        <div class="print-wrapper">
          ${element.innerHTML}
        </div>
      </body>
    </html>
  `;

  // On iOS / Android Mobile: Open clean print document window for 100% reliable rendering
  if (isMobile) {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(printHtml);
      printWindow.document.close();
      
      // Auto-trigger print on mobile after load
      setTimeout(() => {
        try {
          printWindow.focus();
          printWindow.print();
        } catch (e) {
          console.log('Mobile print auto-trigger waiting for user tap');
        }
      }, 500);
      return;
    }
  }

  // On Desktop: Use silent, non-intrusive isolated iframe printing
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.setAttribute('title', documentTitle);
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(printHtml);
  doc.close();

  setTimeout(() => {
    try {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } catch (e) {
      console.warn('Iframe print failed, falling back to window.print()', e);
      window.print();
    }
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 2000);
  }, 400);
}
