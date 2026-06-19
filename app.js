// CAMBIA ESTO
const MI_CORREO = "tu@correo.com";
const MI_PASSWORD = "imperio2026";

const TAREAS = [
  "5:00am - Levantarse sin snooze",
  "Leer 10 páginas - Mente de acero",
  "Entrenar 45 min - Cuerpo de guerrero",
  "8 vasos de agua - Hidratación total",
  "2h sin distracciones - Enfoque brutal",
  "Ahorrar $50 - Construye riqueza",
  "Dormir 11pm - Descanso de rey"
];

const VERSICULOS = [
  {texto:"Todo lo puedo en Cristo que me fortalece",cita:"Filipenses 4:13"},
  {texto:"Porque yo sé los planes que tengo para ti",cita:"Jeremías 29:11"},
  {texto:"Jehová es mi pastor; nada me faltará",cita:"Salmos 23:1"},
  {texto:"Confía en Jehová de todo tu corazón",cita:"Proverbios 3:5"},
  {texto:"No temas, porque yo estoy contigo",cita:"Isaías 41:10"},
  {texto:"El gozo de Jehová es tu fuerza",cita:"Nehemías 8:10"},
  {texto:"Echa sobre Jehová tu carga",cita:"Salmos 55:22"},
  {texto:"Buscad primeramente el reino de Dios",cita:"Mateo 6:33"},
  {texto:"Jehová te bendiga y te guarde",cita:"Números 6:24"},
  {texto:"Bástate mi gracia",cita:"2 Corintios 12:9"},
  {texto:"Esfuérzate y sé valiente",cita:"Josué 1:9"},
  {texto:"Los que esperan a Jehová tendrán nuevas fuerzas",cita:"Isaías 40:31"}
];

const FRASES = [
  {texto:"La disciplina pesa onzas, el arrepentimiento pesa toneladas",autor:"- Jim Rohn"},
  {texto:"No le pidas una vida fácil, pídele fuerza para hacerte imparable",autor:"- Bruce Lee"},
  {texto:"El dolor de hoy es la fuerza de mañana",autor:"- Imperio Life"},
  {texto:"Gánale a tu yo de ayer, no al vecino",autor:"- David Goggins"},
  {texto:"Si no sacrificas por tus sueños, ellos serán el sacrificio",autor:"- Les Brown"},
  {texto:"La disciplina es elegir entre lo que quieres ahora y lo que quieres más",autor:"- Lincoln"},
  {texto:"Mientras otros duermen, tú construyes tu imperio",autor:"- 5:00am Club"},
  {texto:"Tu mente creerá cualquier cosa que le digas",autor:"- Imperio Life"},
  {texto:"No hay ascensor al éxito, toca subir escaleras",autor:"- Ziglar"},
  {texto:"La diferencia está en lo que haces hoy",autor:"- Imperio Life"},
  {texto:"Sé tan bueno que no puedan ignorarte",autor:"- Steve Martin"},
  {texto:"Los campeones se hacen cuando nadie los ve",autor:"- Muhammad Ali"}
];

let datos={tareas:[],vasos:0,peso:"",racha:0,ultimoDia:"",rachaSumada:false};
let metas=[];
let historial={};

function entrar(){
  const c=document.getElementById('emailInput').value.trim().toLowerCase();
  const p=document.getElementById('passwordInput').value;
  if(c===MI_CORREO.toLowerCase()&&p===MI_PASSWORD){
    sessionStorage.setItem('imperio','1');
    document.getElementById('loginScreen').classList.add('oculto');
    document.getElementById('appScreen').classList.remove('oculto');
    cargarTodo();
  }else{document.getElementById('errorMsg').textContent="Correo o contraseña incorrectos"}
}

function salir(){
  sessionStorage.removeItem('imperio');
  document.getElementById('appScreen').classList.add('oculto');
  document.getElementById('loginScreen').classList.remove('oculto');
  document.getElementById('passwordInput').value='';
  document.getElementById('errorMsg').textContent='';
}

window.onload=()=>{
  if(sessionStorage.getItem('imperio')==='1'){
    document.getElementById('loginScreen').classList.add('oculto');
    document.getElementById('appScreen').classList.remove('oculto');
    cargarTodo();
  }
  document.getElementById('passwordInput')?.addEventListener('keypress',e=>{if(e.key==='Enter')entrar()});
};

function cargarTodo(){
  const hoy=new Date();
  const hoyStr=hoy.toDateString();
  document.getElementById('fecha').textContent=hoy.toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long',year:'numeric'});

  const guardado=localStorage.getItem('imperioDatos');
  const histGuardado=localStorage.getItem('imperioHistorial');
  if(histGuardado)historial=JSON.parse(histGuardado);

  if(guardado){
    datos=JSON.parse(guardado);
    if(datos.ultimoDia!==hoyStr){
      guardarDiaHistorial(datos.ultimoDia,datos);
      datos.tareas=Array(TAREAS.length).fill(false);
      datos.vasos=0;
      datos.ultimoDia=hoyStr;
      datos.rachaSumada=false;
    }
  }else{
    datos.tareas=Array(TAREAS.length).fill(false);
    datos.ultimoDia=hoyStr;
  }

  mostrarTareas();
  mostrarAgua();
  mostrarPeso();
  mostrarVersiculo(hoy);
  mostrarFrase(hoy);
  cargarMetas();
  mostrarHistorial();
  actualizarProgreso();
}

function guardarDiaHistorial(fecha,d){
  if(fecha){
    const t=d.tareas.filter(x=>x).length;
    const a=d.vasos>=8?1:0;
    const f=localStorage.getItem('frase_'+fecha)==='1'?1:0;
    const total=TAREAS.length+2;
    const pct=Math.round((t+a+f)/total*100);
    historial[fecha]={tareas:t,agua:a,frase:f,pct:pct,fecha:fecha};

    const keys=Object.keys(historial).sort();
    if(keys.length>30)delete historial[keys[0]];
    localStorage.setItem('imperioHistorial',JSON.stringify(historial));
  }
}

function mostrarHistorial(){
  const div=document.getElementById('calendarioHistorial');
  div.innerHTML='';
  const dias=Object.keys(historial).sort().reverse().slice(0,30);

  if(dias.length===0){
    div.innerHTML='<p style="color:#666;text-align:center;font-size:13px">Aún no hay historial. Completa días para ver tu progreso aquí</p>';
    return;
  }

  dias.forEach(fecha=>{
    const d=historial[fecha];
    const fechaObj=new Date(fecha);
    const fechaTxt=fechaObj.toLocaleDateString('es-ES',{day:'numeric',month:'short',weekday:'short'});
    const color=d.pct===100?'#4ade80':d.pct>=70?'#ffd700':'#ff4444';

    const item=document.createElement('div');
    item.className='dia-historial';
    item.innerHTML=`
      <div class="dia-header">
        <span class="dia-fecha">${fechaTxt}</span>
        <span class="dia-porcentaje" style="color:${color}">${d.pct}%</span>
      </div>
      <div class="dia-barra"><div class="dia-barra-fill" style="width:${d.pct}%;background:${color}"></div></div>
      <div class="dia-detalles">
        <span class="${d.tareas>0?'ok':'fail'}">🎯 ${d.tareas}/${TAREAS.length}</span>
        <span class="${d.agua?'ok':'fail'}">💧 ${d.agua?'8/8':'0/8'}</span>
        <span class="${d.frase?'ok':'fail'}">⚡ ${d.frase?'Leída':'Pendiente'}</span>
      </div>
    `;
    div.appendChild(item);
  });
}

function mostrarTareas(){
  const div=document.getElementById('listaTareas');
  div.innerHTML='';
  TAREAS.forEach((t,i)=>{
    const d=document.createElement('div');
    d.className='tarea'+(datos.tareas[i]?' completada':'');
    d.innerHTML=`<input type="checkbox" ${datos.tareas[i]?'checked':''} onchange="toggleTarea(${i})"><span>${t}</span>`;
    div.appendChild(d);
  });
}

function toggleTarea(i){
  datos.tareas[i]=!datos.tareas[i];
  guardarDatos();
  mostrarTareas();
  actualizarProgreso();
}

function mostrarAgua(){document.getElementById('vasos').textContent=datos.vasos}
function sumarAgua(){if(datos.vasos<8){datos.vasos++;guardarDatos();mostrarAgua();actualizarProgreso()}}
function resetAgua(){datos.vasos=0;guardarDatos();mostrarAgua();actualizarProgreso()}
function mostrarPeso(){document.getElementById('ultimoPeso').textContent=datos.peso||'--'}
function guardarPeso(){const p=document.getElementById('inputPeso').value;if(p){datos.peso=p;guardarDatos();mostrarPeso();document.getElementById('inputPeso').value=''}}

function mostrarVersiculo(hoy){
  const dia=Math.floor((hoy-new Date(hoy.getFullYear(),0,0))/86400000);
  const v=VERSICULOS[dia%VERSICULOS.length];
  document.getElementById('versoTexto').textContent=`"${v.texto}"`;
  document.getElementById('versoCita').textContent=v.cita;
}

function mostrarFrase(hoy){
  const dia=Math.floor((hoy-new Date(hoy.getFullYear(),0,0))/86400000);
  const f=FRASES[(dia+7)%FRASES.length];
  document.getElementById('fraseTexto').textContent=`"${f.texto}"`;
  document.getElementById('fraseAutor').textContent=f.autor;
  const leida=localStorage.getItem('frase_'+hoy.toDateString())==='1';
  document.getElementById('checkFrase').checked=leida;
  document.querySelector('.check-frase').classList.toggle('completada',leida);
}

function marcarFrase(){
  const c=document.getElementById('checkFrase').checked;
  localStorage.setItem('frase_'+new Date().toDateString(),c?'1':'0');
  document.querySelector('.check-frase').classList.toggle('completada',c);
  actualizarProgreso();
}

function cargarMetas(){
  const g=localStorage.getItem('imperioMetas');
  if(g)metas=JSON.parse(g);
  mostrarMetas();
}

function mostrarMetas(){
  const div=document.getElementById('listaMetas');
  if(metas.length===0){div.innerHTML='<p style="color:#666;text-align:center;font-size:13px">Agrega tu primera meta 2026...</p>';return}
  div.innerHTML='';
  metas.forEach((m,i)=>{
    const d=document.createElement('div');
    d.className='meta-item'+(m.completada?' completada':'');
    d.innerHTML=`<input type="checkbox" ${m.completada?'checked':''} onchange="toggleMeta(${i})"><span>${m.texto}</span><button onclick="borrarMeta(${i})">X</button>`;
    div.appendChild(d);
  });
}

function agregarMeta(){
  const inp=document.getElementById('inputMeta');
  const txt=inp.value.trim();
  if(txt){metas.push({texto:txt,completada:false});inp.value='';guardarMetas();mostrarMetas()}
}

function toggleMeta(i){metas[i].completada=!metas[i].completada;guardarMetas();mostrarMetas()}
function borrarMeta(i){if(confirm('¿Borrar meta?')){metas.splice(i,1);guardarMetas();mostrarMetas()}}
function guardarMetas(){localStorage.setItem('imperioMetas',JSON.stringify(metas))}

function actualizarProgreso(){
  const t=datos.tareas.filter(x=>x).length;
  const a=datos.vasos>=8?1:0;
  const f=localStorage.getItem('frase_'+new Date().toDateString())==='1'?1:0;
  const total=TAREAS.length+2;
  const pct=Math.round((t+a+f)/total*100);
  document.getElementById('porcentaje').textContent=pct+'%';
  document.getElementById('progressFill').style.width=pct+'%';

  if(pct===100&&datos.ultimoDia===new Date().toDateString()&&!datos.rachaSumada){
    datos.racha++;datos.rachaSumada=true;guardarDatos();
  }else if(pct<100&&datos.rachaSumada){
    datos.rachaSumada=false;guardarDatos();
  }
  document.getElementById('racha').textContent=datos.racha;
}

function resetDia(){
  if(confirm('¿Resetear solo el día? Las metas 2026 y el historial se quedan')){
    datos.tareas=Array(TAREAS.length).fill(false);
    datos.vasos=0;
    guardarDatos();
    cargarTodo();
  }
}

function guardarDatos(){localStorage.setItem('imperioDatos',JSON.stringify(datos))}