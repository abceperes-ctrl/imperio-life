const TAREAS=[
'🌅 Levantarse 5:00 AM',
'💪 Ejercicio 30min',
'📚 Leer 10 páginas',
'💰 Ahorrar $50',
'🧘 Meditar 10min'
];

let datos={
tareas:[false,false,false,false,false],
vasos:0,
peso:'',
racha:0,
ultimoDia:'',
rachaSumada:false,
xp:0
};

let metas = JSON.parse(localStorage.getItem('imperioMetas')) || [];
let xpHistorial={};
let audioActivado=false;

const VERSOS=[
{texto:"Todo lo puedo en Cristo que me fortalece",cita:"Filipenses 4:13"},
{texto:"Porque yo sé los planes que tengo para ti",cita:"Jeremías 29:11"},
{texto:"El Señor es mi pastor; nada me faltará",cita:"Salmos 23:1"},
{texto:"Esfuérzate y sé valiente",cita:"Josué 1:9"},
{texto:"Dios es nuestro amparo y fortaleza",cita:"Salmos 46:1"}
];

const MENSAJES=[
"Los reyes no se rinden 👑",
"5AM es guerra contra la mediocridad ⚔️",
"Cada hábito es un ladrillo 🏰",
"Hoy compites contra tu yo de ayer 💪",
"La disciplina vence al talento 🔥",
"Un día más fuerte, un día más cerca 🚀"
];

let intentos=0;
const PIN_GUARDADO=localStorage.getItem('imperioPIN')||'1234';

function unlockApp(){
const pin=document.getElementById('pin-input').value;

if(pin===PIN_GUARDADO){
document.getElementById('lock-screen').style.display='none';
document.getElementById('app').style.display='block';
init();
}else{
intentos++;
document.getElementById('pin-error').style.display='block';
document.getElementById('pin-input').value='';

if(intentos>=3){
alert('3 intentos fallidos. Borrando datos.');
localStorage.clear();
location.reload();
}
}
}

document.addEventListener('click',function(){
if(!audioActivado){
const ding=document.getElementById('dingSound');
ding.play().then(()=>ding.pause()).catch(()=>{});
audioActivado=true;
}
},{once:true});

function init(){
cargarDatos();
mostrarFecha();
crearVasos();
cargarEstado();
mostrarVersoDiario();
mostrarMensajeMotivacion();
mostrarMetas();
actualizarXP();
setInterval(checkDiaNuevo,60000);
}

/* ===================== VERSO ===================== */

function mostrarVersoDiario(){
const hoy=new Date();
const diaDelAño=Math.floor((hoy-new Date(hoy.getFullYear(),0,0))/86400000);
const verso=VERSOS[diaDelAño%VERSOS.length];

document.getElementById('verso-text').textContent='"'+verso.texto+'"';
document.getElementById('verso-cita').textContent=verso.cita;
}

/* ===================== MOTIVACIÓN ===================== */

function mostrarMensajeMotivacion(){
const completadas=datos.tareas.filter(t=>t).length;

let mensaje;
if(datos.racha>=7)mensaje="🔥 7 DÍAS DE RACHA.";
else if(completadas===5)mensaje="👑 100% COMPLETADO.";
else mensaje=MENSAJES[Math.floor(Math.random()*MENSAJES.length)];

document.getElementById('mensaje-motivation').textContent=mensaje;
}

/* ===================== STORAGE ===================== */

function cargarDatos(){
const d=localStorage.getItem('imperioDatos_v5');
if(d)datos=JSON.parse(d);

const x=localStorage.getItem('xpHistorial_v5');
if(x)xpHistorial=JSON.parse(x);
}

function guardarDatos(){
localStorage.setItem('imperioDatos_v5',JSON.stringify(datos));
localStorage.setItem('xpHistorial_v5',JSON.stringify(xpHistorial));
}

/* ===================== UI ===================== */

function mostrarFecha(){
const f=new Date();

document.getElementById('fecha').textContent=
f.toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'short'});

document.getElementById('racha').textContent=datos.racha;
document.getElementById('peso').textContent=datos.peso?datos.peso+' kg':'-- kg';
}

/* ===================== DÍA NUEVO ===================== */

function checkDiaNuevo(){
const hoy=new Date().toDateString();

if(datos.ultimoDia!==hoy && datos.ultimoDia!==''){

const completadas=datos.tareas.filter(t=>t).length;

if(!datos.rachaSumada && completadas>=3){
datos.racha++;
}else if(completadas<3){
datos.racha=0;
}

datos.tareas=[false,false,false,false,false];
datos.vasos=0;
datos.rachaSumada=false;
datos.ultimoDia=hoy;

guardarDatos();
mostrarFecha();
cargarEstado();
mostrarVersoDiario();
mostrarMensajeMotivacion();
actualizarXP();
}
}

/* ===================== AGUA ===================== */

function crearVasos(){
const div=document.getElementById('vasosDiv');
div.innerHTML='';

for(let i=0;i<8;i++){
const v=document.createElement('div');
v.className='vaso'+(i<datos.vasos?' lleno':'');
v.onclick=()=>toggleVaso(i);
div.appendChild(v);
}

document.getElementById('vasos').textContent=datos.vasos;
}

function toggleVaso(i){
datos.vasos=i+1;
crearVasos();
sonidoDing();
actualizarXP();
guardarDatos();
}

function sumarAgua(){
if(datos.vasos<8){
datos.vasos++;
crearVasos();
sonidoDing();
actualizarXP();
guardarDatos();
}
}

/* ===================== SONIDO ===================== */

function sonidoDing(){
if(audioActivado){
const ding=document.getElementById('dingSound');
ding.currentTime=0;
ding.play().catch(()=>{});
}
}

/* ===================== HÁBITOS ===================== */

function toggleTarea(i){
datos.tareas[i]=!datos.tareas[i];

document.getElementById('check'+i).classList.toggle('activo');
document.querySelectorAll('.habito')[i].classList.toggle('completado');

sonidoDing();
actualizarXP();
guardarDatos();
verificarRacha();
mostrarMensajeMotivacion();
}

/* ===================== Racha ===================== */

function verificarRacha(){
const completadas=datos.tareas.filter(t=>t).length;
if(completadas>=3)datos.rachaSumada=true;
}

/* ===================== PESO ===================== */

function guardarPeso(){
const p=document.getElementById('pesoInput').value;

if(p){
datos.peso=p;
document.getElementById('peso').textContent=p+' kg';
localStorage.setItem('peso_'+new Date().toDateString(),p);

sonidoDing();
actualizarXP();
guardarDatos();
alert('Peso guardado ✅ +15 XP');
}
}

/* ===================== XP ===================== */

function actualizarXP(){
const t=datos.tareas.filter(x=>x).length*10;
const a=datos.vasos>=8?20:0;
const p=datos.peso?15:0;

const xpHoy=t+a+p;

let xpTotal=0;
for(let f in xpHistorial)xpTotal+=xpHistorial[f];

xpTotal=xpTotal-(xpHistorial[new Date().toDateString()]||0)+xpHoy;

datos.xp=xpTotal;
xpHistorial[new Date().toDateString()]=xpHoy;

guardarDatos();
mostrarRango();
mostrarCalendarioCalor();
mostrarHistorial();
}

/* ===================== RANGO ===================== */

function mostrarRango(){
const rangos=[
{xp:0,nombre:'Recluta',icon:'🪖'},
{xp:100,nombre:'Soldado',icon:'⚔️'},
{xp:300,nombre:'Capitán',icon:'👑'}
];

let actual=rangos[0];

for(let r of rangos){
if(datos.xp>=r.xp)actual=r;
}

const idx=rangos.indexOf(actual);
const next=rangos[idx+1]?rangos[idx+1].xp:actual.xp+100;

const actualXp=datos.xp-actual.xp;
const total=next-actual.xp;
const pct=Math.min(100,(actualXp/total)*100);

document.getElementById('rango').textContent=actual.icon+' '+actual.nombre;
document.getElementById('xp').textContent=actualXp;
document.getElementById('xpNext').textContent=total;
document.getElementById('xpFill').style.width=pct+'%';
}

/* ===================== CALENDARIO ===================== */

function mostrarCalendarioCalor(){
const div=document.getElementById('calendarioCalor');
div.innerHTML='';

const hoy=new Date();

for(let i=89;i>=0;i--){
const f=new Date(hoy);
f.setDate(f.getDate()-i);

const key=f.toDateString();
const xp=xpHistorial[key]||0;

let nivel=0;
if(xp>=80)nivel=4;
else if(xp>=60)nivel=3;
else if(xp>=40)nivel=2;
else if(xp>0)nivel=1;

const box=document.createElement('div');
box.className='cuadro-dia nivel-'+nivel;
div.appendChild(box);
}
}

/* ===================== HISTORIAL ===================== */

function mostrarHistorial(){
const div=document.getElementById('historial');
div.innerHTML='';

const hoy=new Date();

for(let i=0;i<30;i++){
const f=new Date(hoy);
f.setDate(f.getDate()-i);

const key=f.toDateString();
const xp=xpHistorial[key]||0;

if(xp>0){
const pct=Math.round((xp/80)*100);

div.innerHTML+=`
<div class="dia-historial">
<span>${f.toLocaleDateString('es-ES')}</span>
<span class="pct">${pct}% - ${xp} XP</span>
</div>`;
}
}
}

/* ===================== ESTADO ===================== */

function cargarEstado(){
const habitos=document.querySelectorAll('.habito');

for(let i=0;i<datos.tareas.length;i++){
if(datos.tareas[i]){
document.getElementById('check'+i)?.classList.add('activo');
habitos[i]?.classList.add('completado');
}
}

crearVasos();

const p=localStorage.getItem('peso_'+new Date().toDateString());
if(p)document.getElementById('pesoInput').value=p;
}

/* ===================== METAS DEL AÑO ===================== */

function agregarMeta(){
const input=document.getElementById('metaInput');
const texto=input.value.trim();
if(!texto)return;

metas.push({texto,hecha:false});
input.value='';
guardarMetas();
mostrarMetas();
}

function mostrarMetas(){
const div=document.getElementById('listaMetas');
div.innerHTML='';

metas.forEach((m,i)=>{
div.innerHTML+=`
<div class="habito ${m.hecha?'completado':''}">
<span>${m.texto}</span>
<input type="checkbox" ${m.hecha?'checked':''} onchange="toggleMeta(${i})">
</div>`;
});
}

function toggleMeta(i){
metas[i].hecha=!metas[i].hecha;

if(metas[i].hecha){
datos.xp+=30;
}

guardarMetas();
guardarDatos();
mostrarMetas();
actualizarXP();
sonidoDing();
}

function guardarMetas(){
localStorage.setItem('imperioMetas',JSON.stringify(metas));
}