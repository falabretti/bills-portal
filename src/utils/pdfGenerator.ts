import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function savePdf(title: string, headers: string[], entries: string[][]): void {

    const doc = new jsPDF({ putOnlyUsedFonts: true, orientation: "portrait" });

    doc.text(title, 15, 15);
    autoTable(doc, {
        head: [headers],
        body: entries,
        startY: 20
    })

    doc.save("download.pdf");
}
