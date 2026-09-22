export interface CancelTicket {
  orderId?: number;
  tableNumber?: number | string | null;
  orderType: string;
  timestamp?: string;
}

const escapeHtml = (str: string): string =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const printHtmlViaIframe = (htmlContent: string): void => {
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0px";
  iframe.style.height = "0px";
  iframe.style.border = "0";
  iframe.style.visibility = "hidden";

  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentWindow?.document;
  if (iframeDoc) {
    iframeDoc.open();
    iframeDoc.write(htmlContent);
    iframeDoc.close();

    iframe.onload = () => {
      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (err) {
          console.error("Errore durante la stampa:", err);
        } finally {
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
          }, 1000);
        }
      }, 100);
    };
  }
};

export const printCancellationTicket = (ticket: CancelTicket): void => {
  const timeString =
    ticket.timestamp ||
    new Intl.DateTimeFormat("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date());

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Stampa Cancellazione</title>
      <style>
        @page { size: 80mm auto; margin: 0; }
        html, body { width: 80mm; margin: 0; padding: 0; background: #fff; }
        body { 
          font-family: 'Courier New', Courier, monospace; 
          padding: 4mm; 
          margin: 0 auto; 
          text-align: center; 
          color: #000; 
          box-sizing: border-box; 
        }
        * { page-break-inside: avoid; break-inside: avoid; }
        .title { font-size: 18pt; font-weight: bold; }
        .status { font-size: 16pt; font-weight: bold; border: 2px solid black; margin: 8px 0; padding: 4px; }
        .info { font-size: 14pt; margin: 4px 0; }
      </style>
    </head>
    <body>
      <div class="title">COMANDA CANCELLATA</div>
      <div class="status">*** ANNULLATO ***</div>
      <div class="info">
        ${
          ticket.orderType === "TAVOLO" && ticket.tableNumber
            ? `<strong>TAVOLO: ${escapeHtml(String(ticket.tableNumber))}</strong>`
            : `<strong>ASPORTO</strong>`
        }
      </div>
      ${ticket.orderId ? `<div class="info">Ordine #${ticket.orderId}</div>` : ""}
      <div class="info">${timeString}</div>
    </body>
    </html>
  `;

  printHtmlViaIframe(html);
};
