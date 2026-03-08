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
  return NextResponse.json(db.pacientes);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = readDb();

    const now = new Date();
    const pacienteId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    const fecha = now.toLocaleDateString('es-ES', { timeZone: 'America/Caracas' });
    const isoDate = now.toISOString();

    const paciente = {
      id: pacienteId,
      nombre: body.nombre,
      edad: body.edad,
      telefono: body.telefono,
      fecha,
      examenes: body.examenes,
      cedula: body.cedula,
      direccion: body.direccion,
    };

    const nuevosExamenes = body.examenes.map((tipo: string) => ({
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      pacienteId,
      tipo,
      estado: 'pendiente',
      fechaCreacion: isoDate,
      fechaActualizacion: isoDate,
    }));

    db.pacientes.push(paciente);
    db.examenes.push(...nuevosExamenes);
    writeDb(db);

    return NextResponse.json({ paciente, examenes: nuevosExamenes });
  } catch (error) {
    console.error('Error in POST /api/pacientes:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
