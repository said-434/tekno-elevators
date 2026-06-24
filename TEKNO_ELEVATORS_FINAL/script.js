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
