const ngo = "Shajar Hope Alliance";
const volunteers = 100;
const acceptingDonations = true;
const programs = ["Scholarships", "Qarz-e-Hasna", "Community Support"];
const founder = {
  name: "Nadir latifbutt",
  city: "Lahore"
};

const showInfo = () => {
  document.getElementById("ngoName").innerHTML = `NGO Name: ${ngo}`;
  document.getElementById("volunteers").innerHTML = `Volunteers: ${volunteers}`;
  document.getElementById("donations").innerHTML = `Accepting Donations: ${acceptingDonations ? 'Yes' : 'No'}`;
  document.getElementById("programs").innerHTML = `Programs: ${programs.join(", ")}`;
  document.getElementById("founder").innerHTML = `Founder: ${founder.name} (${founder.city})`;
  document.getElementById("infoModal").classList.remove("hidden");
};

const closeInfo = () => {
  document.getElementById("infoModal").classList.add("hidden");
};

let students = [
  { id: 1, name: "Amira K.", major: "Computer Engineering", university: "Stanford", gpa: 3.8, need: 15000, status: "Approved" },
  { id: 2, name: "Omar H.", major: "Medicine", university: "Harvard", gpa: 3.9, need: 25000, status: "Pending" },
  { id: 3, name: "Sarah L.", major: "Literature", university: "Cambridge", gpa: 3.5, need: 8000, status: "Approved" },
  { id: 4, name: "David M.", major: "Physics", university: "MIT", gpa: 3.7, need: 12000, status: "Rejected" },
  { id: 5, name: "Zainab T.", major: "Business", university: "Stanford", gpa: 3.2, need: 10000, status: "Pending" }
];

const renderStudents = (data) => {
  const grid = document.getElementById("studentsGrid");
  if(!grid) return;
  grid.innerHTML = "";
  
  if(data.length === 0) {
    grid.innerHTML = `<p class="col-span-full text-center text-slate-500 py-8">No students found matching your criteria.</p>`;
    return;
  }

  const cardsHtml = data.map(student => {
    let statusColor = student.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                      student.status === 'Rejected' ? 'bg-rose-100 text-rose-700' :
                      'bg-amber-100 text-amber-700';
    
    return `
      <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition relative">
        <span class="absolute top-6 right-6 px-3 py-1 rounded-full text-xs font-bold ${statusColor}">${student.status}</span>
        <h5 class="text-xl font-bold text-slate-900 mb-1">${student.name}</h5>
        <p class="text-sm text-indigo-600 font-semibold mb-4">${student.major} @ ${student.university}</p>
        
        <div class="space-y-2 mb-6">
          <div class="flex justify-between text-sm">
            <span class="text-slate-500">GPA</span>
            <span class="font-bold text-slate-800">${student.gpa}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-slate-500">Need Amount</span>
            <span class="font-bold text-slate-800">$${student.need.toLocaleString()}</span>
          </div>
        </div>
        
        <div class="flex space-x-3 pt-4 border-t border-slate-100">
          <button onclick="editStudent(${student.id})" class="flex-1 bg-slate-100 text-slate-700 py-2 rounded-xl text-sm font-bold hover:bg-slate-200 transition">Edit</button>
          <button onclick="deleteStudent(${student.id})" class="flex-1 bg-rose-50 text-rose-600 py-2 rounded-xl text-sm font-bold hover:bg-rose-100 transition">Delete</button>
        </div>
      </div>
    `;
  }).join('');
  
  grid.innerHTML = cardsHtml;
};

const applyFilters = () => {
  const nameSearch = document.getElementById("filterName").value.toLowerCase();
  const majorFilter = document.getElementById("filterMajor").value;
  const uniFilter = document.getElementById("filterUniversity").value;
  const minGpa = parseFloat(document.getElementById("filterMinGpa").value) || 0;
  const maxNeed = parseFloat(document.getElementById("filterMaxNeed").value) || Infinity;
  const statusFilter = document.getElementById("filterStatus").value;

  const filtered = students.filter(student => {
    const matchName = student.name.toLowerCase().includes(nameSearch);
    const matchMajor = majorFilter ? student.major === majorFilter : true;
    const matchUni = uniFilter ? student.university === uniFilter : true;
    const matchGpa = student.gpa >= minGpa;
    const matchNeed = student.need <= maxNeed;
    const matchStatus = statusFilter ? student.status === statusFilter : true;
    
    return matchName && matchMajor && matchUni && matchGpa && matchNeed && matchStatus;
  });

  renderStudents(filtered);
};

const openStudentModal = () => {
  document.getElementById("studentModalTitle").innerText = "Add New Student";
  document.getElementById("studentForm").reset();
  document.getElementById("studentId").value = "";
  document.getElementById("studentModal").classList.remove("hidden");
  document.getElementById("studentModal").classList.add("flex");
};

const closeStudentModal = () => {
  document.getElementById("studentModal").classList.add("hidden");
  document.getElementById("studentModal").classList.remove("flex");
};

const editStudent = (id) => {
  const student = students.find(s => s.id === id);
  if(!student) return;
  
  document.getElementById("studentModalTitle").innerText = "Edit Student";
  document.getElementById("studentId").value = student.id;
  document.getElementById("studentName").value = student.name;
  document.getElementById("studentMajor").value = student.major;
  document.getElementById("studentUniversity").value = student.university;
  document.getElementById("studentGpa").value = student.gpa;
  document.getElementById("studentNeed").value = student.need;
  document.getElementById("studentStatus").value = student.status;
  
  document.getElementById("studentModal").classList.remove("hidden");
  document.getElementById("studentModal").classList.add("flex");
};

const saveStudent = (event) => {
  event.preventDefault();
  
  const idValue = document.getElementById("studentId").value;
  const newStudent = {
    id: idValue ? parseInt(idValue) : Date.now(),
    name: document.getElementById("studentName").value,
    major: document.getElementById("studentMajor").value,
    university: document.getElementById("studentUniversity").value,
    gpa: parseFloat(document.getElementById("studentGpa").value),
    need: parseInt(document.getElementById("studentNeed").value),
    status: document.getElementById("studentStatus").value
  };

  if (idValue) {
    const index = students.findIndex(s => s.id === parseInt(idValue));
    if(index !== -1) students[index] = newStudent;
  } else {
    students.push(newStudent);
  }
  
  closeStudentModal();
  applyFilters();
};

const deleteStudent = (id) => {
  if(confirm("Are you sure you want to delete this application?")) {
    students = students.filter(student => student.id !== id);
    applyFilters();
  }
};

const runIfElseLogic = () => {
  const out = document.getElementById("ifElseOutput");
  if(!out) return;
  out.innerHTML = "";
  
  let totalApps = students.length;
  let approvedApps = students.filter(s => s.status === "Approved").length;
  let rate = (approvedApps / totalApps) * 100 || 0;
  
  if (rate > 50) {
    out.innerHTML += `<p class="border-b border-slate-200 pb-2 mb-2"><strong class="text-slate-800">Check 1 (High Approval):</strong> The approval rate is ${rate.toFixed(1)}%. We are accepting a majority of students.</p>`;
  } else {
    out.innerHTML += `<p class="border-b border-slate-200 pb-2 mb-2"><strong class="text-slate-800">Check 1 (Strict Approval):</strong> The approval rate is ${rate.toFixed(1)}%. The process is competitive.</p>`;
  }

  let topStudent = students.reduce((prev, current) => (prev.gpa > current.gpa) ? prev : current, students[0]);
  if (topStudent && topStudent.gpa >= 3.8) {
    out.innerHTML += `<p class="border-b border-slate-200 pb-2 mb-2"><strong class="text-slate-800">Check 2 (Excellence):</strong> Top student ${topStudent.name} is exceptionally qualified with a ${topStudent.gpa} GPA.</p>`;
  } else if(topStudent) {
    out.innerHTML += `<p class="border-b border-slate-200 pb-2 mb-2"><strong class="text-slate-800">Check 2 (Standard):</strong> Top student ${topStudent.name} has a ${topStudent.gpa} GPA.</p>`;
  }

  let totalNeed = students.reduce((sum, s) => sum + s.need, 0);
  if (totalNeed > 50000) {
    out.innerHTML += `<p class="border-b border-slate-200 pb-2 mb-2"><strong class="text-slate-800">Check 3 (High Demand):</strong> Total student need ($${totalNeed.toLocaleString()}) exceeds the $50k threshold.</p>`;
  } else {
    out.innerHTML += `<p class="border-b border-slate-200 pb-2 mb-2"><strong class="text-slate-800">Check 3 (Low Demand):</strong> Total student need ($${totalNeed.toLocaleString()}) is manageable within current budget.</p>`;
  }

  if (acceptingDonations) {
    out.innerHTML += `<p class="border-b border-slate-200 pb-2 mb-2"><strong class="text-emerald-600">Check 4 (Fundraising):</strong> We are actively accepting donations to cover student needs.</p>`;
  } else {
    out.innerHTML += `<p class="border-b border-slate-200 pb-2 mb-2"><strong class="text-rose-600">Check 4 (Fundraising):</strong> We are fully funded and currently not accepting new donations.</p>`;
  }

  let stemCount = students.filter(s => s.major === "Computer Engineering" || s.major === "Physics" || s.major === "Medicine").length;
  if(stemCount >= students.length / 2) {
    out.innerHTML += `<p><strong class="text-slate-800">Check 5 (Trend):</strong> The majority of our applicants are focusing on STEM/Medical fields.</p>`;
  } else {
    out.innerHTML += `<p><strong class="text-slate-800">Check 5 (Trend):</strong> We have a diverse set of majors among applicants.</p>`;
  }
};

const recentDonors = [
  { name: "Ali R.", amount: 5000, project: "General Fund" },
  { name: "Global Tech Inc.", amount: 20000, project: "Engineering Scholarships" },
  { name: "Fatima A.", amount: 1500, project: "Medical Grants" },
  { name: "Dr. Smith", amount: 3000, project: "Women in STEM" }
];

const switchView = (type) => {
  const container = document.getElementById("forLoopContainer");
  if(!container) return;
  container.innerHTML = "";
  
  document.querySelectorAll("[id^='btnView']").forEach(btn => {
    btn.classList.remove("bg-white", "text-slate-800", "shadow-sm");
    btn.classList.add("text-slate-500");
  });
  
  const activeBtn = type === 'cards' ? 'btnViewCards' : (type === 'list' ? 'btnViewList' : 'btnViewTable');
  document.getElementById(activeBtn).classList.remove("text-slate-500");
  document.getElementById(activeBtn).classList.add("bg-white", "text-slate-800", "shadow-sm");

  let html = "";

  if (type === 'cards') {
    html += `<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">`;
    for(let i = 0; i < recentDonors.length; i++) {
        html += `<div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h5 class="font-bold text-slate-800">${recentDonors[i].name}</h5>
            <p class="text-sm text-indigo-600 font-semibold mb-2">$${recentDonors[i].amount.toLocaleString()}</p>
            <span class="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">${recentDonors[i].project}</span>
        </div>`;
    }
    html += `</div>`;
  } else if (type === 'list') {
    html += `<ul class="space-y-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">`;
    for(let i = 0; i < recentDonors.length; i++) {
        html += `<li class="flex justify-between border-b border-slate-100 pb-2 last:border-0 last:pb-0">
            <div>
              <span class="font-bold text-slate-800">${recentDonors[i].name}</span>
              <span class="text-xs text-slate-500 ml-2 block sm:inline">${recentDonors[i].project}</span>
            </div>
            <span class="font-semibold text-indigo-600">$${recentDonors[i].amount.toLocaleString()}</span>
        </li>`;
    }
    html += `</ul>`;
  } else if (type === 'table') {
    html += `<div class="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm"><table class="w-full text-left text-sm whitespace-nowrap">
      <thead class="bg-slate-50 text-slate-600 uppercase text-xs"><tr><th class="px-4 py-3">Donor</th><th class="px-4 py-3">Amount</th><th class="px-4 py-3">Project</th></tr></thead>
      <tbody class="divide-y divide-slate-100">`;
    for(let i = 0; i < recentDonors.length; i++) {
        html += `<tr>
            <td class="px-4 py-3 font-medium text-slate-900">${recentDonors[i].name}</td>
            <td class="px-4 py-3 text-emerald-600 font-semibold">$${recentDonors[i].amount.toLocaleString()}</td>
            <td class="px-4 py-3 text-slate-600">${recentDonors[i].project}</td>
        </tr>`;
    }
    html += `</tbody></table></div>`;
  }

  container.innerHTML = html;
};

const runWhileLoopSimulation = () => {
  const out = document.getElementById("whileLoopOutput");
  if(!out) return;
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
    
    logs.push(`<div class="flex items-center"><span class="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs mr-3 shrink-0">${step}</span> <span>Received <strong>$${donation.toLocaleString()}</strong>. Total: <span class="text-indigo-600 font-bold">$${currentFunding.toLocaleString()}</span></span></div>`);
    step++;
  }
  
  logs.push(`<div class="mt-4 p-3 bg-emerald-100 text-emerald-800 rounded-xl font-bold flex items-center"><span class="mr-2">✅</span> Goal of $${targetFunding.toLocaleString()} reached!</div>`);
  
  out.innerHTML = "<strong class='text-slate-800'>Simulating Fundraising Drive:</strong><br><br>" + logs.join("<div class='h-2'></div>");
};

const runCombinedClassification = () => {
  const out = document.getElementById("combinedOutput");
  if(!out) return;
  out.innerHTML = "";
  
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
    <div class="bg-rose-50 p-4 rounded-xl border border-rose-100 shadow-sm flex flex-col h-full">
      <h5 class="font-bold text-rose-800 mb-3 border-b border-rose-200 pb-2">High Priority<br><span class="text-xs font-normal">(Approved & High Need/GPA)</span></h5>
      <ul class="text-sm space-y-2 text-rose-700 list-none">
        ${highPriority.map(s => `<li>• <strong>${s.name}</strong><br><span class="text-xs opacity-80">(GPA: ${s.gpa}, Need: $${s.need})</span></li>`).join('') || "<li>None</li>"}
      </ul>
    </div>
    
    <div class="bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-sm flex flex-col h-full">
      <h5 class="font-bold text-emerald-800 mb-3 border-b border-emerald-200 pb-2">Standard Priority<br><span class="text-xs font-normal">(Approved)</span></h5>
      <ul class="text-sm space-y-2 text-emerald-700 list-none">
        ${standardPriority.map(s => `<li>• <strong>${s.name}</strong></li>`).join('') || "<li>None</li>"}
      </ul>
    </div>

    <div class="bg-amber-50 p-4 rounded-xl border border-amber-100 shadow-sm flex flex-col h-full sm:col-span-2">
      <h5 class="font-bold text-amber-800 mb-3 border-b border-amber-200 pb-2">Under Review / Pending</h5>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <ul class="text-sm space-y-2 text-amber-700 list-none">
          ${underReview.map(s => `<li>• <strong>${s.name}</strong> <span class="bg-amber-200 text-amber-800 px-2 py-0.5 rounded text-xs ml-1">${s.status}</span></li>`).join('') || "<li>None</li>"}
        </ul>
      </div>
    </div>
  `;
  
  out.innerHTML = htmlResponse;
};

window.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById("studentsGrid")) {
    renderStudents(students);
  }
  if (document.getElementById("forLoopContainer")) {
    switchView('cards');
  }
  if (document.getElementById("ifElseOutput")) {
    runIfElseLogic();
  }
});