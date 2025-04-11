const startTimeInput = document.getElementById("startTime");
const nowBtn = document.getElementById("nowBtn");
const scheduleList = document.getElementById("scheduleList");
const shareBtn = document.getElementById("shareBtn");
const clearBtn = document.getElementById("clearBtn");
const copyScheduleBtn = document.getElementById("copyScheduleBtn");

const schedule = [
  [20, "Exposição Solar (T0)", "Exposição direta à luz solar quando os primeiros raios tocam o solo. Marca o início do dia circadiano e serve como tempo de referência para o restante da estrutura."],
  [40, "Café da Manhã Low-Carb", "Refeição leve, com ênfase em lipídios e proteínas para manter estabilidade glicêmica e energética."],
  [10, "Checkpoint", "Avaliação inicial do estado físico e mental para transição segura ao modo cognitivo profundo."],
  [20, "Monitoramento de Ondas", "Leitura ativa de sinais fisiológicos e mentais para iniciar o ciclo no ponto de maior prontidão."],
  [80, "Foco Profundo", "Trabalho cognitivo de alta intensidade, em ambiente controlado e livre de distrações."],
  [20, "Modo Difuso", "Descanso neural ativo. Evitar tarefas mecânicas, cognitivas ou uso de telas."],
  [80, "Foco Profundo", "Continuação de foco intenso para resolução de problemas ou produção densa."],
  [20, "Modo Difuso", "Reestabilização fisiológica e mental para manter performance sustentável."],
  [80, "Foco Moderado", "Atividades cognitivas intermediárias, resolução de problemas, revisões e sínteses."],
  [20, "Modo Difuso", "Recuperação final da fase, preparando transição para a fase seguinte."],
  [10, "Checkpoint", "Checando energia, clareza e motivação para as atividades de recuperação e criatividade."],
  [40, "Almoço Nutritivo", "Refeição densa em nutrientes, com ênfase em carboidratos complexos e fibras."],
  [80, "Trabalho Criativo", "Geração de ideias, conexões cruzadas, exploração conceitual ou expressão construtiva."],
  [40, "Pré-Treino", "Foco respiratório, mobilidade e ativação neural."],
  [80, "Treino de Alta Intensidade", "Treino estruturado com foco em força, potência e resistência, usando movimentos compostos e estímulo neuromuscular."],
  [20, "Alongamento Corporal", "Alongamento intencional para liberar tensões, restaurar mobilidade e favorecer a transição do estado ativo para o desligamento progressivo."],
  [40, "Refeição Pós-Treino", "Refeição de recuperação, priorizando proteínas e eletrólitos."],
  [10, "Checkpoint", "Encerramento metabólico e cognitivo da fase ativa."],
  [120, "Desligamento Noturno", "Desaceleração progressiva. Atividades de baixa estimulação, luz reduzida, protocolos de higiene do sono. Serve como oposto complementar da Ativação Matinal."],
  [570, "Descanso Profundo", "Sono profundo em ambiente escuro, silencioso e com temperatura ideal."],
  [40, "Ativação Matinal", "Respiração consciente, mobilidade e ativação neural. Este bloco atua como rito de transição do estado de repouso para o modo ativo."],
];

function setNow() {
  const now = new Date();
  const pad = n => String(n).padStart(2, "0");
  const defaultTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  startTimeInput.value = defaultTime;
  renderSchedule(defaultTime);
  saveTime(defaultTime);
}

function formatTime(hour, minute) {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function getSchedule(startTime) {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const result = [];
  let hour = startHour;
  let minute = startMinute;

  for (const [duration, label, description] of schedule) {
    result.push([hour, minute, label, description]);
    hour += Math.floor(duration / 60);
    minute += duration % 60;

    if (minute >= 60) {
      hour += Math.floor(minute / 60);
      minute %= 60;
    }

    while (hour >= 24) hour -= 24;
  }

  return result;
}

function renderSchedule(startTime) {
  if (!startTime) {
    scheduleList.innerHTML = "<li class='text-red-400 text-sm'>Por favor, defina um horário inicial válido.</li>";
    return;
  }

  const scheduleData = getSchedule(startTime);
  scheduleList.innerHTML = "";

  scheduleData.forEach(([hour, minute, label, description]) => {
    const li = document.createElement("li");
    li.className = "bg-gray-800 px-4 py-3 rounded-lg shadow-sm flex items-start gap-3 schedule-item";
    li.innerHTML = `
        <span class="time-label font-bold text-blue-400">${formatTime(hour, minute)}</span>
      <div>
        <div class="leading-snug font-bold">${label}</div>
        <div class="leading-snug text-sm">${description}</div>
      </div>
    `;
    scheduleList.appendChild(li);
  });

  const lastChild = scheduleList.lastElementChild;
  if (lastChild) {
    scheduleList.removeChild(lastChild);
    scheduleList.prepend(lastChild);
  }

  scheduleList.scrollIntoView({ behavior: "smooth" });
}

function saveTime(time) {
  localStorage.setItem("scheduleStart", time);
}

function loadTime() {
  const saved = localStorage.getItem("scheduleStart");
  if (saved) {
    startTimeInput.value = saved;
    renderSchedule(saved);
  }
}

copyScheduleBtn.addEventListener("click", () => {
  const items = [...scheduleList.querySelectorAll("li")];
  if (!items.length) return;

  const text = items
    .map(item => {
      const [timeEl, labelEl] = item.children;
      const [titleEl, descriptionEl] = labelEl.children;
      return `${timeEl.textContent} – ${titleEl.textContent}: ${descriptionEl.textContent}`;
    })
    .join("\n");

  navigator.clipboard.writeText(text).then(() => {
    copyScheduleBtn.textContent = "Copied!";
    setTimeout(() => (copyScheduleBtn.textContent = "Copy Schedule"), 2000);
  });
});

startTimeInput.addEventListener("change", () => {
  const val = startTimeInput.value;
  renderSchedule(val);
  saveTime(val);
});

nowBtn.addEventListener("click", setNow);

clearBtn.addEventListener("click", () => {
  localStorage.removeItem("scheduleStart");
  startTimeInput.value = "";
  scheduleList.innerHTML = "";
});

shareBtn.addEventListener("click", () => {
  const val = startTimeInput.value;
  if (!val) return;

  const url = new URL(window.location.href);
  url.searchParams.set("start", val);
  navigator.clipboard.writeText(url.toString()).then(() => {
    shareBtn.textContent = "Copied!";
    setTimeout(() => (shareBtn.textContent = "Copy Link"), 2000);
  });
});

window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const timeFromURL = params.get("start");

  if (timeFromURL) {
    startTimeInput.value = timeFromURL;
    renderSchedule(timeFromURL);
    saveTime(timeFromURL);
  } else {
    loadTime();
  }
});
