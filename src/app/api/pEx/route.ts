// import { NextRequest, NextResponse } from 'next/server';
// import * as XLSX from 'xlsx'; // Исправлено
// import Candidate from '@/src/models/Candidate';
// import { connectDB } from '@/src/lib/db';

// interface ExcelRow {
//   Имя: string;
//   'контактный номер или ник в телеграм': string;
//   специальность: string;
//   примечание: string;
//   мессенджер: string;
// }

// const parseExcel = (buffer: Buffer) => {
//   try {
//     console.log('Parsing Excel file...');
//     const workbook = XLSX.read(buffer, { type: 'buffer' });
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];
//     return XLSX.utils.sheet_to_json(sheet) as ExcelRow[];
//   } catch (error) {
//     console.error('Error parsing Excel file:', error);
//     throw new Error('Failed to parse Excel file');
//   }
// };

// export async function POST(req: NextRequest) {
//   try {
//     console.log('Connecting to the database...');
//     await connectDB();

//     console.log('Fetching form data...');
//     const formData = await req.formData();
//     const file = formData.get('file') as Blob;
    
//     if (!file) {
//       console.error('No file provided in the request');
//       return NextResponse.json({ error: 'File not provided' }, { status: 400 });
//     }

//     console.log('Converting file to buffer...');
//     const buffer = await file.arrayBuffer();
//     const data: ExcelRow[] = parseExcel(Buffer.from(buffer));

//     console.log('Parsed data:', data);

//     // Отправляем данные обратно на клиент для предварительного просмотра
//     return NextResponse.json({
//       message: 'Data successfully parsed, preview it before saving.',
//       previewData: data,  // Отправляем только данные для предварительного просмотра
//     });

//   } catch (error: any) {
//     console.error('Error during file processing:', error);
//     return NextResponse.json({ error: 'Failed to parse Excel file', details: error.message }, { status: 500 });
//   }
// }

// // Endpoint для сохранения данных в базу данных
// export async function SAVE(req: NextRequest) {
//   try {
//     console.log('Connecting to the database...');
//     await connectDB();

//     const body = await req.json();
//     const candidates = body.data;

//     console.log('Saving candidates to the database...');
//     const savedCandidates = await Candidate.insertMany(candidates);

//     console.log('Data successfully saved to the database');
//     return NextResponse.json({ message: 'Data successfully uploaded', data: savedCandidates });

//   } catch (error: any) {
//     console.error('Error during database insertion:', error);
//     return NextResponse.json({ error: 'Failed to save data', details: error.message }, { status: 500 });
//   }
// }
import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import Candidate from '@/src/models/Candidate';
import { connectDB } from '@/src/lib/db';

interface ExcelRow {
  Имя: string;
  'контактный номер или ник в телеграм': string;
  специальность: string;
  примечание: string;
  мессенджер: string;
  isDuplicate?: boolean;

}

const parseExcel = (buffer: Buffer) => {
  try {
    console.log('Parsing Excel file...');
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(sheet) as ExcelRow[];
  } catch (error) {
    console.error('Error parsing Excel file:', error);
    throw new Error('Failed to parse Excel file');
  }
};

const checkForDuplicates = async (phone: string) => {
  // Проверяем наличие кандидата с таким же номером телефона
  const existingCandidate = await Candidate.findOne({ 'контактный номер или ник в телеграм': phone });
  return existingCandidate;
};

export async function POST(req: NextRequest) {
  try {
    console.log('Connecting to the database...');
    await connectDB();

    const contentType = req.headers.get('Content-Type');

    if (contentType?.includes('multipart/form-data')) {
      // Если запрос с типом 'multipart/form-data', значит, это загрузка файла
      console.log('Fetching form data...');
      const formData = await req.formData();
      const file = formData.get('file') as Blob;
      
      if (!file) {
        console.error('No file provided in the request');
        return NextResponse.json({ error: 'File not provided' }, { status: 400 });
      }

      console.log('Converting file to buffer...');
      const buffer = await file.arrayBuffer();
      const data: ExcelRow[] = parseExcel(Buffer.from(buffer));

      console.log('Parsed data:', data);

      // Проверка на дубликаты и добавление в лог
      const dataWithDuplicates = await Promise.all(data.map(async (candidate) => {
        const isDuplicate = await checkForDuplicates(candidate['контактный номер или ник в телеграм']);
        if (isDuplicate) {
          console.log(`Candidate ${candidate['Имя']} with phone ${candidate['контактный номер или ник в телеграм']} is a duplicate.`);
        } else {
          console.log(`Candidate ${candidate['Имя']} with phone ${candidate['контактный номер или ник в телеграм']} is unique.`);
        }
        return { ...candidate, isDuplicate };
      }));

      // Отправляем данные обратно на клиент для предварительного просмотра
      return NextResponse.json({
        message: 'Data successfully parsed, preview it before saving.',
        previewData: dataWithDuplicates,  // Отправляем только данные для предварительного просмотра
      });

    } else if (contentType?.includes('application/json')) {
      // Если запрос с типом 'application/json', значит, это запрос на сохранение данных
      console.log('Saving candidates to the database...');
      const body = await req.json();
      const candidates = body.data;

      // Отбираем только уникальных кандидатов
      const uniqueCandidates = (candidates as ExcelRow[]).filter(candidate => !candidate.isDuplicate);

      // Для каждого уникального кандидата проверяем на дубликат перед сохранением
      const candidatesToSave = await Promise.all(uniqueCandidates.map(async (candidate: ExcelRow) => {
        const isDuplicate = await checkForDuplicates(candidate['контактный номер или ник в телеграм']);
        if (isDuplicate) {
          console.log(`Candidate ${candidate['Имя']} with phone ${candidate['контактный номер или ник в телеграм']} is a duplicate.`);
        } else {
          console.log(`Candidate ${candidate['Имя']} with phone ${candidate['контактный номер или ник в телеграм']} is unique.`);
        }
        return candidate;
      }));

      // Сохраняем уникальных кандидатов в базу
      const savedCandidates = await Candidate.insertMany(candidatesToSave);

      console.log('Data successfully saved to the database');
      return NextResponse.json({ message: 'Data successfully uploaded', data: savedCandidates });

    } else {
      return NextResponse.json({ error: 'Unsupported Content-Type' }, { status: 415 });
    }

  } catch (error: any) {
    console.error('Error during processing:', error);
    return NextResponse.json({ error: 'Failed to process request', details: error.message }, { status: 500 });
  }
}
