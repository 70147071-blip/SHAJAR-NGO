const $ = (id) => document.getElementById(id);

const createEl = (tag, classes = "", content = "") => {
  const el = document.createElement(tag);
  if (classes) el.className = classes;
  if (content) el.innerHTML = content;
  return el;
};
