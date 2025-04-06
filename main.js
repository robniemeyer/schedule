const startTimeInput = document.getElementById("startTime");
const nowBtn = document.getElementById("nowBtn");
const scheduleList = document.getElementById("scheduleList");
const shareBtn = document.getElementById("shareBtn");
const clearBtn = document.getElementById("clearBtn");
const copyScheduleBtn = document.getElementById("copyScheduleBtn");

const schedule = [
  ["Breakfast + Personal Priorities", 3],
  ["Brunch + Focused Work", 3],
  ["Lunch + Body Training", 4],
  ["Dinner + Focused Work", 3],
  ["Supper + Personal Priorities", 3],
  ["Core Rest", 8],
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

  for (const [label, duration] of schedule) {
    result.push([hour, minute, label]);
    hour += duration;
    while (hour >= 24) hour -= 24;
  }

  return result;
}

function renderSchedule(startTime) {
  if (!startTime) {
    scheduleList.innerHTML = "<li class='text-red-400 text-sm'>Please set a valid start time.</li>";
    return;
  }

  const scheduleData = getSchedule(startTime);
  scheduleList.innerHTML = "";

  scheduleData.forEach(([hour, minute, label]) => {
    const li = document.createElement("li");
    li.className = "bg-gray-800 px-4 py-3 rounded-lg shadow-sm flex items-start gap-3 schedule-item";
    li.innerHTML = `
      <span class="time-label font-bold text-blue-400">${formatTime(hour, minute)}</span>
      <span class="leading-snug">${label}</span>
    `;
    scheduleList.appendChild(li);
  });

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
      return `${timeEl.textContent} – ${labelEl.textContent}`;
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
