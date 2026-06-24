import { useState, useEffect } from "react";

// ── SUPABASE ──
const SUPABASE_URL = "https://wfnzlwungqveojrvapiv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indmbnpsd3VuZ3F2ZW9qcnZhcGl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMjE1MDQsImV4cCI6MjA5Nzc5NzUwNH0.-F0Krj1jywct4QNtWmLK-NP2qre8cr-9TDPG6vTStbM";

const sbFetch = (path, opts={}) => fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
  headers:{
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
    "Prefer": "return=representation",
    ...(opts.headers||{}),
  },
  ...opts,
});

const loadRegistros = async () => {
  try {
    const res = await sbFetch("registros?select=*");
    const data = await res.json();
    const records = {};
    (Array.isArray(data)?data:[]).forEach(r => { records[r.id] = r; });
    return records;
  } catch(e) { return {}; }
};

const upsertRegistro = async (id, record) => {
  try {
    await sbFetch("registros", {
      method: "POST",
      headers: {"Prefer":"resolution=merge-duplicates,return=representation"},
      body: JSON.stringify({id, ...record}),
    });
  } catch(e) { console.error("upsert error",e); }
};

const deleteRegistro = async (id) => {
  try {
    await sbFetch(`registros?id=eq.${id}`, {method:"DELETE"});
  } catch(e) { console.error("delete error",e); }
};

const signIn = async (email, password) => {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "X-Client-Info": "supabase-js/2.0.0",
    },
    body: JSON.stringify({ email, password, gotrue_meta_security: {} }),
  });
  const data = await res.json();
  if(data.error || data.error_code) {
    throw new Error(data.error_description || data.msg || data.error || "Credenciales incorrectas");
  }
  return data;
};

const SPOTS_DATA = [
  {id:59,torre:"1060",depto:"A1",sector:1,gx:1,gy:0},{id:39,torre:"1036",depto:"A1",sector:1,gx:1,gy:1},
  {id:41,torre:"1080",depto:"A1",sector:1,gx:1,gy:2},{id:46,torre:"1038",depto:"A1",sector:1,gx:1,gy:3},
  {id:62,torre:"1080",depto:"B2",sector:1,gx:2,gy:0},{id:51,torre:"1036",depto:"B2",sector:1,gx:2,gy:1},
  {id:60,torre:"1060",depto:"B2",sector:1,gx:2,gy:2},{id:47,torre:"1080",depto:"C3",sector:1,gx:3,gy:0},
  {id:49,torre:"1036",depto:"C3",sector:1,gx:3,gy:1},{id:53,torre:"1060",depto:"C3",sector:1,gx:3,gy:2},
  {id:48,torre:"1036",depto:"D4",sector:1,gx:4,gy:0},{id:58,torre:"1060",depto:"D4",sector:1,gx:4,gy:1},
  {id:43,torre:"1080",depto:"D4",sector:1,gx:4,gy:2},{id:64,torre:"1080",depto:"E5",sector:1,gx:5,gy:0},
  {id:45,torre:"1036",depto:"E5",sector:1,gx:5,gy:1},{id:56,torre:"1060",depto:"E5",sector:1,gx:5,gy:2},
  {id:50,torre:"1080",depto:"F6",sector:1,gx:6,gy:0},{id:54,torre:"1060",depto:"F6",sector:1,gx:6,gy:1},
  {id:63,torre:"1038",depto:"F6",sector:1,gx:6,gy:2},{id:40,torre:"1080",depto:"G7",sector:1,gx:7,gy:0},
  {id:57,torre:"1060",depto:"G7",sector:1,gx:7,gy:1},{id:42,torre:"1036",depto:"G7",sector:1,gx:7,gy:2},
  {id:55,torre:"1038",depto:"G7",sector:1,gx:7,gy:3},{id:61,torre:"1080",depto:"H8",sector:1,gx:8,gy:0},
  {id:52,torre:"1060",depto:"H8",sector:1,gx:8,gy:1},{id:44,torre:"1036",depto:"H8",sector:1,gx:8,gy:2},
  {id:33,torre:"1052",depto:"B2",sector:2,gx:2,gy:0},{id:38,torre:"1038",depto:"B2",sector:2,gx:2,gy:1},
  {id:27,torre:"1038",depto:"C3",sector:2,gx:3,gy:0},{id:28,torre:"1052",depto:"C3",sector:2,gx:3,gy:1},
  {id:37,torre:"1038",depto:"D4",sector:2,gx:4,gy:0},{id:29,torre:"1052",depto:"D4",sector:2,gx:4,gy:1},
  {id:36,torre:"1038",depto:"E5",sector:2,gx:5,gy:0},{id:32,torre:"1052",depto:"F6",sector:2,gx:6,gy:0},
  {id:31,torre:"1036",depto:"F6",sector:2,gx:6,gy:1},{id:35,torre:"1052",depto:"G7",sector:2,gx:7,gy:0},
  {id:30,torre:"1052",depto:"H8",sector:2,gx:8,gy:0},{id:34,torre:"1038",depto:"H8",sector:2,gx:8,gy:1},
  {id:1,torre:"1081",depto:"A1",sector:3,gx:1,gy:0},{id:12,torre:"1061",depto:"A1",sector:3,gx:1,gy:1},
  {id:21,torre:"1052",depto:"A1",sector:3,gx:1,gy:2},{id:6,torre:"1054",depto:"A1",sector:3,gx:1,gy:3},
  {id:8,torre:"1081",depto:"B2",sector:3,gx:2,gy:0},{id:13,torre:"1061",depto:"B2",sector:3,gx:2,gy:1},
  {id:5,torre:"1054",depto:"B2",sector:3,gx:2,gy:2},{id:3,torre:"1081",depto:"C3",sector:3,gx:3,gy:0},
  {id:14,torre:"1061",depto:"C3",sector:3,gx:3,gy:1},{id:23,torre:"1054",depto:"C3",sector:3,gx:3,gy:2},
  {id:9,torre:"1061",depto:"D4",sector:3,gx:4,gy:0},{id:11,torre:"1081",depto:"D4",sector:3,gx:4,gy:1},
  {id:18,torre:"1054",depto:"D4",sector:3,gx:4,gy:2},{id:2,torre:"1081",depto:"E5",sector:3,gx:5,gy:0},
  {id:4,torre:"1054",depto:"E5",sector:3,gx:5,gy:1},{id:16,torre:"1052",depto:"E5",sector:3,gx:5,gy:2},
  {id:10,torre:"1061",depto:"E6",sector:3,gx:6,gy:0},{id:15,torre:"1061",depto:"F5",sector:3,gx:6,gy:1},
  {id:7,torre:"1081",depto:"F6",sector:3,gx:7,gy:0},{id:19,torre:"1054",depto:"F6",sector:3,gx:7,gy:1},
  {id:17,torre:"1054",depto:"G7",sector:3,gx:8,gy:0},{id:20,torre:"1061",depto:"G7",sector:3,gx:8,gy:1},
  {id:25,torre:"1081",depto:"G7",sector:3,gx:8,gy:2},{id:22,torre:"1081",depto:"H8",sector:3,gx:9,gy:0},
  {id:24,torre:"1054",depto:"H8",sector:3,gx:9,gy:1},{id:26,torre:"1061",depto:"H8",sector:3,gx:9,gy:2},
];

const BY_TD = {};
SPOTS_DATA.forEach(s => { BY_TD[`${s.torre}-${s.depto}`] = s; });

const SECTOR_NAMES = {1:"3 Oriente / 12 Norte",2:"Patio Central",3:"4 Oriente / 12 Norte"};

// Colores más visibles (claros sobre fondo oscuro)
const SC = {
  1:{bg:"#166534",border:"#22c55e",spotFill:"#14532d",spotOcc:"#16a34a",accent:"#4ade80",text:"#bbf7d0"},
  2:{bg:"#581c87",border:"#a855f7",spotFill:"#4c1d95",spotOcc:"#7c3aed",accent:"#c084fc",text:"#e9d5ff"},
  3:{bg:"#9a3412",border:"#f97316",spotFill:"#7c2d12",spotOcc:"#c2410c",accent:"#fb923c",text:"#fed7aa"},
};

const TORRES = ["1036","1038","1052","1054","1060","1061","1080","1081"];
const DEPTOS_ALL = ["A1","B2","C3","D4","E5","E6","F5","F6","G7","H8"];

function emptyForm() {
  return {torre:"",depto:"",tipoResidente:"",nombre:"",email:"",telefono:"",usoEstacionamiento:"",
    vehiculos:[{patente:"",marca:"",color:"",esVisita:"no"}]};
}

// ── SECTOR MAP — SVG con coordenadas absolutas, layout fiel a imágenes ──
const SPOT_INFO = {};
SPOTS_DATA.forEach(s => { SPOT_INFO[s.id] = s; });

// Constantes de celda
const SW=90, SH=40, G=4, RD=28, DW=88, PAD=6, NBH=SH*2+G;

// Colores sector
const SC_MAP = {1:{occ:'#14532d',acc:'#22c55e'},2:{occ:'#4c1d95',acc:'#a855f7'},3:{occ:'#7c2d12',acc:'#f97316'}};

const SectorMap = ({sectorId, records, onSpotClick, highlightId}) => {
  // Construir SVG como string y renderizar con dangerouslySetInnerHTML
  const sec = sectorId;

  // helpers
  const spotEl = (id,x,y,w=SW,h=SH) => {
    const occ=!!records[id], hl=id===highlightId;
    const sc=SC_MAP[SPOT_INFO[id]?.sector||sec];
    const fill=hl?'#facc15':occ?sc.occ:'#1e2d45';
    const stk=hl?'#fde047':occ?sc.acc:'#2d4060';
    const sw=hl?2.5:occ?1.5:1;
    const nc=hl?'#0f172a':occ?'#ffffff':'#4a6080'; // número SIEMPRE visible
    const sc2=hl?'#1e3a5f':occ?'rgba(255,255,255,.6)':'#2d3f55';
    const inf=SPOT_INFO[id];
    const halo=hl?`<rect x="${x-3}" y="${y-3}" width="${w+6}" height="${h+6}" rx="7" fill="none" stroke="#facc15" stroke-width="2" opacity=".5"/>`:'';
    const pat=occ&&records[id].patentes?.[0]?`<text x="${x+w/2}" y="${y-6}" text-anchor="middle" font-size="6" font-family="monospace" font-weight="700" fill="${sc.acc}">${records[id].patentes[0]}</text>`:'';
    return `${pat}<g style="cursor:pointer" data-id="${id}">
      <rect x="${x+1}" y="${y+2}" width="${w}" height="${h}" rx="4" fill="rgba(0,0,0,.28)"/>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${fill}" stroke="${stk}" stroke-width="${sw}"/>
      <text x="${x+w/2}" y="${y+h*.42}" text-anchor="middle" dominant-baseline="middle" font-size="11" font-weight="900" font-family="monospace" fill="${nc}">#${id}</text>
      ${inf?`<text x="${x+w/2}" y="${y+h*.78}" text-anchor="middle" dominant-baseline="middle" font-size="6.5" font-family="monospace" fill="${sc2}">${inf.t} ${inf.d}</text>`:''}
      ${halo}
    </g>`;
  };

  const doorEl = (x,y,w,h,lines) => {
    const mid=h/(lines.length+1);
    const txts=lines.map((l,i)=>`<text x="${x+w/2}" y="${y+mid*(i+1)}" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="monospace" font-weight="700" fill="#bfdbfe">${l}</text>`).join('');
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="#1d4ed8" stroke="#3b82f6" stroke-width="1"/>${txts}`;
  };

  const emergEl = (x,y,w,h,lines) => {
    const mid=h/(lines.length+1);
    const txts=lines.map((l,i)=>`<text x="${x+w/2}" y="${y+mid*(i+1)}" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="monospace" font-weight="700" fill="#fef08a">${l}</text>`).join('');
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="#854d0e" stroke="#fbbf24" stroke-width="1.5"/>${txts}`;
  };

  const nbEl = (x,y,w,h) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="#450a0a" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4,2"/>
     <text x="${x+w/2}" y="${y+h*.28}" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="monospace" font-weight="700" fill="#fca5a5">Zona con</text>
     <text x="${x+w/2}" y="${y+h*.50}" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="monospace" font-weight="700" fill="#fca5a5">prohibición de</text>
     <text x="${x+w/2}" y="${y+h*.72}" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="monospace" font-weight="700" fill="#fca5a5">bloquear</text>`;

  const roadEl = (W,H,lt,rt) =>
    `<rect x="0" y="0" width="${W}" height="${RD}" fill="#1e3358"/>
     <rect x="0" y="${H-RD}" width="${W}" height="${RD}" fill="#1e3358"/>
     <line x1="0" y1="${RD/2}" x2="${W}" y2="${RD/2}" stroke="#facc15" stroke-width="1.5" stroke-dasharray="10,5" opacity=".7"/>
     <line x1="0" y1="${H-RD/2}" x2="${W}" y2="${H-RD/2}" stroke="#facc15" stroke-width="1.5" stroke-dasharray="10,5" opacity=".7"/>
     <text x="8" y="${RD/2}" text-anchor="start" dominant-baseline="middle" font-size="8" font-family="monospace" font-weight="700" fill="#facc15">${lt}</text>
     <text x="${W-8}" y="${H-RD/2}" text-anchor="end" dominant-baseline="middle" font-size="8" font-family="monospace" font-weight="700" fill="#facc15">${rt}</text>`;

  const lblEl = (x,y,lines,fill='#334155',sz=9) =>
    lines.map((l,i)=>`<text x="${x}" y="${y+i*13}" text-anchor="middle" dominant-baseline="middle" font-size="${sz}" font-family="monospace" font-weight="700" fill="${fill}">${l}</text>`).join('');

  let svg='', W=0, H=0;

  if(sec===1){
    // Col izq: 64,63,62,61,60,59,58 | EMERG | 57,56,55,54,53,52
    // Col der: 51,50,49,48,47,46,45 | EMERG | 44,43,42,41,40,39
    const cI=[64,63,62,61,60,59,58], cD=[51,50,49,48,47,46,45];
    const bI=[57,56,55,54,53,52],    bD=[44,43,42,41,40,39];
    const PASO=200;
    W=PAD+DW+G+SW+G+PASO+G+SW+G+DW+PAD;
    const rows=cI.length+1+bI.length;
    H=RD+PAD+rows*(SH+G)-G+PAD+RD;
    const xL=PAD+DW+G, xR=W-PAD-DW-G-SW, y0=RD+PAD;
    svg+=`<rect width="${W}" height="${H}" fill="#0f172a" rx="8"/>`;
    svg+=roadEl(W,H,'← Salida 3 oriente','Salida 4 Oriente →');
    svg+=doorEl(PAD,4,DW,RD-6,['Puerta de','acceso 1080']);
    svg+=doorEl(W-PAD-DW,4,DW,RD-6,['Puerta de','acceso 1036']);
    svg+=lblEl(W/2,y0+cI.length*(SH+G)/2-6,['Estacionamiento 3 Oriente /','12 Norte']);
    cI.forEach((id,i)=>{svg+=spotEl(id,xL,y0+i*(SH+G));});
    cD.forEach((id,i)=>{svg+=spotEl(id,xR,y0+i*(SH+G));});
    const yE=y0+cI.length*(SH+G);
    svg+=doorEl(PAD,yE,DW,SH,['Puerta de','acceso 1080']);
    svg+=emergEl(xL,yE,SW,SH,['Salida','emergencia']);
    svg+=emergEl(xR,yE,SW,SH,['Salida','emergencia']);
    svg+=doorEl(W-PAD-DW,yE,DW,SH,['Puerta de','acceso 1038']);
    const yB=yE+SH+G;
    bI.forEach((id,i)=>{svg+=spotEl(id,xL,yB+i*(SH+G));});
    bD.forEach((id,i)=>{svg+=spotEl(id,xR,yB+i*(SH+G));});
  }

  if(sec===2){
    const der=[38,37,36,35,34,33,32,31,30,29];
    const PASO=180;
    W=PAD+SW+G+PASO+G+SW+G+DW+PAD;
    const izqH=NBH+G+SH+G+SH+G+SH+G+SH+G+NBH;
    const derH=der.length*(SH+G)-G;
    const contH=Math.max(izqH,derH);
    H=RD+PAD+contH+PAD+RD;
    const xI=PAD, xD=W-PAD-DW-G-SW, xDr=W-PAD-DW, y0=RD+PAD;
    svg+=`<rect width="${W}" height="${H}" fill="#0f172a" rx="8"/>`;
    svg+=roadEl(W,H,'← Salida 3 Oriente','Salida 4 Oriente →');
    svg+=doorEl(xDr,4,DW,RD-6,['Puerta de','acceso 1038']);
    // col izq
    let y=y0;
    svg+=nbEl(xI,y,SW,NBH); y+=NBH+G;
    svg+=spotEl(28,xI,y); y+=SH+G;
    y+=SH+G;
    svg+=spotEl(27,xI,y); y+=SH+G;
    y+=SH+G;
    svg+=nbEl(xI,y,SW,NBH);
    svg+=lblEl(PAD+SW+G+PASO/2,y0+contH/2-6,['Estacionamientos','Patio Central']);
    der.forEach((id,i)=>{svg+=spotEl(id,xD,y0+i*(SH+G));});
    // barra puerta vertical
    svg+=`<rect x="${xDr}" y="${y0}" width="${DW}" height="${contH}" rx="4" fill="#1d4ed8" stroke="#3b82f6" stroke-width="1"/>
          <text x="${xDr+DW/2}" y="${y0+contH/2}" text-anchor="middle" dominant-baseline="middle" font-size="7.5" font-family="monospace" font-weight="700" fill="#bfdbfe" transform="rotate(-90,${xDr+DW/2},${y0+contH/2})">Puerta de acceso 1052</text>`;
    svg+=doorEl(xDr,H-RD+2,DW,RD-6,['Puerta de','acceso 1052']);
  }

  if(sec===3){
    // ── SECTOR 3 — layout exacto desde imagen ──
    // Estructura vertical (top→bot):
    // [ROAD norte]
    // [barra gris] — calle de acceso norte
    // [vacío | 6 | 5 | 4 | 3 | 2 | 1 | vacío]  fila top spots
    // [P.1052 | amarillo | vacío...vacío | amarillo | P.1081]  fila puertas
    // [vacío | vacío | Comedor+Camarines (ancho) | 7 | vacío]
    // [vacío | vacío | vacío              | 8 | vacío]
    // [vacío | 18 | vacío(pasillo) | 9  | vacío]
    // [vacío | 19 |                | 10 | vacío]
    // [vacío | 20 |                | 11 | vacío]
    // [P.1052| 21 | "Estac. label" | 12 | P.1061]
    // [vacío | 22 |                | 13 | vacío]
    // [vacío | 23 |                | 14 | vacío]
    // [vacío | 24 |                | 15 | vacío]
    // [vacío | 25 |                | 16 | vacío]
    // [vacío | 26 |                | 17 | vacío]
    // [ROAD sur — Salida 3 Oriente / Salida 4 Oriente]

    const SP = SW; // spot width
    const PASO = 200; // pasillo central
    const YGAP = G;
    // Ancho total: PAD + DW(puerta) + G + SP + G + PASO + G + SP + G + DW + PAD
    W = PAD + DW + G + SP + G + PASO + G + SP + G + DW + PAD;

    // Posiciones X clave
    const xDL = PAD;                    // puerta izq
    const xCL = PAD + DW + G;           // col izq spots
    const xPaso = xCL + SP + G;         // inicio pasillo
    const xCR = xPaso + PASO + G;       // col der spots
    const xDR = xCR + SP + G;           // puerta der

    // Posiciones Y
    const yGray = RD;                   // barra gris
    const grayH = 16;
    const yTopSpots = yGray + grayH + G;
    const yDoors = yTopSpots + SH + G;  // fila puertas 1052/1081
    const doorH = 40;
    const yComedor = yDoors + doorH + G;
    const comedorH = SH + 16;           // comedor más alto que un spot
    const y8 = yComedor + comedorH + G; // spot 8 solo
    const yBody = y8 + SH + G;          // empieza col 18..26 / 9..17

    const cI = [18,19,20,21,22,23,24,25,26]; // 9 spots col izq
    const cD = [9,10,11,12,13,14,15,16,17];  // 9 spots col der
    const bodyRows = Math.max(cI.length, cD.length); // 9
    const bodyH = bodyRows * (SH + YGAP) - YGAP;

    H = yBody + bodyH + PAD + RD;

    svg += `<rect width="${W}" height="${H}" fill="#0f172a" rx="8"/>`;
    svg += roadEl(W, H, '← Salida 3 Oriente', 'Salida 4 Oriente →');

    // Barra gris norte
    svg += `<rect x="0" y="${yGray}" width="${W}" height="${grayH}" fill="#1a2535" stroke="#1e3a5f" stroke-width="1"/>`;

    // Fila top: 6 spots centrados
    const top = [6,5,4,3,2,1];
    const tW = top.length*(SP+G)-G;
    const tX = (W - tW) / 2;
    top.forEach((id,i) => { svg += spotEl(id, tX+i*(SP+G), yTopSpots, SP, SH); });

    // Fila puertas: P.1052 izq, celda amarilla, ...espacio..., celda amarilla, P.1081 der
    svg += doorEl(xDL, yDoors, DW, doorH, ['Puerta de','acceso 1052']);
    svg += `<rect x="${xCL}" y="${yDoors}" width="${SP}" height="${doorH}" rx="4" fill="#facc15" stroke="#b45309" stroke-width="1.5"/>`;
    svg += doorEl(xDR, yDoors, DW, doorH, ['Puerta de','acceso 1081']);
    svg += `<rect x="${xCR}" y="${yDoors}" width="${SP}" height="${doorH}" rx="4" fill="#facc15" stroke="#b45309" stroke-width="1.5"/>`;

    // Comedor y Camarines — ocupa parte del pasillo, alineado al centro-izq
    const comX = xPaso;
    const comW = PASO * 0.65 | 0;
    svg += `<rect x="${comX}" y="${yComedor}" width="${comW}" height="${comedorH}" rx="4" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>`;
    svg += `<text x="${comX+comW/2}" y="${yComedor+comedorH/2-6}" text-anchor="middle" dominant-baseline="middle" font-size="8" font-family="monospace" font-weight="700" fill="#64748b">Comedor y</text>`;
    svg += `<text x="${comX+comW/2}" y="${yComedor+comedorH/2+7}" text-anchor="middle" dominant-baseline="middle" font-size="8" font-family="monospace" font-weight="700" fill="#64748b">Camarines</text>`;

    // Spot 7 — a la derecha del comedor, misma fila
    svg += spotEl(7, xCR, yComedor, SP, comedorH);

    // Spot 8 — solo, col der, fila siguiente
    svg += spotEl(8, xCR, y8, SP, SH);

    // Col izq: 18..26
    cI.forEach((id,i) => { svg += spotEl(id, xCL, yBody+i*(SH+YGAP)); });

    // Col der: 9..17
    cD.forEach((id,i) => { svg += spotEl(id, xCR, yBody+i*(SH+YGAP)); });

    // Puertas mid: P.1052 izq fila 3 (junto a spot 21), P.1061 der fila 3 (junto a 12)
    const yMid = yBody + 3*(SH+YGAP);
    svg += doorEl(xDL, yMid, DW, SH, ['Puerta de','acceso 1052']);
    svg += doorEl(xDR, yMid, DW, SH, ['Puerta de','acceso 1061']);

    // Label central pasillo
    svg += `<text x="${xPaso+PASO/2}" y="${yBody+bodyH/2-6}" text-anchor="middle" dominant-baseline="middle" font-size="8" font-family="monospace" font-weight="700" fill="#1e3a5f">Estacionamiento</text>`;
    svg += `<text x="${xPaso+PASO/2}" y="${yBody+bodyH/2+8}" text-anchor="middle" dominant-baseline="middle" font-size="8" font-family="monospace" font-weight="700" fill="#1e3a5f">4 Oriente / 12 Norte</text>`;
  }

  const handleClick = (e) => {
    const g = e.target.closest('[data-id]');
    if(g && onSpotClick){
      const id=parseInt(g.getAttribute('data-id'));
      const sp=SPOTS_DATA.find(s=>s.id===id);
      if(sp) onSpotClick(sp);
    }
  };

  return (
    <div style={{overflowX:'auto',borderRadius:8}}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{display:'block',width:'100%',minWidth:320,borderRadius:8}}
        dangerouslySetInnerHTML={{__html:svg}}
        onClick={handleClick}/>
    </div>
  );
};

// ── Small components ──
const Toast = ({msg,type}) => (
  <div style={{position:"fixed",bottom:28,left:"50%",transform:"translateX(-50%)",
    background:type==="error"?"#7f1d1d":type==="info"?"#1e3a5f":"#064e3b",
    color:"white",padding:"12px 22px",borderRadius:12,fontSize:13,fontWeight:700,
    boxShadow:"0 8px 32px rgba(0,0,0,.4)",zIndex:400,whiteSpace:"nowrap",
    border:`1px solid ${type==="error"?"#dc2626":type==="info"?"#2563eb":"#16a34a"}`}}>
    {type==="error"?"❌":type==="info"?"🔓":"✅"} {msg}
  </div>
);

const RowItem = ({icon,label,value,mono}) => (
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid rgba(255,255,255,.07)",paddingBottom:10}}>
    <span style={{fontSize:13,color:"rgba(255,255,255,.5)"}}>{icon} {label}</span>
    <span style={{fontSize:14,fontWeight:700,color:"white",fontFamily:mono?"monospace":"inherit",letterSpacing:mono?2:0}}>{value||"—"}</span>
  </div>
);

const Legend = ({color,label}) => (
  <div style={{display:"flex",alignItems:"center",gap:5}}>
    <div style={{width:10,height:10,borderRadius:2,background:color}}/>
    <span style={{fontSize:10,color:"#94a3b8"}}>{label}</span>
  </div>
);

const SummaryRow = ({label,value}) => (
  <div style={{display:"flex",justifyContent:"space-between",gap:8}}>
    <span style={{fontSize:11,color:"#94a3b8",fontWeight:600,textTransform:"uppercase",letterSpacing:0.3,flexShrink:0}}>{label}</span>
    <span style={{fontSize:12,color:"#0f172a",fontWeight:600,textAlign:"right"}}>{value||"—"}</span>
  </div>
);

// ── SpotModal ──
const SpotModal = ({spot,record,onClose,onSave,onDelete}) => {
  const sc = SC[spot.sector];
  const [patentes,setPatentes] = useState(record?.patentes||[""]);
  const [propietario,setPropietario] = useState(record?.propietario||"");
  const [telefono,setTelefono] = useState(record?.telefono||"");
  const [vehiculo,setVehiculo] = useState(record?.vehiculo||"");
  const save = () => { const c=patentes.filter(p=>p.trim()); onSave({patentes:c,propietario,telefono,vehiculo,updatedAt:new Date().toISOString()}); };
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.72)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:16,backdropFilter:"blur(6px)"}}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:"#0f172a",border:`1.5px solid ${sc.accent}50`,borderRadius:18,width:"100%",maxWidth:420,overflow:"hidden",boxShadow:"0 24px 64px rgba(0,0,0,.7)"}}>
        <div style={{padding:"18px 20px 14px",background:sc.bg,display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontSize:10,fontWeight:700,color:sc.accent,textTransform:"uppercase",letterSpacing:1.5,marginBottom:4}}>{SECTOR_NAMES[spot.sector]}</div>
            <div style={{fontSize:22,fontWeight:900,color:"white",fontFamily:"monospace"}}>Estac. #{spot.id}</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,.6)",marginTop:2}}>Torre {spot.torre} · Depto {spot.depto}</div>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.15)",border:"none",color:"white",borderRadius:8,padding:"5px 10px",cursor:"pointer",fontSize:16}}>✕</button>
        </div>
        <div style={{padding:"18px 20px",display:"flex",flexDirection:"column",gap:14}}>
          <div>
            <label style={{fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:0.5,display:"block",marginBottom:8}}>Patentes del vehículo</label>
            {patentes.map((p,i)=>(
              <div key={i} style={{display:"flex",gap:6,marginBottom:7}}>
                <input value={p} onChange={e=>setPatentes(pt=>pt.map((x,j)=>j===i?e.target.value.toUpperCase():x))}
                  placeholder={`Patente ${i+1}  (ej: ABCD12)`} maxLength={8}
                  style={{flex:1,padding:"10px 14px",borderRadius:9,fontSize:15,fontWeight:800,border:"1.5px solid #1e3a5f",background:"#1e293b",color:"white",outline:"none",fontFamily:"monospace",letterSpacing:3,textTransform:"uppercase"}}/>
                {patentes.length>1&&<button onClick={()=>setPatentes(pt=>pt.filter((_,j)=>j!==i))}
                  style={{padding:"0 11px",borderRadius:9,border:"1.5px solid #7f1d1d",background:"#450a0a",color:"#f87171",cursor:"pointer",fontSize:15}}>−</button>}
              </div>
            ))}
            {patentes.length<5&&<button onClick={()=>setPatentes(p=>[...p,""])}
              style={{width:"100%",padding:"7px",borderRadius:9,border:`1.5px dashed ${sc.accent}70`,background:"rgba(255,255,255,.03)",color:sc.accent,cursor:"pointer",fontSize:12,fontWeight:600}}>+ Agregar patente</button>}
          </div>
          {[["Propietario",propietario,setPropietario,"Nombre completo"],["Teléfono",telefono,setTelefono,"+56 9 ..."],["Vehículo",vehiculo,setVehiculo,"Marca/Color"]].map(([lbl,val,setter,ph])=>(
            <div key={lbl} style={{display:"flex",flexDirection:"column",gap:4}}>
              <label style={{fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:0.5}}>{lbl}</label>
              <input value={val} onChange={e=>setter(e.target.value)} placeholder={ph}
                style={{padding:"8px 11px",borderRadius:8,fontSize:13,border:"1.5px solid #1e3a5f",background:"#1e293b",color:"white",outline:"none",fontFamily:"inherit"}}/>
            </div>
          ))}
        </div>
        <div style={{padding:"0 20px 20px",display:"flex",gap:8,justifyContent:"space-between"}}>
          <div>{record&&<button onClick={onDelete} style={{padding:"9px 16px",borderRadius:9,border:"1.5px solid #7f1d1d",background:"#450a0a",color:"#f87171",fontWeight:700,fontSize:12,cursor:"pointer"}}>Liberar</button>}</div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={onClose} style={{padding:"9px 16px",borderRadius:9,border:"1.5px solid #1e3a5f",background:"transparent",color:"#94a3b8",fontWeight:600,fontSize:12,cursor:"pointer"}}>Cancelar</button>
            <button onClick={save} style={{padding:"9px 22px",borderRadius:9,border:"none",background:sc.accent,color:"#0f172a",fontWeight:900,fontSize:12,cursor:"pointer"}}>Guardar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConfirmDialog = ({msg,onConfirm,onCancel}) => (
  <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,padding:20,backdropFilter:"blur(4px)"}}>
    <div style={{background:"#1e293b",borderRadius:16,padding:28,maxWidth:320,width:"100%",border:"1.5px solid #334155",boxShadow:"0 20px 50px rgba(0,0,0,.6)",textAlign:"center"}}>
      <div style={{fontSize:36,marginBottom:14}}>⚠️</div>
      <div style={{fontSize:15,fontWeight:700,color:"white",marginBottom:8}}>¿Confirmar eliminación?</div>
      <div style={{fontSize:13,color:"#94a3b8",marginBottom:22,lineHeight:1.5}}>{msg}</div>
      <div style={{display:"flex",gap:10}}>
        <button onClick={onCancel} style={{flex:1,padding:"10px",borderRadius:9,border:"1.5px solid #334155",background:"transparent",color:"#94a3b8",fontWeight:700,fontSize:13,cursor:"pointer"}}>Cancelar</button>
        <button onClick={onConfirm} style={{flex:1,padding:"10px",borderRadius:9,border:"none",background:"#dc2626",color:"white",fontWeight:800,fontSize:13,cursor:"pointer"}}>Eliminar</button>
      </div>
    </div>
  </div>
);

// ── STAFF LOGIN ──
const STAFF_CREDENTIALS = {email:"admin@parkadmin.cl", pass:"Park2024"};

const StaffLogin = ({onSuccess, onBack}) => {
  const [email,setEmail] = useState("");
  const [pass,setPass] = useState("");
  const [error,setError] = useState("");
  const [show,setShow] = useState(false);

  const login = () => {
    if(!email.trim()||!pass.trim()){setError("Completa todos los campos.");return;}
    if(email.trim().toLowerCase()===STAFF_CREDENTIALS.email && pass===STAFF_CREDENTIALS.pass){
      onSuccess();
    } else {
      setError("Correo o contraseña incorrectos.");
    }
  };

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#0a0f1e 0%,#1a2236 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 24px",fontFamily:"system-ui,sans-serif"}}>
      <div style={{width:"100%",maxWidth:380}}>
        <button onClick={onBack} style={{background:"rgba(255,255,255,.08)",border:"none",color:"#94a3b8",borderRadius:9,padding:"7px 14px",cursor:"pointer",fontSize:14,marginBottom:28}}>← Volver</button>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{width:70,height:70,borderRadius:20,background:"linear-gradient(135deg,#1f2937,#374151)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,margin:"0 auto 16px",boxShadow:"0 10px 30px rgba(0,0,0,.4)"}}>🔑</div>
          <h2 style={{margin:0,fontSize:22,fontWeight:900,color:"white",letterSpacing:-0.5}}>Acceso Personal</h2>
          <p style={{margin:"6px 0 0",fontSize:13,color:"#4b5563"}}>Administración · Conserjería</p>
        </div>
        <div style={{background:"#111827",borderRadius:18,padding:24,border:"1px solid #1f2937",boxShadow:"0 20px 50px rgba(0,0,0,.4)"}}>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div>
              <label style={{fontSize:11,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:0.5,display:"block",marginBottom:6}}>Correo electrónico</label>
              <input type="email" value={email} onChange={e=>{setEmail(e.target.value);setError("");}}
                onKeyDown={e=>e.key==="Enter"&&login()} placeholder="admin@parkadmin.cl"
                style={{width:"100%",padding:"12px 14px",borderRadius:10,fontSize:14,border:`1.5px solid ${error?"#7f1d1d":"#1f2937"}`,background:"#0a0f1e",color:"white",outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
            </div>
            <div>
              <label style={{fontSize:11,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:0.5,display:"block",marginBottom:6}}>Contraseña</label>
              <input type="password" value={pass} onChange={e=>{setPass(e.target.value);setError("");}}
                onKeyDown={e=>e.key==="Enter"&&login()} placeholder="••••••••"
                style={{width:"100%",padding:"12px 14px",borderRadius:10,fontSize:14,border:`1.5px solid ${error?"#7f1d1d":"#1f2937"}`,background:"#0a0f1e",color:"white",outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
            </div>
            {error&&<div style={{padding:"10px 14px",borderRadius:8,background:"#450a0a",border:"1px solid #7f1d1d",fontSize:12,color:"#fca5a5"}}>⚠️ {error}</div>}
            <button onClick={login} style={{padding:"13px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#1d4ed8,#2563eb)",color:"white",fontWeight:800,fontSize:15,cursor:"pointer",boxShadow:"0 4px 14px rgba(37,99,235,.35)",marginTop:4}}>Ingresar →</button>
          </div>

        </div>
      </div>
    </div>
  );
};

// ── HOME ──
const HomeScreen = ({onGo}) => {
  const [show,setShow] = useState(false);
  useEffect(()=>{setTimeout(()=>setShow(true),60);},[]);
  const card=(icon,title,sub,key,grad,delay)=>(
    <button onClick={()=>onGo(key)} style={{display:"flex",alignItems:"center",gap:18,width:"100%",padding:"22px 24px",borderRadius:20,border:"none",cursor:"pointer",background:grad,color:"white",textAlign:"left",boxShadow:"0 10px 30px rgba(0,0,0,.3)",transform:show?"translateY(0)":"translateY(28px)",opacity:show?1:0,transition:`transform .45s cubic-bezier(.22,1,.36,1) ${delay}ms, opacity .4s ${delay}ms`}}>
      <div style={{fontSize:44,lineHeight:1}}>{icon}</div>
      <div style={{flex:1}}><div style={{fontSize:20,fontWeight:900,marginBottom:4}}>{title}</div><div style={{fontSize:13,opacity:0.78,lineHeight:1.4}}>{sub}</div></div>
      <div style={{fontSize:24,opacity:0.45}}>›</div>
    </button>
  );
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#0a0f1e 0%,#1a2236 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 24px"}}>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",marginBottom:44,transform:show?"translateY(0)":"translateY(-18px)",opacity:show?1:0,transition:"transform .5s cubic-bezier(.22,1,.36,1), opacity .5s"}}>
        <div style={{width:90,height:90,borderRadius:28,background:"linear-gradient(135deg,#1d4ed8 0%,#3b82f6 100%)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:46,boxShadow:"0 20px 50px rgba(37,99,235,.5)",marginBottom:22}}>🅿</div>
        <h1 style={{margin:0,fontSize:34,fontWeight:900,color:"white",letterSpacing:-1.2,fontFamily:"Georgia,serif"}}>ParkAdmin</h1>
        <p style={{margin:"7px 0 0",fontSize:13,color:"#4a5568",fontWeight:500}}>Gestión de Estacionamientos · {SPOTS_DATA.length} espacios</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:14,width:"100%",maxWidth:390}}>
        {card("🏠","Soy Residente","Registra tus patentes y consulta tu estacionamiento asignado","resident","linear-gradient(135deg,#1d4ed8 0%,#2563eb 100%)",100)}
        {card("🔑","Acceso Personal","Verificar patente · Administración · Conserjería","staff","linear-gradient(135deg,#111827 0%,#1f2937 100%)",210)}
      </div>
      <div style={{marginTop:38,display:"flex",gap:18,transform:show?"translateY(0)":"translateY(10px)",opacity:show?1:0,transition:"all .6s 350ms"}}>
        {Object.entries(SC).map(([k,sc])=>(
          <div key={k} style={{display:"flex",alignItems:"center",gap:5}}>
            <div style={{width:8,height:8,borderRadius:2,background:sc.accent,boxShadow:`0 0 6px ${sc.accent}80`}}/>
            <span style={{fontSize:10,color:"#4a5568"}}>{SECTOR_NAMES[Number(k)]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── QUERY TAB ──
const QueryTab = ({records}) => {
  const [mode,setMode] = useState("patente");
  const [queryPat,setQueryPat] = useState("");
  const [queryTorre,setQueryTorre] = useState("");
  const [queryDepto,setQueryDepto] = useState("");
  const [result,setResult] = useState(null);

  const deptosFiltrados = queryTorre ? DEPTOS_ALL.filter(d=>BY_TD[`${queryTorre}-${d}`]) : [];

  const buscarPatente = () => {
    if(!queryPat.trim()) return;
    const q = queryPat.trim().toUpperCase().replace(/[^A-Z0-9]/g,"");
    let res=null;
    for(const s of SPOTS_DATA){const rec=records[s.id];if(rec?.patentes?.some(p=>p.toUpperCase().replace(/[^A-Z0-9]/g,"")===q)){res={spot:s,record:rec};break;}}
    setResult(res||"not_found");
  };

  const buscarDireccion = () => {
    if(!queryTorre||!queryDepto) return;
    const spot=BY_TD[`${queryTorre}-${queryDepto}`];
    if(!spot){setResult("not_found");return;}
    const rec=records[spot.id];
    if(!rec){setResult({spot,notReg:true});return;}
    setResult({spot,record:rec});
  };

  const reset = () => {setResult(null);setQueryPat("");setQueryTorre("");setQueryDepto("");};

  return (
    <div>
      <div style={{display:"flex",gap:2,background:"#dde3ed",borderRadius:10,padding:3,marginBottom:16}}>
        {[["patente","🔍 Por Patente"],["direccion","🏠 Por Dirección"]].map(([k,lbl])=>(
          <button key={k} onClick={()=>{setMode(k);setResult(null);}} style={{flex:1,padding:"9px 6px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,background:mode===k?"white":"transparent",color:mode===k?"#1d4ed8":"#64748b",boxShadow:mode===k?"0 2px 8px rgba(0,0,0,.1)":"none"}}>{lbl}</button>
        ))}
      </div>

      {mode==="patente"&&(
        <div style={{background:"white",borderRadius:16,padding:24,marginBottom:16,boxShadow:"0 2px 12px rgba(0,0,0,.06)"}}>
          <h2 style={{margin:"0 0 6px",fontSize:17,fontWeight:800,color:"#0f172a"}}>Consultar Patente</h2>
          <p style={{margin:"0 0 16px",fontSize:13,color:"#64748b",lineHeight:1.5}}>Ingresa la patente de tu vehículo para verificar si está registrada.</p>
          <div style={{display:"flex",gap:10}}>
            <input value={queryPat} onChange={e=>{setQueryPat(e.target.value);setResult(null);}} onKeyDown={e=>e.key==="Enter"&&buscarPatente()}
              placeholder="ABCD12" maxLength={8}
              style={{flex:1,padding:"13px 16px",borderRadius:10,fontSize:18,fontWeight:900,border:"2px solid #e2e8f0",background:"white",color:"#0f172a",outline:"none",fontFamily:"monospace",textTransform:"uppercase",letterSpacing:3}}/>
            <button onClick={buscarPatente} style={{padding:"13px 20px",borderRadius:10,border:"none",background:"#2563eb",color:"white",fontWeight:800,fontSize:14,cursor:"pointer"}}>Buscar</button>
          </div>
        </div>
      )}

      {mode==="direccion"&&(
        <div style={{background:"white",borderRadius:16,padding:24,marginBottom:16,boxShadow:"0 2px 12px rgba(0,0,0,.06)"}}>
          <h2 style={{margin:"0 0 6px",fontSize:17,fontWeight:800,color:"#0f172a"}}>Consultar por Dirección</h2>
          <p style={{margin:"0 0 16px",fontSize:13,color:"#64748b",lineHeight:1.5}}>Selecciona tu torre y letra/block para ver tu estacionamiento en el plano.</p>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <select value={queryTorre} onChange={e=>{setQueryTorre(e.target.value);setQueryDepto("");setResult(null);}}
              style={{width:"100%",padding:"11px 12px",borderRadius:9,fontSize:14,fontWeight:600,border:"1.5px solid #e2e8f0",background:"white",outline:"none",cursor:"pointer",fontFamily:"monospace"}}>
              <option value="">— Selecciona la dirección —</option>
              {TORRES.map(t=><option key={t} value={t}>12 Norte {t}</option>)}
            </select>
            <select value={queryDepto} onChange={e=>{setQueryDepto(e.target.value);setResult(null);}} disabled={!queryTorre}
              style={{width:"100%",padding:"11px 12px",borderRadius:9,fontSize:14,fontWeight:600,border:"1.5px solid #e2e8f0",background:queryTorre?"white":"#f8fafc",outline:"none",cursor:queryTorre?"pointer":"not-allowed",fontFamily:"monospace"}}>
              <option value="">— Selecciona letra/block —</option>
              {deptosFiltrados.map(d=><option key={d} value={d}>{d}</option>)}
            </select>
            <button onClick={buscarDireccion} disabled={!queryTorre||!queryDepto}
              style={{padding:"12px",borderRadius:10,border:"none",background:queryTorre&&queryDepto?"#2563eb":"#cbd5e1",color:"white",fontWeight:800,fontSize:14,cursor:queryTorre&&queryDepto?"pointer":"not-allowed"}}>
              Ver Estacionamiento
            </button>
          </div>
        </div>
      )}

      {result==="not_found"&&(
        <div style={{background:"#fff7ed",border:"1.5px solid #fed7aa",borderRadius:16,padding:28,textAlign:"center"}}>
          <div style={{fontSize:40,marginBottom:10}}>🔍</div>
          <div style={{fontSize:16,fontWeight:700,color:"#92400e",marginBottom:6}}>{mode==="patente"?"Patente no encontrada":"Dirección no encontrada"}</div>
          <div style={{fontSize:12,color:"#b45309",lineHeight:1.5,marginBottom:16}}>{mode==="patente"?"Esta patente no está registrada.":"No existe asignación para esta combinación."}</div>
          <button onClick={reset} style={{padding:"9px 20px",borderRadius:8,border:"1.5px solid #f59e0b",background:"transparent",color:"#b45309",cursor:"pointer",fontWeight:700,fontSize:12}}>Nueva búsqueda</button>
        </div>
      )}

      {result&&result!=="not_found"&&result.notReg&&(
        <div style={{background:"#f0f9ff",border:"1.5px solid #bae6fd",borderRadius:16,padding:28,textAlign:"center"}}>
          <div style={{fontSize:40,marginBottom:10}}>📋</div>
          <div style={{fontSize:16,fontWeight:700,color:"#0c4a6e",marginBottom:8}}>Estacionamiento sin registrar</div>
          {(()=>{const sp=result.spot,sc0=SC[sp.sector];return(
            <div style={{display:"inline-flex",alignItems:"center",gap:10,padding:"10px 18px",borderRadius:10,background:sc0.accent+"20",border:`1.5px solid ${sc0.accent}50`,marginBottom:12}}>
              <div style={{fontFamily:"monospace",fontWeight:900,fontSize:18,color:sc0.spotOcc}}>#{sp.id}</div>
              <div style={{textAlign:"left"}}><div style={{fontSize:11,color:sc0.spotOcc,fontWeight:700}}>{SECTOR_NAMES[sp.sector]}</div><div style={{fontSize:11,color:"#0f172a"}}>Torre {sp.torre} · {sp.depto}</div></div>
            </div>
          );})()}
          <div style={{fontSize:12,color:"#0369a1",lineHeight:1.5,marginBottom:16}}>Este estacionamiento aún no tiene datos registrados.<br/>Ve a <strong>Ingresar Datos</strong> para registrarte.</div>
          <button onClick={reset} style={{padding:"9px 20px",borderRadius:8,border:"1.5px solid #0ea5e9",background:"transparent",color:"#0369a1",cursor:"pointer",fontWeight:700,fontSize:12}}>Nueva búsqueda</button>
        </div>
      )}

      {result&&result!=="not_found"&&!result.notReg&&(()=>{
        const{spot,record}=result,sc5=SC[spot.sector];
        return <div>
          <div style={{background:sc5.bg,borderRadius:16,overflow:"hidden",boxShadow:`0 10px 36px rgba(0,0,0,.3)`,marginBottom:14}}>
            <div style={{padding:"18px 22px",background:"rgba(255,255,255,.08)",borderBottom:"1px solid rgba(255,255,255,.1)",display:"flex",alignItems:"center",gap:12}}>
              <div style={{fontSize:36}}>✅</div>
              <div>
                <div style={{fontSize:11,color:sc5.accent,fontWeight:700,marginBottom:2}}>Estacionamiento registrado</div>
                <div style={{fontSize:22,fontWeight:900,fontFamily:"monospace",color:"white"}}>#{spot.id}</div>
              </div>
            </div>
            <div style={{padding:"18px 22px",display:"flex",flexDirection:"column",gap:12}}>
              <RowItem icon="📍" label="Sector" value={SECTOR_NAMES[spot.sector]}/>
              <RowItem icon="🏢" label="Torre" value={spot.torre}/>
              <RowItem icon="🏠" label="Departamento" value={spot.depto}/>
              {record.nombre&&<RowItem icon="👤" label="Residente" value={record.nombre}/>}
              {record.patentes?.length>0&&<RowItem icon="🚗" label="Patente(s)" value={record.patentes.join(" · ")}/>}
            </div>
          </div>
          <div style={{background:"#1e293b",borderRadius:16,overflow:"hidden",border:`2px solid ${sc5.border}40`,marginBottom:12}}>
            <div style={{padding:"10px 16px",background:sc5.bg,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{fontSize:12,fontWeight:700,color:sc5.accent}}>📐 Ubicación en el plano — Sector {spot.sector}</div>
              <div style={{fontSize:11,color:sc5.text,opacity:0.7}}>{SECTOR_NAMES[spot.sector]}</div>
            </div>
            <div style={{padding:10,overflowX:"auto"}}>
              <SectorMap sectorId={spot.sector} records={records} onSpotClick={()=>{}} highlightId={spot.id}/>
            </div>
            <div style={{padding:"8px 14px 10px",display:"flex",gap:14,flexWrap:"wrap",background:"#162032"}}>
              <Legend color="#facc15" label="Tu estacionamiento"/>
              <Legend color={sc5.spotOcc} label="Ocupado"/>
              <Legend color="#2d3f5a" label="Libre"/>
            </div>
          </div>
          <button onClick={reset} style={{width:"100%",padding:"11px",borderRadius:10,border:"1.5px solid #e2e8f0",background:"white",color:"#475569",fontWeight:700,fontSize:13,cursor:"pointer"}}>Nueva búsqueda</button>
        </div>;
      })()}
    </div>
  );
};

// ── RESIDENT ──
const ResidentScreen = ({records,setRecords,onBack}) => {
  const [tab,setTab] = useState("form");
  const [toast,setToast] = useState(null);
  const [form,setFormState] = useState(emptyForm());
  const [step,setStep] = useState(0);
  const [found,setFound] = useState(null);
  const [errors,setErrors] = useState({});
  const [emailInput,setEmailInput] = useState("");
  const [isEditing,setIsEditing] = useState(false);

  const showToast=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),2800);};
  const setF=(k,v)=>{setFormState(f=>({...f,[k]:v}));setErrors(e=>({...e,[k]:""}));};

  const handleLookup=()=>{
    if(!form.torre||!form.depto){setErrors({lookup:"Selecciona dirección y departamento"});return;}
    const spot=BY_TD[`${form.torre}-${form.depto}`]||null;
    if(!spot){setErrors({lookup:"No se encontró asignación para esta dirección"});return;}
    setFound(spot);
    const rec=records[spot.id];
    if(rec&&rec.email){setIsEditing(true);setEmailInput("");setErrors({});setStep("verify");}
    else{setIsEditing(false);setErrors({});setStep(1);}
  };

  const handleEmailVerify=()=>{
    if(!found)return;
    const rec=records[found.id];
    const stored=(rec?.email||"").trim().toLowerCase();
    const entered=emailInput.trim().toLowerCase();
    if(!entered){setErrors({emailVerify:"Ingresa tu correo"});return;}
    if(stored!==entered){setErrors({emailVerify:"El correo no coincide. Contacta a administración."});return;}
    setFormState(f=>({...f,nombre:rec?.nombre||"",email:rec?.email||"",telefono:rec?.telefono||"",tipoResidente:rec?.tipoResidente||"",usoEstacionamiento:rec?.usoEstacionamiento||"",vehiculos:rec?.vehiculos?.length?rec.vehiculos:[{patente:"",marca:"",color:"",esVisita:"no"}]}));
    setErrors({});setStep(1);
  };

  const validateStep=s=>{
    const e={};
    if(s===1){if(!form.nombre.trim())e.nombre="Requerido";if(!form.tipoResidente)e.tipoResidente="Selecciona una opción";}
    if(s===2&&!form.usoEstacionamiento)e.usoEstacionamiento="Selecciona una opción";
    if(s===3)form.vehiculos.forEach((v,i)=>{if(!v.patente.trim())e[`pat_${i}`]="Ingresa la patente";});
    return e;
  };

  const next=()=>{
    const e=validateStep(step);
    if(Object.keys(e).length){setErrors(e);return;}
    if(step===1)setStep(2);
    else if(step===2)setStep(3);
    else if(step===3)guardar();
  };

  const guardar=()=>{
    if(!found)return;
    const veh=form.vehiculos.filter(v=>v.patente.trim());
    const data={nombre:form.nombre,email:form.email,telefono:form.telefono,tipoResidente:form.tipoResidente,usoEstacionamiento:form.usoEstacionamiento,vehiculos:veh,patentes:veh.map(v=>v.patente.toUpperCase().replace(/[^A-Z0-9]/g,"")),updatedAt:new Date().toISOString()};
    setRecords(r=>({...r,[found.id]:data}));
    setStep(4);showToast("Registro guardado correctamente");
  };

  const resetForm=()=>{setFormState(emptyForm());setFound(null);setStep(0);setErrors({});setIsEditing(false);setEmailInput("");};
  const addVehiculo=()=>{if(form.vehiculos.length<5)setFormState(f=>({...f,vehiculos:[...f.vehiculos,{patente:"",marca:"",color:"",esVisita:"no"}]}));};
  const updateVeh=(i,k,v)=>{setFormState(f=>({...f,vehiculos:f.vehiculos.map((x,j)=>j===i?{...x,[k]:k==="patente"?v.toUpperCase():v}:x)}));setErrors(e=>({...e,[`pat_${i}`]:""}));};
  const removeVeh=i=>setFormState(f=>({...f,vehiculos:f.vehiculos.filter((_,j)=>j!==i)}));

  const sc=found?SC[found.sector]:null;
  const deptosFiltrados=form.torre?DEPTOS_ALL.filter(d=>BY_TD[`${form.torre}-${d}`]):[];
  const STEPS=["Dirección","Identificación","Uso","Vehículos"];
  const stepNum=typeof step==="number"?step:0;

  const radioBtn=(fk,val,label)=>(
    <label key={val} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"11px 14px",borderRadius:9,border:`1.5px solid ${form[fk]===val?"#2563eb":"#e2e8f0"}`,background:form[fk]===val?"#eff6ff":"white",cursor:"pointer",marginBottom:7}}
      onClick={()=>setF(fk,val)}>
      <div style={{width:17,height:17,borderRadius:"50%",border:"2px solid",marginTop:1,flexShrink:0,borderColor:form[fk]===val?"#2563eb":"#cbd5e1",background:form[fk]===val?"#2563eb":"white",display:"flex",alignItems:"center",justifyContent:"center"}}>
        {form[fk]===val&&<div style={{width:6,height:6,borderRadius:"50%",background:"white"}}/>}
      </div>
      <span style={{fontSize:13,color:form[fk]===val?"#1d4ed8":"#374151",fontWeight:form[fk]===val?600:400,lineHeight:1.4}}>{label}</span>
    </label>
  );

  return (
    <div style={{minHeight:"100vh",background:"#eef2f7",fontFamily:"system-ui,sans-serif"}}>
      <div style={{background:"linear-gradient(135deg,#1d4ed8,#2563eb)",color:"white",padding:"16px 20px 0",boxShadow:"0 6px 24px rgba(37,99,235,.4)",position:"sticky",top:0,zIndex:50}}>
        <div style={{maxWidth:640,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
            <button onClick={onBack} style={{background:"rgba(255,255,255,.15)",border:"none",color:"white",borderRadius:9,padding:"7px 13px",cursor:"pointer",fontSize:16,fontWeight:600}}>←</button>
            <div style={{flex:1}}>
              <div style={{fontSize:10,fontWeight:600,opacity:0.7,textTransform:"uppercase",letterSpacing:1}}>Residente</div>
              <div style={{fontSize:20,fontWeight:900,letterSpacing:-0.4}}>🏠 Mi Estacionamiento</div>
            </div>
          </div>
          <div style={{display:"flex",gap:2,background:"rgba(0,0,0,.2)",borderRadius:10,padding:3,marginBottom:0}}>
            {[["form","📝","Ingresar Datos"],["query","🔍","Consultar"]].map(([k,icon,label])=>(
              <button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"9px 6px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,background:tab===k?"white":"transparent",color:tab===k?"#1d4ed8":"rgba(255,255,255,.7)",display:"flex",alignItems:"center",justifyContent:"center",gap:5,boxShadow:tab===k?"0 2px 8px rgba(0,0,0,.15)":"none"}}>
                <span>{icon}</span><span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:640,margin:"0 auto",padding:"20px 16px"}}>
        {tab==="form"&&(
          <div>
            {typeof step==="number"&&step>=1&&step<=3&&(
              <div style={{display:"flex",alignItems:"center",marginBottom:20}}>
                {STEPS.slice(1).map((s,i)=>{
                  const idx=i+1,done=stepNum>idx,active=stepNum===idx;
                  return <div key={s} style={{display:"flex",alignItems:"center",flex:1}}>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",flex:1}}>
                      <div style={{width:28,height:28,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,background:done||active?"#2563eb":"#e2e8f0",color:done||active?"white":"#94a3b8",boxShadow:active?"0 0 0 4px rgba(37,99,235,.2)":"none"}}>{done?"✓":idx}</div>
                      <span style={{fontSize:9,color:active?"#1d4ed8":done?"#64748b":"#94a3b8",fontWeight:active?700:400,marginTop:3,textTransform:"uppercase",letterSpacing:0.3}}>{s}</span>
                    </div>
                    {i<2&&<div style={{height:2,flex:1,background:done?"#2563eb":"#e2e8f0",marginBottom:16}}/>}
                  </div>;
                })}
              </div>
            )}

            {step===0&&(
              <div style={{background:"white",borderRadius:16,padding:24,boxShadow:"0 2px 12px rgba(0,0,0,.06)"}}>
                <h2 style={{margin:"0 0 6px",fontSize:17,fontWeight:800,color:"#0f172a"}}>Dirección de tu unidad</h2>
                <p style={{margin:"0 0 20px",fontSize:13,color:"#64748b",lineHeight:1.5}}>Selecciona tu dirección para identificar tu estacionamiento asignado.</p>
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  <div>
                    <label style={{fontSize:11,fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:0.5,display:"block",marginBottom:6}}>1. Dirección / Torre <span style={{color:"#e53e3e"}}>*</span></label>
                    <select value={form.torre} onChange={e=>{setF("torre",e.target.value);setF("depto","");}}
                      style={{width:"100%",padding:"11px 12px",borderRadius:9,fontSize:14,fontWeight:600,border:"1.5px solid #e2e8f0",background:"white",outline:"none",cursor:"pointer",fontFamily:"monospace"}}>
                      <option value="">— Selecciona la dirección —</option>
                      {TORRES.map(t=><option key={t} value={t}>12 Norte {t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{fontSize:11,fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:0.5,display:"block",marginBottom:6}}>2. Letra / Block <span style={{color:"#e53e3e"}}>*</span></label>
                    <select value={form.depto} onChange={e=>setF("depto",e.target.value)} disabled={!form.torre}
                      style={{width:"100%",padding:"11px 12px",borderRadius:9,fontSize:14,fontWeight:600,border:`1.5px solid ${errors.lookup?"#e53e3e":"#e2e8f0"}`,background:form.torre?"white":"#f8fafc",outline:"none",cursor:form.torre?"pointer":"not-allowed",fontFamily:"monospace"}}>
                      <option value="">— Selecciona letra/block —</option>
                      {deptosFiltrados.map(d=><option key={d} value={d}>{d}</option>)}
                    </select>
                    {errors.lookup&&<span style={{fontSize:11,color:"#e53e3e",marginTop:4,display:"block"}}>{errors.lookup}</span>}
                  </div>
                </div>
                {form.torre&&form.depto&&BY_TD[`${form.torre}-${form.depto}`]&&(()=>{
                  const prev=BY_TD[`${form.torre}-${form.depto}`],sc0=SC[prev.sector];
                  return <div style={{marginTop:16,padding:"12px 16px",borderRadius:10,background:sc0.accent+"18",border:`1.5px solid ${sc0.accent}40`,display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:44,height:44,borderRadius:10,background:sc0.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"monospace",fontWeight:900,fontSize:14,color:sc0.accent}}>#{prev.id}</div>
                    <div><div style={{fontSize:11,color:sc0.spotOcc,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5}}>Estacionamiento asignado ✓</div><div style={{fontSize:13,color:"#0f172a",fontWeight:600}}>{SECTOR_NAMES[prev.sector]}</div></div>
                  </div>;
                })()}
                <button onClick={handleLookup} style={{width:"100%",marginTop:20,padding:"13px",borderRadius:10,border:"none",background:"#2563eb",color:"white",fontWeight:800,fontSize:15,cursor:"pointer",boxShadow:"0 4px 14px rgba(37,99,235,.35)"}}>Continuar →</button>
              </div>
            )}

            {step==="verify"&&found&&(()=>{
              const sc0=SC[found.sector],rec=records[found.id];
              return <div style={{background:"white",borderRadius:16,overflow:"hidden",boxShadow:"0 4px 20px rgba(0,0,0,.08)"}}>
                <div style={{background:sc0.bg,padding:"20px 24px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:14}}>
                    <div style={{width:52,height:52,borderRadius:12,background:"rgba(0,0,0,.3)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"monospace",fontSize:18,fontWeight:900,color:sc0.accent,flexShrink:0}}>#{found.id}</div>
                    <div>
                      <div style={{fontSize:11,color:sc0.accent,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:2}}>Registro existente encontrado</div>
                      <div style={{fontSize:14,color:"white",fontWeight:700}}>{SECTOR_NAMES[found.sector]}</div>
                      <div style={{fontSize:11,color:"rgba(255,255,255,.5)"}}>Torre {found.torre} · {found.depto}</div>
                    </div>
                  </div>
                </div>
                <div style={{padding:"22px"}}>
                  <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:10,padding:"12px 16px",marginBottom:20,display:"flex",gap:10,alignItems:"flex-start"}}>
                    <span style={{fontSize:18,lineHeight:1}}>ℹ️</span>
                    <div>
                      <div style={{fontSize:13,fontWeight:700,color:"#166534",marginBottom:3}}>Esta unidad ya tiene un registro</div>
                      <div style={{fontSize:12,color:"#15803d",lineHeight:1.5}}>Registrado a nombre de <strong>{rec?.nombre||"un residente"}</strong>. Para modificar, verifica tu identidad.</div>
                    </div>
                  </div>
                  <label style={{fontSize:11,fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:0.5,display:"block",marginBottom:8}}>Correo electrónico registrado</label>
                  <input type="email" value={emailInput} onChange={e=>{setEmailInput(e.target.value);setErrors(er=>({...er,emailVerify:""}));}}
                    onKeyDown={e=>e.key==="Enter"&&handleEmailVerify()} placeholder="correo@ejemplo.com"
                    style={{width:"100%",padding:"12px 14px",borderRadius:10,fontSize:14,border:`1.5px solid ${errors.emailVerify?"#e53e3e":"#e2e8f0"}`,outline:"none",fontFamily:"inherit",boxSizing:"border-box",background:"#f8fafc"}}/>
                  {errors.emailVerify&&<div style={{marginTop:8,padding:"10px 14px",borderRadius:8,background:"#fff5f5",border:"1px solid #fecaca",fontSize:12,color:"#dc2626",lineHeight:1.5}}>⚠️ {errors.emailVerify}</div>}
                  <button onClick={handleEmailVerify} style={{width:"100%",marginTop:14,padding:"13px",borderRadius:10,border:"none",background:"#2563eb",color:"white",fontWeight:800,fontSize:14,cursor:"pointer"}}>Verificar y Editar Registro →</button>
                  <button onClick={()=>{setStep(0);setFound(null);setIsEditing(false);}} style={{width:"100%",marginTop:8,padding:"10px",borderRadius:9,border:"1.5px solid #e2e8f0",background:"white",color:"#475569",fontWeight:600,fontSize:12,cursor:"pointer"}}>← Volver</button>
                  <div style={{marginTop:14,fontSize:11,color:"#94a3b8",textAlign:"center"}}>¿No recuerdas el correo? Contacta a la administración.</div>
                </div>
              </div>;
            })()}

            {step===1&&(
              <div style={{background:"white",borderRadius:16,padding:24,boxShadow:"0 2px 12px rgba(0,0,0,.06)"}}>
                {sc&&<div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderRadius:10,background:sc.bg,marginBottom:20}}>
                  <div style={{fontFamily:"monospace",fontWeight:900,fontSize:18,color:sc.accent}}>#{found.id}</div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,.7)"}}>{SECTOR_NAMES[found.sector]} · Torre {found.torre} · {found.depto}</div>
                </div>}
                <h2 style={{margin:"0 0 16px",fontSize:16,fontWeight:800,color:"#0f172a"}}>Bloque 1: Identificación del Residente</h2>
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  <div>
                    <label style={{fontSize:11,fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:0.5,display:"block",marginBottom:8}}>3. ¿Usted es? <span style={{color:"#e53e3e"}}>*</span></label>
                    {errors.tipoResidente&&<span style={{fontSize:10,color:"#e53e3e",display:"block",marginBottom:6}}>{errors.tipoResidente}</span>}
                    {radioBtn("tipoResidente","propietario_residente","Propietario residente")}
                    {radioBtn("tipoResidente","propietario_arriendo","Propietario no residente (arrienda)")}
                    {radioBtn("tipoResidente","arrendatario","Arrendatario / Ocupante")}
                  </div>
                  {[["nombre","4. Nombre completo","Ej: Juan Pérez González","text",true],["email","5. Correo electrónico","correo@ejemplo.com","email",false],["telefono","6. Teléfono","+56 9 1234 5678","tel",false]].map(([k,lbl,ph,type,req])=>(
                    <div key={k} style={{display:"flex",flexDirection:"column",gap:4}}>
                      <label style={{fontSize:11,fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:0.5}}>{lbl}{req&&<span style={{color:"#e53e3e"}}> *</span>}</label>
                      <input type={type} value={form[k]} onChange={e=>setF(k,e.target.value)} placeholder={ph}
                        style={{padding:"10px 12px",borderRadius:9,fontSize:13,border:`1.5px solid ${errors[k]?"#e53e3e":"#e2e8f0"}`,outline:"none",fontFamily:"inherit",background:"white"}}/>
                      {errors[k]&&<span style={{fontSize:10,color:"#e53e3e"}}>{errors[k]}</span>}
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:10,marginTop:20}}>
                  <button onClick={()=>setStep(0)} style={{padding:"11px 20px",borderRadius:9,border:"1.5px solid #e2e8f0",background:"white",color:"#475569",fontWeight:600,fontSize:13,cursor:"pointer"}}>← Atrás</button>
                  <button onClick={next} style={{flex:1,padding:"11px",borderRadius:9,border:"none",background:"#2563eb",color:"white",fontWeight:800,fontSize:14,cursor:"pointer"}}>Continuar →</button>
                </div>
              </div>
            )}

            {step===2&&(
              <div style={{background:"white",borderRadius:16,padding:24,boxShadow:"0 2px 12px rgba(0,0,0,.06)"}}>
                {sc&&<div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderRadius:10,background:sc.bg,marginBottom:20}}>
                  <div style={{fontFamily:"monospace",fontWeight:900,fontSize:18,color:sc.accent}}>#{found.id}</div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,.7)"}}>{SECTOR_NAMES[found.sector]} · Torre {found.torre} · {found.depto}</div>
                </div>}
                <h2 style={{margin:"0 0 6px",fontSize:16,fontWeight:800,color:"#0f172a"}}>Bloque 2: Uso del Espacio</h2>
                <p style={{margin:"0 0 16px",fontSize:13,color:"#64748b"}}>7. ¿Cómo será utilizado el estacionamiento?</p>
                {errors.usoEstacionamiento&&<span style={{fontSize:10,color:"#e53e3e",display:"block",marginBottom:8}}>{errors.usoEstacionamiento}</span>}
                {radioBtn("usoEstacionamiento","uso_exclusivo","Uso exclusivo para vehículo(s) del residente.")}
                {radioBtn("usoEstacionamiento","visitas","Se utilizará principalmente para visitas.")}
                {radioBtn("usoEstacionamiento","ceder","Lo prestaré / cederé a otro comunero.")}
                {radioBtn("usoEstacionamiento","sin_uso","No tengo vehículo ni lo usaré por ahora.")}
                <div style={{display:"flex",gap:10,marginTop:20}}>
                  <button onClick={()=>setStep(1)} style={{padding:"11px 20px",borderRadius:9,border:"1.5px solid #e2e8f0",background:"white",color:"#475569",fontWeight:600,fontSize:13,cursor:"pointer"}}>← Atrás</button>
                  <button onClick={next} style={{flex:1,padding:"11px",borderRadius:9,border:"none",background:"#2563eb",color:"white",fontWeight:800,fontSize:14,cursor:"pointer"}}>Continuar →</button>
                </div>
              </div>
            )}

            {step===3&&(
              <div style={{background:"white",borderRadius:16,padding:24,boxShadow:"0 2px 12px rgba(0,0,0,.06)"}}>
                {sc&&<div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderRadius:10,background:sc.bg,marginBottom:20}}>
                  <div style={{fontFamily:"monospace",fontWeight:900,fontSize:18,color:sc.accent}}>#{found.id}</div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,.7)"}}>{SECTOR_NAMES[found.sector]} · Torre {found.torre} · {found.depto}</div>
                </div>}
                <h2 style={{margin:"0 0 6px",fontSize:16,fontWeight:800,color:"#0f172a"}}>Bloque 3: Registro de Vehículos</h2>
                <p style={{margin:"0 0 18px",fontSize:13,color:"#64748b",lineHeight:1.5}}>Puedes registrar hasta 5 vehículos. Al menos uno es requerido.</p>
                {form.vehiculos.map((v,i)=>(
                  <div key={i} style={{background:"#f8fafc",borderRadius:12,padding:16,marginBottom:12,border:"1.5px solid #e2e8f0"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                      <span style={{fontSize:12,fontWeight:700,color:"#0f172a"}}>🚗 Vehículo {i+1}</span>
                      {form.vehiculos.length>1&&<button onClick={()=>removeVeh(i)} style={{background:"none",border:"none",color:"#f87171",cursor:"pointer",fontSize:12,fontWeight:600}}>✕ Quitar</button>}
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:10}}>
                      <div>
                        <label style={{fontSize:10,fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:0.5,display:"block",marginBottom:4}}>Patente <span style={{color:"#e53e3e"}}>*</span></label>
                        <input value={v.patente} onChange={e=>updateVeh(i,"patente",e.target.value)} placeholder="Ej: ABCD12" maxLength={8}
                          style={{width:"100%",padding:"10px 12px",borderRadius:8,fontSize:15,fontWeight:800,border:`1.5px solid ${errors[`pat_${i}`]?"#e53e3e":"#e2e8f0"}`,outline:"none",fontFamily:"monospace",letterSpacing:2,textTransform:"uppercase",boxSizing:"border-box"}}/>
                        {errors[`pat_${i}`]&&<span style={{fontSize:10,color:"#e53e3e"}}>{errors[`pat_${i}`]}</span>}
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                        {[["marca","Marca","Toyota, Kia..."],["color","Color","Blanco, Negro..."]].map(([k,lbl,ph])=>(
                          <div key={k}>
                            <label style={{fontSize:10,fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:0.5,display:"block",marginBottom:4}}>{lbl}</label>
                            <input value={v[k]} onChange={e=>updateVeh(i,k,e.target.value)} placeholder={ph}
                              style={{width:"100%",padding:"9px 11px",borderRadius:8,fontSize:13,border:"1.5px solid #e2e8f0",outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
                          </div>
                        ))}
                      </div>
                      <div>
                        <label style={{fontSize:10,fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:0.5,display:"block",marginBottom:6}}>¿Es de visita recurrente?</label>
                        <div style={{display:"flex",gap:8,marginBottom:v.esVisita==="si"?10:0}}>
                          {[["si","Sí, es visita"],["no","No, es propio"]].map(([val,label])=>(
                            <button key={val} onClick={()=>updateVeh(i,"esVisita",val)}
                              style={{flex:1,padding:"8px 12px",borderRadius:8,border:`1.5px solid ${v.esVisita===val?"#2563eb":"#e2e8f0"}`,background:v.esVisita===val?"#eff6ff":"white",color:v.esVisita===val?"#1d4ed8":"#475569",fontWeight:v.esVisita===val?700:400,fontSize:12,cursor:"pointer"}}>{label}</button>
                          ))}
                        </div>
                        {v.esVisita==="si" && (
                          <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:8,padding:"10px 12px",borderRadius:8,background:"#eff6ff",border:"1px solid #bfdbfe"}}>
                            <div style={{fontSize:10,fontWeight:700,color:"#1d4ed8",marginBottom:2}}>Datos de la visita</div>
                            {[["nombreVisita","Nombre visita","Ej: María González"],["telefonoVisita","Teléfono visita","+56 9 ..."]].map(([k,lbl,ph])=>(
                              <div key={k}>
                                <label style={{fontSize:10,fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:0.5,display:"block",marginBottom:3}}>{lbl}</label>
                                <input value={v[k]||""} onChange={e=>updateVeh(i,k,e.target.value)} placeholder={ph}
                                  style={{width:"100%",padding:"8px 10px",borderRadius:7,fontSize:12,border:"1.5px solid #bfdbfe",outline:"none",fontFamily:"inherit",boxSizing:"border-box",background:"white"}}/>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {form.vehiculos.length<5&&<button onClick={addVehiculo} style={{width:"100%",padding:"10px",borderRadius:10,border:"1.5px dashed #2563eb",background:"#eff6ff",color:"#2563eb",cursor:"pointer",fontSize:13,fontWeight:600,marginBottom:4}}>+ Agregar otro vehículo</button>}
                <div style={{display:"flex",gap:10,marginTop:16}}>
                  <button onClick={()=>setStep(2)} style={{padding:"11px 20px",borderRadius:9,border:"1.5px solid #e2e8f0",background:"white",color:"#475569",fontWeight:600,fontSize:13,cursor:"pointer"}}>← Atrás</button>
                  <button onClick={next} style={{flex:1,padding:"11px",borderRadius:9,border:"none",background:"#16a34a",color:"white",fontWeight:800,fontSize:14,cursor:"pointer"}}>✅ Enviar Registro</button>
                </div>
              </div>
            )}

            {step===4&&found&&(()=>{
              const sc4=SC[found.sector];
              const tipoL={propietario_residente:"Propietario residente",propietario_arriendo:"Propietario no residente",arrendatario:"Arrendatario"};
              const usoL={uso_exclusivo:"Uso exclusivo",visitas:"Para visitas",ceder:"Cede a comunero",sin_uso:"Sin uso"};
              return <div style={{background:"white",borderRadius:16,overflow:"hidden",boxShadow:"0 4px 24px rgba(0,0,0,.08)",textAlign:"center"}}>
                <div style={{background:sc4.bg,padding:"32px 24px 24px"}}>
                  <div style={{fontSize:52,marginBottom:10}}>✅</div>
                  <div style={{fontSize:20,fontWeight:900,color:"white",marginBottom:4}}>{isEditing?"✏️ Registro modificado":"¡Registro enviado!"}</div>
                  <div style={{fontFamily:"monospace",fontSize:28,fontWeight:900,color:sc4.accent}}>#{found.id}</div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,.6)",marginTop:4}}>{SECTOR_NAMES[found.sector]} · Torre {found.torre} · {found.depto}</div>
                </div>
                <div style={{padding:"20px 24px"}}>
                  <div style={{background:"#f8fafc",borderRadius:10,padding:"14px 16px",textAlign:"left",marginBottom:16,display:"flex",flexDirection:"column",gap:8}}>
                    <SummaryRow label="Residente" value={form.nombre}/>
                    <SummaryRow label="Tipo" value={tipoL[form.tipoResidente]||form.tipoResidente}/>
                    <SummaryRow label="Vehículos" value={form.vehiculos.filter(v=>v.patente).map(v=>v.patente).join(", ")||"—"}/>
                    <SummaryRow label="Uso" value={usoL[form.usoEstacionamiento]||"—"}/>
                  </div>
                  <button onClick={resetForm} style={{width:"100%",padding:"12px",borderRadius:9,border:"1.5px solid #2563eb",background:"white",color:"#2563eb",fontWeight:700,fontSize:13,cursor:"pointer"}}>Registrar otra unidad</button>
                </div>
              </div>
              {/* Plano del sector */}
              <div style={{background:"#1e293b",borderRadius:16,overflow:"hidden",border:`2px solid ${sc4.border}40`,marginTop:14}}>
                <div style={{padding:"10px 16px",background:sc4.bg,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{fontSize:12,fontWeight:700,color:sc4.accent}}>📐 Tu ubicación en el plano</div>
                  <div style={{fontSize:11,color:sc4.text,opacity:0.8}}>{SECTOR_NAMES[found.sector]}</div>
                </div>
                <div style={{padding:10,overflowX:"auto"}}>
                  <SectorMap sectorId={found.sector} records={records} onSpotClick={()=>{}} highlightId={found.id}/>
                </div>
                <div style={{padding:"6px 14px 10px",display:"flex",gap:14,flexWrap:"wrap",background:"#162032"}}>
                  <Legend color="#facc15" label="Tu estacionamiento"/>
                  <Legend color={sc4.spotOcc} label="Ocupado"/>
                  <Legend color="#2d3f5a" label="Libre"/>
                </div>
              </div>
              ;
            })()}
          </div>
        )}
        {tab==="query"&&<QueryTab records={records}/>}
      </div>
      {toast&&<Toast msg={toast.msg} type={toast.type}/>}
    </div>
  );
};

// ── MAP EDITOR — drag & drop solo en Acceso Personal ──
const MapEditor = ({records, onSpotClick}) => {
  const SPOT_INFO2 = {};
  SPOTS_DATA.forEach(s => { SPOT_INFO2[s.id] = s; });

  const activeSector = 3;
  const sc = SC[activeSector];

  const loadPos = () => {
    try {
      const saved = localStorage.getItem('parkadmin_mappos_s3');
      if(saved) return JSON.parse(saved);
    } catch{}
    const pos = {};
    SPOTS_DATA.filter(s=>s.sector===3).forEach(s => {
      pos[s.id] = { x: s.gx * 70, y: s.gy * 52 };
    });
    return pos;
  };

  const [positions, setPositions] = useState(loadPos);
  const [dragging, setDragging] = useState(null);
  const [saved, setSaved] = useState(false);

  const sectorSpots = SPOTS_DATA.filter(s => s.sector === activeSector);

  const spos = sectorSpots.map(s => positions[s.id]).filter(Boolean);
  const minX = Math.min(0, ...spos.map(p=>p.x)) - 10;
  const minY = Math.min(0, ...spos.map(p=>p.y)) - 10;
  const maxX = Math.max(...spos.map(p=>p.x)) + 100;
  const maxY = Math.max(...spos.map(p=>p.y)) + 60;
  const VW = Math.max(600, maxX - minX);
  const VH = Math.max(400, maxY - minY);

  const getSVGPoint = (e, svg, isTouch=false) => {
    const pt = svg.createSVGPoint();
    pt.x = isTouch ? e.touches[0].clientX : e.clientX;
    pt.y = isTouch ? e.touches[0].clientY : e.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  };

  const startDrag = (e, id, isTouch=false) => {
    if(!isTouch) e.preventDefault();
    const svg = e.currentTarget.closest('svg');
    const svgP = getSVGPoint(e, svg, isTouch);
    const cur = positions[id] || {x:0,y:0};
    setDragging({id, offX: svgP.x - cur.x, offY: svgP.y - cur.y});
  };

  const moveDrag = (e, isTouch=false) => {
    if(!dragging) return;
    if(isTouch) e.preventDefault();
    const svg = e.currentTarget;
    const svgP = getSVGPoint(e, svg, isTouch);
    setPositions(prev => ({
      ...prev,
      [dragging.id]: { x: svgP.x - dragging.offX, y: svgP.y - dragging.offY }
    }));
  };

  const saveLayout = () => {
    try { localStorage.setItem('parkadmin_mappos_s3', JSON.stringify(positions)); } catch{}
    setSaved(true); setTimeout(()=>setSaved(false), 2000);
  };

  const resetLayout = () => {
    const pos = {};
    SPOTS_DATA.filter(s=>s.sector===3).forEach(s => { pos[s.id] = { x: s.gx*70, y: s.gy*52 }; });
    setPositions(pos);
    try { localStorage.removeItem('parkadmin_mappos_s3'); } catch{}
  };

  const SW2=80, SH2=42;

  return (
    <div>
      {/* Header */}
      <div style={{background:"#111827",borderRadius:12,padding:"10px 14px",marginBottom:10,border:"1px solid #1f2937",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
        <div>
          <div style={{fontSize:12,fontWeight:700,color:"white"}}>🗺️ Editor de Plano</div>
          <div style={{fontSize:10,color:"#4b5563",marginTop:2}}>Arrastra los espacios para reposicionarlos</div>
        </div>
        <div style={{display:"flex",gap:6}}>
          <button onClick={resetLayout} style={{padding:"6px 12px",borderRadius:8,border:"1px solid #374151",background:"transparent",color:"#9ca3af",fontSize:11,cursor:"pointer",fontWeight:600}}>↺ Resetear</button>
          <button onClick={saveLayout} style={{padding:"6px 14px",borderRadius:8,border:"none",background:saved?"#16a34a":"#2563eb",color:"white",fontSize:11,cursor:"pointer",fontWeight:700,transition:"background .3s"}}>
            {saved?"✅ Guardado":"💾 Guardar layout"}
          </button>
        </div>
      </div>

      {/* Canvas SVG editable */}
      <div style={{background:"#111827",borderRadius:12,border:`1px solid ${sc.border||sc.accent}30`,overflow:"hidden"}}>
        <div style={{padding:"8px 12px",background:sc.bg,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:11,fontWeight:700,color:sc.accent}}>📍 {SECTOR_NAMES[activeSector]}</span>
          <span style={{fontSize:9,color:"rgba(255,255,255,.4)"}}>
            {sectorSpots.filter(s=>records[s.id]).length}/{sectorSpots.length} ocupados
          </span>
        </div>
        <div style={{overflowX:"auto",overflowY:"auto",maxHeight:500}}>
          <svg
            viewBox={`${minX} ${minY} ${VW} ${VH}`}
            width={VW} height={VH}
            style={{display:"block",userSelect:"none",touchAction:"none"}}
            onMouseMove={e=>moveDrag(e)}
            onMouseUp={()=>setDragging(null)}
            onMouseLeave={()=>setDragging(null)}
            onTouchMove={e=>moveDrag(e,true)}
            onTouchEnd={()=>setDragging(null)}
          >
            <rect x={minX} y={minY} width={VW} height={VH} fill="#0f172a"/>
            {/* Grid de referencia */}
            {Array.from({length:Math.ceil(VW/70)+1},(_,i)=>(
              <line key={`vg${i}`} x1={minX+i*70} y1={minY} x2={minX+i*70} y2={minY+VH} stroke="#1e293b" strokeWidth={1}/>
            ))}
            {Array.from({length:Math.ceil(VH/52)+1},(_,i)=>(
              <line key={`hg${i}`} x1={minX} y1={minY+i*52} x2={minX+VW} y2={minY+i*52} stroke="#1e293b" strokeWidth={1}/>
            ))}

            {sectorSpots.map(s => {
              const pos = positions[s.id] || {x:0,y:0};
              const occ = !!records[s.id];
              const isDraggingThis = dragging?.id === s.id;
              const fill = isDraggingThis ? '#fde68a' : occ ? sc.spotOcc : '#1e2d45';
              const stroke = isDraggingThis ? '#f59e0b' : occ ? sc.accent : '#2d4060';
              const inf = SPOT_INFO2[s.id];

              return (
                <g key={s.id}
                  style={{cursor: isDraggingThis ? 'grabbing' : 'grab'}}
                  onMouseDown={e => startDrag(e, s.id)}
                  onTouchStart={e => startDrag(e, s.id, true)}
                  onClick={() => !dragging && onSpotClick && onSpotClick(s)}
                >
                  {/* Sombra */}
                  <rect x={pos.x+2} y={pos.y+3} width={SW2} height={SH2} rx={5} fill="rgba(0,0,0,.4)"/>
                  {/* Cuerpo */}
                  <rect x={pos.x} y={pos.y} width={SW2} height={SH2} rx={5}
                    fill={fill} stroke={stroke} strokeWidth={isDraggingThis?2.5:1.5}/>
                  {/* Número siempre visible */}
                  <text x={pos.x+SW2/2} y={pos.y+SH2*.42} textAnchor="middle" dominantBaseline="middle"
                    fontSize={11} fontWeight="900" fontFamily="monospace"
                    fill={isDraggingThis?'#0f172a':occ?'#fff':'#4a6080'}>#{s.id}</text>
                  {/* Torre·Depto */}
                  {inf && <text x={pos.x+SW2/2} y={pos.y+SH2*.78} textAnchor="middle" dominantBaseline="middle"
                    fontSize={6.5} fontFamily="monospace"
                    fill={isDraggingThis?'#1e293b':occ?'rgba(255,255,255,.6)':'#2d3f55'}>
                    {inf.torre} {inf.depto}
                  </text>}
                  {/* Indicador drag */}
                  {isDraggingThis && <rect x={pos.x-3} y={pos.y-3} width={SW2+6} height={SH2+6} rx={7}
                    fill="none" stroke="#f59e0b" strokeWidth={2} opacity={.6}/>}
                </g>
              );
            })}
          </svg>
        </div>
        <div style={{padding:"6px 12px",background:"#0a0f1e",display:"flex",gap:14,flexWrap:"wrap",alignItems:"center"}}>
          <Legend color={sc.accent} label="Ocupado"/>
          <Legend color="#2d3f5a" label="Libre"/>
          <Legend color="#fde68a" label="Arrastrando"/>
          <span style={{fontSize:9,color:"#374151",marginLeft:"auto"}}>Arrastra · Toca para editar</span>
        </div>
      </div>
    </div>
  );
};

// ── STAFF ──
const StaffScreen = ({records,setRecords,onBack}) => {
  const [tab,setTab] = useState("verify");
  const [query,setQuery] = useState("");
  const [result,setResult] = useState(null);
  const [selectedSpot,setSelectedSpot] = useState(null);
  const [toast,setToast] = useState(null);
  const [searchList,setSearchList] = useState("");
  const [filterSector,setFilterSector] = useState("all");
  const [sortBy,setSortBy] = useState("id");
  const [confirmDelete,setConfirmDelete] = useState(null);

  const showToast=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),2600);};

  const verify=()=>{
    if(!query.trim())return;
    const q=query.trim().toUpperCase().replace(/[^A-Z0-9]/g,"");
    let found=null;
    for(const s of SPOTS_DATA){const rec=records[s.id];if(rec?.patentes?.some(p=>p.toUpperCase().replace(/[^A-Z0-9]/g,"")===q)){found={spot:s,record:rec};break;}}
    setResult(found||"not_found");
  };

  const deleteRecord=spot=>{
    setRecords(r=>{const n={...r};delete n[spot.id];return n;});
    setConfirmDelete(null);
    showToast(`Estacionamiento #${spot.id} liberado`,"info");
  };

  const listedSpots=SPOTS_DATA
    .filter(s=>{
      if(!records[s.id])return false;
      if(filterSector!=="all"&&s.sector!==Number(filterSector))return false;
      if(searchList){const q=searchList.toLowerCase(),rec=records[s.id];return String(s.id).includes(q)||s.torre.includes(q)||s.depto.toLowerCase().includes(q)||rec.patentes?.some(p=>p.toLowerCase().includes(q))||(rec.propietario||rec.nombre||"").toLowerCase().includes(q);}
      return true;
    })
    .sort((a,b)=>{
      if(sortBy==="id")return a.id-b.id;
      if(sortBy==="torre")return a.torre.localeCompare(b.torre)||a.depto.localeCompare(b.depto);
      if(sortBy==="sector")return a.sector-b.sector;
      if(sortBy==="depto")return a.depto.localeCompare(b.depto);
      return 0;
    });

  const sc=result&&result!=="not_found"?SC[result.spot.sector]:null;
  const totalOcc=Object.keys(records).length,total=SPOTS_DATA.length;

  return (
    <div style={{minHeight:"100vh",background:"#0a0f1e",fontFamily:"system-ui,sans-serif",color:"white"}}>
      <div style={{background:"#111827",borderBottom:"1px solid #1f2937",padding:"14px 20px",position:"sticky",top:0,zIndex:50}}>
        <div style={{maxWidth:760,margin:"0 auto",display:"flex",alignItems:"center",gap:12}}>
          <button onClick={onBack} style={{background:"#0a0f1e",border:"none",color:"#64748b",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:16}}>←</button>
          <div style={{flex:1}}>
            <div style={{fontSize:10,fontWeight:600,color:"#374151",textTransform:"uppercase",letterSpacing:1}}>Acceso Personal</div>
            <div style={{fontSize:18,fontWeight:800}}>🔑 Panel de Control</div>
          </div>
          <div style={{display:"flex",gap:14,textAlign:"right"}}>
            <div><div style={{fontSize:17,fontWeight:900,color:"#22c55e",fontFamily:"monospace"}}>{total-totalOcc}</div><div style={{fontSize:9,color:"#374151"}}>LIBRES</div></div>
            <div><div style={{fontSize:17,fontWeight:900,color:"#f59e0b",fontFamily:"monospace"}}>{totalOcc}</div><div style={{fontSize:9,color:"#374151"}}>OCUP.</div></div>
            <div><div style={{fontSize:17,fontWeight:900,color:"#60a5fa",fontFamily:"monospace"}}>{total}</div><div style={{fontSize:9,color:"#374151"}}>TOTAL</div></div>
          </div>
        </div>
        <div style={{maxWidth:760,margin:"10px auto 0",display:"flex",gap:2,background:"#0a0f1e",borderRadius:10,padding:3}}>
          {[["verify","🔍","Verificar"],["list","📋","Listado"],["map","🗺️","Plano"]].map(([k,icon,label])=>(
            <button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"8px 4px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,background:tab===k?"#2563eb":"transparent",color:tab===k?"white":"#4b5563",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
              <span>{icon}</span><span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:760,margin:"0 auto",padding:"16px"}}>
        {tab==="verify"&&(
          <div>
            <div style={{background:"#111827",borderRadius:16,padding:22,marginBottom:18,border:"1px solid #1f2937"}}>
              <p style={{margin:"0 0 13px",fontSize:13,color:"#6b7280",lineHeight:1.6}}>Ingresa la patente para verificar su registro y estacionamiento.</p>
              <div style={{display:"flex",gap:10}}>
                <input value={query} onChange={e=>{setQuery(e.target.value);setResult(null);}} onKeyDown={e=>e.key==="Enter"&&verify()}
                  placeholder="ABCD12" maxLength={8}
                  style={{flex:1,padding:"14px 16px",borderRadius:10,fontSize:20,fontWeight:900,border:"2px solid #1f2937",background:"#0a0f1e",color:"white",outline:"none",fontFamily:"monospace",textTransform:"uppercase",letterSpacing:4}}/>
                <button onClick={verify} style={{padding:"14px 24px",borderRadius:10,border:"none",background:"#2563eb",color:"white",fontWeight:800,fontSize:14,cursor:"pointer"}}>Verificar</button>
              </div>
            </div>
            {result==="not_found"&&(
              <div style={{background:"#450a0a",border:"1.5px solid #7f1d1d",borderRadius:16,padding:28,textAlign:"center"}}>
                <div style={{fontSize:44,marginBottom:10}}>❌</div>
                <div style={{fontSize:17,fontWeight:800,color:"#fca5a5",marginBottom:8}}>Patente no registrada</div>
                <div style={{fontFamily:"monospace",fontSize:20,fontWeight:900,letterSpacing:4,color:"#f87171",marginBottom:12}}>{query.toUpperCase()}</div>
                <div style={{background:"rgba(239,68,68,.1)",borderRadius:10,padding:"10px 16px",fontSize:12,color:"#fca5a5",marginBottom:18}}>⚠️ Vehículo sin asignación. Derivar a administración.</div>
                <button onClick={()=>{setQuery("");setResult(null);}} style={{padding:"9px 24px",borderRadius:8,border:"1.5px solid #7f1d1d",background:"transparent",color:"#f87171",cursor:"pointer",fontWeight:700}}>Nueva búsqueda</button>
              </div>
            )}
            {result&&result!=="not_found"&&sc&&(
              <div style={{background:sc.bg,borderRadius:16,overflow:"hidden",boxShadow:`0 12px 42px rgba(0,0,0,.4)`}}>
                <div style={{padding:"18px 22px",background:"rgba(255,255,255,.07)",borderBottom:"1px solid rgba(255,255,255,.09)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{fontSize:38}}>✅</div>
                    <div>
                      <div style={{fontSize:11,color:sc.accent,fontWeight:700,marginBottom:2}}>Patente verificada</div>
                      <div style={{fontSize:24,fontWeight:900,fontFamily:"monospace",letterSpacing:4,color:"white"}}>{query.toUpperCase()}</div>
                    </div>
                  </div>
                  <button onClick={()=>setSelectedSpot(result.spot)} style={{padding:"8px 14px",borderRadius:8,border:`1.5px solid ${sc.accent}60`,background:"rgba(255,255,255,.08)",color:sc.accent,fontWeight:700,fontSize:12,cursor:"pointer"}}>✏️ Editar</button>
                </div>
                <div style={{padding:"18px 22px",display:"flex",flexDirection:"column",gap:12}}>
                  <RowItem icon="🅿" label="Estacionamiento" value={`#${result.spot.id}`} mono/>
                  <RowItem icon="📍" label="Sector" value={SECTOR_NAMES[result.spot.sector]}/>
                  <RowItem icon="🏢" label="Torre" value={result.spot.torre}/>
                  <RowItem icon="🏠" label="Departamento" value={result.spot.depto}/>
                  {result.record.patentes?.length>0&&<RowItem icon="🚗" label="Patentes" value={result.record.patentes.join(" · ")}/>}
                  {(result.record.propietario||result.record.nombre)&&<RowItem icon="👤" label="Residente" value={result.record.propietario||result.record.nombre}/>}
                </div>
                <div style={{padding:"0 22px 18px",display:"flex",gap:8}}>
                  <button onClick={()=>setConfirmDelete(result.spot)} style={{flex:1,padding:"10px",borderRadius:9,border:"1.5px solid #7f1d1d",background:"rgba(239,68,68,.1)",color:"#f87171",fontWeight:700,fontSize:13,cursor:"pointer"}}>🗑 Eliminar</button>
                  <button onClick={()=>{setQuery("");setResult(null);}} style={{flex:1,padding:"10px",borderRadius:9,border:"2px solid rgba(255,255,255,.14)",background:"rgba(255,255,255,.06)",color:"white",fontWeight:700,fontSize:13,cursor:"pointer"}}>Nueva búsqueda</button>
                </div>
              </div>
            )}
          </div>
        )}

        {tab==="list"&&(
          <div>
            <div style={{background:"#111827",borderRadius:13,padding:12,marginBottom:12,border:"1px solid #1f2937",display:"flex",gap:8,flexWrap:"wrap"}}>
              <input value={searchList} onChange={e=>setSearchList(e.target.value)} placeholder="Buscar patente, torre, depto, propietario..."
                style={{flex:1,minWidth:150,padding:"8px 12px",borderRadius:8,fontSize:12,border:"1.5px solid #1f2937",background:"#0a0f1e",color:"white",outline:"none",fontFamily:"inherit"}}/>
              <select value={filterSector} onChange={e=>setFilterSector(e.target.value)}
                style={{padding:"8px 10px",borderRadius:8,fontSize:12,border:"1.5px solid #1f2937",background:"#0a0f1e",color:"white",cursor:"pointer"}}>
                <option value="all">Todos los sectores</option>
                {[1,2,3].map(s=><option key={s} value={s}>{SECTOR_NAMES[s]}</option>)}
              </select>
              <select value={sortBy} onChange={e=>setSortBy(e.target.value)}
                style={{padding:"8px 10px",borderRadius:8,fontSize:12,border:"1.5px solid #1f2937",background:"#0a0f1e",color:"white",cursor:"pointer"}}>
                <option value="id">N° Estac.</option><option value="torre">Torre</option>
                <option value="depto">Depto</option><option value="sector">Sector</option>
              </select>
            </div>
            <div style={{display:"flex",gap:8,marginBottom:12}}>
              {Object.entries(SC).map(([sid,sc2])=>{
                const ss=SPOTS_DATA.filter(s=>s.sector===Number(sid)),occ=ss.filter(s=>records[s.id]).length;
                return <div key={sid} style={{flex:1,background:"#111827",borderRadius:10,padding:"9px 11px",border:`1px solid ${sc2.accent}30`,borderLeft:`3px solid ${sc2.accent}`}}>
                  <div style={{fontSize:8,color:sc2.accent,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5,marginBottom:2}}>S{sid}</div>
                  <div style={{fontSize:16,fontWeight:900,fontFamily:"monospace",color:"white"}}>{occ}<span style={{fontSize:10,color:"#374151"}}>/{ss.length}</span></div>
                  <div style={{height:3,background:"#0a0f1e",borderRadius:2,marginTop:4}}><div style={{height:"100%",width:`${occ/ss.length*100}%`,background:sc2.accent,borderRadius:2}}/></div>
                </div>;
              })}
            </div>
            <div style={{background:"#111827",borderRadius:14,overflow:"hidden",border:"1px solid #1f2937"}}>
              <div style={{display:"grid",gridTemplateColumns:"50px 62px 60px 1fr 68px 84px",padding:"8px 14px",background:"#0a0f1e",borderBottom:"1px solid #1f2937",fontSize:10,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:0.5}}>
                <span>Estac.</span><span>Torre</span><span>Depto</span><span>Patente(s)</span><span>Sector</span><span>Acciones</span>
              </div>
              {listedSpots.length===0&&<div style={{padding:32,textAlign:"center",color:"#374151",fontSize:13}}>{totalOcc===0?"No hay registros aún.":"Sin resultados."}</div>}
              {listedSpots.map((s,i)=>{
                const rec=records[s.id],sc2=SC[s.sector];
                return <div key={s.id} style={{display:"grid",gridTemplateColumns:"50px 62px 60px 1fr 68px 84px",padding:"10px 14px",borderBottom:i<listedSpots.length-1?"1px solid #0f172a":"none",alignItems:"center",fontSize:12}}>
                  <div style={{width:34,height:34,borderRadius:8,background:sc2.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"monospace",fontWeight:900,fontSize:11,color:sc2.accent}}>#{s.id}</div>
                  <span style={{color:"#94a3b8",fontFamily:"monospace",fontSize:11}}>{s.torre}</span>
                  <span style={{color:"#94a3b8",fontFamily:"monospace",fontWeight:700}}>{s.depto}</span>
                  <div>{rec.patentes?.map((p,pi)=><span key={pi} style={{display:"inline-block",marginRight:4,marginBottom:2,padding:"2px 6px",borderRadius:5,background:sc2.bg,color:sc2.accent,fontFamily:"monospace",fontSize:11,fontWeight:700,letterSpacing:0.8}}>{p}</span>)}{(rec.propietario||rec.nombre)&&<div style={{fontSize:10,color:"#374151",marginTop:2}}>{rec.propietario||rec.nombre}</div>}</div>
                  <div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:6,height:6,borderRadius:1,background:sc2.accent}}/><span style={{fontSize:10,color:"#374151"}}>S{s.sector}</span></div>
                  <div style={{display:"flex",gap:5}}>
                    <button onClick={()=>setSelectedSpot(s)} style={{padding:"5px 8px",borderRadius:6,border:"1.5px solid #1e3a5f",background:"rgba(37,99,235,.12)",color:"#60a5fa",cursor:"pointer",fontSize:13}}>✏️</button>
                    <button onClick={()=>setConfirmDelete(s)} style={{padding:"5px 8px",borderRadius:6,border:"1.5px solid #7f1d1d",background:"rgba(239,68,68,.1)",color:"#f87171",cursor:"pointer",fontSize:13}}>🗑</button>
                  </div>
                </div>;
              })}
              {listedSpots.length>0&&<div style={{padding:"9px 14px",borderTop:"1px solid #1f2937",fontSize:11,color:"#374151",display:"flex",justifyContent:"space-between"}}><span>{listedSpots.length} de {totalOcc} registros</span><span>{total-totalOcc} espacios libres</span></div>}
            </div>
          </div>
        )}

        {tab==="map"&&(
          <div>
            {[1,2,3].map(sid=>{
              const sc2=SC[sid],sSpots=SPOTS_DATA.filter(s=>s.sector===sid),occ=sSpots.filter(s=>records[s.id]).length;
              return <div key={sid} style={{background:"#111827",borderRadius:16,overflow:"hidden",marginBottom:14,border:`1px solid ${sc2.accent}30`}}>
                <div style={{padding:"12px 16px",background:sc2.bg,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{fontWeight:800,fontSize:13,color:sc2.accent}}>📍 {SECTOR_NAMES[sid]}</div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:16,fontWeight:900,fontFamily:"monospace",color:sc2.accent}}>{occ}<span style={{fontSize:10,color:"rgba(255,255,255,.4)"}}>/{sSpots.length}</span></div>
                    <div style={{fontSize:9,color:"rgba(255,255,255,.4)",textTransform:"uppercase"}}>ocupados</div>
                  </div>
                </div>
                <div style={{padding:10,overflowX:"auto"}}>
                  <SectorMap sectorId={sid} records={records} onSpotClick={s=>setSelectedSpot(s)} highlightId={null}/>
                </div>
                <div style={{padding:"6px 14px 10px",display:"flex",gap:14,flexWrap:"wrap",alignItems:"center",background:"#0f172a"}}>
                  <Legend color={sc2.spotOcc} label="Ocupado"/>
                  <Legend color="#2d3f5a" label="Libre"/>
                  <span style={{fontSize:10,color:"#374151",marginLeft:"auto"}}>Toca un espacio para editar</span>
                </div>
              </div>;
            })}
          </div>
        )}
      </div>

      {selectedSpot&&<SpotModal spot={selectedSpot} record={records[selectedSpot.id]} onClose={()=>setSelectedSpot(null)}
        onSave={data=>{setRecords(r=>({...r,[selectedSpot.id]:data}));setSelectedSpot(null);showToast(`Estacionamiento #${selectedSpot.id} actualizado`);}}
        onDelete={()=>{setRecords(r=>{const n={...r};delete n[selectedSpot.id];return n;});setSelectedSpot(null);showToast(`#${selectedSpot.id} liberado`,"info");}}/>}
      {confirmDelete&&<ConfirmDialog msg={`Se eliminará el registro del estacionamiento #${confirmDelete.id} (Torre ${confirmDelete.torre} · Depto ${confirmDelete.depto}). Esta acción no se puede deshacer.`} onConfirm={()=>deleteRecord(confirmDelete)} onCancel={()=>setConfirmDelete(null)}/>}
      {toast&&<Toast msg={toast.msg} type={toast.type}/>}
    </div>
  );
};

// ── ROOT ──
export default function App() {
  const [screen, setScreen] = useState("home");
  const [staffAuth, setStaffAuth] = useState(false);
  const [records, setRecords] = useState({});
  const [loading, setLoading] = useState(true);

  // Cargar registros desde Supabase al iniciar
  useEffect(() => {
    loadRegistros()
      .then(data => setRecords(data))
      .catch(e => console.error("Error cargando registros:", e))
      .finally(() => setLoading(false));
  }, []);

  // Wrapper para guardar en Supabase al actualizar records
  const setRecordsAndSync = async (updater) => {
    setRecords(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      // Detectar cambios y sincronizar
      Object.entries(next).forEach(([id, rec]) => {
        if(JSON.stringify(prev[id]) !== JSON.stringify(rec)) {
          upsertRegistro(Number(id), rec).catch(e => console.error("Error guardando:", e));
        }
      });
      // Detectar eliminaciones
      Object.keys(prev).forEach(id => {
        if(!next[id]) {
          deleteRegistro(Number(id)).catch(e => console.error("Error eliminando:", e));
        }
      });
      return next;
    });
  };

  if(loading) return (
    <div style={{minHeight:"100vh",background:"#0a0f1e",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}}>
      <div style={{width:50,height:50,border:"3px solid #1e3a5f",borderTop:"3px solid #3b82f6",borderRadius:"50%",animation:"spin 1s linear infinite"}}/>
      <div style={{color:"#4b5563",fontSize:13,fontFamily:"monospace"}}>Cargando registros...</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if(screen==="resident") return <ResidentScreen records={records} setRecords={setRecordsAndSync} onBack={()=>setScreen("home")}/>;
  if(screen==="staff"){
    if(!staffAuth) return <StaffLogin onSuccess={()=>setStaffAuth(true)} onBack={()=>setScreen("home")}/>;
    return <StaffScreen records={records} setRecords={setRecordsAndSync} onBack={()=>{setScreen("home");setStaffAuth(false);}}/>;
  }
  return <HomeScreen onGo={setScreen}/>;
}
