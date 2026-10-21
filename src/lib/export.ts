// Export multi-format (CSV, TXT, print/PDF) — client side
export function exportCSV(rows: Record<string, any>[], filename: string) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(','), ...rows.map((r) =>
    headers.map((h) => `"${String(r[h] ?? '').replace(/"/g, '""')}"`).join(',')
  )].join('\n');
  download(csv, `${filename}.csv`, 'text/csv');
}

export function exportTXT(rows: Record<string, any>[], filename: string) {
  const text = rows.map((r) => Object.entries(r).map(([k, v]) => `${k}: ${v ?? '-'}`).join(' | ')).join('\n');
  download(text, `${filename}.txt`, 'text/plain');
}

export function exportXLS(rows: Record<string, any>[], filename: string) {
  // SpreadsheetML sederhana yang bisa dibuka Excel
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const xml = `<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="Data" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Table>${
    `<Row>${headers.map((h) => `<Cell><Data ss:Type="String">${h}</Data></Cell>`).join('')}</Row>` +
    rows.map((r) => `<Row>${headers.map((h) => `<Cell><Data ss:Type="String">${String(r[h] ?? '')}</Data></Cell>`).join('')}</Row>`).join('')
  }</Table></Worksheet></Workbook>`;
  download(xml, `${filename}.xls`, 'application/vnd.ms-excel');
}

export function printPDF(title: string, rows: Record<string, any>[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const html = `<html><head><title>${title}</title><style>body{font-family:sans-serif;padding:24px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ccc;padding:6px;text-align:left;font-size:12px}th{background:#eee}</style></head><body><h2>${title}</h2><table><thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${headers.map((h) => `<td>${r[h] ?? '-'}</td>`).join('')}</tr>`).join('')}</tbody></table></body></html>`;
  const w = window.open('', '_blank');
  if (w) { w.document.write(html); w.document.close(); w.print(); }
}

function download(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
