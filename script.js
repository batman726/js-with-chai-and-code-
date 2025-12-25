/* PROFILE */
function saveProfile() {
  let name = document.getElementById("studentName").value;
  let roll = document.getElementById("rollNumber").value;

  if (!name || !roll) {
    alert("Enter name and roll number");
    return;
  }

  localStorage.setItem("studentProfile", JSON.stringify({ name, roll }));
  loadProfile();
}

function loadProfile() {
  let profile = JSON.parse(localStorage.getItem("studentProfile"));
  if (!profile) return;

  document.getElementById("profileBox").innerHTML =
    `<p><b>Name:</b> ${profile.name}</p>
     <p><b>Roll No:</b> ${profile.roll}</p>`;

  document.getElementById("loginBox").style.display = "none";
}

loadProfile();

/* MAIN */
function calculateAttendance() {
  let month = document.getElementById("month").value;
  let subject = document.getElementById("subject").value;
  let total = parseInt(document.getElementById("total").value);
  let attended = parseInt(document.getElementById("attended").value);

  if (!month || !subject || isNaN(total) || isNaN(attended)) {
    alert("Fill all fields");
    return;
  }

  if (attended > total) {
    alert("Attended cannot be more than total");
    return;
  }

  let percentage = ((attended / total) * 100).toFixed(2);

  let neededText = "";
  if (percentage < 75) {
    let needed = Math.ceil((0.75 * total - attended) / 0.25);
    neededText = `<p class="bad">Attend ${needed} more classes to reach 75%</p>`;
  }

  document.getElementById("result").innerHTML = `
    <p><b>Month:</b> ${month}</p>
    <p><b>Subject:</b> ${subject}</p>
    <p class="${percentage >= 75 ? "good" : "bad"}">
      ${percentage >= 75 ? "Eligible" : "Below 75%"} (${percentage}%)
    </p>
    ${neededText}
  `;

  let bar = document.getElementById("progressBar");
  bar.style.width = percentage + "%";
  bar.style.background = percentage >= 75 ? "#22c55e" : "#ef4444";

  saveToHistory(month, subject, percentage);
  calculateMonthlyAverage(month);
}

/* STORAGE */
function saveToHistory(month, subject, percentage) {
  let data = JSON.parse(localStorage.getItem("attendanceHistory")) || [];
  data.push({ month, subject, percentage: parseFloat(percentage) });
  localStorage.setItem("attendanceHistory", JSON.stringify(data));
  displayHistory();
}

function displayHistory() {
  let data = JSON.parse(localStorage.getItem("attendanceHistory")) || [];
  let history = document.getElementById("history");
  history.innerHTML = "";

  data.forEach(item => {
    let li = document.createElement("li");
    li.innerHTML = `
      <span>${item.month} - ${item.subject}</span>
      <span class="${item.percentage >= 75 ? "good" : "bad"}">
        ${item.percentage}%
      </span>`;
    history.appendChild(li);
  });
}

/* MONTHLY AVERAGE */
function calculateMonthlyAverage(month) {
  let data = JSON.parse(localStorage.getItem("attendanceHistory")) || [];
  let monthData = data.filter(i => i.month === month);

  if (monthData.length === 0) {
    document.getElementById("monthlySummary").innerText = "";
    return;
  }

  let avg = (monthData.reduce((a,b)=>a+b.percentage,0)/monthData.length).toFixed(2);
  document.getElementById("monthlySummary").innerText =
    `Average Attendance for ${month}: ${avg}%`;
}

/* CLEAR */
function clearMonth() {
  let month = document.getElementById("month").value;
  let data = JSON.parse(localStorage.getItem("attendanceHistory")) || [];
  data = data.filter(i => i.month !== month);
  localStorage.setItem("attendanceHistory", JSON.stringify(data));
  displayHistory();
  document.getElementById("monthlySummary").innerText = "";
}

function clearAll() {
  if (confirm("Clear all data?")) {
    localStorage.removeItem("attendanceHistory");
    displayHistory();
    document.getElementById("monthlySummary").innerText = "";
  }
}

displayHistory();
