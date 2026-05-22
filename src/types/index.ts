export type TipoExamen =
  | 'dengue'
  | 'frotis_sangre'
  | 'glicemia_pre_post'
  | 'heces'
  | 'heces_hematologia'
  | 'hematologia'
  | 'hematologia_orina'
  | 'helicobacter_pylori'
  | 'hematologia_quimica'
  | 'hematologia_serologia'
  | 'hemoglobina_hematocritos'
  | 'hemoparasitos'
  | 'nuevo_completo'
  | 'orina_heces'
  | 'orina'
  | 'prueba_embarazo'
  | 'quimica_colinesterasa'
  | 'quimica_corta'
  | 'quimica_heces'
  | 'quimica_orina'
  | 'quimica_serologia'
  | 'quimica'
  | 'serologia_asto_psa_pylori'
  | 'serologia_heces'
  | 'serologia_orina'
  | 'serologia'
  | 'tipo_sangre'
  | 'vdrl_hepatitis';

export type EstadoExamen = 'pendiente' | 'en_proceso' | 'completo' | 'enviado';

export interface Paciente {
  id: string;
  nombre: string;
  edad: number;
  telefono: string;
  fecha: string;
  examenes: TipoExamen[];
  cedula: string;
  direccion: string;
}

export interface ResultadosOrina {
  color: string;
  aspecto: string;
  densidad: string;
  ph: string;
  proteinas: string;
  glucosa: string;
  cetonas: string;
  sangre: string;
  leucocitos: string;
  nitritos: string;
  observaciones: string;
}

export interface ResultadosHeces {
  aspecto: string;
  reaccion: string;
  color: string;
  consistencia: string;
  moco: string;
  sangre: string;
  microscopicoLeucocitos: string;
  microscopicoEritrocitos: string;
  microscopicoConidias: string;
  microscopicoOtro: string;
  noElementosParasitarios: boolean;
  huevosAscarisLumbricoides: boolean;
  huevosTricocefalos: boolean;
  larvasAncylostomideos: boolean;
  prequisteAmebaSp: boolean;
  quistesAmebaColi: boolean;
  quistesBlastocystisHominis: boolean;
  quistesEndolimaxNana: boolean;
  quistesEntamoebaHistolytica: boolean;
  quistesGiardicaLamblia: boolean;
  quistesIodamoebaBusthlli: boolean;
  trofositosChilomastixMessmilli: boolean;
  complementarioSangreOculta: string;
  complementarioSangreOculta2: string;
  complementarioAzucaresReductores: string;
  complementarioOtro: string;
  observaciones: string;
  ph?: string;
  mucus?: string;
  leucocitos?: string;
  parasitos?: string;
}

export interface ResultadosHematologia {
  leucocitos: string;
  hematies: string;
  hemoglobina: string;
  hematocrito: string;
  segmentados: string;
  linfocitos: string;
  eosinofilos: string;
  otros: string;
  sedimentacion_1h: string;
  sedimentacion_2h: string;
  plaquetas: string;
  t_protrombina: string;
  t_protrombina_control: string;
  inr: string;
  razon_pc: string;
  ptt: string;
  ptt_control: string;
  t_sangria: string;
  t_coagulacion: string;
  observaciones: string;
}

export interface ResultadosHematologiaCompleta {
  hemoglobina: string;
  hematocrito: string;
  leucocitos: string;
  neutrofilos: string;
  linfocitos: string;
  monocitos: string;
  eosinofilos: string;
  plaquetas: string;
  vcm: string;
  hcm: string;
  chcm: string;
  rdw: string;
  mpv: string;
  observaciones: string;
}

export interface ResultadosDengue {
  IgG: string;
  IgM: string;
  observaciones: string;
}

export interface ResultadosQuimica {
  glucosa: string;
  urea: string;
  creatinina: string;
  acidoUrico: string;
  colesterolTotal: string;
  trigliceridos: string;
  hdl: string;
  ldl: string;
  proteinasTotales: string;
  albumina: string;
  bilirrubinaTotal: string;
  bilirrubinaDirecta: string;
  tgo: string;
  tgp: string;
  fosfatasaAlcalina: string;
  ggt: string;
  ldh: string;
  amilasa: string;
  lipasa: string;
  sodio: string;
  potasio: string;
  cloro: string;
  calcio: string;
  fosforo: string;
  observaciones: string;
}

export interface ResultadosGlicemia {
  glucosaAyunas: string;
  glucosaPostprandial: string;
  observaciones: string;
}

export interface ResultadosHematologiaQuimica {
  hemoglobina: string;
  hematocrito: string;
  leucocitos: string;
  neutrofilos: string;
  linfocitos: string;
  monocitos: string;
  eosinofilos: string;
  plaquetas: string;
  vcm: string;
  hcm: string;
  chcm: string;
  rdw: string;
  mpv: string;
  glucosa: string;
  urea: string;
  creatinina: string;
  acidoUrico: string;
  colesterolTotal: string;
  trigliceridos: string;
  hdl: string;
  ldl: string;
  tgo: string;
  tgp: string;
  observaciones: string;
}

export interface ResultadosHematologiaSerologia {
  hemoglobina: string;
  hematocrito: string;
  leucocitos: string;
  neutrofilos: string;
  linfocitos: string;
  monocitos: string;
  eosinofilos: string;
  plaquetas: string;
  vcm: string;
  hcm: string;
  chcm: string;
  rdw: string;
  mpv: string;
  vdrl: string;
  rpr: string;
  vih: string;
  hepatitisB: string;
  hepatitisC: string;
  observaciones: string;
}

export interface ResultadosHemoglobinaHematocritos {
  hemoglobina: string;
  hematocrito: string;
  globulosRojos: string;
  observaciones: string;
}

export interface ResultadosHemoparasitos {
  plasmodium: string;
  resultado: string;
  observaciones: string;
}

export interface ResultadosOrinaHeces {
  color: string;
  aspecto: string;
  densidad: string;
  ph: string;
  proteinas: string;
  glucosa: string;
  cetonas: string;
  sangre: string;
  leucocitos: string;
  nitritos: string;
  colorHeces: string;
  consistenciaHeces: string;
  mucusHeces: string;
  sangreHeces: string;
  phHeces: string;
  leucocitosHeces: string;
  parasitos: string;
  observaciones: string;
}

export interface ResultadosQuimicaColinesterasa {
  Colinesterasa: string;
  observaciones: string;
}

export interface ResultadosQuimicaCorta {
  glucosa: string;
  urea: string;
  creatinina: string;
  acidoUrico: string;
  colesterolTotal: string;
  trigliceridos: string;
  observaciones: string;
}

export interface ResultadosQuimicaHeces {
  glucosa: string;
  urea: string;
  creatinina: string;
  acidoUrico: string;
  colesterolTotal: string;
  trigliceridos: string;
  hdl: string;
  ldl: string;
  proteinasTotales: string;
  albumina: string;
  bilirrubinaTotal: string;
  bilirrubinaDirecta: string;
  tgo: string;
  tgp: string;
  fosfatasaAlcalina: string;
  ggt: string;
  ldh: string;
  amilasa: string;
  lipasa: string;
  colorHeces: string;
  consistenciaHeces: string;
  mucusHeces: string;
  sangreHeces: string;
  phHeces: string;
  leucocitosHeces: string;
  parasitos: string;
  observaciones: string;
}

export interface ResultadosQuimicaOrina {
  glucosa: string;
  urea: string;
  creatinina: string;
  acidoUrico: string;
  colesterolTotal: string;
  trigliceridos: string;
  hdl: string;
  ldl: string;
  proteinasTotales: string;
  albumina: string;
  bilirrubinaTotal: string;
  bilirrubinaDirecta: string;
  tgo: string;
  tgp: string;
  fosfatasaAlcalina: string;
  ggt: string;
  ldh: string;
  amilasa: string;
  lipasa: string;
  colorOrina: string;
  aspectoOrina: string;
  densidadOrina: string;
  phOrina: string;
  proteinasOrina: string;
  glucosaOrina: string;
  cetonasOrina: string;
  sangreOrina: string;
  leucocitosOrina: string;
  nitritosOrina: string;
  observaciones: string;
}

export interface ResultadosQuimicaSerologia {
  glucosa: string;
  urea: string;
  creatinina: string;
  acidoUrico: string;
  colesterolTotal: string;
  trigliceridos: string;
  hdl: string;
  ldl: string;
  proteinasTotales: string;
  albumina: string;
  bilirrubinaTotal: string;
  bilirrubinaDirecta: string;
  tgo: string;
  tgp: string;
  fosfatasaAlcalina: string;
  ggt: string;
  ldh: string;
  amilasa: string;
  lipasa: string;
  vdrl: string;
  rpr: string;
  vih: string;
  hepatitisB: string;
  hepatitisC: string;
  observaciones: string;
}

export interface ResultadosSerologia {
  vdrl: string;
  rpr: string;
  vih: string;
  hepatitisB: string;
  hepatitisC: string;
  toxoplasmosis: string;
  rubéola: string;
  cmv: string;
  herpes: string;
  observaciones: string;
}

export interface ResultadosSerologiaAstoPsaPylori {
  asto: string;
  psa: string;
  helicobacter: string;
  observaciones: string;
}

export interface ResultadosSerologiaHeces {
  vdrl: string;
  rpr: string;
  vih: string;
  hepatitisB: string;
  hepatitisC: string;
  colorHeces: string;
  consistenciaHeces: string;
  mucusHeces: string;
  sangreHeces: string;
  phHeces: string;
  leucocitosHeces: string;
  parasitos: string;
  observaciones: string;
}

export interface ResultadosSerologiaOrina {
  vdrl: string;
  rpr: string;
  vih: string;
  hepatitisB: string;
  hepatitisC: string;
  colorOrina: string;
  aspectoOrina: string;
  densidadOrina: string;
  phOrina: string;
  proteinasOrina: string;
  glucosaOrina: string;
  cetonasOrina: string;
  sangreOrina: string;
  leucocitosOrina: string;
  nitritosOrina: string;
  observaciones: string;
}

export interface ResultadosTipoSangre {
  grupo: string;
  factor: string;
  observaciones: string;
}

export interface ResultadosVDRLHepatitis {
  vdrl: string;
  rpr: string;
  hepatitisB: string;
  hepatitisC: string;
  hepatitisA: string;
  observaciones: string;
}

export interface ResultadosFrotisSangre {
  morfologia: string;
  parasites: string;
  observaciones: string;
}

export interface ResultadosPruebaEmbarazo {
  resultado: string;
  valor: string;
  observaciones: string;
}

export interface ResultadosHelicobacterPylori {
  resultado: string;
  metodo: string;
  observaciones: string;
}

export interface ResultadosNuevoCompleto {
  hemoglobina: string;
  hematocrito: string;
  leucocitos: string;
  neutrofilos: string;
  linfocitos: string;
  monocitos: string;
  eosinofilos: string;
  plaquetas: string;
  vcm: string;
  hcm: string;
  chcm: string;
  rdw: string;
  mpv: string;
  glucosa: string;
  urea: string;
  creatinina: string;
  acidoUrico: string;
  colesterolTotal: string;
  trigliceridos: string;
  hdl: string;
  ldl: string;
  proteinasTotales: string;
  albumina: string;
  bilirrubinaTotal: string;
  bilirrubinaDirecta: string;
  tgo: string;
  tgp: string;
  fosfatasaAlcalina: string;
  ggt: string;
  ldh: string;
  amilasa: string;
  lipasa: string;
  vdrl: string;
  rpr: string;
  colorOrina: string;
  aspectoOrina: string;
  densidadOrina: string;
  phOrina: string;
  proteinasOrina: string;
  glucosaOrina: string;
  cetonasOrina: string;
  sangreOrina: string;
  leucocitosOrina: string;
  nitritosOrina: string;
  colorHeces: string;
  consistenciaHeces: string;
  mucusHeces: string;
  sangreHeces: string;
  phHeces: string;
  leucocitosHeces: string;
  parasitos: string;
  observaciones: string;
}

export type ResultadosExamen =
  | ResultadosOrina
  | ResultadosHeces
  | ResultadosHematologia
  | ResultadosDengue
  | ResultadosQuimica
  | ResultadosGlicemia
  | ResultadosHematologiaQuimica
  | ResultadosHematologiaSerologia
  | ResultadosHemoglobinaHematocritos
  | ResultadosHemoparasitos
  | ResultadosOrinaHeces
  | ResultadosQuimicaColinesterasa
  | ResultadosQuimicaCorta
  | ResultadosQuimicaHeces
  | ResultadosQuimicaOrina
  | ResultadosQuimicaSerologia
  | ResultadosSerologia
  | ResultadosSerologiaAstoPsaPylori
  | ResultadosSerologiaHeces
  | ResultadosSerologiaOrina
  | ResultadosTipoSangre
  | ResultadosVDRLHepatitis
  | ResultadosFrotisSangre
  | ResultadosPruebaEmbarazo
  | ResultadosHelicobacterPylori
  | ResultadosNuevoCompleto;

export interface Examen {
  id: string;
  pacienteId: string;
  tipo: TipoExamen;
  estado: EstadoExamen;
  resultados?: ResultadosExamen;
  doctorOrdenante?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  emailEnviado?: string;
}
