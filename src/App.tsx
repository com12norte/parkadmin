import { useState, useEffect, useRef, useCallback } from "react";

// ── SUPABASE ──
const SUPABASE_URL = "https://qpuuggfcubsepcjwocxf.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwdXVnZ2ZjdWJzZXBjandvY3hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1Nzk3ODQsImV4cCI6MjA5OTE1NTc4NH0.bTPWVT76QdNKvg9TuvMAX3TrRmfWgvKjuE1VcQWKYaM";

const sbFetch = (path, opts={}) => fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
  headers:{"apikey":SUPABASE_KEY,"Authorization":`Bearer ${SUPABASE_KEY}`,"Content-Type":"application/json","Prefer":"return=representation",...(opts.headers||{})},
  ...opts,
});
const loadRegistros = async () => {
  try { const res=await sbFetch("registros?select=*"); const data=await res.json(); const r={}; (Array.isArray(data)?data:[]).forEach(x=>{r[x.id]=x;}); return r; }
  catch(e){ return {}; }
};
const upsertRegistro = async (id,record) => {
  try { await sbFetch("registros",{method:"POST",headers:{"Prefer":"resolution=merge-duplicates,return=representation"},body:JSON.stringify({id,...record})}); }
  catch(e){}
};
const deleteRegistro = async (id) => {
  try { await sbFetch(`registros?id=eq.${id}`,{method:"DELETE"}); }
  catch(e){}
};

// ── RECLAMOS (Supabase) ──
const loadReclamos = async () => {
  try { const res=await sbFetch("reclamos?select=*&order=created_at.desc"); const data=await res.json(); return Array.isArray(data)?data:[]; }
  catch(e){ return []; }
};
const insertReclamo = async (reclamo) => {
  try { const res=await sbFetch("reclamos",{method:"POST",body:JSON.stringify(reclamo)}); const data=await res.json(); return Array.isArray(data)?data[0]:data; }
  catch(e){ return null; }
};
const updateReclamo = async (id,patch) => {
  try { await sbFetch(`reclamos?id=eq.${id}`,{method:"PATCH",body:JSON.stringify(patch)}); }
  catch(e){}
};

// ── EMAILJS ──
const EMAILJS_SERVICE = "service_vxhdrlx";
const EMAILJS_TEMPLATE = "template_dgshb8a";
const EMAILJS_KEY = "wKxD2rJHuftU7W-WE";

const sendEmail = async (params) => {
  try {
    await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE,
        template_id: EMAILJS_TEMPLATE,
        user_id: EMAILJS_KEY,
        template_params: params,
      }),
    });
  } catch(e) { console.error("Email error:",e); }
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
const SC = {
  1:{bg:"#166534",border:"#22c55e",spotOcc:"#16a34a",accent:"#4ade80",text:"#bbf7d0"},
  2:{bg:"#581c87",border:"#a855f7",spotOcc:"#7c3aed",accent:"#c084fc",text:"#e9d5ff"},
  3:{bg:"#9a3412",border:"#f97316",spotOcc:"#c2410c",accent:"#fb923c",text:"#fed7aa"},
};
const TORRES_LABELS = {
  "1052": "12 Norte 1052",
  "1054": "12 Norte 1054",
  "1036": "12 Norte 1036",
  "1038": "12 Norte 1038",
  "1061": "4 Oriente 1061",
  "1081": "4 Oriente 1081",
  "1060": "3 Oriente 1060",
  "1080": "3 Oriente 1080",
};
const TORRES = ["1052","1054","1036","1038","1061","1081","1060","1080"];
const DEPTOS_ALL = ["A1","B2","C3","D4","E5","E6","F5","F6","G7","H8"];

const validarTelefono = (tel) => {
  if(!tel?.trim()) return null;
  const clean = tel.replace(/[\s\-\+\(\)]/g,'').replace(/^56/,'');
  if(!/^9\d{8}$/.test(clean)) return "Debe ser móvil chileno (ej: 9 1234 5678)";
  if(/^(\d)\1{8}$/.test(clean)) return "Ingresa un número real";
  if(["912345678","987654321","900000000"].includes(clean)) return "Ingresa un número real";
  return null;
};

function emptyForm() {
  return {
    torre:"",depto:"",tipoResidente:"",nombre:"",email:"",telefono:"",
    nombrePropietario:"",emailPropietario:"",telefonoPropietario:"",
    usoEstacionamiento:"",nombreCedido:"",emailCedido:"",telefonoCedido:"",docCedido:null,
    vehiculos:[{patente:"",marca:"",color:"",esVisita:"no",nombreVisita:"",telefonoVisita:""}]
  };
}

// ── SECTOR MAP ──
const SPOT_INFO = {};
SPOTS_DATA.forEach(s => { SPOT_INFO[s.id] = s; });
const SW=90,SH=40,G=4,RD=28,DW=88,PAD=6,NBH=SH*2+G;

const SectorMap = ({sectorId,records,onSpotClick,highlightId}) => {
  const sec=sectorId;
  const scm={1:{occ:'#14532d',acc:'#22c55e'},2:{occ:'#4c1d95',acc:'#a855f7'},3:{occ:'#7c2d12',acc:'#f97316'}};

  const spotEl=(id,x,y,w=SW,h=SH)=>{
    const rec=records[id];
    const occ=!!rec,hl=id===highlightId;
    // Color por uso
    const usoColor={
      uso_exclusivo:'#14532d',
      visitas:'#1e3a5f',
      ceder:'#4c1d95',
      sin_uso:'#292524',
    };
    const usoAccent={
      uso_exclusivo:'#22c55e',
      visitas:'#3b82f6',
      ceder:'#a855f7',
      sin_uso:'#78716c',
    };
    const uso=rec?.usoEstacionamiento||'uso_exclusivo';
    const fill=hl?'#facc15':occ?(usoColor[uso]||'#14532d'):'#1e2d45';
    const stk=hl?'#fde047':occ?(usoAccent[uso]||'#22c55e'):'#2d4060';
    const nc=hl?'#0f172a':occ?'#fff':'#4a6080';
    const sc2=hl?'#1e3a5f':occ?'rgba(255,255,255,.6)':'#2d3f55';
    const inf=SPOT_INFO[id];
    const halo=hl?`<rect x="${x-3}" y="${y-3}" width="${w+6}" height="${h+6}" rx="7" fill="none" stroke="#facc15" stroke-width="2" opacity=".5"/>`:'';
    const pat=occ&&rec?.patentes?.[0]?`<text x="${x+w/2}" y="${y-6}" text-anchor="middle" font-size="6" font-family="monospace" font-weight="700" fill="${usoAccent[uso]||'#22c55e'}">${rec.patentes[0]}</text>`:'';
    return `${pat}<g style="cursor:pointer" data-id="${id}">
      <rect x="${x+1}" y="${y+2}" width="${w}" height="${h}" rx="4" fill="rgba(0,0,0,.28)"/>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${fill}" stroke="${stk}" stroke-width="${hl?2.5:occ?1.5:1}"/>
      <text x="${x+w/2}" y="${y+h*.42}" text-anchor="middle" dominant-baseline="middle" font-size="11" font-weight="900" font-family="monospace" fill="${nc}">#${id}</text>
      ${inf?`<text x="${x+w/2}" y="${y+h*.78}" text-anchor="middle" dominant-baseline="middle" font-size="6.5" font-family="monospace" fill="${sc2}">${inf.torre} ${inf.depto}</text>`:''}
      ${halo}</g>`;
  };
  const doorEl=(x,y,w,h,lines)=>{
    const mid=h/(lines.length+1);
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="#1d4ed8" stroke="#3b82f6" stroke-width="1"/>
      ${lines.map((l,i)=>`<text x="${x+w/2}" y="${y+mid*(i+1)}" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="monospace" font-weight="700" fill="#bfdbfe">${l}</text>`).join('')}`;
  };
  const emergEl=(x,y,w,h,lines)=>{
    const mid=h/(lines.length+1);
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="#854d0e" stroke="#fbbf24" stroke-width="1.5"/>
      ${lines.map((l,i)=>`<text x="${x+w/2}" y="${y+mid*(i+1)}" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="monospace" font-weight="700" fill="#fef08a">${l}</text>`).join('')}`;
  };
  const nbEl=(x,y,w,h)=>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="#450a0a" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4,2"/>
     <text x="${x+w/2}" y="${y+h*.28}" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="monospace" font-weight="700" fill="#fca5a5">Zona con</text>
     <text x="${x+w/2}" y="${y+h*.50}" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="monospace" font-weight="700" fill="#fca5a5">prohibición de</text>
     <text x="${x+w/2}" y="${y+h*.72}" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="monospace" font-weight="700" fill="#fca5a5">bloquear</text>`;
  const roadEl=(W,H,lt,rt)=>
    `<rect x="0" y="0" width="${W}" height="${RD}" fill="#1e3358"/>
     <rect x="0" y="${H-RD}" width="${W}" height="${RD}" fill="#1e3358"/>
     <line x1="0" y1="${RD/2}" x2="${W}" y2="${RD/2}" stroke="#facc15" stroke-width="1.5" stroke-dasharray="10,5" opacity=".7"/>
     <line x1="0" y1="${H-RD/2}" x2="${W}" y2="${H-RD/2}" stroke="#facc15" stroke-width="1.5" stroke-dasharray="10,5" opacity=".7"/>
     <text x="8" y="${RD/2}" text-anchor="start" dominant-baseline="middle" font-size="8" font-family="monospace" font-weight="700" fill="#facc15">${lt}</text>
     <text x="${W-8}" y="${H-RD/2}" text-anchor="end" dominant-baseline="middle" font-size="8" font-family="monospace" font-weight="700" fill="#facc15">${rt}</text>`;
  const lblEl=(x,y,lines,fill='#334155',sz=9)=>
    lines.map((l,i)=>`<text x="${x}" y="${y+i*13}" text-anchor="middle" dominant-baseline="middle" font-size="${sz}" font-family="monospace" font-weight="700" fill="${fill}">${l}</text>`).join('');

  let svg='',W=0,H=0;

  if(sec===1){
    const cI=[64,63,62,61,60,59,58],cD=[51,50,49,48,47,46,45],bI=[57,56,55,54,53,52],bD=[44,43,42,41,40,39];
    const PASO=200; W=PAD+DW+G+SW+G+PASO+G+SW+G+DW+PAD;
    const rows=cI.length+1+bI.length; H=RD+PAD+rows*(SH+G)-G+PAD+RD;
    const xL=PAD+DW+G,xR=W-PAD-DW-G-SW,y0=RD+PAD;
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
    const der=[38,37,36,35,34,33,32,31,30,29],PASO=180;
    W=PAD+SW+G+PASO+G+SW+G+DW+PAD;
    const izqH=NBH+G+SH+G+SH+G+SH+G+SH+G+NBH,derH=der.length*(SH+G)-G,contH=Math.max(izqH,derH);
    H=RD+PAD+contH+PAD+RD;
    const xI=PAD,xD=W-PAD-DW-G-SW,xDr=W-PAD-DW,y0=RD+PAD;
    svg+=`<rect width="${W}" height="${H}" fill="#0f172a" rx="8"/>`;
    svg+=roadEl(W,H,'← Salida 3 Oriente','Salida 4 Oriente →');
    svg+=doorEl(xDr,4,DW,RD-6,['Puerta de','acceso 1038']);
    let y=y0;
    svg+=nbEl(xI,y,SW,NBH); y+=NBH+G;
    svg+=spotEl(28,xI,y); y+=SH+G; y+=SH+G;
    svg+=spotEl(27,xI,y); y+=SH+G; y+=SH+G;
    svg+=nbEl(xI,y,SW,NBH);
    svg+=lblEl(PAD+SW+G+PASO/2,y0+contH/2-6,['Estacionamientos','Patio Central']);
    der.forEach((id,i)=>{svg+=spotEl(id,xD,y0+i*(SH+G));});
    svg+=`<rect x="${xDr}" y="${y0}" width="${DW}" height="${contH}" rx="4" fill="#1d4ed8" stroke="#3b82f6" stroke-width="1"/>
          <text x="${xDr+DW/2}" y="${y0+contH/2}" text-anchor="middle" dominant-baseline="middle" font-size="7.5" font-family="monospace" font-weight="700" fill="#bfdbfe" transform="rotate(-90,${xDr+DW/2},${y0+contH/2})">Puerta de acceso 1052</text>`;
    svg+=doorEl(xDr,H-RD+2,DW,RD-6,['Puerta de','acceso 1052']);
  }
  if(sec===3){
    const PASO=200,YGAP=G;
    W=PAD+DW+G+SW+G+PASO+G+SW+G+DW+PAD;
    const xDL=PAD,xCL=PAD+DW+G,xPaso=xCL+SW+G,xCR=xPaso+PASO+G,xDR=xCR+SW+G;
    const yGray=RD,grayH=16,yTopSpots=yGray+grayH+G,yDoors=yTopSpots+SH+G,doorH=40;
    const yComedor=yDoors+doorH+G,comedorH=SH+16,y8=yComedor+comedorH+G,yBody=y8+SH+G;
    const cI=[18,19,20,21,22,23,24,25,26],cD=[9,10,11,12,13,14,15,16,17];
    const bodyH=Math.max(cI.length,cD.length)*(SH+YGAP)-YGAP;
    H=yBody+bodyH+PAD+RD;
    svg+=`<rect width="${W}" height="${H}" fill="#0f172a" rx="8"/>`;
    svg+=roadEl(W,H,'← Salida 3 Oriente','Salida 4 Oriente →');
    svg+=`<rect x="0" y="${yGray}" width="${W}" height="${grayH}" fill="#1a2535" stroke="#1e3a5f" stroke-width="1"/>`;
    const top=[6,5,4,3,2,1],tW=top.length*(SW+G)-G,tX=(W-tW)/2;
    top.forEach((id,i)=>{svg+=spotEl(id,tX+i*(SW+G),yTopSpots,SW,SH);});
    svg+=doorEl(xDL,yDoors,DW,doorH,['Puerta de','acceso 1052']);
    svg+=`<rect x="${xCL}" y="${yDoors}" width="${SW}" height="${doorH}" rx="4" fill="#facc15" stroke="#b45309" stroke-width="1.5"/>`;
    svg+=doorEl(xDR,yDoors,DW,doorH,['Puerta de','acceso 1081']);
    svg+=`<rect x="${xCR}" y="${yDoors}" width="${SW}" height="${doorH}" rx="4" fill="#facc15" stroke="#b45309" stroke-width="1.5"/>`;
    const comX=xPaso,comW=PASO*.65|0;
    svg+=`<rect x="${comX}" y="${yComedor}" width="${comW}" height="${comedorH}" rx="4" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>`;
    svg+=`<text x="${comX+comW/2}" y="${yComedor+comedorH/2-6}" text-anchor="middle" dominant-baseline="middle" font-size="8" font-family="monospace" font-weight="700" fill="#64748b">Comedor y</text>`;
    svg+=`<text x="${comX+comW/2}" y="${yComedor+comedorH/2+7}" text-anchor="middle" dominant-baseline="middle" font-size="8" font-family="monospace" font-weight="700" fill="#64748b">Camarines</text>`;
    svg+=spotEl(7,xCR,yComedor,SW,comedorH);
    svg+=spotEl(8,xCR,y8,SW,SH);
    cI.forEach((id,i)=>{svg+=spotEl(id,xCL,yBody+i*(SH+YGAP));});
    cD.forEach((id,i)=>{svg+=spotEl(id,xCR,yBody+i*(SH+YGAP));});
    const yMid=yBody+3*(SH+YGAP);
    svg+=doorEl(xDL,yMid,DW,SH,['Puerta de','acceso 1052']);
    svg+=doorEl(xDR,yMid,DW,SH,['Puerta de','acceso 1061']);
    svg+=lblEl(W/2,yBody+bodyH/2,['Estacionamiento 4 Oriente /','12 Norte']);
  }

  const handleClick=(e)=>{
    const g=e.target.closest('[data-id]');
    if(g&&onSpotClick){const id=parseInt(g.getAttribute('data-id'));const sp=SPOTS_DATA.find(s=>s.id===id);if(sp)onSpotClick(sp);}
  };
  return (
    <div style={{overflowX:'auto',borderRadius:8}}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{display:'block',width:'100%',minWidth:320,borderRadius:8}}
        dangerouslySetInnerHTML={{__html:svg}} onClick={handleClick}/>
    </div>
  );
};

// ── Small components ──
const Toast = ({msg,type}) => (
  <div style={{position:"fixed",bottom:28,left:"50%",transform:"translateX(-50%)",background:type==="error"?"#7f1d1d":type==="info"?"#1e3a5f":"#064e3b",color:"white",padding:"12px 22px",borderRadius:12,fontSize:13,fontWeight:700,boxShadow:"0 8px 32px rgba(0,0,0,.4)",zIndex:400,whiteSpace:"nowrap",border:`1px solid ${type==="error"?"#dc2626":type==="info"?"#2563eb":"#16a34a"}`}}>
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
  const sc=SC[spot.sector];
  const [patentes,setPatentes]=useState(record?.patentes||[""]);
  const [propietario,setPropietario]=useState(record?.propietario||"");
  const [telefono,setTelefono]=useState(record?.telefono||"");
  const [vehiculo,setVehiculo]=useState(record?.vehiculo||"");
  const [historial,setHistorial]=useState([]);
  const [showHist,setShowHist]=useState(false);
  const [loadingHist,setLoadingHist]=useState(false);

  const toggleHist=async()=>{
    if(!showHist&&historial.length===0){
      setLoadingHist(true);
      const h=await loadHistorial(spot.id);
      setHistorial(h);
      setLoadingHist(false);
    }
    setShowHist(v=>!v);
  };

  const save=()=>{
    const c=patentes.filter(p=>p.trim());
    onSave({patentes:c,propietario,telefono,vehiculo,updatedAt:new Date().toISOString()});
    addHistorial(spot.id,"Edición staff",`Patentes: ${c.join(", ")||"—"} · ${propietario||"sin nombre"}`);
  };

  const accionColor={
    "Registro inicial":"#22c55e",
    "Modificación":"#3b82f6",
    "Edición staff":"#a855f7",
    "Liberación":"#ef4444",
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.72)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:16,backdropFilter:"blur(6px)"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:"#0f172a",border:`1.5px solid ${sc.accent}50`,borderRadius:18,width:"100%",maxWidth:420,overflow:"hidden",boxShadow:"0 24px 64px rgba(0,0,0,.7)",maxHeight:"90vh",overflowY:"auto"}}>
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
            <label style={{fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:0.5,display:"block",marginBottom:8}}>Patentes</label>
            {patentes.map((p,i)=>(
              <div key={i} style={{display:"flex",gap:6,marginBottom:7}}>
                <input value={p} onChange={e=>setPatentes(pt=>pt.map((x,j)=>j===i?e.target.value.toUpperCase():x))} placeholder={`Patente ${i+1}`} maxLength={8}
                  style={{flex:1,padding:"10px 14px",borderRadius:9,fontSize:15,fontWeight:800,border:"1.5px solid #1e3a5f",background:"#1e293b",color:"white",outline:"none",fontFamily:"monospace",letterSpacing:3,textTransform:"uppercase"}}/>
                {patentes.length>1&&<button onClick={()=>setPatentes(pt=>pt.filter((_,j)=>j!==i))} style={{padding:"0 11px",borderRadius:9,border:"1.5px solid #7f1d1d",background:"#450a0a",color:"#f87171",cursor:"pointer",fontSize:15}}>−</button>}
              </div>
            ))}
            {patentes.length<5&&<button onClick={()=>setPatentes(p=>[...p,""])} style={{width:"100%",padding:"7px",borderRadius:9,border:`1.5px dashed ${sc.accent}70`,background:"rgba(255,255,255,.03)",color:sc.accent,cursor:"pointer",fontSize:12,fontWeight:600}}>+ Agregar patente</button>}
          </div>
          {[["Propietario",propietario,setPropietario,"Nombre completo"],["Teléfono",telefono,setTelefono,"+56 9 ..."],["Vehículo",vehiculo,setVehiculo,"Marca/Color"]].map(([lbl,val,setter,ph])=>(
            <div key={lbl} style={{display:"flex",flexDirection:"column",gap:4}}>
              <label style={{fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:0.5}}>{lbl}</label>
              <input value={val} onChange={e=>setter(e.target.value)} placeholder={ph} style={{padding:"8px 11px",borderRadius:8,fontSize:13,border:"1.5px solid #1e3a5f",background:"#1e293b",color:"white",outline:"none",fontFamily:"inherit"}}/>
            </div>
          ))}

          {/* Historial */}
          <div>
            <button onClick={toggleHist} style={{width:"100%",padding:"8px",borderRadius:8,border:"1px solid #1e3a5f",background:"transparent",color:"#64748b",fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span>🕐 Historial de cambios</span>
              <span>{showHist?"▲":"▼"}</span>
            </button>
            {showHist&&(
              <div style={{marginTop:8,background:"#0a0f1e",borderRadius:8,padding:10,border:"1px solid #1e293b"}}>
                {loadingHist&&<div style={{color:"#4b5563",fontSize:11,textAlign:"center",padding:8}}>Cargando...</div>}
                {!loadingHist&&historial.length===0&&<div style={{color:"#4b5563",fontSize:11,textAlign:"center",padding:8}}>Sin historial registrado</div>}
                {historial.map((h,i)=>(
                  <div key={i} style={{display:"flex",gap:8,marginBottom:8,paddingBottom:8,borderBottom:i<historial.length-1?"1px solid #1e293b":"none"}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:accionColor[h.accion]||"#64748b",marginTop:4,flexShrink:0}}/>
                    <div style={{flex:1}}>
                      <div style={{fontSize:11,fontWeight:700,color:accionColor[h.accion]||"#94a3b8"}}>{h.accion}</div>
                      <div style={{fontSize:10,color:"#475569",marginTop:2}}>{h.detalle}</div>
                      <div style={{fontSize:9,color:"#334155",marginTop:2}}>{h.created_at?new Date(h.created_at).toLocaleString("es-CL"):""}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div style={{padding:"0 20px 20px",display:"flex",gap:8,justifyContent:"space-between"}}>
          <div>{record&&<button onClick={()=>{addHistorial(spot.id,"Liberación",`Liberado por staff`);onDelete();}} style={{padding:"9px 16px",borderRadius:9,border:"1.5px solid #7f1d1d",background:"#450a0a",color:"#f87171",fontWeight:700,fontSize:12,cursor:"pointer"}}>Liberar</button>}</div>
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
    <div style={{background:"#1e293b",borderRadius:16,padding:28,maxWidth:320,width:"100%",border:"1.5px solid #334155",textAlign:"center"}}>
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

// ── ReclamoModal ──
const ReclamoModal = ({spot,record,onClose,onSent}) => {
  const [patenteIntrusa,setPatenteIntrusa]=useState("");
  const [descripcion,setDescripcion]=useState("");
  const [error,setError]=useState("");
  const [sending,setSending]=useState(false);

  const enviar=async()=>{
    if(!descripcion.trim()){setError("Describe brevemente la situación");return;}
    setSending(true);
    const reclamo={
      spot_id:spot.id,
      torre:spot.torre,
      depto:spot.depto,
      sector:spot.sector,
      nombre_residente:record?.nombre||record?.propietario||"—",
      patente_intrusa:patenteIntrusa.trim().toUpperCase().replace(/[^A-Z0-9]/g,"")||null,
      descripcion:descripcion.trim(),
      estado:"pendiente",
    };
    await insertReclamo(reclamo);
    sendEmail({
      tipo:"Reclamo de ocupación indebida",
      nombre:reclamo.nombre_residente,
      torre:TORRES_LABELS[spot.torre]||spot.torre,
      depto:spot.depto,
      estac_id:spot.id,
      sector:SECTOR_NAMES[spot.sector],
      patente_intrusa:reclamo.patente_intrusa||"No especificada",
      descripcion:reclamo.descripcion,
      fecha:new Date().toLocaleString("es-CL"),
    });
    setSending(false);
    onSent&&onSent();
    onClose();
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.72)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:250,padding:16,backdropFilter:"blur(6px)"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:"white",borderRadius:18,width:"100%",maxWidth:420,overflow:"hidden",boxShadow:"0 24px 64px rgba(0,0,0,.5)",maxHeight:"90vh",overflowY:"auto"}}>
        <div style={{padding:"18px 20px",background:"#fef2f2",borderBottom:"1px solid #fecaca"}}>
          <div style={{fontSize:16,fontWeight:800,color:"#b91c1c"}}>⚠️ Reportar ocupación indebida</div>
          <div style={{fontSize:12,color:"#7f1d1d",marginTop:2}}>Estacionamiento #{spot.id} · Torre {spot.torre} · {spot.depto}</div>
        </div>
        <div style={{padding:"18px 20px",display:"flex",flexDirection:"column",gap:14}}>
          <div>
            <label style={{fontSize:11,fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:0.5,display:"block",marginBottom:6}}>Patente del vehículo intruso <span style={{fontWeight:400,textTransform:"none",color:"#94a3b8"}}>(opcional)</span></label>
            <input value={patenteIntrusa} onChange={e=>setPatenteIntrusa(e.target.value)} placeholder="Ej: ABCD12" maxLength={8}
              style={{width:"100%",padding:"10px 12px",borderRadius:8,fontSize:15,fontWeight:800,border:"1.5px solid #e2e8f0",outline:"none",fontFamily:"monospace",letterSpacing:2,textTransform:"uppercase",boxSizing:"border-box"}}/>
          </div>
          <div>
            <label style={{fontSize:11,fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:0.5,display:"block",marginBottom:6}}>Descripción <span style={{color:"#e53e3e"}}>*</span></label>
            <textarea value={descripcion} onChange={e=>{setDescripcion(e.target.value);setError("");}} placeholder="Describe lo que está ocurriendo..." rows={4}
              style={{width:"100%",padding:"10px 12px",borderRadius:8,fontSize:13,border:`1.5px solid ${error?"#e53e3e":"#e2e8f0"}`,outline:"none",fontFamily:"inherit",resize:"vertical",boxSizing:"border-box"}}/>
            {error&&<span style={{fontSize:10,color:"#e53e3e"}}>{error}</span>}
          </div>
        </div>
        <div style={{padding:"0 20px 20px",display:"flex",gap:8}}>
          <button onClick={onClose} style={{flex:1,padding:"11px",borderRadius:9,border:"1.5px solid #e2e8f0",background:"white",color:"#475569",fontWeight:600,fontSize:13,cursor:"pointer"}}>Cancelar</button>
          <button onClick={enviar} disabled={sending} style={{flex:1,padding:"11px",borderRadius:9,border:"none",background:sending?"#fca5a5":"#dc2626",color:"white",fontWeight:800,fontSize:13,cursor:sending?"default":"pointer"}}>{sending?"Enviando...":"Enviar reclamo"}</button>
        </div>
      </div>
    </div>
  );
};

// ── ReclamosTab (staff) ──
const ReclamosTab = () => {
  const [reclamos2,setReclamos2]=useState([]);
  const [loadingR,setLoadingR]=useState(true);
  const [filtroEstado,setFiltroEstado]=useState("pendiente");

  const refresh=()=>{setLoadingR(true);loadReclamos().then(d=>{setReclamos2(d);setLoadingR(false);});};

  useEffect(()=>{refresh();},[]);

  const estadoColor={pendiente:"#f59e0b",atendido:"#22c55e",descartado:"#6b7280"};
  const estadoLabel={pendiente:"Pendiente",atendido:"Atendido",descartado:"Descartado"};

  const marcar=async(id,estado)=>{
    await updateReclamo(id,{estado});
    setReclamos2(prev=>prev.map(x=>x.id===id?{...x,estado}:x));
  };

  const listados=filtroEstado==="todos"?reclamos2:reclamos2.filter(r=>r.estado===filtroEstado);

  return <div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
      <div style={{fontSize:13,fontWeight:700,color:"white"}}>⚠️ Reclamos de residentes</div>
      <div style={{display:"flex",gap:6,alignItems:"center"}}>
        <select value={filtroEstado} onChange={e=>setFiltroEstado(e.target.value)}
          style={{padding:"6px 8px",borderRadius:7,fontSize:11,border:"1px solid #1f2937",background:"#0a0f1e",color:"white",cursor:"pointer"}}>
          <option value="todos">Todos</option>
          <option value="pendiente">Pendientes</option>
          <option value="atendido">Atendidos</option>
          <option value="descartado">Descartados</option>
        </select>
        <button onClick={refresh} style={{padding:"6px 12px",borderRadius:8,border:"1px solid #1f2937",background:"transparent",color:"#64748b",fontSize:11,cursor:"pointer"}}>↺ Actualizar</button>
      </div>
    </div>
    {loadingR&&<div style={{textAlign:"center",padding:32,color:"#4b5563"}}>Cargando...</div>}
    {!loadingR&&listados.length===0&&(
      <div style={{textAlign:"center",padding:32,background:"#111827",borderRadius:12,border:"1px solid #1f2937"}}>
        <div style={{fontSize:32,marginBottom:8}}>✅</div>
        <div style={{color:"#4b5563",fontSize:13}}>No hay reclamos {filtroEstado!=="todos"?estadoLabel[filtroEstado]?.toLowerCase():""}</div>
      </div>
    )}
    {listados.map(r=>(
      <div key={r.id} style={{background:"#111827",borderRadius:12,padding:16,marginBottom:10,border:`1px solid ${estadoColor[r.estado]||"#1f2937"}30`,borderLeft:`3px solid ${estadoColor[r.estado]||"#1f2937"}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
          <div>
            <div style={{fontSize:12,fontWeight:700,color:"white"}}>Estac. #{r.spot_id} · {TORRES_LABELS[r.torre]||r.torre} {r.depto}</div>
            <div style={{fontSize:10,color:"#4b5563",marginTop:2}}>{r.nombre_residente} · {r.created_at?new Date(r.created_at).toLocaleString("es-CL"):""}</div>
          </div>
          <div style={{padding:"3px 8px",borderRadius:6,background:(estadoColor[r.estado]||"#6b7280")+"20",border:`1px solid ${estadoColor[r.estado]||"#6b7280"}50`,fontSize:10,fontWeight:700,color:estadoColor[r.estado]||"#6b7280",whiteSpace:"nowrap"}}>
            {estadoLabel[r.estado]||r.estado}
          </div>
        </div>
        {r.patente_intrusa&&<div style={{fontSize:11,color:"#f87171",marginBottom:6}}>🚗 Patente intrusa: <strong style={{fontFamily:"monospace",letterSpacing:1}}>{r.patente_intrusa}</strong></div>}
        <div style={{fontSize:12,color:"#94a3b8",lineHeight:1.5,marginBottom:10}}>{r.descripcion}</div>
        <div style={{display:"flex",gap:6}}>
          {r.estado==="pendiente"&&<>
            <button onClick={()=>marcar(r.id,"atendido")}
              style={{flex:1,padding:"7px",borderRadius:7,border:"1px solid #22c55e",background:"rgba(34,197,94,.1)",color:"#22c55e",fontSize:11,fontWeight:700,cursor:"pointer"}}>✅ Marcar atendido</button>
            <button onClick={()=>marcar(r.id,"descartado")}
              style={{flex:1,padding:"7px",borderRadius:7,border:"1px solid #6b7280",background:"rgba(107,114,128,.1)",color:"#6b7280",fontSize:11,fontWeight:700,cursor:"pointer"}}>✕ Descartar</button>
          </>}
          {r.estado!=="pendiente"&&<div style={{fontSize:11,color:"#334155"}}>Resuelto</div>}
        </div>
      </div>
    ))}
  </div>;
};

// ── INACTIVIDAD ──
const INACTIVITY_MINUTES = 15;

const useInactivity = (onTimeout) => {
  const timer = useRef(null);
  const reset = useCallback(() => {
    if(timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(onTimeout, INACTIVITY_MINUTES * 60 * 1000);
  }, [onTimeout]);

  useEffect(() => {
    const events = ["mousemove","keydown","click","scroll","touchstart"];
    events.forEach(e => window.addEventListener(e, reset));
    reset();
    return () => {
      events.forEach(e => window.removeEventListener(e, reset));
      if(timer.current) clearTimeout(timer.current);
    };
  }, [reset]);
};
let loginInProgress = false;

// ── STAFF LOGIN ──
const StaffLogin = ({onSuccess,onBack}) => {
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);
  useEffect(()=>{loginInProgress=false;},[]);

  const login=async()=>{
    if(loginInProgress)return;
    if(!email.trim()||!pass.trim()){setError("Completa todos los campos.");return;}
    loginInProgress=true; setLoading(true); setError("");
    try{
      const res=await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`,{
        method:"POST",
        headers:{"Content-Type":"application/json","apikey":SUPABASE_KEY,"Authorization":`Bearer ${SUPABASE_KEY}`},
        body:JSON.stringify({email:email.trim(),password:pass}),
      });
      const data=await res.json();
      if(data.access_token){loginInProgress=false;onSuccess();}
      else{setError(data.error_description||data.msg||"Correo o contraseña incorrectos.");loginInProgress=false;setLoading(false);}
    }catch(e){setError("Error de conexión.");loginInProgress=false;setLoading(false);}
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
              <input type="email" value={email} onChange={e=>{setEmail(e.target.value);setError("");}} placeholder="correo@ejemplo.com"
                style={{width:"100%",padding:"12px 14px",borderRadius:10,fontSize:14,border:`1.5px solid ${error?"#7f1d1d":"#1f2937"}`,background:"#0a0f1e",color:"white",outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
            </div>
            <div>
              <label style={{fontSize:11,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:0.5,display:"block",marginBottom:6}}>Contraseña</label>
              <input type="password" value={pass} onChange={e=>{setPass(e.target.value);setError("");}} placeholder="••••••••"
                style={{width:"100%",padding:"12px 14px",borderRadius:10,fontSize:14,border:`1.5px solid ${error?"#7f1d1d":"#1f2937"}`,background:"#0a0f1e",color:"white",outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
            </div>
            {error&&<div style={{padding:"10px 14px",borderRadius:8,background:"#450a0a",border:"1px solid #7f1d1d",fontSize:12,color:"#fca5a5"}}>⚠️ {error}</div>}
            <button onClick={login} disabled={loading}
              style={{padding:"13px",borderRadius:10,border:"none",background:loading?"#374151":"linear-gradient(135deg,#1d4ed8,#2563eb)",color:"white",fontWeight:800,fontSize:15,cursor:loading?"not-allowed":"pointer",marginTop:4,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              {loading?<><span style={{width:16,height:16,border:"2px solid rgba(255,255,255,.3)",borderTop:"2px solid white",borderRadius:"50%",display:"inline-block",animation:"spin 1s linear infinite"}}/> Verificando...</>:"Ingresar →"}
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

// ── HOME ──
const HomeScreen = ({onGo}) => {
  const [show,setShow]=useState(false);
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
const QueryTab = ({records, reportMode=false, onReportDone}) => {
  const [mode,setMode]=useState("patente");
  const [queryPat,setQueryPat]=useState("");
  const [queryTorre,setQueryTorre]=useState("");
  const [queryDepto,setQueryDepto]=useState("");
  const [result,setResult]=useState(null);
  const [reclamo,setReclamo]=useState(null);
  const [toast,setToast]=useState(null);
  const showToast=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),2800);};
  const deptosFiltrados=queryTorre?DEPTOS_ALL.filter(d=>BY_TD[`${queryTorre}-${d}`]):[];

  // Auto-open reclamo modal when found in reportMode
  const openReclamo=(spot,record)=>{
    setReclamo({spot,record});
  };

  const buscarPatente=()=>{
    if(!queryPat.trim())return;
    const q=queryPat.trim().toUpperCase().replace(/[^A-Z0-9]/g,"");
    let res=null;
    for(const s of SPOTS_DATA){const rec=records[s.id];if(rec?.patentes?.some(p=>p.toUpperCase().replace(/[^A-Z0-9]/g,"")===q)){res={spot:s,record:rec};break;}}
    setResult(res||"not_found");
  };
  const buscarDireccion=(torreOverride,deptoOverride)=>{
    const t=torreOverride||queryTorre,d=deptoOverride||queryDepto;
    if(!t||!d)return;
    const spot=BY_TD[`${t}-${d}`];
    if(!spot){setResult("not_found");return;}
    const rec=records[spot.id];
    if(!rec){setResult({spot,notReg:true});return;}
    const res={spot,record:rec};
    setResult(res);
    if(reportMode) openReclamo(spot,rec);
  };
  const reset=()=>{setResult(null);setQueryPat("");setQueryTorre("");setQueryDepto("");};

  const [notified,setNotified]=useState(false);
  const buscarReporte=()=>{
    if(!queryPat.trim())return;
    const q=queryPat.trim().toUpperCase().replace(/[^A-Z0-9]/g,"");
    let res=null;
    for(const s of SPOTS_DATA){const rec=records[s.id];if(rec?.patentes?.some(p=>p.toUpperCase().replace(/[^A-Z0-9]/g,"")===q)){res={spot:s,record:rec};break;}}
    if(res){setResult(res);}
    else{setResult("not_found");}
  };
  const notificarAdmin=()=>{
    sendEmail({
      tipo:"Patente no registrada - Posible ocupación indebida",
      patente:queryPat.trim().toUpperCase().replace(/[^A-Z0-9]/g,""),
      fecha:new Date().toLocaleString("es-CL"),
      mensaje:"Un residente reportó ocupación indebida pero su patente no está registrada en el sistema.",
    });
    setNotified(true);
    showToast("Administración notificada","info");
  };

  // ── REPORT MODE: patente-first flow ──
  if(reportMode){
    return (
      <div>
        <div style={{background:"#fef2f2",border:"1.5px solid #fecaca",borderRadius:14,padding:"14px 18px",marginBottom:18,display:"flex",gap:12,alignItems:"flex-start"}}>
          <span style={{fontSize:22,flexShrink:0}}>⚠️</span>
          <div>
            <div style={{fontSize:13,fontWeight:800,color:"#b91c1c",marginBottom:2}}>Reportar ocupación indebida</div>
            <div style={{fontSize:12,color:"#7f1d1d",lineHeight:1.5}}>Ingresa tu patente para identificar tu estacionamiento y enviar el reclamo.</div>
          </div>
        </div>

        {!result&&(
          <div style={{background:"white",borderRadius:16,padding:24,boxShadow:"0 2px 12px rgba(0,0,0,.06)"}}>
            <label style={{fontSize:11,fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:0.5,display:"block",marginBottom:8}}>Tu patente <span style={{color:"#e53e3e"}}>*</span></label>
            <div style={{display:"flex",gap:10}}>
              <input value={queryPat} onChange={e=>{setQueryPat(e.target.value);setResult(null);setNotified(false);}} onKeyDown={e=>e.key==="Enter"&&buscarReporte()} placeholder="ABCD12" maxLength={8}
                style={{flex:1,padding:"14px 16px",borderRadius:10,fontSize:20,fontWeight:900,border:"2px solid #fecaca",background:"#fff5f5",color:"#0f172a",outline:"none",fontFamily:"monospace",textTransform:"uppercase",letterSpacing:3}}/>
              <button onClick={buscarReporte}
                style={{padding:"14px 20px",borderRadius:10,border:"none",background:"#dc2626",color:"white",fontWeight:800,fontSize:14,cursor:"pointer"}}>Buscar</button>
            </div>
          </div>
        )}

        {result==="not_found"&&!notified&&(
          <div style={{background:"white",borderRadius:16,padding:24,boxShadow:"0 2px 12px rgba(0,0,0,.06)"}}>
            <div style={{textAlign:"center",marginBottom:16}}>
              <div style={{fontSize:36,marginBottom:8}}>❓</div>
              <div style={{fontSize:15,fontWeight:800,color:"#0f172a",marginBottom:4}}>Patente no registrada</div>
              <div style={{fontSize:12,color:"#64748b",lineHeight:1.5,marginBottom:4}}>La patente <strong style={{fontFamily:"monospace",letterSpacing:1}}>{queryPat.toUpperCase()}</strong> no está en el sistema.</div>
              <div style={{fontSize:12,color:"#64748b",lineHeight:1.5}}>¿Igualmente hay un vehículo no autorizado en tu estacionamiento? Podemos notificar a administración.</div>
            </div>
            <button onClick={notificarAdmin}
              style={{width:"100%",padding:"12px",borderRadius:10,border:"none",background:"#dc2626",color:"white",fontWeight:800,fontSize:14,cursor:"pointer",marginBottom:8}}>
              📢 Notificar a administración
            </button>
            <button onClick={()=>{setResult(null);setQueryPat("");setNotified(false);}}
              style={{width:"100%",padding:"10px",borderRadius:10,border:"1.5px solid #e2e8f0",background:"white",color:"#475569",fontWeight:600,fontSize:13,cursor:"pointer"}}>
              ← Intentar con otra patente
            </button>
          </div>
        )}

        {result==="not_found"&&notified&&(
          <div style={{background:"#f0fdf4",border:"1.5px solid #bbf7d0",borderRadius:16,padding:28,textAlign:"center"}}>
            <div style={{fontSize:36,marginBottom:8}}>✅</div>
            <div style={{fontSize:15,fontWeight:800,color:"#166534",marginBottom:6}}>Administración notificada</div>
            <div style={{fontSize:12,color:"#15803d",lineHeight:1.5}}>El equipo de administración fue alertado y revisará la situación a la brevedad.</div>
            <button onClick={()=>{onReportDone&&onReportDone();}} style={{marginTop:16,padding:"10px 24px",borderRadius:9,border:"none",background:"#16a34a",color:"white",fontWeight:700,fontSize:13,cursor:"pointer"}}>Volver al inicio</button>
          </div>
        )}

        {result&&result!=="not_found"&&(()=>{
          const {spot,record}=result,sc5=SC[spot.sector];
          return <div>
            <div style={{background:sc5.bg,borderRadius:16,overflow:"hidden",marginBottom:14,boxShadow:"0 4px 16px rgba(0,0,0,.15)"}}>
              <div style={{padding:"16px 20px",background:"rgba(255,255,255,.08)",borderBottom:"1px solid rgba(255,255,255,.1)",display:"flex",alignItems:"center",gap:12}}>
                <div style={{fontSize:32}}>✅</div>
                <div>
                  <div style={{fontSize:10,color:sc5.accent,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5,marginBottom:2}}>Estacionamiento encontrado</div>
                  <div style={{fontSize:20,fontWeight:900,fontFamily:"monospace",color:"white"}}>#{spot.id}</div>
                </div>
              </div>
              <div style={{padding:"16px 20px",display:"flex",flexDirection:"column",gap:10}}>
                <RowItem icon="📍" label="Sector" value={SECTOR_NAMES[spot.sector]}/>
                <RowItem icon="🏢" label="Torre" value={TORRES_LABELS[spot.torre]||spot.torre}/>
                <RowItem icon="🏠" label="Departamento" value={spot.depto}/>
                <RowItem icon="👤" label="Registrado a nombre de" value={record.nombre||"—"}/>
              </div>
            </div>
            <button onClick={()=>openReclamo(spot,record)}
              style={{width:"100%",padding:"14px",borderRadius:12,border:"none",background:"#dc2626",color:"white",fontWeight:800,fontSize:15,cursor:"pointer",boxShadow:"0 4px 14px rgba(220,38,38,.4)"}}>
              ⚠️ Reportar ocupación indebida
            </button>
            <button onClick={()=>{setResult(null);setQueryPat("");}} style={{width:"100%",marginTop:8,padding:"10px",borderRadius:10,border:"1.5px solid #e2e8f0",background:"white",color:"#475569",fontWeight:600,fontSize:12,cursor:"pointer"}}>← Buscar otra patente</button>
          </div>;
        })()}

        {reclamo&&<ReclamoModal spot={reclamo.spot} record={reclamo.record} onClose={()=>{setReclamo(null);reset();}} onSent={()=>{showToast("Reclamo enviado a administración","info");setTimeout(()=>onReportDone&&onReportDone(),1800);}}/>}
        {toast&&<Toast msg={toast.msg} type={toast.type}/>}
      </div>
    );
  }

  // ── NORMAL QUERY MODE ──
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
          <p style={{margin:"0 0 16px",fontSize:13,color:"#64748b"}}>Ingresa la patente para verificar si está registrada.</p>
          <div style={{display:"flex",gap:10}}>
            <input value={queryPat} onChange={e=>{setQueryPat(e.target.value);setResult(null);}} onKeyDown={e=>e.key==="Enter"&&buscarPatente()} placeholder="ABCD12" maxLength={8}
              style={{flex:1,padding:"13px 16px",borderRadius:10,fontSize:18,fontWeight:900,border:"2px solid #e2e8f0",background:"white",color:"#0f172a",outline:"none",fontFamily:"monospace",textTransform:"uppercase",letterSpacing:3}}/>
            <button onClick={buscarPatente} style={{padding:"13px 20px",borderRadius:10,border:"none",background:"#2563eb",color:"white",fontWeight:800,fontSize:14,cursor:"pointer"}}>Buscar</button>
          </div>
        </div>
      )}
      {mode==="direccion"&&(
        <div style={{background:"white",borderRadius:16,padding:24,marginBottom:16,boxShadow:"0 2px 12px rgba(0,0,0,.06)"}}>
          <h2 style={{margin:"0 0 6px",fontSize:17,fontWeight:800,color:"#0f172a"}}>Consultar por Dirección</h2>
          <p style={{margin:"0 0 16px",fontSize:13,color:"#64748b"}}>Selecciona tu torre y letra para ver tu estacionamiento.</p>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <select value={queryTorre} onChange={e=>{setQueryTorre(e.target.value);setQueryDepto("");setResult(null);}}
              style={{width:"100%",padding:"11px 12px",borderRadius:9,fontSize:14,fontWeight:600,border:"1.5px solid #e2e8f0",background:"white",outline:"none",cursor:"pointer",fontFamily:"monospace"}}>
              <option value="">— Selecciona la dirección —</option>
              {TORRES.map(t=><option key={t} value={t}>{TORRES_LABELS[t]}</option>)}
            </select>
            <select value={queryDepto} onChange={e=>{setQueryDepto(e.target.value);setResult(null);}} disabled={!queryTorre}
              style={{width:"100%",padding:"11px 12px",borderRadius:9,fontSize:14,fontWeight:600,border:"1.5px solid #e2e8f0",background:queryTorre?"white":"#f8fafc",outline:"none",cursor:queryTorre?"pointer":"not-allowed",fontFamily:"monospace"}}>
              <option value="">— Selecciona letra/block —</option>
              {deptosFiltrados.map(d=><option key={d} value={d}>{d}</option>)}
            </select>
            <button onClick={()=>buscarDireccion()} disabled={!queryTorre||!queryDepto}
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
          <div style={{fontSize:12,color:"#b45309",marginBottom:16}}>{mode==="patente"?"Esta patente no está registrada.":"No existe asignación para esta combinación."}</div>
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
          <div style={{fontSize:12,color:"#0369a1",marginBottom:16}}>Ve a <strong>Ingresar Datos</strong> para registrarte.</div>
          <button onClick={reset} style={{padding:"9px 20px",borderRadius:8,border:"1.5px solid #0ea5e9",background:"transparent",color:"#0369a1",cursor:"pointer",fontWeight:700,fontSize:12}}>Nueva búsqueda</button>
        </div>
      )}
      {result&&result!=="not_found"&&!result.notReg&&(()=>{
        const {spot,record}=result,sc5=SC[spot.sector];
        const veh=record.vehiculos?.find(v=>v.patente?.toUpperCase().replace(/[^A-Z0-9]/g,"")===queryPat.trim().toUpperCase().replace(/[^A-Z0-9]/g,""));
        const esVisita=veh?.esVisita==="si";
        return <div>
          <div style={{background:sc5.bg,borderRadius:16,overflow:"hidden",marginBottom:14}}>
            <div style={{padding:"18px 22px",background:"rgba(255,255,255,.08)",borderBottom:"1px solid rgba(255,255,255,.1)",display:"flex",alignItems:"center",gap:12}}>
              <div style={{fontSize:36}}>{esVisita?"🚗":"✅"}</div>
              <div>
                <div style={{fontSize:11,color:sc5.accent,fontWeight:700,marginBottom:2}}>{esVisita?"Vehículo de visita registrado":"Patente registrada"}</div>
                <div style={{fontSize:22,fontWeight:900,fontFamily:"monospace",color:"white"}}>#{spot.id}</div>
              </div>
            </div>
            <div style={{padding:"18px 22px",display:"flex",flexDirection:"column",gap:12}}>
              <RowItem icon="📍" label="Sector" value={SECTOR_NAMES[spot.sector]}/>
              <RowItem icon="🏢" label="Torre" value={spot.torre}/>
              <RowItem icon="🏠" label="Departamento" value={spot.depto}/>
              <RowItem icon="👤" label="Propietario inmueble" value={record.nombre||"—"}/>
              <RowItem icon="📞" label="Teléfono propietario" value={record.telefono||"—"}/>
              {esVisita&&<>
                <div style={{height:1,background:"rgba(255,255,255,.1)"}}/>
                <div style={{fontSize:10,color:sc5.accent,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5}}>Datos de la visita</div>
                <RowItem icon="👥" label="Nombre visita" value={veh?.nombreVisita||"—"}/>
                <RowItem icon="📱" label="Teléfono visita" value={veh?.telefonoVisita||"—"}/>
              </>}
            </div>
          </div>
          <div style={{background:"#1e293b",borderRadius:16,overflow:"hidden",border:`2px solid ${sc5.border}40`,marginBottom:12}}>
            <div style={{padding:"10px 16px",background:sc5.bg,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{fontSize:12,fontWeight:700,color:sc5.accent}}>📐 Ubicación en el plano</div>
              <div style={{fontSize:11,color:sc5.text,opacity:0.7}}>{SECTOR_NAMES[spot.sector]}</div>
            </div>
            <div style={{padding:10,overflowX:"auto"}}><SectorMap sectorId={spot.sector} records={records} onSpotClick={()=>{}} highlightId={spot.id}/></div>
            <div style={{padding:"8px 14px 10px",display:"flex",gap:14,flexWrap:"wrap",background:"#162032"}}>
              <Legend color="#facc15" label="Tu estacionamiento"/>
              <Legend color={SC[spot.sector].spotOcc} label="Ocupado"/>
              <Legend color="#2d3f5a" label="Libre"/>
            </div>
          </div>
          <button onClick={reset} style={{width:"100%",padding:"11px",borderRadius:10,border:"1.5px solid #e2e8f0",background:"white",color:"#475569",fontWeight:700,fontSize:13,cursor:"pointer"}}>Nueva búsqueda</button>
          <button onClick={()=>setReclamo({spot,record})}
            style={{width:"100%",marginTop:8,padding:"11px",borderRadius:10,border:"1.5px solid #ef4444",background:"#fff5f5",color:"#dc2626",fontWeight:700,fontSize:13,cursor:"pointer"}}>
            ⚠️ Reportar ocupación indebida
          </button>
        </div>;
      })()}
      {reclamo&&<ReclamoModal spot={reclamo.spot} record={reclamo.record} onClose={()=>setReclamo(null)} onSent={()=>showToast("Reclamo enviado a administración","info")}/>}
      {toast&&<Toast msg={toast.msg} type={toast.type}/>}
    </div>
  );
};

// ── RESIDENT ──
const ResidentScreen = ({records,setRecords,onBack}) => {
  const [entered,setEntered]=useState(false);
  const [reportMode,setReportMode]=useState(false);
  const [tab,setTab]=useState("form");
  const [toast,setToast]=useState(null);
  const [form,setFormState]=useState(emptyForm());
  const [step,setStep]=useState(0);
  const [found,setFound]=useState(null);
  const [errors,setErrors]=useState({});
  const [emailInput,setEmailInput]=useState("");
  const [isEditing,setIsEditing]=useState(false);
  const [reglamentoExpanded,setReglamentoExpanded]=useState(false);
  const [aceptaReglamento,setAceptaReglamento]=useState(false);

  const [reclamo,setReclamo]=useState(null); // {spot, record}

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
    setFormState(f=>({...f,nombre:rec?.nombre||"",email:rec?.email||"",telefono:rec?.telefono||"",tipoResidente:rec?.tipoResidente||"",usoEstacionamiento:rec?.usoEstacionamiento||"",nombrePropietario:rec?.nombrePropietario||"",emailPropietario:rec?.emailPropietario||"",telefonoPropietario:rec?.telefonoPropietario||"",vehiculos:rec?.vehiculos?.length?rec.vehiculos:[{patente:"",marca:"",color:"",esVisita:"no",nombreVisita:"",telefonoVisita:""}]}));
    setErrors({});setStep(1);
  };

  const validateStep=s=>{
    const e={};
    if(s===1){
      if(!form.nombre.trim())e.nombre="Requerido";
      if(!form.tipoResidente)e.tipoResidente="Selecciona una opción";
      if(form.telefono){const err=validarTelefono(form.telefono);if(err)e.telefono=err;}
      if(form.tipoResidente==="arrendatario"||form.tipoResidente==="propietario_arriendo"){
        if(!form.nombrePropietario?.trim())e.nombrePropietario="Requerido";
        if(!form.emailPropietario?.trim())e.emailPropietario="Requerido";
        if(!form.telefonoPropietario?.trim())e.telefonoPropietario="Requerido";
        else{const err=validarTelefono(form.telefonoPropietario);if(err)e.telefonoPropietario=err;}
      }
    }
    if(s===2){
      if(!form.usoEstacionamiento)e.usoEstacionamiento="Selecciona una opción";
      if(form.usoEstacionamiento==="ceder"){
        if(!form.nombreCedido?.trim())e.nombreCedido="Requerido";
        if(!form.emailCedido?.trim())e.emailCedido="Requerido";
        if(!form.telefonoCedido?.trim())e.telefonoCedido="Requerido";
        else{const err=validarTelefono(form.telefonoCedido);if(err)e.telefonoCedido=err;}
        if(!form.docCedido)e.docCedido="Debes adjuntar el documento de autorización";
      }
    }
    if(s===3){
      form.vehiculos.forEach((v,i)=>{if(!v.patente.trim())e[`pat_${i}`]="Ingresa la patente";});
      if(!aceptaReglamento)e.reglamento="Debes aceptar el Reglamento de Copropiedad para continuar";
    }
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
    const data={
      nombre:form.nombre,email:form.email,telefono:form.telefono,
      tipoResidente:form.tipoResidente,usoEstacionamiento:form.usoEstacionamiento,
      vehiculos:veh,patentes:veh.map(v=>v.patente.toUpperCase().replace(/[^A-Z0-9]/g,"")),
      ...(form.usoEstacionamiento==="ceder"?{nombreCedido:form.nombreCedido||"",emailCedido:form.emailCedido||"",telefonoCedido:form.telefonoCedido||""}:{}),
      ...(form.tipoResidente==="arrendatario"?{nombrePropietario:form.nombrePropietario||"",emailPropietario:form.emailPropietario||"",telefonoPropietario:form.telefonoPropietario||""}:{}),
      updatedAt:new Date().toISOString()
    };
    setRecords(r=>({...r,[found.id]:data}));
    const usoL={uso_exclusivo:"Uso exclusivo",visitas:"Para visitas",ceder:"Cede a comunero",sin_uso:"Sin uso"};
    const emailParams={
      nombre:form.nombre,
      torre:TORRES_LABELS[found.torre]||found.torre,
      depto:found.depto,
      estac_id:found.id,
      patentes:veh.map(v=>v.patente).join(", ")||"—",
      telefono:form.telefono||"—",
      uso:usoL[form.usoEstacionamiento]||form.usoEstacionamiento,
      fecha:new Date().toLocaleString("es-CL"),
      sector:SECTOR_NAMES[found.sector],
      email_residente:form.email||"",
      ...(form.tipoResidente==="arrendatario"?{nombre_propietario:form.nombrePropietario||"",email_propietario:form.emailPropietario||"",telefono_propietario:form.telefonoPropietario||""}:{}),
    };
    sendEmail({...emailParams});
    if(form.email?.trim()) sendEmail({...emailParams,to_email:form.email.trim()});
    // Historial
    addHistorial(found.id, isEditing?"Modificación":"Registro inicial",
      `${form.nombre} · Patentes: ${veh.map(v=>v.patente).join(", ")||"—"} · Uso: ${usoL[form.usoEstacionamiento]||"—"}`
    );
    setStep(4);showToast("Registro guardado correctamente");
  };

  const resetForm=()=>{setFormState(emptyForm());setFound(null);setStep(0);setErrors({});setIsEditing(false);setEmailInput("");setAceptaReglamento(false);setReglamentoExpanded(false);};
  const addVehiculo=()=>{if(form.vehiculos.length<5)setFormState(f=>({...f,vehiculos:[...f.vehiculos,{patente:"",marca:"",color:"",esVisita:"no",nombreVisita:"",telefonoVisita:""}]}));};
  const updateVeh=(i,k,v)=>{setFormState(f=>({...f,vehiculos:f.vehiculos.map((x,j)=>j===i?{...x,[k]:k==="patente"?v.toUpperCase():v}:x)}));setErrors(e=>({...e,[`pat_${i}`]:""}));};
  const removeVeh=i=>setFormState(f=>({...f,vehiculos:f.vehiculos.filter((_,j)=>j!==i)}));

  const sc=found?SC[found.sector]:null;
  const deptosFiltrados=form.torre?DEPTOS_ALL.filter(d=>BY_TD[`${form.torre}-${d}`]):[];
  const STEPS=["Dirección","Identificación","Uso","Vehículos"];
  const stepNum=typeof step==="number"?step:0;

  const radioBtn=(fk,val,label)=>(
    <label key={val} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"11px 14px",borderRadius:9,border:`1.5px solid ${form[fk]===val?"#2563eb":"#e2e8f0"}`,background:form[fk]===val?"#eff6ff":"white",cursor:"pointer",marginBottom:7}} onClick={()=>setF(fk,val)}>
      <div style={{width:17,height:17,borderRadius:"50%",border:"2px solid",marginTop:1,flexShrink:0,borderColor:form[fk]===val?"#2563eb":"#cbd5e1",background:form[fk]===val?"#2563eb":"white",display:"flex",alignItems:"center",justifyContent:"center"}}>
        {form[fk]===val&&<div style={{width:6,height:6,borderRadius:"50%",background:"white"}}/>}
      </div>
      <span style={{fontSize:13,color:form[fk]===val?"#1d4ed8":"#374151",fontWeight:form[fk]===val?600:400,lineHeight:1.4}}>{label}</span>
    </label>
  );

  if(!entered){
    return (
      <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#1d4ed8,#2563eb)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"system-ui,sans-serif"}}>
        <div style={{width:"100%",maxWidth:420}}>
          <button onClick={onBack} style={{background:"rgba(255,255,255,.15)",border:"none",color:"white",borderRadius:9,padding:"7px 13px",cursor:"pointer",fontSize:16,fontWeight:600,marginBottom:24}}>← Volver</button>
          <div style={{fontSize:22,fontWeight:900,color:"white",marginBottom:4}}>🏠 Mi Estacionamiento</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,.75)",marginBottom:24}}>¿Qué deseas hacer?</div>
          <button onClick={()=>{setTab("form");setReportMode(false);setEntered(true);}}
            style={{width:"100%",display:"flex",alignItems:"center",gap:14,padding:"18px 20px",borderRadius:16,border:"none",cursor:"pointer",background:"white",marginBottom:12,textAlign:"left",boxShadow:"0 8px 24px rgba(0,0,0,.2)"}}>
            <span style={{fontSize:28}}>📝</span>
            <div>
              <div style={{fontSize:15,fontWeight:800,color:"#0f172a"}}>Registro o modificación</div>
              <div style={{fontSize:12,color:"#64748b",marginTop:2}}>Registra tus patentes o actualiza tus datos</div>
            </div>
          </button>
          <button onClick={()=>{setTab("query");setReportMode(true);setEntered(true);}}
            style={{width:"100%",display:"flex",alignItems:"center",gap:14,padding:"18px 20px",borderRadius:16,border:"none",cursor:"pointer",background:"#fff5f5",textAlign:"left",boxShadow:"0 8px 24px rgba(0,0,0,.2)"}}>
            <span style={{fontSize:28}}>⚠️</span>
            <div>
              <div style={{fontSize:15,fontWeight:800,color:"#dc2626"}}>Reportar ocupación indebida</div>
              <div style={{fontSize:12,color:"#b91c1c",marginTop:2}}>Un vehículo está en tu estacionamiento sin autorización</div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight:"100vh",background:"#eef2f7",fontFamily:"system-ui,sans-serif"}}>
      <div style={{background:"linear-gradient(135deg,#1d4ed8,#2563eb)",color:"white",padding:"16px 20px 0",boxShadow:"0 6px 24px rgba(37,99,235,.4)",position:"sticky",top:0,zIndex:50}}>
        <div style={{maxWidth:640,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
            <button onClick={()=>setEntered(false)} style={{background:"rgba(255,255,255,.15)",border:"none",color:"white",borderRadius:9,padding:"7px 13px",cursor:"pointer",fontSize:16,fontWeight:600}}>←</button>
            <div style={{flex:1}}>
              <div style={{fontSize:10,fontWeight:600,opacity:0.7,textTransform:"uppercase",letterSpacing:1}}>Residente</div>
              <div style={{fontSize:20,fontWeight:900,letterSpacing:-0.4}}>🏠 Mi Estacionamiento</div>
            </div>
          </div>
          <div style={{display:"flex",gap:2,background:"rgba(0,0,0,.2)",borderRadius:10,padding:3}}>
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
                <p style={{margin:"0 0 20px",fontSize:13,color:"#64748b",lineHeight:1.5}}>Selecciona tu dirección para identificar tu estacionamiento.</p>
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  <div>
                    <label style={{fontSize:11,fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:0.5,display:"block",marginBottom:6}}>1. Dirección / Torre <span style={{color:"#e53e3e"}}>*</span></label>
                    <select value={form.torre} onChange={e=>{setF("torre",e.target.value);setF("depto","");}}
                      style={{width:"100%",padding:"11px 12px",borderRadius:9,fontSize:14,fontWeight:600,border:"1.5px solid #e2e8f0",background:"white",outline:"none",cursor:"pointer",fontFamily:"monospace"}}>
                      <option value="">— Selecciona la dirección —</option>
                      {TORRES.map(t=><option key={t} value={t}>{TORRES_LABELS[t]}</option>)}
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
                  <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:10,padding:"12px 16px",marginBottom:20,display:"flex",gap:10}}>
                    <span style={{fontSize:18}}>ℹ️</span>
                    <div>
                      <div style={{fontSize:13,fontWeight:700,color:"#166534",marginBottom:3}}>Esta unidad ya tiene un registro</div>
                      <div style={{fontSize:12,color:"#15803d",lineHeight:1.5}}>Registrado a nombre de <strong>{rec?.nombre||"un residente"}</strong>. Para modificar, verifica tu identidad.</div>
                    </div>
                  </div>
                  <label style={{fontSize:11,fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:0.5,display:"block",marginBottom:8}}>Correo electrónico registrado</label>
                  <input type="email" value={emailInput} onChange={e=>{setEmailInput(e.target.value);setErrors(er=>({...er,emailVerify:""}));}} placeholder="correo@ejemplo.com"
                    style={{width:"100%",padding:"12px 14px",borderRadius:10,fontSize:14,border:`1.5px solid ${errors.emailVerify?"#e53e3e":"#e2e8f0"}`,outline:"none",fontFamily:"inherit",boxSizing:"border-box",background:"#f8fafc"}}/>
                  {errors.emailVerify&&<div style={{marginTop:8,padding:"10px 14px",borderRadius:8,background:"#fff5f5",border:"1px solid #fecaca",fontSize:12,color:"#dc2626"}}>⚠️ {errors.emailVerify}</div>}
                  <button onClick={handleEmailVerify} style={{width:"100%",marginTop:14,padding:"13px",borderRadius:10,border:"none",background:"#2563eb",color:"white",fontWeight:800,fontSize:14,cursor:"pointer"}}>Verificar y Editar →</button>
                  <button onClick={()=>{setStep(0);setFound(null);setIsEditing(false);}} style={{width:"100%",marginTop:8,padding:"10px",borderRadius:9,border:"1.5px solid #e2e8f0",background:"white",color:"#475569",fontWeight:600,fontSize:12,cursor:"pointer"}}>← Volver</button>
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
                  {(form.tipoResidente==="arrendatario"||form.tipoResidente==="propietario_arriendo")&&(
                    <div style={{background:"#fffbeb",border:"1.5px solid #fde68a",borderRadius:12,padding:16}}>
                      <div style={{fontSize:12,fontWeight:800,color:"#92400e",marginBottom:2}}>
                        {form.tipoResidente==="arrendatario"?"👤 Datos del propietario (dueño de la unidad)":"👤 Datos de contacto del arrendatario"}
                      </div>
                      <div style={{fontSize:11,color:"#b45309",marginBottom:12,lineHeight:1.5}}>
                        {form.tipoResidente==="arrendatario"
                          ?"Como arrendatario u ocupante, debes indicar los datos del dueño de la propiedad."
                          :"Como propietario no residente, ingresa los datos de quien ocupa la unidad."}
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:10}}>
                        {[["nombrePropietario","Nombre completo","Nombre y apellido","text"],["emailPropietario","Correo electrónico","correo@ejemplo.com","email"],["telefonoPropietario","Teléfono","+56 9 ...","tel"]].map(([k,lbl,ph,type])=>(
                          <div key={k}>
                            <label style={{fontSize:10,fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:0.5,display:"block",marginBottom:4}}>{lbl} <span style={{color:"#e53e3e"}}>*</span></label>
                            <input type={type} value={form[k]||""} onChange={e=>setF(k,e.target.value)} placeholder={ph}
                              style={{width:"100%",padding:"9px 11px",borderRadius:8,fontSize:13,border:`1.5px solid ${errors[k]?"#e53e3e":"#fde68a"}`,outline:"none",fontFamily:"inherit",background:"white",boxSizing:"border-box"}}/>
                            {errors[k]&&<span style={{fontSize:10,color:"#e53e3e"}}>{errors[k]}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
                {form.usoEstacionamiento==="ceder"&&(
                  <div style={{marginTop:16,padding:16,borderRadius:12,background:"#f0f9ff",border:"1.5px solid #bae6fd"}}>
                    <div style={{fontSize:12,fontWeight:700,color:"#0369a1",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <span>🤝 Datos del comunero beneficiario</span>
                      <a href="/declaracion-autorizacion.docx" download style={{display:"flex",alignItems:"center",gap:5,padding:"6px 12px",borderRadius:8,background:"#0369a1",color:"white",fontSize:10,fontWeight:700,textDecoration:"none"}}>
                        📄 Descargar declaración
                      </a>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:12}}>
                      {[["nombreCedido","Nombre completo","Ej: María González","text"],["emailCedido","Correo electrónico","correo@ejemplo.com","email"],["telefonoCedido","Teléfono","+56 9 ...","tel"]].map(([k,lbl,ph,type])=>(
                        <div key={k}>
                          <label style={{fontSize:10,fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:0.5,display:"block",marginBottom:4}}>{lbl} <span style={{color:"#e53e3e"}}>*</span></label>
                          <input type={type} value={form[k]||""} onChange={e=>setF(k,e.target.value)} placeholder={ph}
                            style={{width:"100%",padding:"9px 12px",borderRadius:8,fontSize:13,border:`1.5px solid ${errors[k]?"#e53e3e":"#bae6fd"}`,outline:"none",fontFamily:"inherit",background:"white",boxSizing:"border-box"}}/>
                          {errors[k]&&<span style={{fontSize:10,color:"#e53e3e"}}>{errors[k]}</span>}
                        </div>
                      ))}
                      <div>
                        <label style={{fontSize:10,fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:0.5,display:"block",marginBottom:6}}>Documento de autorización <span style={{color:"#e53e3e"}}>*</span></label>
                        <div style={{fontSize:11,color:"#64748b",marginBottom:8}}>Adjunta la declaración simple firmada.</div>
                        <label style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",borderRadius:9,border:`1.5px dashed ${errors.docCedido?"#e53e3e":form.docCedido?"#0ea5e9":"#bae6fd"}`,background:form.docCedido?"#e0f2fe":"white",cursor:"pointer"}}>
                          <span style={{fontSize:20}}>{form.docCedido?"📎":"📄"}</span>
                          <div style={{flex:1}}>
                            <div style={{fontSize:12,fontWeight:700,color:form.docCedido?"#0369a1":"#475569"}}>{form.docCedido?form.docCedido.name:"Seleccionar archivo"}</div>
                            <div style={{fontSize:10,color:"#94a3b8",marginTop:2}}>PDF, JPG, PNG — máx. 5MB</div>
                          </div>
                          {form.docCedido&&<span style={{fontSize:18}}>✅</span>}
                          <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{display:"none"}}
                            onChange={e=>{const f=e.target.files?.[0];if(f){setFormState(prev=>({...prev,docCedido:f}));setErrors(er=>({...er,docCedido:""}));}}}/>
                        </label>
                        {errors.docCedido&&<span style={{fontSize:10,color:"#e53e3e",marginTop:4,display:"block"}}>{errors.docCedido}</span>}
                      </div>
                    </div>
                  </div>
                )}
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
                <p style={{margin:"0 0 18px",fontSize:13,color:"#64748b"}}>Puedes registrar hasta 5 vehículos.</p>
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
                        <div style={{display:"flex",gap:8,marginBottom:v.esVisita==="si"?8:0}}>
                          {[["si","Sí, es visita"],["no","No, es propio"]].map(([val,label])=>(
                            <button key={val} onClick={()=>updateVeh(i,"esVisita",val)}
                              style={{flex:1,padding:"8px 12px",borderRadius:8,border:`1.5px solid ${v.esVisita===val?"#2563eb":"#e2e8f0"}`,background:v.esVisita===val?"#eff6ff":"white",color:v.esVisita===val?"#1d4ed8":"#475569",fontWeight:v.esVisita===val?700:400,fontSize:12,cursor:"pointer"}}>{label}</button>
                          ))}
                        </div>
                        {v.esVisita==="si"&&(
                          <div style={{display:"flex",flexDirection:"column",gap:8,padding:"10px 12px",borderRadius:8,background:"#eff6ff",border:"1px solid #bfdbfe"}}>
                            <div style={{fontSize:10,fontWeight:700,color:"#1d4ed8"}}>Datos de la visita</div>
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

                <div style={{background:"#f8fafc",borderRadius:12,border:`1.5px solid ${errors.reglamento?"#e53e3e":"#e2e8f0"}`,overflow:"hidden",marginTop:16}}>
                  <div style={{padding:"12px 16px",borderBottom:"1px solid #e2e8f0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div style={{fontSize:12,fontWeight:800,color:"#0f172a"}}>📋 Reglamento de Copropiedad</div>
                    <button onClick={()=>setReglamentoExpanded(v=>!v)} style={{background:"none",border:"none",color:"#2563eb",fontSize:11,fontWeight:700,cursor:"pointer",padding:"2px 8px",borderRadius:6,background:"#eff6ff"}}>
                      {reglamentoExpanded?"▲ Cerrar":"▼ Leer reglamento"}
                    </button>
                  </div>
                  {reglamentoExpanded&&(
                    <div style={{padding:"14px 16px",maxHeight:260,overflowY:"auto",fontSize:11,color:"#374151",lineHeight:1.7,background:"white"}}>
                      <p style={{margin:"0 0 10px",fontWeight:700,color:"#0f172a"}}>Artículo 23 — Reglamento de Copropiedad</p>
                      <p style={{margin:"0 0 10px"}}>Cada copropietario podrá solicitar una porción del espacio común como estacionamiento, para que sea utilizado por el residente (dueño, ocupante y/o arrendatario) con el único objeto de estacionar un automóvil y/o vehículo similar en dicho espacio asignado, el cual deberá ser respetado por los demás comuneros. Esta asignación está señalada en el reglamento interno. Los espacios asignados para uso de estacionamiento constituyen meramente asignaciones de uso de una porción de espacio común, razón por la que no forma parte del dominio singular que cada comunero tiene respecto de su departamento. Por tanto, los comuneros no pueden vender, ceder, enajenar, arrendar, subarrendar o prometer servicio alguno en ellos ya sea de forma directa o indirecta mediante corredores de propiedades o sus arrendatarios.</p>
                      <p style={{margin:"0 0 10px"}}>Será responsabilidad de cada comunero hacer uso de forma responsable del espacio asignado como estacionamiento, respetando la demarcación respectiva de forma tal que no impida el correcto estacionamiento de los demás comuneros. Asimismo, corresponderá a cada comunero no permitir que terceros le priven y/o perturben su derecho de uso del espacio asignado, debiendo en primera instancia, buscar personalmente la forma de resolver con el comunero que esté ocupando indebidamente su estacionamiento. En caso de que definitivamente no se pudo arribar a una solución directa, el comunero afectado deberá efectuar la denuncia y remitir los antecedentes respectivos a la Administración, para efectos de aplicar multas y ejercer las acciones legales pertinentes.</p>
                      <p style={{margin:"0 0 6px",fontWeight:700,color:"#0f172a"}}>Normas de uso:</p>
                      <p style={{margin:"0 0 6px"}}>a) Cada propietario tiene derecho a un estacionamiento.</p>
                      <p style={{margin:"0 0 6px"}}>b) Se permite prestar el espacio a otros residentes, siempre informando a la administración mediante declaración simple. Es necesario contar con el registro de copropietario al día.</p>
                      <p style={{margin:"0 0 6px"}}>c) Es obligatorio registrar la patente del vehículo asignado. Cualquier modificación debe ser comunicada a la administración.</p>
                      <p style={{margin:"0 0 6px"}}>d) El estacionamiento no puede ser arrendado ni entregado en uso y goce a personas no residentes en el edificio.</p>
                      <p style={{margin:"0 0 6px"}}>e) Se permite estacionar vehículos externos que concurran de visita. El incumplimiento se sancionará con multa categorizada como grave.</p>
                      <p style={{margin:"0 0 10px",fontWeight:700,color:"#0f172a",marginTop:10}}>Reglamento Interno — Normas adicionales:</p>
                      <p style={{margin:"0 0 6px"}}>• Solo se permiten motocicletas, automóviles y camionetas (máx. 5.25m largo × 1.85m ancho).</p>
                      <p style={{margin:"0 0 6px"}}>• Velocidad máxima de circulación: 15 km/hr.</p>
                      <p style={{margin:"0 0 6px"}}>• Los vehículos deben estacionarse aculatados (parte trasera al interior).</p>
                      <p style={{margin:"0 0 6px"}}>• Prohibido estacionar en pistas de circulación bajo cualquier circunstancia.</p>
                      <p style={{margin:"0 0 6px"}}>• Prohibido cerrar espacios o dejar objetos en ellos (bicicletas, neumáticos, etc.).</p>
                      <p style={{margin:"0 0 6px"}}>• Prohibido el lavado de vehículos con agua y jabón, trabajos de mecánica mayor, y acopio de escombros o basuras.</p>
                      <p style={{margin:"0 0 6px"}}>• Está prohibido estacionar o tener vehículos abandonados. El incumplimiento será sancionado con multa grave por cada día.</p>
                      <p style={{margin:"0 0 0px"}}>• En caso de estacionar en lugar no designado o infringir las normas, la Administración podrá aplicar traba ruedas hasta el pago de la multa correspondiente.</p>
                    </div>
                  )}
                  <div style={{padding:"12px 16px",display:"flex",alignItems:"flex-start",gap:10,background:aceptaReglamento?"#f0fdf4":"white",transition:"background .2s"}}>
                    <div onClick={()=>setAceptaReglamento(v=>!v)} style={{width:20,height:20,borderRadius:5,border:`2px solid ${aceptaReglamento?"#16a34a":errors.reglamento?"#e53e3e":"#cbd5e1"}`,background:aceptaReglamento?"#16a34a":"white",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,marginTop:1}}>
                      {aceptaReglamento&&<span style={{color:"white",fontSize:13,fontWeight:900,lineHeight:1}}>✓</span>}
                    </div>
                    <label onClick={()=>setAceptaReglamento(v=>!v)} style={{fontSize:12,color:"#374151",lineHeight:1.5,cursor:"pointer"}}>
                      He leído y acepto el <strong>Reglamento de Copropiedad</strong> y el <strong>Reglamento Interno</strong> respecto al uso de estacionamientos. Entiendo que el incumplimiento puede derivar en multas y acciones legales.
                    </label>
                  </div>
                  {errors.reglamento&&<div style={{padding:"6px 16px 10px",fontSize:11,color:"#e53e3e"}}>{errors.reglamento}</div>}
                </div>

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
              return <div>
                <div style={{background:"white",borderRadius:16,overflow:"hidden",boxShadow:"0 4px 24px rgba(0,0,0,.08)",textAlign:"center",marginBottom:14}}>
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
                      {form.tipoResidente==="arrendatario"&&<SummaryRow label="Propietario" value={form.nombrePropietario||"—"}/>}
                    </div>
                    <button onClick={resetForm} style={{width:"100%",padding:"12px",borderRadius:9,border:"1.5px solid #2563eb",background:"white",color:"#2563eb",fontWeight:700,fontSize:13,cursor:"pointer"}}>Registrar otra unidad</button>
                    <button onClick={()=>setReclamo({spot:found,record:records[found.id]})}
                      style={{width:"100%",marginTop:8,padding:"12px",borderRadius:9,border:"1.5px solid #ef4444",background:"#fff5f5",color:"#dc2626",fontWeight:700,fontSize:13,cursor:"pointer"}}>
                      ⚠️ Reportar ocupación indebida
                    </button>
                  </div>
                </div>
                <div style={{background:"#1e293b",borderRadius:16,overflow:"hidden",border:`2px solid ${sc4.accent}40`}}>
                  <div style={{padding:"10px 16px",background:sc4.bg,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div style={{fontSize:12,fontWeight:700,color:sc4.accent}}>📐 Tu ubicación en el plano</div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,.6)"}}>{SECTOR_NAMES[found.sector]}</div>
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
              </div>;
            })()}
          </div>
        )}
        {tab==="query"&&<QueryTab records={records} reportMode={reportMode} onReportDone={()=>setEntered(false)}/>}
      </div>
      {reclamo&&<ReclamoModal spot={reclamo.spot} record={reclamo.record} onClose={()=>setReclamo(null)} onSent={()=>showToast("Reclamo enviado a administración","info")}/>}
      {toast&&<Toast msg={toast.msg} type={toast.type}/>}
    </div>
  );
};

// ── STAFF ──
const StaffScreen = ({records,setRecords,onBack}) => {
  const [tab,setTab]=useState("verify");
  const [query,setQuery]=useState("");
  const [result,setResult]=useState(null);
  const [selectedSpot,setSelectedSpot]=useState(null);
  const [toast,setToast]=useState(null);
  const [searchList,setSearchList]=useState("");
  const [filterSector,setFilterSector]=useState("all");
  const [sortBy,setSortBy]=useState("id");
  const [confirmDelete,setConfirmDelete]=useState(null);
  const [warningVisible,setWarningVisible]=useState(false);
  const warningTimer=useRef(null);

  const showToast=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),2600);};

  // Cierre por inactividad
  const handleTimeout=useCallback(()=>{
    showToast("Sesión cerrada por inactividad","info");
    setTimeout(()=>onBack(),1500);
  },[onBack]);

  // Aviso 2 min antes
  const handleWarning=useCallback(()=>{
    setWarningVisible(true);
    warningTimer.current=setTimeout(()=>setWarningVisible(false),10000);
  },[]);

  useInactivity(handleTimeout);

  // Aviso a los 13 minutos
  useEffect(()=>{
    const t=setTimeout(handleWarning,(INACTIVITY_MINUTES-2)*60*1000);
    return()=>clearTimeout(t);
  },[handleWarning]);;

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

  const listedSpots=SPOTS_DATA.filter(s=>{
    if(!records[s.id])return false;
    if(filterSector!=="all"&&s.sector!==Number(filterSector))return false;
    if(searchList){const q=searchList.toLowerCase(),rec=records[s.id];return String(s.id).includes(q)||s.torre.includes(q)||s.depto.toLowerCase().includes(q)||rec.patentes?.some(p=>p.toLowerCase().includes(q))||(rec.propietario||rec.nombre||"").toLowerCase().includes(q);}
    return true;
  }).sort((a,b)=>{
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
      {/* Aviso inactividad */}
      {warningVisible&&(
        <div style={{position:"fixed",top:0,left:0,right:0,zIndex:500,background:"#854d0e",padding:"10px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
          <span style={{fontSize:13,fontWeight:700,color:"#fef08a"}}>⚠️ Tu sesión se cerrará en 2 minutos por inactividad</span>
          <button onClick={()=>{setWarningVisible(false);if(warningTimer.current)clearTimeout(warningTimer.current);}}
            style={{padding:"4px 12px",borderRadius:6,border:"1px solid #fef08a",background:"transparent",color:"#fef08a",fontSize:12,cursor:"pointer",fontWeight:700}}>
            Continuar sesión
          </button>
        </div>
      )}
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
          {[["verify","🔍","Verificar"],["list","📋","Listado"],["map","🗺️","Plano"],["dashboard","📊","Dashboard"],["reclamos","⚠️","Reclamos"]].map(([k,icon,label])=>(
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
              <p style={{margin:"0 0 13px",fontSize:13,color:"#6b7280",lineHeight:1.6}}>Ingresa la patente para verificar su registro.</p>
              <div style={{display:"flex",gap:10}}>
                <input value={query} onChange={e=>{setQuery(e.target.value);setResult(null);}} onKeyDown={e=>e.key==="Enter"&&verify()} placeholder="ABCD12" maxLength={8}
                  style={{flex:1,padding:"14px 16px",borderRadius:10,fontSize:20,fontWeight:900,border:"2px solid #1f2937",background:"#0a0f1e",color:"white",outline:"none",fontFamily:"monospace",textTransform:"uppercase",letterSpacing:4}}/>
                <button onClick={verify} style={{padding:"14px 24px",borderRadius:10,border:"none",background:"#2563eb",color:"white",fontWeight:800,fontSize:14,cursor:"pointer"}}>Verificar</button>
              </div>
            </div>
            {result==="not_found"&&(
              <div style={{background:"#450a0a",border:"1.5px solid #7f1d1d",borderRadius:16,padding:28,textAlign:"center"}}>
                <div style={{fontSize:44,marginBottom:10}}>❌</div>
                <div style={{fontSize:17,fontWeight:800,color:"#fca5a5",marginBottom:8}}>Patente no registrada</div>
                <div style={{fontFamily:"monospace",fontSize:20,fontWeight:900,letterSpacing:4,color:"#f87171",marginBottom:12}}>{query.toUpperCase()}</div>
                <button onClick={()=>{setQuery("");setResult(null);}} style={{padding:"9px 24px",borderRadius:8,border:"1.5px solid #7f1d1d",background:"transparent",color:"#f87171",cursor:"pointer",fontWeight:700}}>Nueva búsqueda</button>
              </div>
            )}
            {result&&result!=="not_found"&&sc&&(
              <div style={{background:sc.bg,borderRadius:16,overflow:"hidden"}}>
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
              <input value={searchList} onChange={e=>setSearchList(e.target.value)} placeholder="Buscar patente, torre, depto..."
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
              <button onClick={()=>{
                const usoL={uso_exclusivo:"Uso exclusivo",visitas:"Para visitas",ceder:"Cedido",sin_uso:"Sin uso"};
                const tipoL={propietario_residente:"Prop. residente",propietario_arriendo:"Prop. no residente",arrendatario:"Arrendatario"};
                const rows=[["Estac.","Torre","Depto","Sector","Nombre","Email","Teléfono","Tipo","Uso","Patentes","Actualizado"]];
                listedSpots.forEach(s=>{
                  const r=records[s.id];
                  rows.push([
                    `#${s.id}`,
                    TORRES_LABELS[s.torre]||s.torre,
                    s.depto,
                    SECTOR_NAMES[s.sector],
                    r.nombre||"",
                    r.email||"",
                    r.telefono||"",
                    tipoL[r.tipoResidente]||r.tipoResidente||"",
                    usoL[r.usoEstacionamiento]||r.usoEstacionamiento||"",
                    (r.patentes||[]).join(", "),
                    r.updatedAt?new Date(r.updatedAt).toLocaleDateString("es-CL"):"",
                  ]);
                });
                const csv=rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
                const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"});
                const url=URL.createObjectURL(blob);
                const a=document.createElement("a");
                a.href=url;a.download=`estacionamientos_${new Date().toLocaleDateString("es-CL").replace(/\//g,"-")}.csv`;
                a.click();URL.revokeObjectURL(url);
              }} style={{padding:"8px 14px",borderRadius:8,border:"1px solid #22c55e",background:"rgba(34,197,94,.1)",color:"#22c55e",fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>
                📥 Exportar CSV
              </button>
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
                  <div>{rec.patentes?.map((p,pi)=><span key={pi} style={{display:"inline-block",marginRight:4,marginBottom:2,padding:"2px 6px",borderRadius:5,background:sc2.bg,color:sc2.accent,fontFamily:"monospace",fontSize:11,fontWeight:700}}>{p}</span>)}{(rec.propietario||rec.nombre)&&<div style={{fontSize:10,color:"#374151",marginTop:2}}>{rec.propietario||rec.nombre}</div>}</div>
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

        {tab==="dashboard"&&(()=>{
          const totalSpots=SPOTS_DATA.length;
          const totalOcc2=Object.keys(records).length;
          const totalFree=totalSpots-totalOcc2;
          const pctOcc=Math.round(totalOcc2/totalSpots*100);

          // Por sector
          const bySector=[1,2,3].map(sid=>{
            const spots=SPOTS_DATA.filter(s=>s.sector===sid);
            const occ=spots.filter(s=>records[s.id]).length;
            return {sid,name:SECTOR_NAMES[sid],total:spots.length,occ,free:spots.length-occ,pct:Math.round(occ/spots.length*100)};
          });

          // Por tipo residente
          const byTipo={propietario_residente:0,propietario_arriendo:0,arrendatario:0,sin_tipo:0};
          Object.values(records).forEach(r=>{
            if(r.tipoResidente&&byTipo[r.tipoResidente]!==undefined) byTipo[r.tipoResidente]++;
            else if(r.tipoResidente) byTipo.sin_tipo++;
            else byTipo.sin_tipo++;
          });

          // Por uso
          const byUso={uso_exclusivo:0,visitas:0,ceder:0,sin_uso:0,otro:0};
          Object.values(records).forEach(r=>{
            if(r.usoEstacionamiento&&byUso[r.usoEstacionamiento]!==undefined) byUso[r.usoEstacionamiento]++;
            else byUso.otro++;
          });

          // Registros recientes (últimos 5)
          const recientes=Object.entries(records)
            .filter(([,r])=>r.updatedAt)
            .sort(([,a],[,b])=>new Date(b.updatedAt)-new Date(a.updatedAt))
            .slice(0,5);

          const StatCard=({label,value,sub,color})=>(
            <div style={{background:"#111827",borderRadius:12,padding:"14px 16px",border:`1px solid ${color}30`,borderLeft:`3px solid ${color}`,flex:1,minWidth:120}}>
              <div style={{fontSize:28,fontWeight:900,color,fontFamily:"monospace"}}>{value}</div>
              <div style={{fontSize:12,fontWeight:700,color:"white",marginTop:2}}>{label}</div>
              {sub&&<div style={{fontSize:10,color:"#4b5563",marginTop:2}}>{sub}</div>}
            </div>
          );

          const tipoL={propietario_residente:"Propietario residente",propietario_arriendo:"Propietario no residente",arrendatario:"Arrendatario",sin_tipo:"Sin especificar"};
          const usoL={uso_exclusivo:"Uso exclusivo",visitas:"Para visitas",ceder:"Cedido a comunero",sin_uso:"Sin uso",otro:"Otro"};
          const usoColors={uso_exclusivo:"#22c55e",visitas:"#3b82f6",ceder:"#a855f7",sin_uso:"#6b7280",otro:"#f59e0b"};
          const tipoColors={propietario_residente:"#22c55e",propietario_arriendo:"#3b82f6",arrendatario:"#f59e0b",sin_tipo:"#6b7280"};

          return <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {/* Stats principales */}
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <StatCard label="Total espacios" value={totalSpots} color="#60a5fa"/>
              <StatCard label="Ocupados" value={totalOcc2} sub={`${pctOcc}% del total`} color="#f59e0b"/>
              <StatCard label="Disponibles" value={totalFree} sub={`${100-pctOcc}% del total`} color="#22c55e"/>
            </div>

            {/* Barra ocupación total */}
            <div style={{background:"#111827",borderRadius:12,padding:16,border:"1px solid #1f2937"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <span style={{fontSize:12,fontWeight:700,color:"white"}}>Ocupación total</span>
                <span style={{fontSize:12,fontWeight:900,color:"#f59e0b",fontFamily:"monospace"}}>{pctOcc}%</span>
              </div>
              <div style={{height:10,background:"#1e293b",borderRadius:5,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${pctOcc}%`,background:"linear-gradient(90deg,#f59e0b,#ef4444)",borderRadius:5,transition:"width .5s"}}/>
              </div>
            </div>

            {/* Por sector */}
            <div style={{background:"#111827",borderRadius:12,padding:16,border:"1px solid #1f2937"}}>
              <div style={{fontSize:12,fontWeight:700,color:"white",marginBottom:12}}>📍 Ocupación por sector</div>
              {bySector.map(s=>(
                <div key={s.sid} style={{marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:11,color:SC[s.sid].accent,fontWeight:600}}>{s.name}</span>
                    <span style={{fontSize:11,color:"#94a3b8",fontFamily:"monospace"}}>{s.occ}/{s.total} — {s.pct}%</span>
                  </div>
                  <div style={{height:8,background:"#1e293b",borderRadius:4,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${s.pct}%`,background:SC[s.sid].accent,borderRadius:4,transition:"width .5s"}}/>
                  </div>
                </div>
              ))}
            </div>

            {/* Por tipo residente */}
            <div style={{background:"#111827",borderRadius:12,padding:16,border:"1px solid #1f2937"}}>
              <div style={{fontSize:12,fontWeight:700,color:"white",marginBottom:12}}>👤 Por tipo de residente</div>
              {Object.entries(byTipo).filter(([,v])=>v>0).map(([k,v])=>(
                <div key={k} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:tipoColors[k],flexShrink:0}}/>
                  <span style={{fontSize:11,color:"#94a3b8",flex:1}}>{tipoL[k]}</span>
                  <span style={{fontSize:12,fontWeight:700,color:"white",fontFamily:"monospace"}}>{v}</span>
                  <div style={{width:60,height:6,background:"#1e293b",borderRadius:3,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${Math.round(v/totalOcc2*100)}%`,background:tipoColors[k],borderRadius:3}}/>
                  </div>
                </div>
              ))}
            </div>

            {/* Por uso */}
            <div style={{background:"#111827",borderRadius:12,padding:16,border:"1px solid #1f2937"}}>
              <div style={{fontSize:12,fontWeight:700,color:"white",marginBottom:12}}>🚗 Por uso del estacionamiento</div>
              {Object.entries(byUso).filter(([,v])=>v>0).map(([k,v])=>(
                <div key={k} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:usoColors[k],flexShrink:0}}/>
                  <span style={{fontSize:11,color:"#94a3b8",flex:1}}>{usoL[k]}</span>
                  <span style={{fontSize:12,fontWeight:700,color:"white",fontFamily:"monospace"}}>{v}</span>
                  <div style={{width:60,height:6,background:"#1e293b",borderRadius:3,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${Math.round(v/totalOcc2*100)}%`,background:usoColors[k],borderRadius:3}}/>
                  </div>
                </div>
              ))}
            </div>

            {/* Registros recientes */}
            {recientes.length>0&&<div style={{background:"#111827",borderRadius:12,padding:16,border:"1px solid #1f2937"}}>
              <div style={{fontSize:12,fontWeight:700,color:"white",marginBottom:12}}>🕐 Últimos registros</div>
              {recientes.map(([id,rec])=>{
                const spot=SPOTS_DATA.find(s=>s.id===Number(id));
                const sc2=SC[spot?.sector||1];
                return <div key={id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,paddingBottom:10,borderBottom:"1px solid #1e293b"}}>
                  <div style={{width:36,height:36,borderRadius:8,background:sc2.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"monospace",fontWeight:900,fontSize:11,color:sc2.accent,flexShrink:0}}>#{id}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:700,color:"white"}}>{rec.nombre||"Sin nombre"}</div>
                    <div style={{fontSize:10,color:"#4b5563"}}>{TORRES_LABELS[spot?.torre]||spot?.torre} · {spot?.depto}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:10,color:"#4b5563"}}>{rec.updatedAt?new Date(rec.updatedAt).toLocaleDateString("es-CL"):""}</div>
                    <div style={{fontSize:10,color:sc2.accent,fontWeight:600}}>{rec.patentes?.join(", ")||"—"}</div>
                  </div>
                </div>;
              })}
            </div>}
          </div>;
        })()}

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
                <div style={{padding:"8px 14px 10px",display:"flex",gap:10,flexWrap:"wrap",alignItems:"center",background:"#0f172a"}}>
                  <Legend color="#22c55e" label="Uso exclusivo"/>
                  <Legend color="#3b82f6" label="Visitas"/>
                  <Legend color="#a855f7" label="Cedido"/>
                  <Legend color="#78716c" label="Sin uso"/>
                  <Legend color="#2d3f5a" label="Libre"/>
                  <span style={{fontSize:10,color:"#374151",marginLeft:"auto"}}>Toca un espacio para editar</span>
                </div>
              </div>;
            })}
          </div>
        )}

        {tab==="reclamos"&&<ReclamosTab/>}
      </div>

      {selectedSpot&&<SpotModal spot={selectedSpot} record={records[selectedSpot.id]} onClose={()=>setSelectedSpot(null)}
        onSave={data=>{setRecords(r=>({...r,[selectedSpot.id]:data}));setSelectedSpot(null);showToast(`Estacionamiento #${selectedSpot.id} actualizado`);}}
        onDelete={()=>{setRecords(r=>{const n={...r};delete n[selectedSpot.id];return n;});setSelectedSpot(null);showToast(`#${selectedSpot.id} liberado`,"info");}}/>}
      {confirmDelete&&<ConfirmDialog msg={`Se eliminará el registro del estacionamiento #${confirmDelete.id} (Torre ${confirmDelete.torre} · Depto ${confirmDelete.depto}).`} onConfirm={()=>deleteRecord(confirmDelete)} onCancel={()=>setConfirmDelete(null)}/>}
      {toast&&<Toast msg={toast.msg} type={toast.type}/>}
    </div>
  );
};

// ── ROOT ──
export default function App() {
  const [screen,setScreen]=useState("home");
  const [staffAuth,setStaffAuth]=useState(false);
  const [records,setRecords]=useState({});
  const [loading,setLoading]=useState(true);
  const loadedRef=useRef(false);

  useEffect(()=>{
    if(loadedRef.current)return;
    loadedRef.current=true;
    loadRegistros().then(data=>setRecords(data)).catch(()=>{}).finally(()=>setLoading(false));
  },[]);

  const setRecordsAndSync=useCallback((updater)=>{
    setRecords(prev=>{
      const next=typeof updater==="function"?updater(prev):updater;
      Object.entries(next).forEach(([id,rec])=>{if(JSON.stringify(prev[id])!==JSON.stringify(rec))upsertRegistro(Number(id),rec);});
      Object.keys(prev).forEach(id=>{if(!next[id])deleteRegistro(Number(id));});
      return next;
    });
  },[]);

  if(loading)return(
    <div style={{minHeight:"100vh",background:"#0a0f1e",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}}>
      <div style={{width:50,height:50,border:"3px solid #1e3a5f",borderTop:"3px solid #3b82f6",borderRadius:"50%",animation:"spin 1s linear infinite"}}/>
      <div style={{color:"#4b5563",fontSize:13,fontFamily:"monospace"}}>Cargando...</div>
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
