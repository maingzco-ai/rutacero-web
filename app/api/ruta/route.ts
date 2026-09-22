const PYTHON_API_URL =
  process.env.RUTACERO_API_URL ?? 'http://127.0.0.1:8000';

type PasajeroIn = {
  nombre: string;
  ubicacion: string;
  destino?: string;
};

type RutaBody = {
  origen: string;
  destino: string;
  pasajeros?: PasajeroIn[];
  cupos?: number;
};

export async function POST(request: Request) {
  let body: RutaBody;
  try {
    body = (await request.json()) as RutaBody;
  } catch {
    return Response.json(
      { error: 'JSON inválido en el cuerpo de la petición.' },
      { status: 400 },
    );
  }

  const { origen, destino, pasajeros = [], cupos = 3 } = body ?? {};

  if (!origen?.trim() || !destino?.trim()) {
    return Response.json(
      { error: "Campos 'origen' y 'destino' son obligatorios." },
      { status: 400 },
    );
  }
  if (!Number.isInteger(cupos) || cupos < 1 || cupos > 8) {
    return Response.json(
      { error: "Campo 'cupos' debe ser un entero entre 1 y 8." },
      { status: 400 },
    );
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${PYTHON_API_URL}/api/calcular-ruta`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ origen, destino, pasajeros, cupos }),
    });
  } catch {
    return Response.json(
      {
        error:
          'Backend Python no disponible. Inicia `python api_server.py` (puerto 8000).',
      },
      { status: 502 },
    );
  }

  const data = await upstream.json().catch(() => null);
  return Response.json(data, { status: upstream.status });
}

export async function GET() {
  return Response.json({
    ok: true,
    uso: 'POST /api/ruta con { origen, destino, pasajeros[], cupos }',
    upstream: `${PYTHON_API_URL}/api/calcular-ruta`,
  });
}
