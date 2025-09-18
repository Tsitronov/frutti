import React from "react";
import { useSelector } from "react-redux";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; 

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import Navbar from "../UI/navbar/Navbar";

const Report = () => {
  const utenti = useSelector((state) => state.utenti.lista || []);
  const frutti = useSelector((state) => state.frutti.lista || []);

    // 📄 Экспорт в PDF
  const exportPDF = () => {
    const doc = new jsPDF('p','mm','a4');
    doc.setFontSize(16);
    doc.text("Report Utenti", 14, 16);

    // HEAD senza "Altro" (lo mettiamo su riga separata)
    const head = [[
      "ID","Reparto","Stanza","Nome","Bagno","Barba","Autonomia","Vestiti","Alimentazione","Accessori"
    ]];

    const body = utenti.flatMap(u => {
      const mainRow = [
        u.id, u.reparto, u.stanza, u.nome, u.bagno, u.barba,
        u.autonomia, u.vestiti, u.alimentazione, u.accessori
      ];
      
      // Se "altro" esiste, aggiungiamo una riga separata
      if (u.altro && u.altro.trim() !== "") {
        return [
          mainRow,
          [
            { content: "Altro:", styles: { fontStyle: 'bold', halign: 'left' } },
            { content: u.altro, colSpan: 10, styles: { halign: 'left', fontStyle: 'normal' } }]
        ];
      } else {
        return [mainRow]; // altrimenti solo la riga principale
      }
    });

    autoTable(doc, {
      startY: 22,
      head,
      body,
      styles: { fontSize: 9, cellWidth: 'wrap' },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 12 }, // ID piccolo
        2: { cellWidth: 16 }, // Stanza
        5: { cellWidth: 14 }, // barba
        6: { cellWidth: 20 }  // Autonomia
        // non serve columnStyles per la colSpan
      },
      theme: 'striped'
    });

    // seconda pagina con frutti (se vuoi)
    doc.addPage();
    doc.text("Report Frutti", 14, 16);
    const fruttiData = frutti.map(f => [f.id, f.nome, f.categoria, f.descrizione]);
    autoTable(doc, {
      startY: 22,
      head: [["ID","Nome","Categoria","Descrizione"]],
      body: fruttiData,
      styles: { fontSize: 9, cellWidth: 'wrap' }
    });

    doc.save("report.pdf");
  };



const exportExcel = () => {
  const utentiData = utenti.map(u => ({
    ID: u.id,
    Reparto: u.reparto,
    Stanza: u.stanza,
    Nome: u.nome,
    Bagno: u.bagno,
    Barba: u.barba,
    Autonomia: u.autonomia,
    Vestiti: u.vestiti,
    Alimentazione: u.alimentazione,
    Accessori: u.accessori,
    Altro: u.altro || ""
  }));

  const fruttiData = frutti.map(f => ({
    ID: f.id,
    Nome: f.nome,
    Categoria: f.categoria,
    Descrizione: f.descrizione
  }));

  const utentiSheet = XLSX.utils.json_to_sheet(utentiData);
  const fruttiSheet = XLSX.utils.json_to_sheet(fruttiData);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, utentiSheet, "Utenti");
  XLSX.utils.book_append_sheet(workbook, fruttiSheet, "Frutti");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { 
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
  saveAs(data, "report.xlsx");
};

// 📑 Экспорт в CSV migliorato
const exportCSV = () => {
  const utentiData = utenti.map(u => ({
    ID: u.id,
    Reparto: u.reparto,
    Stanza: u.stanza,
    Nome: u.nome,
    Bagno: u.bagno,
    Barba: u.barba,
    Autonomia: u.autonomia,
    Vestiti: u.vestiti,
    Alimentazione: u.alimentazione,
    Accessori: u.accessori,
    Altro: u.altro || ""
  }));

  const fruttiData = frutti.map(f => ({
    ID: f.id,
    Nome: f.nome,
    Categoria: f.categoria,
    Descrizione: f.descrizione
  }));

  const utentiSheet = XLSX.utils.json_to_sheet(utentiData);
  const fruttiSheet = XLSX.utils.json_to_sheet(fruttiData);

  const csvUtenti = XLSX.utils.sheet_to_csv(utentiSheet);
  const csvFrutti = XLSX.utils.sheet_to_csv(fruttiSheet);

  const csvContent = `Utenti\n${csvUtenti}\n\nFrutti\n${csvFrutti}`;
  const data = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
  saveAs(data, "report.csv");
};

  return (
    <div className="container">
      <Navbar />
      <div className="main-content">
        <div className="content">
          <h3>Экспорт данных</h3>
          <div className="article-list">
            <button onClick={exportPDF}>📄 Экспорт в PDF</button>
            <button onClick={exportExcel}>📊 Экспорт в Excel</button>
            <button onClick={exportCSV}>📑 Экспорт в CSV</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;