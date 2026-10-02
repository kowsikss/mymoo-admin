export async function downloadExcel(rows, columns, fileName, sheetName = "Data") {
  const XLSX = await import("xlsx");
  const data = [
    columns.map((column) => column.label),
    ...rows.map((row) => columns.map((column) => row[column.key] ?? "")),
  ];
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.slice(0, 31));
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

export async function downloadPdf(rows, columns, fileName, title) {
  const [pdfModule, tableModule] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);
  const { jsPDF } = pdfModule;
  const autoTable = tableModule.default;
  const document = new jsPDF({
    orientation: columns.length > 7 ? "landscape" : "portrait",
  });
  const printableRows = rows.map((row) => (
    columns.map((column) => String(row[column.key] ?? "-"))
  ));

  document.setFontSize(15);
  document.text(title, 14, 16);
  autoTable(document, {
    startY: 23,
    head: [columns.map((column) => column.label)],
    body: printableRows,
    styles: { fontSize: 8, cellPadding: 2.5, overflow: "linebreak" },
    headStyles: { fillColor: [41, 77, 54] },
    margin: { left: 14, right: 14 },
  });
  document.save(`${fileName}.pdf`);
}