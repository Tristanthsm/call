const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');

function setActiveTab(targetId) {
  tabs.forEach((tab) => {
    const isActive = tab.dataset.target === targetId;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-pressed', isActive);
  });

  panels.forEach((panel) => {
    panel.classList.toggle('visible', panel.id === targetId);
  });
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => setActiveTab(tab.dataset.target));
});

// Fallback for hash navigation
if (window.location.hash) {
  const target = window.location.hash.replace('#', '');
  const exists = Array.from(panels).some((panel) => panel.id === target);
  if (exists) setActiveTab(target);
}
