// ================================
// UTILITY FUNCTIONS
// ================================

function escHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeCsv(val) {
  if (val == null) return "";
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function generatePDF(title, htmlContent) {
  const styles = `
    <style>
      body { font-family: Arial, sans-serif; margin: 40px; }
      h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
      h2 { color: #1e40af; margin-top: 30px; }
      .meta { color: #6b7280; font-size: 12px; margin-bottom: 20px; }
      .kv { margin: 10px 0; }
      .kv-row { display: flex; padding: 8px; border-bottom: 1px solid #e5e7eb; }
      .k { font-weight: bold; width: 150px; color: #374151; }
      .v { color: #1f2937; }
      table { width: 100%; border-collapse: collapse; margin: 10px 0; }
      th { background: #f3f4f6; padding: 10px; text-align: left; border: 1px solid #d1d5db; }
      td { padding: 8px; border: 1px solid #e5e7eb; }
      .muted { color: #9ca3af; font-style: italic; }
    </style>
  `;

  const fullHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${escHtml(title)}</title>
      ${styles}
    </head>
    <body>
      ${htmlContent}
    </body>
    </html>
  `;

  const blob = new Blob([fullHtml], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const printWindow = window.open(url, "_blank");
  
  if (printWindow) {
    printWindow.onload = function() {
      setTimeout(() => {
        printWindow.print();
        printWindow.close(); 
      }, 250);
    };
  }
}

// ================================
// GENERIC PROFILE EXPORT (CLINIC)
// Works for: Patient, Doctor, Billing
// ================================

function buildProfileHTML(title, entity, entityFields, rows, rowColumns) {
  const metaLine = `Generated on: ${new Date().toLocaleString()}`;

  const entityBlock = `
    <h2>Details</h2>
    <div class="kv">
      ${(entityFields || [])
        .map(
          (f) => `
        <div class="kv-row">
          <div class="k">${escHtml(f.label)}</div>
          <div class="v">${escHtml(entity?.[f.key])}</div>
        </div>
      `
        )
        .join("")}
    </div>
  `;

  const tableBlock = `
    <h2>Records</h2>
    ${
      rows?.length
        ? `
      <table>
        <thead>
          <tr>
            ${(rowColumns || []).map((c) => `<th>${escHtml(c.label)}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${(rows || [])
            .map(
              (r) => `
            <tr>
              ${(rowColumns || [])
                .map((c) => `<td>${escHtml(r?.[c.key])}</td>`)
                .join("")}
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `
        : `<div class="muted">No records found.</div>`
    }
  `;

  return `
    <h1>${escHtml(title)}</h1>
    <div class="meta">${escHtml(metaLine)}</div>
    ${entityBlock}
    ${tableBlock}
  `;
}

function buildProfileCSV(entity, entityFields, rows, rowColumns) {
  const entityLines = (entityFields || []).map(
    (f) => `${safeCsv(f.label)},${safeCsv(entity?.[f.key])}`
  );

  const tableHeader = (rowColumns || []).map((c) => safeCsv(c.label)).join(",");
  const tableBody = (rows || [])
    .map((r) => (rowColumns || []).map((c) => safeCsv(r?.[c.key])).join(","))
    .join("\n");

  return [
    "Details",
    "Field,Value",
    ...entityLines,
    "",
    "Records",
    tableHeader,
    tableBody,
  ].join("\n");
}

// ================================
// EXPORTED FUNCTIONS
// ================================

export function exportToCSV(filename, entity, rows, config) {
  const csv = buildProfileCSV(
    entity,
    config?.entityFields || [],
    rows || [],
    config?.rowColumns || []
  );

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  downloadBlob(filename, blob);
}

export function exportToPDF(title, entity, rows, config) {
  const html = buildProfileHTML(
    title,
    entity,
    config?.entityFields || [],
    rows || [],
    config?.rowColumns || []
  );

  generatePDF(title, html);
}

export function exportProfileToCSV(filename, entity, rows, config) {
  return exportToCSV(filename, entity, rows, config);
}

export function exportProfileToPDF(title, entity, rows, config) {
  return exportToPDF(title, entity, rows, config);
}