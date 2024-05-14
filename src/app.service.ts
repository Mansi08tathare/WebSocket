import { Injectable } from '@nestjs/common';
import * as xlsx from 'xlsx';
const excelToJson = require('convert-excel-to-json');
const fs = require('fs');


@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  // async convertExcelToJson(filePath: string): Promise<any[]> {
  //   // Read the Excel file asynchronously
  //   const fileBuffer = fs.readFileSync(filePath);

  //   // Convert Excel to JSON
  //   const result = excelToJson({
  //     source: fileBuffer,
  //   });

  //   // Extract and return the data from the result object
  //   const jsonData = result[Object.keys(result)[0]]; // Assuming only one sheet
  //   return jsonData;
  // }


  //.....

  convertExcelToJson(filePath: string): any[] {
    // Read the Excel file
    let  workbook = xlsx.readFile(filePath);

    // Assuming the first sheet contains the data
    let sheetName = workbook.SheetNames[0];
    let sheet = workbook.Sheets[sheetName];

    // Convert the sheet to JSON
    let jsonData = [];
    console.log(jsonData)

    // Convert each row to JSON object
    const range = xlsx.utils.decode_range(sheet['!ref']);

    console.log("range",range)

    for (let rowNum = range.s.r + 1; rowNum <= range.e.r; rowNum++) {
      const row = {};
      for (let colNum = range.s.c; colNum <= range.e.c; colNum++) {
        const cellAddress = xlsx.utils.encode_cell({ r: rowNum, c: colNum });
        const cell = sheet[cellAddress];
        const headerCell = sheet[xlsx.utils.encode_cell({ r: range.s.r, c: colNum })];
        row[headerCell.v] = cell ? cell.v : null;
      }
      jsonData.push(row);
    }

    return jsonData;
  }


  async countRowsInExcel(filePath: string): Promise<number> {
    // Load the Excel file
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Assuming the data is in the first sheet
    const worksheet = workbook.Sheets[sheetName];

    // Convert the sheet to an array of rows
    const rows = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    // Return the number of rows
    return rows.length;
  }

}
