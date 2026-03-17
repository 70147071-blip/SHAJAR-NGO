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