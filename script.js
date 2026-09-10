const dialog = document.querySelector('#contacto');
const interestSelect = document.querySelector('#interest-select');
const form = document.querySelector('#contact-form');
const successMessage = document.querySelector('.form-success');

document.querySelectorAll('[data-open-dialog]').forEach((button) => {
  button.addEventListener('click', () => {
    const interest = button.dataset.interest;
    if (interest) interestSelect.value = interest;
    if (button.dataset.openDialog === 'diagnostico') interestSelect.value = 'Encontrar oportunidades de IA';
    dialog.showModal();
    setTimeout(() => dialog.querySelector('input')?.focus(), 100);
  });
});

document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  const name = new FormData(form).get('nombre').trim();
  successMessage.textContent = `Gracias, ${name}. Tu solicitud quedó lista. Te contactaremos muy pronto.`;
  form.querySelector('.form-submit').textContent = 'Solicitud enviada ✓';
  form.querySelector('.form-submit').disabled = true;
});

const hours = document.querySelector('#hours');
const rate = document.querySelector('#rate');
const hoursOutput = document.querySelector('#hours-output');
const rateOutput = document.querySelector('#rate-output');
const annualOutput = document.querySelector('#annual-output');
const money = new Intl.NumberFormat('es-CO');

function updateCalculator() {
  const weeklyHours = Number(hours.value);
  const hourlyRate = Number(rate.value);
  const annual = weeklyHours * hourlyRate * 52;
  hoursOutput.textContent = `${weeklyHours} h`;
  rateOutput.textContent = `$${money.format(hourlyRate)}`;
  annualOutput.innerHTML = `$${money.format(annual)} <small>COP</small>`;
}
[hours, rate].forEach((input) => input.addEventListener('input', updateCalculator));
updateCalculator();

const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
menuToggle.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  menuToggle.classList.toggle('active', isOpen);
  menuToggle.setAttribute('aria-expanded', isOpen);
  mobileMenu.setAttribute('aria-hidden', !isOpen);
});
mobileMenu.querySelectorAll('a, button').forEach((item) => item.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
  menuToggle.classList.remove('active');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

document.querySelector('#year').textContent = new Date().getFullYear();
