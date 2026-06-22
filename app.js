/* =====================================
   IMPERIO BUSINESS OS V2 - CORREGIDO
===================================== */

let coins = Number(localStorage.getItem("coins")) || 0;
let achievements = JSON.parse(localStorage.getItem("achievements")) || [];

const HABITS = [
  "🌅 Levantarme a las 9AM",
  "📵 1 hora sin redes",
  "💪 Ejercicio",
  "📚 Leer 10 páginas",
  "🧘 Meditar",
  "🙏 Orar",
  "📖 Leer Biblia",
  "💈 Dar seguimiento a clientes",
  "📞 Hacer llamadas pendientes",
  "💰 Revisar finanzas",
  "🥗 Comer saludable",
  "🚶 Caminar 30 min",
  "📝 Planificar el día",
  "🎯 Completar tarea importante"
];

const VERSES = [
  "Todo lo puedo en Cristo que me fortalece. Filipenses 4:13",
  "Esfuérzate y sé valiente. Josué 1:9",
  "El Señor es mi pastor; nada me faltará. Salmos 23:1",
  "Porque yo sé los planes que tengo para vosotros. Jeremías 29:11",
  "Dios es nuestro amparo y fortaleza. Salmos 46:1"
];

const MOTIVATIONS = [
  "🔥 La disciplina vence la motivación",
  "⚔️ Construye tu imperio un día a la vez",
  "👑 El éxito es una decisión diaria",
  "📈 Hoy debes ser mejor que ayer",
  "💰 Tu futuro depende de tus hábitos"
];

let data = JSON.parse(localStorage.getItem("imperioData")) || {
  pin: "1234",
  xp: 0,
  habits: new Array(HABITS.length).fill(false)
};

let todayTasks    = JSON.parse(localStorage.getItem("todayTasks"))    || [];
let tomorrowTasks = JSON.parse(localStorage.getItem("tomorrowTasks")) || [];
let reminders     = JSON.parse(localStorage.getItem("reminders"))     || [];
let followups     = JSON.parse(localStorage.getItem("followups"))     || [];
let clients       = JSON.parse(localStorage.getItem("clients"))       || [];

/* =====================================
   LOGIN
===================================== */

function login() {
  const pin = document.getElementById("pin-input").value;

  if (pin === data.pin) {
    document.getElementById("lock-screen").style.display = "none";
    document.getElementById("app").style.display = "block";
    init();
  } else {
    document.getElementById("error").innerText = "PIN incorrecto";
  }
}

/* =====================================
   INIT  ← TODAS las llamadas de render van aquí
===================================== */

function init() {
  renderHabits();
  showVerse();
  showMotivation();
  updateXP();
  renderCommandCenter();
  renderTodayTasks();
  renderTomorrowTasks();
  renderReminders();
  renderFollowups();
  renderClients();
  renderContactToday();   // ← faltaba en init()
  renderCoins();
  checkAchievements();    // ← estaba suelto fuera de función
  renderAchievements();
  renderStats();
  renderMentor();
  loadPersonalNote();
  renderMission();
  renderMoney();

  setInterval(showMotivation, 15000);
}

/* =====================================
   SAVE
===================================== */

function save() {
  localStorage.setItem("imperioData",   JSON.stringify(data));
  localStorage.setItem("todayTasks",    JSON.stringify(todayTasks));
  localStorage.setItem("tomorrowTasks", JSON.stringify(tomorrowTasks));
  localStorage.setItem("reminders",     JSON.stringify(reminders));
  localStorage.setItem("followups",     JSON.stringify(followups));
  localStorage.setItem("clients",       JSON.stringify(clients));
}

/* =====================================
   VERSO Y MOTIVACIÓN
===================================== */

function showVerse() {
  const verse = VERSES[Math.floor(Math.random() * VERSES.length)];
  document.getElementById("verse").innerText = verse;
}

function showMotivation() {
  const motivation = MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)];
  document.getElementById("motivation").innerText = motivation;
}

/* =====================================
   HÁBITOS
===================================== */

function renderHabits() {
  const container = document.getElementById("habitList");
  if (!container) return;
  container.innerHTML = "";

  HABITS.forEach((habit, index) => {
    container.innerHTML += `
      <div onclick="toggleHabit(${index})">
        ${habit}
        <span>${data.habits[index] ? "✅" : "❌"}</span>
      </div>
    `;
  });
}

function toggleHabit(index) {
  // Solo suma coins al completar, no al desmarcar
  if (!data.habits[index]) coins += 2;

  data.habits[index] = !data.habits[index];

  save();
  renderHabits();
  updateXP();
  renderCoins();        // ← faltaba: actualiza el display de coins
  checkAchievements();  // ← faltaba: verifica logros al ganar XP
  renderStats();
  renderCommandCenter();
}

/* =====================================
   XP Y RANGOS
===================================== */

function updateXP() {
  const habitsXP  = data.habits.filter(x => x).length * 20;
  const todayXP   = todayTasks.filter(x => x.done).length * 10;
  const followXP  = followups.filter(x => x.done).length * 15;

  data.xp = habitsXP + todayXP + followXP;

  const xpEl = document.getElementById("xpDashboard");
  if (xpEl) xpEl.innerText = data.xp;

  let rank = "🪖 Recluta";
  if (data.xp >= 100) rank = "⚔️ Guerrero";
  if (data.xp >= 250) rank = "👑 Emperador";
  if (data.xp >= 500) rank = "🔥 Leyenda";

  const rankEl = document.getElementById("rank");
  if (rankEl) rankEl.innerText = rank;

  save();
}

/* =====================================
   TAREAS DE HOY
===================================== */

function addTodayTask() {
  const input = document.getElementById("todayInput");
  if (!input.value.trim()) return;

  todayTasks.push({ text: input.value, done: false });
  input.value = "";

  save();
  renderTodayTasks();
  updateXP();
}

function toggleTodayTask(index) {
  todayTasks[index].done = !todayTasks[index].done;
  save();
  renderTodayTasks();
  updateXP();
  renderCommandCenter();
}

function renderTodayTasks() {
  const list = document.getElementById("todayList");
  if (!list) return;
  list.innerHTML = "";

  todayTasks.forEach((task, index) => {
    list.innerHTML += `
      <div onclick="toggleTodayTask(${index})">
        ${task.done ? "✅" : "❌"} ${task.text}
      </div>
    `;
  });

  const pendingEl = document.getElementById("pendingTasks");
  if (pendingEl) pendingEl.innerText = todayTasks.filter(x => !x.done).length;
}

/* =====================================
   TAREAS DE MAÑANA
===================================== */

function addTomorrowTask() {
  const input = document.getElementById("tomorrowInput");
  if (!input.value.trim()) return;

  tomorrowTasks.push({ text: input.value, done: false });
  input.value = "";

  save();
  renderTomorrowTasks();
}

function toggleTomorrowTask(index) {
  tomorrowTasks[index].done = !tomorrowTasks[index].done;
  save();
  renderTomorrowTasks();
}

function renderTomorrowTasks() {
  const list = document.getElementById("tomorrowList");
  if (!list) return;
  list.innerHTML = "";

  tomorrowTasks.forEach((task, index) => {
    list.innerHTML += `
      <div onclick="toggleTomorrowTask(${index})">
        ${task.done ? "✅" : "❌"} ${task.text}
      </div>
    `;
  });
}

/* =====================================
   RECORDATORIOS
===================================== */

function addReminder() {
  const input = document.getElementById("reminderInput");
  if (!input.value.trim()) return;

  reminders.push({ text: input.value });
  input.value = "";

  save();
  renderReminders();
}

function renderReminders() {
  const list = document.getElementById("reminderList");
  if (!list) return;
  list.innerHTML = "";

  reminders.forEach(item => {
    list.innerHTML += `<div>⏰ ${item.text}</div>`;
  });
}

/* =====================================
   SEGUIMIENTOS
===================================== */

function addFollowup() {
  const text     = document.getElementById("followInput").value;
  const priority = document.getElementById("priority").value;

  if (!text.trim()) return;

  followups.push({ text, priority, done: false });
  document.getElementById("followInput").value = "";

  save();
  renderFollowups();
  checkAchievements(); // verifica logro "Maestro Seguimiento"
}

function toggleFollowup(index) {
  followups[index].done = !followups[index].done;
  save();
  renderFollowups();
  updateXP();
  renderCommandCenter();
  renderMentor();
}

function renderFollowups() {
  const list = document.getElementById("followupList");
  if (!list) return;
  list.innerHTML = "";

  followups.forEach((item, index) => {
    list.innerHTML += `
      <div onclick="toggleFollowup(${index})">
        ${item.done ? "✅" : "📌"} ${item.text} (${item.priority})
      </div>
    `;
  });

  const pendingEl = document.getElementById("pendingFollowups");
  if (pendingEl) pendingEl.innerText = followups.filter(x => !x.done).length;
}

/* =====================================
   BARBERÍA / CLIENTES
===================================== */

function addClient() {
  const name  = document.getElementById("clientName").value;
  const phone = document.getElementById("clientPhone").value;
  const date  = document.getElementById("clientDate").value;

  if (!name.trim()) return;

  clients.push({ name, phone, date });

  document.getElementById("clientName").value  = "";
  document.getElementById("clientPhone").value = "";
  document.getElementById("clientDate").value  = "";

  save();
  renderClients();
  renderContactToday();
  checkAchievements(); // verifica logro "25 Clientes"
  renderStats();
  renderCommandCenter();
}

function renderClients() {
  const list = document.getElementById("clientList");
  if (!list) return;
  list.innerHTML = "";

  clients.forEach(client => {
    list.innerHTML += `
      <div>
        💈 ${client.name}<br>
        📞 ${client.phone}
      </div>
    `;
  });
}

function renderContactToday() {
  const div = document.getElementById("contactToday");
  if (!div) return;
  div.innerHTML = "";

  const hoy = new Date();

  clients.forEach(cliente => {
    if (!cliente.date) return;

    const ultimaFecha = new Date(cliente.date);
    const dias = Math.floor((hoy - ultimaFecha) / (1000 * 60 * 60 * 24));

    if (dias >= 7) {
      div.innerHTML += `
        <div class="habito">
          💈 ${cliente.name}<br>
          ⚠️ ${dias} días sin corte
        </div>
      `;
    }
  });
}

/* =====================================
   IA IMPERIO
===================================== */

function askAI() {
  const q = document.getElementById("iaInput").value.toLowerCase();
  let response = "👑 Mantente enfocado.";

  if (q.includes("dinero"))     response = "💰 Prioriza ingresos y controla gastos.";
  if (q.includes("barberia"))   response = "💈 Da seguimiento a tus mejores clientes.";
  if (q.includes("disciplina")) response = "⚔️ Cumple hábitos aunque no tengas ganas.";
  if (q.includes("motivacion")) response = "🔥 La acción crea motivación.";

  document.getElementById("iaResponse").innerText = response;
}

/* =====================================
   CAMBIAR PIN
===================================== */

function changePin() {
  const newPin = document.getElementById("newPin").value;

  if (newPin.length < 4) {
    alert("PIN mínimo 4 dígitos");
    return;
  }

  data.pin = newPin;
  save();
  alert("PIN actualizado");
  document.getElementById("newPin").value = "";
}

/* =====================================
   RECORDATORIO PERSONAL
===================================== */

function savePersonalNote() {
  const note = document.getElementById("personalNote").value;
  localStorage.setItem("personalNote", note);
  alert("Recordatorio guardado");
}

function loadPersonalNote() {
  const note = localStorage.getItem("personalNote");
  if (note) document.getElementById("personalNote").value = note;
}

/* =====================================
   MISIÓN PRINCIPAL
===================================== */

let mainMission = localStorage.getItem("mainMission") || "";
let missionDone = localStorage.getItem("missionDone") === "true";

function saveMainMission() {
  mainMission = document.getElementById("mainMissionInput").value;
  localStorage.setItem("mainMission", mainMission);

  missionDone = false;
  localStorage.setItem("missionDone", "false");

  renderMission();
}

function completeMission() {
  if (missionDone) return;

  missionDone = true;
  coins += 20;
  data.xp += 100;

  localStorage.setItem("missionDone", "true");

  save();
  renderMission();
  updateXP();
  renderCoins();
  checkAchievements();
  renderStats();

  alert("🔥 +100 XP por completar tu misión");
}

function renderMission() {
  const div = document.getElementById("mainMissionView");
  if (!div) return;
  div.innerHTML = missionDone
    ? `✅ ${mainMission}`
    : `🎯 ${mainMission}`;
}

/* =====================================
   META DE DINERO
===================================== */

function saveMoneyGoal() {
  const goal  = Number(document.getElementById("goalMoney").value);
  const today = Number(document.getElementById("todayMoney").value);

  localStorage.setItem("goalMoney",  goal);
  localStorage.setItem("todayMoney", today);

  renderMoney();
  renderCommandCenter();
}

function renderMoney() {
  const goal  = Number(localStorage.getItem("goalMoney"))  || 0;
  const today = Number(localStorage.getItem("todayMoney")) || 0;
  const pct   = goal > 0 ? Math.min(100, Math.round((today / goal) * 100)) : 0;

  const div = document.getElementById("moneyProgress");
  if (!div) return;

  div.innerHTML = `
    <p>Meta: RD$ ${goal}</p>
    <p>Hoy: RD$ ${today}</p>
    <p>${pct}% completado</p>
  `;
}

/* =====================================
   COMMAND CENTER
===================================== */

function renderCommandCenter() {
  const habitosCompletados    = data.habits.filter(x => x).length;
  const seguimientosPendientes = followups.filter(x => !x.done).length;
  const clientesPendientes    = clients.length;
  const dineroHoy = Number(localStorage.getItem("todayMoney")) || 0;
  const metaHoy   = Number(localStorage.getItem("goalMoney"))  || 2000;

  let rango = "🪖 Recluta";
  if (data.xp >= 100) rango = "⚔️ Guerrero";
  if (data.xp >= 250) rango = "👑 Emperador";
  if (data.xp >= 500) rango = "🔥 Leyenda";

  const set = (id, html) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  };

  set("ccNivel",         `<b>${rango}</b>`);
  set("ccXP",            `⚔️ XP: ${data.xp}`);
  set("ccHabitos",       `🔥 Hábitos: ${habitosCompletados}/14`);
  set("ccSeguimientos",  `📞 Seguimientos: ${seguimientosPendientes}`);
  set("ccClientes",      `💈 Clientes: ${clientesPendientes}`);
  set("ccMeta",          `💰 RD$ ${dineroHoy} / ${metaHoy}`);

  const prioridad = seguimientosPendientes > 0
    ? "📞 Hacer seguimientos"
    : "🎯 Completar misión";

  set("ccPrioridad", `🚨 Prioridad: ${prioridad}`);
}

/* =====================================
   COINS
===================================== */

function renderCoins() {
  const div = document.getElementById("coins");
  if (!div) return;
  div.innerText = coins;
  localStorage.setItem("coins", coins);
}

/* =====================================
   LOGROS / ACHIEVEMENTS
===================================== */

function unlockAchievement(name) {
  if (achievements.includes(name)) return;

  achievements.push(name);
  coins += 50;

  localStorage.setItem("achievements", JSON.stringify(achievements));
  renderCoins();
  renderAchievements();
}

function checkAchievements() {
  if (data.xp >= 100)        unlockAchievement("⚔️ Primer Guerrero");
  if (data.xp >= 500)        unlockAchievement("👑 Emperador");
  if (clients.length >= 25)  unlockAchievement("💈 25 Clientes");
  if (followups.length >= 50) unlockAchievement("📞 Maestro Seguimiento");
}

function renderAchievements() {
  const div = document.getElementById("achievementList");
  if (!div) return;
  div.innerHTML = "";

  achievements.forEach(a => {
    div.innerHTML += `<div class="habito completado">${a}</div>`;
  });
}

/* =====================================
   ESTADÍSTICAS
===================================== */

function renderStats() {
  const div = document.getElementById("stats");
  if (!div) return;

  const habitsDone = data.habits.filter(x => x).length;

  div.innerHTML = `
    🔥 Hábitos: ${habitsDone}<br><br>
    💈 Clientes: ${clients.length}<br><br>
    📞 Seguimientos: ${followups.length}<br><br>
    ⚔️ XP: ${data.xp}<br><br>
    💎 Coins: ${coins}
  `;
}

/* =====================================
   MENTOR IA
===================================== */

function renderMentor() {
  const div = document.getElementById("mentorMessage");
  if (!div) return;

  const pendientes = followups.filter(x => !x.done).length;

  let msg = pendientes > 0
    ? `👑 Tienes ${pendientes} seguimientos pendientes. Hazlos primero.`
    : `🔥 Excelente. No tienes seguimientos pendientes.`;

  if (data.habits.filter(x => x).length < 5) {
    msg += `<br><br>⚠️ Te faltan hábitos.`;
  }

  div.innerHTML = msg;
}