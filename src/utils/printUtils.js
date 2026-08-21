/**
 * Universal Multi-Device Print Engine
 * Works flawlessly on Desktop (Chrome, Edge, Safari, Firefox) and Mobile (iOS Safari, Android Chrome).
 */

export function printDocument(elementId, documentTitle = 'Official Document') {
  const element = document.getElementById(elementId);
  if (!element) {
    console.warn(`Print target #${elementId} not found, falling back to window.print()`);
    window.print();
    return;
  }

  // Detect Mobile Devices (iOS, Android)
  const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);

  // Collect all stylesheets and style tags
  const styleTags = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map((el) => el.outerHTML)
    .join('\n');

  // Convert relative image URLs to absolute URLs
  let contentHtml = element.outerHTML;
  const origin = window.location.origin;
  contentHtml = contentHtml.replace(/src="\/([^"]+)"/g, `src="${origin}/$1"`);

  const printDocumentHtml = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>${documentTitle}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
        ${styleTags}
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
            margin: 0 !important;
            padding: 0 !important;
            background: #FFFFFF !important;
            color: #000000 !important;
            font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
          }
          .mobile-action-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #06452C;
            color: #FFFFFF;
            padding: 12px 20px;
            position: sticky;
            top: 0;
            z-index: 99999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-family: 'Poppins', sans-serif;
          }
          .mobile-action-btn {
            background: #10B981;
            color: #06452C;
            font-weight: 800;
            border: none;
            padding: 10px 18px;
            border-radius: 10px;
            font-size: 13px;
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          }
          .mobile-close-btn {
            background: rgba(255,255,255,0.2);
            color: #FFFFFF;
            font-weight: 600;
            border: none;
            padding: 10px 14px;
            border-radius: 10px;
            font-size: 12px;
            cursor: pointer;
            margin-left: 8px;
          }
          .document-wrapper {
            width: 100% !important;
            max-width: 900px !important;
            margin: 0 auto !important;
            padding: 12px !important;
            background: #FFFFFF !important;
          }
          #printable-report-sheet,
          #printable-admission-slip {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 auto !important;
            background: #FFFFFF !important;
            display: block !important;
          }
          @media print {
            .mobile-action-bar {
              display: none !important;
            }
            .document-wrapper {
              padding: 0 !important;
              margin: 0 !important;
              max-width: 100% !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="mobile-action-bar">
          <div>
            <div style="font-weight: 800; font-size: 14px; letter-spacing: 0.3px;">${documentTitle}</div>
            <div style="font-size: 11px; opacity: 0.85;">Tap "Print / Save PDF" to download or print</div>
          </div>
          <div style="display: flex; align-items: center;">
            <button class="mobile-action-btn" onclick="window.print()">🖨️ Print / Save PDF</button>
            <button class="mobile-close-btn" onclick="window.close()">✕ Close</button>
          </div>
        </div>
        <div class="document-wrapper">
          ${contentHtml}
        </div>
        <script>
          // Automatically trigger native print dialog when rendered
          window.addEventListener('load', function() {
            setTimeout(function() {
              try {
                window.focus();
                window.print();
              } catch (e) {
                console.log('Print trigger waiting for user interaction', e);
              }
            }, 400);
          });
        </script>
      </body>
    </html>
  `;

  // 1. Mobile Browsers: Open clean dedicated print document window/tab
  if (isMobile) {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(printDocumentHtml);
      printWindow.document.close();
      return;
    }
  }

  // 2. Desktop Browsers: Use clean hidden iframe or dedicated window
  try {
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
    doc.write(printDocumentHtml);
    doc.close();

    setTimeout(() => {
      try {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } catch (e) {
        console.warn('Iframe print failed, opening dedicated print window', e);
        const win = window.open('', '_blank');
        if (win) {
          win.document.open();
          win.document.write(printDocumentHtml);
          win.document.close();
        }
      }
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 3000);
    }, 450);
  } catch (err) {
    console.error('Print execution error:', err);
    window.print();
  }
}
