const ngo = "Shajar Hope Alliance";
const volunteers = 100;
const acceptingDonations = true;
const programs = ["Scholarships", "Qarz-e-Hasna", "Community Support"];
const founder = {
  name: "Nadir latifbutt",
  city: "Lahore"
};

const showInfo = () => {
  $("ngoName").innerHTML = `NGO Name: ${ngo}`;
  $("volunteers").innerHTML = `Volunteers: ${volunteers}`;
  $("donations").innerHTML = `Accepting Donations: ${acceptingDonations ? 'Yes' : 'No'}`;
  $("programs").innerHTML = `Programs: ${programs.join(", ")}`;
  $("founder").innerHTML = `Founder: ${founder.name} (${founder.city})`;
  $("infoModal").classList.remove("hidden");
};

const closeInfo = () => {
  $("infoModal").classList.add("hidden");
};

const renderStudents = (data) => {
  const grid = $("studentsGrid");
  if (!grid) return;
  grid.innerHTML = "";

  if (data.length === 0) {
    grid.innerHTML = `<p class="col-span-full text-center text-slate-500 dark:text-slate-400 py-8">No students found matching your criteria.</p>`;
    return;
  }

  const cardsHtml = data.map(student => {
    let statusColor = student.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' :
                      student.status === 'Rejected' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300' :
                      'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';

    return `
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition relative">
        <span class="absolute top-6 right-6 px-3 py-1 rounded-full text-xs font-bold ${statusColor}">${student.status}</span>
        <h5 class="text-xl font-bold text-slate-900 dark:text-white mb-1">${student.name}</h5>
        <p class="text-sm text-indigo-600 dark:text-indigo-400 font-semibold mb-4">${student.major} @ ${student.university}</p>

        <div class="space-y-2 mb-6">
          <div class="flex justify-between text-sm">
            <span class="text-slate-500 dark:text-slate-400">GPA</span>
            <span class="font-bold text-slate-800 dark:text-slate-200">${student.gpa}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-slate-500 dark:text-slate-400">Need Amount</span>
            <span class="font-bold text-slate-800 dark:text-slate-200">$${student.need.toLocaleString()}</span>
          </div>
        </div>

        <div class="flex space-x-3 pt-4 border-t border-slate-100 dark:border-slate-700">
          <button onclick="editStudent(${student.id})" class="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 py-2 rounded-xl text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition">Edit</button>
          <button onclick="deleteStudent(${student.id})" class="flex-1 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 py-2 rounded-xl text-sm font-bold hover:bg-rose-100 dark:hover:bg-rose-900/50 transition">Delete</button>
        </div>
      </div>
    `;
  }).join('');

  grid.innerHTML = cardsHtml;
};

const applyFilters = () => {
  const nameSearch = $("filterName").value.toLowerCase();
  const majorFilter = $("filterMajor").value;
  const uniFilter = $("filterUniversity").value;
  const minGpa = parseFloat($("filterMinGpa").value) || 0;
  const maxNeed = parseFloat($("filterMaxNeed").value) || Infinity;
  const statusFilter = $("filterStatus").value;
  const sortBy = $("sortBy") ? $("sortBy").value : "name";
  const sortOrder = $("sortOrder") ? $("sortOrder").dataset.order || "asc" : "asc";

  let filtered = StudentsDB.getStudents().filter(student => {
    const matchName = student.name.toLowerCase().includes(nameSearch);
    const matchMajor = majorFilter ? student.major === majorFilter : true;
    const matchUni = uniFilter ? student.university === uniFilter : true;
    const matchGpa = student.gpa >= minGpa;
    const matchNeed = student.need <= maxNeed;
    const matchStatus = statusFilter ? student.status === statusFilter : true;

    return matchName && matchMajor && matchUni && matchGpa && matchNeed && matchStatus;
  });

  filtered = sortStudents(filtered, sortBy, sortOrder);
  renderStudents(filtered);
};

const sortStudents = (arr, sortBy, order) => {
  const sorted = [...arr].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "gpa") return a.gpa - b.gpa;
    if (sortBy === "need") return a.need - b.need;
    if (sortBy === "createdAt") return new Date(a.createdAt) - new Date(b.createdAt);
    return 0;
  });
  return order === "desc" ? sorted.reverse() : sorted;
};

const toggleSortOrder = () => {
  const btn = $("sortOrder");
  if (!btn) return;
  const current = btn.dataset.order || "asc";
  const next = current === "asc" ? "desc" : "asc";
  btn.dataset.order = next;
  btn.innerHTML = next === "asc"
    ? `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"/></svg>`
    : `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"/></svg>`;
  applyFilters();
};

const showTopRated = () => {
  const topRated = StudentsDB.getStudents()
    .filter(s => s.gpa >= 3.5)
    .sort((a, b) => b.gpa - a.gpa);
  renderStudents(topRated);
};

const showRecentlyAdded = () => {
  const recent = [...StudentsDB.getStudents()]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  renderStudents(recent);
};

const openStudentModal = () => {
  $("studentModalTitle").innerText = "Add New Student";
  $("studentForm").reset();
  $("studentId").value = "";
  $("studentModal").classList.remove("hidden");
  $("studentModal").classList.add("flex");
};

const closeStudentModal = () => {
  $("studentModal").classList.add("hidden");
  $("studentModal").classList.remove("flex");
};

const editStudent = (id) => {
  const student = StudentsDB.findById(id);
  if (!student) return;

  $("studentModalTitle").innerText = "Edit Student";
  $("studentId").value = student.id;
  $("studentName").value = student.name;
  $("studentMajor").value = student.major;
  $("studentUniversity").value = student.university;
  $("studentGpa").value = student.gpa;
  $("studentNeed").value = student.need;
  $("studentStatus").value = student.status;

  $("studentModal").classList.remove("hidden");
  $("studentModal").classList.add("flex");
};

const saveStudent = (event) => {
  event.preventDefault();

  const idValue = $("studentId").value;
  const studentData = {
    name: $("studentName").value,
    major: $("studentMajor").value,
    university: $("studentUniversity").value,
    gpa: parseFloat($("studentGpa").value),
    need: parseInt($("studentNeed").value),
    status: $("studentStatus").value
  };

  if (idValue) {
    StudentsDB.updateStudent(parseInt(idValue), studentData);
  } else {
    StudentsDB.addStudent(studentData);
  }

  closeStudentModal();
  applyFilters();
};

const deleteStudent = (id) => {
  if (confirm("Are you sure you want to delete this application?")) {
    StudentsDB.deleteStudent(id);
    applyFilters();
  }
};

const runIfElseLogic = () => {
  const out = $("ifElseOutput");
  if (!out) return;
  out.innerHTML = "";

  const students = StudentsDB.getStudents();
  let totalApps = students.length;
  let approvedApps = students.filter(s => s.status === "Approved").length;
  let rate = (approvedApps / totalApps) * 100 || 0;

  if (rate > 50) {
    out.innerHTML += `<p class="border-b border-slate-200 dark:border-slate-700 pb-2 mb-2"><strong class="text-slate-800 dark:text-slate-200">Check 1 (High Approval):</strong> The approval rate is ${rate.toFixed(1)}%. We are accepting a majority of students.</p>`;
  } else {
    out.innerHTML += `<p class="border-b border-slate-200 dark:border-slate-700 pb-2 mb-2"><strong class="text-slate-800 dark:text-slate-200">Check 1 (Strict Approval):</strong> The approval rate is ${rate.toFixed(1)}%. The process is competitive.</p>`;
  }

  let topStudent = students.reduce((prev, current) => (prev.gpa > current.gpa) ? prev : current, students[0]);
  if (topStudent && topStudent.gpa >= 3.8) {
    out.innerHTML += `<p class="border-b border-slate-200 dark:border-slate-700 pb-2 mb-2"><strong class="text-slate-800 dark:text-slate-200">Check 2 (Excellence):</strong> Top student ${topStudent.name} is exceptionally qualified with a ${topStudent.gpa} GPA.</p>`;
  } else if (topStudent) {
    out.innerHTML += `<p class="border-b border-slate-200 dark:border-slate-700 pb-2 mb-2"><strong class="text-slate-800 dark:text-slate-200">Check 2 (Standard):</strong> Top student ${topStudent.name} has a ${topStudent.gpa} GPA.</p>`;
  }

  let totalNeed = students.reduce((sum, s) => sum + s.need, 0);
  if (totalNeed > 50000) {
    out.innerHTML += `<p class="border-b border-slate-200 dark:border-slate-700 pb-2 mb-2"><strong class="text-slate-800 dark:text-slate-200">Check 3 (High Demand):</strong> Total student need ($${totalNeed.toLocaleString()}) exceeds the $50k threshold.</p>`;
  } else {
    out.innerHTML += `<p class="border-b border-slate-200 dark:border-slate-700 pb-2 mb-2"><strong class="text-slate-800 dark:text-slate-200">Check 3 (Low Demand):</strong> Total student need ($${totalNeed.toLocaleString()}) is manageable within current budget.</p>`;
  }

  if (acceptingDonations) {
    out.innerHTML += `<p class="border-b border-slate-200 dark:border-slate-700 pb-2 mb-2"><strong class="text-emerald-600 dark:text-emerald-400">Check 4 (Fundraising):</strong> We are actively accepting donations to cover student needs.</p>`;
  } else {
    out.innerHTML += `<p class="border-b border-slate-200 dark:border-slate-700 pb-2 mb-2"><strong class="text-rose-600 dark:text-rose-400">Check 4 (Fundraising):</strong> We are fully funded and currently not accepting new donations.</p>`;
  }

  let stemCount = students.filter(s => s.major === "Computer Engineering" || s.major === "Physics" || s.major === "Medicine").length;
  if (stemCount >= students.length / 2) {
    out.innerHTML += `<p><strong class="text-slate-800 dark:text-slate-200">Check 5 (Trend):</strong> The majority of our applicants are focusing on STEM/Medical fields.</p>`;
  } else {
    out.innerHTML += `<p><strong class="text-slate-800 dark:text-slate-200">Check 5 (Trend):</strong> We have a diverse set of majors among applicants.</p>`;
  }
};

const switchView = (type) => {
  const container = $("forLoopContainer");
  if (!container) return;
  container.innerHTML = "";

  const recentDonors = StudentsDB.getDonors();

  document.querySelectorAll("[id^='btnView']").forEach(btn => {
    btn.classList.remove("bg-white", "dark:bg-slate-700", "text-slate-800", "dark:text-white", "shadow-sm");
    btn.classList.add("text-slate-500");
  });

  const activeBtn = type === 'cards' ? 'btnViewCards' : (type === 'list' ? 'btnViewList' : 'btnViewTable');
  $(activeBtn).classList.remove("text-slate-500");
  $(activeBtn).classList.add("bg-white", "dark:bg-slate-700", "text-slate-800", "dark:text-white", "shadow-sm");

  let html = "";

  if (type === 'cards') {
    html += `<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">`;
    for (let i = 0; i < recentDonors.length; i++) {
      html += `<div class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h5 class="font-bold text-slate-800 dark:text-white">${recentDonors[i].name}</h5>
            <p class="text-sm text-indigo-600 dark:text-indigo-400 font-semibold mb-2">$${recentDonors[i].amount.toLocaleString()}</p>
            <span class="inline-block px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-md">${recentDonors[i].project}</span>
        </div>`;
    }
    html += `</div>`;
  } else if (type === 'list') {
    html += `<ul class="space-y-3 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">`;
    for (let i = 0; i < recentDonors.length; i++) {
      html += `<li class="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2 last:border-0 last:pb-0">
            <div>
              <span class="font-bold text-slate-800 dark:text-white">${recentDonors[i].name}</span>
              <span class="text-xs text-slate-500 dark:text-slate-400 ml-2 block sm:inline">${recentDonors[i].project}</span>
            </div>
            <span class="font-semibold text-indigo-600 dark:text-indigo-400">$${recentDonors[i].amount.toLocaleString()}</span>
        </li>`;
    }
    html += `</ul>`;
  } else if (type === 'table') {
    html += `<div class="overflow-x-auto bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"><table class="w-full text-left text-sm whitespace-nowrap">
      <thead class="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 uppercase text-xs"><tr><th class="px-4 py-3">Donor</th><th class="px-4 py-3">Amount</th><th class="px-4 py-3">Project</th></tr></thead>
      <tbody class="divide-y divide-slate-100 dark:divide-slate-700">`;
    for (let i = 0; i < recentDonors.length; i++) {
      html += `<tr>
            <td class="px-4 py-3 font-medium text-slate-900 dark:text-white">${recentDonors[i].name}</td>
            <td class="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-semibold">$${recentDonors[i].amount.toLocaleString()}</td>
            <td class="px-4 py-3 text-slate-600 dark:text-slate-300">${recentDonors[i].project}</td>
        </tr>`;
    }
    html += `</tbody></table></div>`;
  }

  container.innerHTML = html;
};

const runWhileLoopSimulation = () => {
  const out = $("whileLoopOutput");
  if (!out) return;
  out.innerHTML = "";

  let targetFunding = 50000;
  let currentFunding = 0;
  let step = 1;
  let logs = [];

  while (currentFunding < targetFunding) {
    let donation = Math.floor(Math.random() * (10000 - 2000 + 1) + 2000);
    currentFunding += donation;

    if (currentFunding > targetFunding) {
      currentFunding = targetFunding;
    }

    logs.push(`<div class="flex items-center"><span class="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs mr-3 shrink-0">${step}</span> <span>Received <strong>$${donation.toLocaleString()}</strong>. Total: <span class="text-indigo-600 dark:text-indigo-400 font-bold">$${currentFunding.toLocaleString()}</span></span></div>`);
    step++;
  }

  logs.push(`<div class="mt-4 p-3 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 rounded-xl font-bold flex items-center"><span class="mr-2">✅</span> Goal of $${targetFunding.toLocaleString()} reached!</div>`);

  out.innerHTML = "<strong class='text-slate-800 dark:text-slate-200'>Simulating Fundraising Drive:</strong><br><br>" + logs.join("<div class='h-2'></div>");
};

const runCombinedClassification = () => {
  const out = $("combinedOutput");
  if (!out) return;
  out.innerHTML = "";

  const students = StudentsDB.getStudents();
  let highPriority = [];
  let standardPriority = [];
  let underReview = [];

  for (let i = 0; i < students.length; i++) {
    let s = students[i];

    if (s.status === "Approved") {
      if (s.need >= 15000 || s.gpa >= 3.8) {
        highPriority.push(s);
      } else {
        standardPriority.push(s);
      }
    } else {
      underReview.push(s);
    }
  }

  let htmlResponse = `
    <div class="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-xl border border-rose-100 dark:border-rose-800 shadow-sm flex flex-col h-full">
      <h5 class="font-bold text-rose-800 dark:text-rose-300 mb-3 border-b border-rose-200 dark:border-rose-800 pb-2">High Priority<br><span class="text-xs font-normal">(Approved & High Need/GPA)</span></h5>
      <ul class="text-sm space-y-2 text-rose-700 dark:text-rose-300 list-none">
        ${highPriority.map(s => `<li>• <strong>${s.name}</strong><br><span class="text-xs opacity-80">(GPA: ${s.gpa}, Need: $${s.need})</span></li>`).join('') || "<li>None</li>"}
      </ul>
    </div>

    <div class="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800 shadow-sm flex flex-col h-full">
      <h5 class="font-bold text-emerald-800 dark:text-emerald-300 mb-3 border-b border-emerald-200 dark:border-emerald-800 pb-2">Standard Priority<br><span class="text-xs font-normal">(Approved)</span></h5>
      <ul class="text-sm space-y-2 text-emerald-700 dark:text-emerald-300 list-none">
        ${standardPriority.map(s => `<li>• <strong>${s.name}</strong></li>`).join('') || "<li>None</li>"}
      </ul>
    </div>

    <div class="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800 shadow-sm flex flex-col h-full sm:col-span-2">
      <h5 class="font-bold text-amber-800 dark:text-amber-300 mb-3 border-b border-amber-200 dark:border-amber-800 pb-2">Under Review / Pending</h5>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <ul class="text-sm space-y-2 text-amber-700 dark:text-amber-300 list-none">
          ${underReview.map(s => `<li>• <strong>${s.name}</strong> <span class="bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded text-xs ml-1">${s.status}</span></li>`).join('') || "<li>None</li>"}
        </ul>
      </div>
    </div>
  `;

  out.innerHTML = htmlResponse;
};

const initHomePage = () => {
  if ($("studentsGrid")) {
    renderStudents(StudentsDB.getStudents());
  }
  if ($("forLoopContainer")) {
    switchView('cards');
  }
  if ($("ifElseOutput")) {
    runIfElseLogic();
  }
};
