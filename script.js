const elevatorStorageKey = 'teknoElevatorList';

const adminElevatorForm = document.getElementById('admin-add-elevator-form');
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
    ${item.image ? `<img src="${item.image}" alt="${item.name}" class="elevator-image" />` : ''}

    <h3>${item.name}</h3>

    <p><strong>النوع:</strong> ${item.type}</p>

    ${
      item.capacity
        ? `<p><strong>المواصفات:</strong> ${item.capacity}</p>`
        : ''
    }

    <p>${item.description}</p>
  `;

  return card;
}

function renderElevators(list) {

  if (!elevatorList) return;

  elevatorList.innerHTML = '';

  if (!list.length) {
    if (noElevatorsMessage) {
      noElevatorsMessage.style.display = 'block';
    }
    return;
  }

  if (noElevatorsMessage) {
    noElevatorsMessage.style.display = 'none';
  }

  list.forEach(item => {
    elevatorList.appendChild(createElevatorCard(item));
  });
}

document.addEventListener('DOMContentLoaded', () => {

  const savedElevators = getSavedElevators();

  renderElevators(savedElevators);

  if (adminElevatorForm) {

    adminElevatorForm.addEventListener('submit', function (event) {

      event.preventDefault();

      const name =
        adminElevatorForm.elements['name'].value.trim();

      const type =
        adminElevatorForm.elements['type'].value;

      const capacity =
        adminElevatorForm.elements['capacity'].value.trim();

      const image =
        adminElevatorForm.elements['image'].value.trim();

      const description =
        adminElevatorForm.elements['description'].value.trim();

      if (!name || !type || !description) {
        alert('من فضلك أدخل اسم المنتج والنوع والوصف.');
        return;
      }

      const newElevator = {
        name,
        type,
        capacity,
        image,
        description
      };

      const updatedList = [
        newElevator,
        ...getSavedElevators()
      ];

      saveElevators(updatedList);

      renderElevators(updatedList);

      adminElevatorForm.reset();

      alert('تمت إضافة المنتج بنجاح.');
    });

  }

});