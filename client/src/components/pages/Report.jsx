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


  const exportPDF = () => {
    const doc = new jsPDF('p','mm','a4');
    doc.setFontSize(16);
    doc.text("raport utente ", 14, 16);


    const head = [[
      "ID","reparto","stanza","nome","bagno","barba","autonomia","vestiti","alimentazione","accessori"
    ]];

    const body = utenti.flatMap(u => {
      const mainRow = [
        u.id, u.reparto, u.stanza, u.cognome, u.bagno, u.barba,
        u.autonomia, u.vestiti, u.alimentazione, u.accessori
      ];
      

      if (u.altro && u.altro.trim() !== "") {
        return [
          mainRow,
          [
            { content: "altro:", styles: { fontStyle: 'bold', halign: 'left' } },
            { content: u.altro, colSpan: 10, styles: { halign: 'left', fontStyle: 'normal' } }]
        ];
      } else {
        return [mainRow];
      }
    });

    autoTable(doc, {
      startY: 22,
      head,
      body,
      styles: { fontSize: 9, cellWidth: 'wrap' },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 12 },
        2: { cellWidth: 16 },
        5: { cellWidth: 14 },
        6: { cellWidth: 20 }
      },
      theme: 'striped'
    });

    doc.addPage();
    doc.text("reaport generale", 14, 16);
    const fruttiData = frutti.map(f => [f.id, f.cognome, f.categoria, f.descrizione]);
    autoTable(doc, {
      startY: 22,
      head: [["ID","nome","categoria","descrizione"]],
      body: fruttiData,
      styles: { fontSize: 9, cellWidth: 'wrap' }
    });

    doc.save("report.pdf");
  };



const exportExcel = () => {
  const utentiData = utenti.map(u => ({
    ID: u.id,
    reparto: u.reparto,
    stanza: u.stanza,
    nome: u.cognome,
    bagno: u.bagno,
    barba: u.barba,
    autonomia: u.autonomia,
    vestiti: u.vestiti,
    alimentazione: u.alimentazione,
    accessori: u.accessori,
    altro: u.altro || ""
  }));

  const fruttiData = frutti.map(f => ({
    ID: f.id,
    nome: f.cognome,
    categoria: f.categoria,
    descrizione: f.descrizione
  }));

  const utentiSheet = XLSX.utils.json_to_sheet(utentiData);
  const fruttiSheet = XLSX.utils.json_to_sheet(fruttiData);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, utentiSheet, "utenti");
  XLSX.utils.book_append_sheet(workbook, fruttiSheet, "frutti");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { 
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
  saveAs(data, "report.xlsx");
};

const exportCSV = () => {
  const utentiData = utenti.map(u => ({
    ID: u.id,
    reparto: u.reparto,
    stanza: u.stanza,
    nome: u.cognome,
    bagno: u.bagno,
    barba: u.barba,
    autonomia: u.autonomia,
    vestiti: u.vestiti,
    alimentazione: u.alimentazione,
    accessori: u.accessori,
    altro: u.altro || ""
  }));

  const fruttiData = frutti.map(f => ({
    ID: f.id,
    nome: f.cognome,
    categoria: f.categoria,
    descrizione: f.descrizione
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
      <div className="main-content-table-utenti">
        <div className="content-table-utenti">
          <h3> export dei dati utente </h3>
          <div className="article-list">
            <button onClick={exportPDF}>📄 exportPDF </button>
            <button onClick={exportExcel}>📊 exportExcel </button>
            <button onClick={exportCSV}>📑 exportCSV </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;