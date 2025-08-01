  // JADWAL FARMASI
const datesElement = document.getElementById("dates");
const monthYearElement = document.getElementById("month-year");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");

let date = new Date();
let currentMonth = date.getMonth();
let currentYear = date.getFullYear();
// Variabel global untuk menyimpan index minggu carryover
let currentWeekIndex = 4; // Bisa diubah sesuai kebutuhan, 1 untuk M1, 2 untuk M2, ..., 5 untuk M5

const scheduleData = [
  // Header: [Label Minggu, Senin, Selasa, Rabu, Kamis, Jum'at, Sabtu]
  ["Minggu Ke", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"],
  ["M1", "SDV • LNB", "VND • SLB", "NLB • DVS", "LSV • NBD", "BLN • SVD", "SDV • BLN"],
  ["M2", "LNB • DVS", "LBS • DNV", "SNV • BLD", "DBN • SLV", "DSV • BLN", "VBN • SDL"],
  ["M3", "SDL • VBN", "NBV • SLD", "LSB • NDV", "DSN • LBV", "DVN • LBS", "SLD • VBN"],
  ["M4", "VNB • DLS", "LVB • SND", "DLV • BNS", "DSL • NVB", "SLB • VND", "NLB • SVD"],
  ["M5", "VDS • LBN", "LVB • NSD", "NSB • VDL", "VDN • LSB", "LDB • VSN", "LNB • SDV"]
];

function renderCalendar(month, year) {
  datesElement.innerHTML = "";
  monthYearElement.innerText = new Date(year, month).toLocaleString("id-ID", { month: "long", year: "numeric" });

  let firstDay = new Date(year, month, 1).getDay();
  let lastDay  = new Date(year, month + 1, 0).getDate();
  
  // Jika minggu terakhir hanya M5 dan hanya muncul di hari Minggu, reset ke M1
if (currentWeekIndex === 5) {
    let lastMonth = new Date(year, month - 1); // Cek bulan sebelumnya
    let lastDayOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0);
    
    let lastSunday = lastDayOfLastMonth.getDate(); // Tanggal terakhir bulan sebelumnya
    
    if (new Date(lastMonth.getFullYear(), lastMonth.getMonth(), lastSunday).getDay() === 0) {
        currentWeekIndex = 1; // Reset ke M1 di bulan baru
    }
}

  // Cek apakah minggu terakhir bulan sebelumnya hanya berisi M5 pada hari Minggu
  if (currentWeekIndex === 5 && scheduleData[5][1] === "" && scheduleData[5][6] === "") {
    currentWeekIndex = 1; // Reset ke M1 di bulan baru jika M5 hanya di hari Minggu
  }

  let weekIndex = currentWeekIndex;
  let carryover = (weekIndex !== 1);

  for (let i = 0; i < firstDay; i++) {
    datesElement.innerHTML += "<div></div>";
  }

  for (let i = 1; i <= lastDay; i++) {
    let dateInstance = new Date(year, month, i);
    let weekDay = dateInstance.getDay();
    let isToday = (i === new Date().getDate() &&
                   month === new Date().getMonth() &&
                   year === new Date().getFullYear()) ? "today" : "";
    
    let schedule = "";
    let weekLabel = "";

    if (scheduleData[weekIndex]) {
      if (weekDay === 0) {
        weekLabel = `<strong>${scheduleData[weekIndex][0]}</strong>`;
      } else {
        schedule = scheduleData[weekIndex][weekDay] || "";
      }
    }

    /* datesElement.innerHTML += `<div class="${isToday}"><span>${i}</span><br>${weekLabel}<small2>${schedule}</small2></div>`; (ini kode Default)*/
    // Tambahkan kelas minggu ke variabel
    let mingguClass = `m-m${weekIndex}`;

    if (scheduleData[weekIndex]) {
      if (weekDay === 0) {
        weekLabel = `<strong class="${mingguClass}">${scheduleData[weekIndex][0]}</strong>`;
      } else {
        schedule = scheduleData[weekIndex][weekDay] || "";
      }
    }

    // Tambahkan kelas minggu ke div tanggal
    datesElement.innerHTML += `<div class="${isToday}">
    <span>${i}</span><br>
    ${weekLabel}
    <small class="${mingguClass}">${schedule}</small></div>`;

    if (weekDay === 6) {
      if (carryover) {
        weekIndex = 1;
        carryover = false;
      } else {
        if (weekIndex < 5) {
          weekIndex++;
        } else {
          weekIndex = 5;
        }
      }
    }
  }

  currentWeekIndex = weekIndex;
}

prevButton.addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
});

nextButton.addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
});

renderCalendar(currentMonth, currentYear);