const elevatorStorageKey = 'teknoElevatorList';
const elevatorForm = document.getElementById('add-elevator-form');
const elevatorList = document.getElementById('elevator-list');
const noElevatorsMessage = document.getElementById('no-elevators');

function getSavedElevators() {
  const saved = localStorage.getItem(elevatorStorageKey);
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
}

// Contact form handling (server first, then EmailJS, then mailto fallback)
(function() {
  const contactForm = document.getElementById('contact-form');
  const EMAILJS_USER_ID = 'YOUR_EMAILJS_USER_ID'; // e.g. user_xxx
  const EMAILJS_SERVICE_ID = 'YOUR_EMAILJS_SERVICE_ID'; // e.g. service_xxx
  const EMAILJS_TEMPLATE_ID = 'YOUR_EMAILJS_TEMPLATE_ID'; // e.g. template_xxx

  if (window.emailjs && EMAILJS_USER_ID && EMAILJS_USER_ID !== 'YOUR_EMAILJS_USER_ID') {
    try { emailjs.init(EMAILJS_USER_ID); } catch (e) { console.warn('EmailJS init failed', e); }
  }

  if (!contactForm) return;

  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const name = (contactForm.elements['name'] || {}).value.trim() || '';
    const email = (contactForm.elements['email'] || {}).value.trim() || '';
    const message = (contactForm.elements['message'] || {}).value.trim() || '';

    if (submitBtn) submitBtn.disabled = true;

    // 1) Try server-side endpoint /send
    try {
      const res = await fetch('/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.success) {
          alert('تم الإرسال بنجاح. شكراً لتواصلك.');
          contactForm.reset();
          window.location.href = 'thanks.html';
          return;
        }
      } else {
        // show server error to user
        let errData = { error: res.statusText || 'Server error' };
        try { errData = await res.json(); } catch (e) {}
        alert('فشل الإرسال من الخادم: ' + (errData.error || errData.message || res.status));
      }
    } catch (err) {
      console.warn('Server send failed:', err);
      alert('تعذّر التواصل مع الخادم. سيتم فتح بريدك المحلي كبديل.');
    }

    // 2) Try EmailJS if configured
    if (window.emailjs && EMAILJS_USER_ID && EMAILJS_USER_ID !== 'YOUR_EMAILJS_USER_ID' && EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID) {
      try {
        const templateParams = { from_name: name, from_email: email, message };
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
        alert('تم الإرسال بنجاح. شكراً لتواصلك.');
        contactForm.reset();
        window.location.href = 'thanks.html';
        return;
      } catch (err) {
        console.error('EmailJS send error', err);
      }
    }

    // 3) Fallback: open user's email client with prefilled content
    const subject = encodeURIComponent('رسالة من موقع TEKNO_ELEVATORS');
    const body = encodeURIComponent(`الاسم: ${name}\nالبريد: ${email}\n\n${message}`);
    window.location.href = `mailto:Tecno.elevators.sa@gmail.com?subject=${subject}&body=${body}`;
    if (submitBtn) submitBtn.disabled = false;
  });
})();

function saveElevators(items) {
  localStorage.setItem(elevatorStorageKey, JSON.stringify(items));
}

function createElevatorCard(item) {
  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML = `
    ${item.image ? `<img src="${item.image}" alt="صورة المصعد" class="elevator-image" />` : ''}
    <h3>${item.name}</h3>
    <p><strong>النوع:</strong> ${item.type}</p>
    <p><strong>سعة الوزن:</strong> ${item.capacity}</p>
    <p>${item.description}</p>
  `;
  return card;
}

function renderElevators(list) {
  elevatorList.innerHTML = '';
  if (!list.length) {
    if (noElevatorsMessage) noElevatorsMessage.style.display = 'block';
    return;
  }

  if (noElevatorsMessage) noElevatorsMessage.style.display = 'none';
  list.forEach((item) => elevatorList.appendChild(createElevatorCard(item)));
}

const savedElevators = getSavedElevators();
if (elevatorList) renderElevators(savedElevators);

if (elevatorForm && elevatorList) {
  elevatorForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = elevatorForm.elements['name'].value.trim();
    const type = elevatorForm.elements['type'].value;
    const capacity = elevatorForm.elements['capacity'].value.trim();
    const image = elevatorForm.elements['image'].value.trim();
    const description = elevatorForm.elements['description'].value.trim();

    if (!name || !type || !capacity || !description) {
      alert('من فضلك املأ جميع الحقول الأساسية. حقل الصورة اختياري.');
      return;
    }

    const newElevator = { name, type, capacity, image, description };
    const updatedList = [newElevator, ...getSavedElevators()];
    saveElevators(updatedList);
    renderElevators(updatedList);
    elevatorForm.reset();
    alert('تمت إضافة المصعد بنجاح وسيظهر في القائمة الآن.');
  });
}
