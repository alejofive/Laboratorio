import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'src', 'data', 'db.json');

function readDb() {
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
}

function writeDb(data: any) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export async function GET() {
  const db = readDb();
  return NextResponse.json(db.examenes);
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, ...updates } = body;
  const db = readDb();

  const examIndex = db.examenes.findIndex((ex: any) => ex.id === id);
  if (examIndex === -1) {
    return NextResponse.json({ error: 'Examen no encontrado' }, { status: 404 });
  }

  const now = new Date().toISOString();

  db.examenes[examIndex] = {
    ...db.examenes[examIndex],
    ...updates,
    fechaActualizacion: now,
  };

  writeDb(db);
  return NextResponse.json(db.examenes[examIndex]);
}
