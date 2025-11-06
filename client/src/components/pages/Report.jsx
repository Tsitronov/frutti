import React from "react";
import { useSelector } from "react-redux";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; 

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


const Report = () => {
  const utenti = useSelector((state) => state.utenti.lista || []);
  const frutti = useSelector((state) => state.frutti.lista || []);

    // 📄 Экспорт в PDF
  const exportPDF = () => {
    const doc = new jsPDF('p','mm','a4');
    doc.setFontSize(16);
    doc.text("Отчёт Пользователи", 14, 16);

    // HEAD senza "Altro" (lo mettiamo su riga separata)
    const head = [[
      "ID","Отдел","Комната","Фамилия","Ванна","Борода","Автономия","Одежда","Питание","Аксессуары"
    ]];

    const body = utenti.flatMap(u => {
      const mainRow = [
        u.id, u.reparto, u.stanza, u.cognome, u.bagno, u.barba,
        u.autonomia, u.vestiti, u.alimentazione, u.accessori
      ];
      
      // Se "altro" esiste, aggiungiamo una riga separata
      if (u.altro && u.altro.trim() !== "") {
        return [
          mainRow,
          [
            { content: "Другое:", styles: { fontStyle: 'bold', halign: 'left' } },
            { content: u.altro, colSpan: 10, styles: { halign: 'left', fontStyle: 'normal' } }]
        ];
      } else {
        return [mainRow]; // иначе только основная строка
      }
    });

    autoTable(doc, {
      startY: 22,
      head,
      body,
      styles: { fontSize: 9, cellWidth: 'wrap' },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 12 }, // ID маленький
        2: { cellWidth: 16 }, // Комната
        5: { cellWidth: 14 }, // Борода
        6: { cellWidth: 20 }  // Автономия
        // не нужно columnStyles для colSpan
      },
      theme: 'striped'
    });

    // вторая страница с frutti (если хочешь)
    doc.addPage();
    doc.text("Отчёт Общее", 14, 16);
    const fruttiData = frutti.map(f => [f.id, f.cognome, f.categoria, f.descrizione]);
    autoTable(doc, {
      startY: 22,
      head: [["ID","Фамилия","Категория","Описание"]],
      body: fruttiData,
      styles: { fontSize: 9, cellWidth: 'wrap' }
    });

    doc.save("report.pdf");
  };



const exportExcel = () => {
  const utentiData = utenti.map(u => ({
    ID: u.id,
    Отдел: u.reparto,
    Комната: u.stanza,
    Фамилия: u.cognome,
    Ванна: u.bagno,
    Борода: u.barba,
    Автономия: u.autonomia,
    Одежда: u.vestiti,
    Питание: u.alimentazione,
    Аксессуары: u.accessori,
    Другое: u.altro || ""
  }));

  const fruttiData = frutti.map(f => ({
    ID: f.id,
    Фамилия: f.cognome,
    Категория: f.categoria,
    Описание: f.descrizione
  }));

  const utentiSheet = XLSX.utils.json_to_sheet(utentiData);
  const fruttiSheet = XLSX.utils.json_to_sheet(fruttiData);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, utentiSheet, "Пользователи");
  XLSX.utils.book_append_sheet(workbook, fruttiSheet, "Общее");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { 
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
  saveAs(data, "report.xlsx");
};

// 📑 Улучшенный экспорт в CSV
const exportCSV = () => {
  const utentiData = utenti.map(u => ({
    ID: u.id,
    Отдел: u.reparto,
    Комната: u.stanza,
    Фамилия: u.cognome,
    Ванна: u.bagno,
    Борода: u.barba,
    Автономия: u.autonomia,
    Одежда: u.vestiti,
    Питание: u.alimentazione,
    Аксессуары: u.accessori,
    Другое: u.altro || ""
  }));

  const fruttiData = frutti.map(f => ({
    ID: f.id,
    Фамилия: f.cognome,
    Категория: f.categoria,
    Описание: f.descrizione
  }));

  const utentiSheet = XLSX.utils.json_to_sheet(utentiData);
  const fruttiSheet = XLSX.utils.json_to_sheet(fruttiData);

  const csvUtenti = XLSX.utils.sheet_to_csv(utentiSheet);
  const csvFrutti = XLSX.utils.sheet_to_csv(fruttiSheet);

  const csvContent = `Пользователи\n${csvUtenti}\n\nОбщее\n${csvFrutti}`;
  const data = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
  saveAs(data, "report.csv");
};

  return (
    <div className="container">
      <Navbar />
      <div className="main-content-table-utenti">
        <div className="content-table-utenti">
          <h3> Экспорт данных пользователей </h3>
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