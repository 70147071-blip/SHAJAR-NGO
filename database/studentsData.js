const StudentsDB = (() => {
  let students = [
    { id: 1, name: "Amira K.", major: "Computer Engineering", university: "Stanford", gpa: 3.8, need: 15000, status: "Approved", createdAt: new Date("2026-01-15") },
    { id: 2, name: "Omar H.", major: "Medicine", university: "Harvard", gpa: 3.9, need: 25000, status: "Pending", createdAt: new Date("2026-01-20") },
    { id: 3, name: "Sarah L.", major: "Literature", university: "Cambridge", gpa: 3.5, need: 8000, status: "Approved", createdAt: new Date("2026-02-05") },
    { id: 4, name: "David M.", major: "Physics", university: "MIT", gpa: 3.7, need: 12000, status: "Rejected", createdAt: new Date("2026-02-18") },
    { id: 5, name: "Zainab T.", major: "Business", university: "Stanford", gpa: 3.2, need: 10000, status: "Pending", createdAt: new Date("2026-03-01") }
  ];

  const recentDonors = [
    { name: "Ali R.", amount: 5000, project: "General Fund" },
    { name: "Global Tech Inc.", amount: 20000, project: "Engineering Scholarships" },
    { name: "Fatima A.", amount: 1500, project: "Medical Grants" },
    { name: "Dr. Smith", amount: 3000, project: "Women in STEM" }
  ];

  const getStudents = () => students;
  const setStudents = (newStudents) => { students = newStudents; };
  const getDonors = () => recentDonors;

  const addStudent = (student) => {
    student.id = Date.now();
    student.createdAt = new Date();
    students.push(student);
  };

  const updateStudent = (id, updatedData) => {
    const index = students.findIndex(s => s.id === id);
    if (index !== -1) {
      students[index] = { ...students[index], ...updatedData, id };
    }
  };

  const deleteStudent = (id) => {
    students = students.filter(student => student.id !== id);
  };

  const findById = (id) => students.find(s => s.id === id);

  return { getStudents, setStudents, getDonors, addStudent, updateStudent, deleteStudent, findById };
})();
