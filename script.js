import { db } from "./firebase-config.js";

import {
  ref,
  push,
  onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const adminElevatorForm = document.getElementById('admin-add-elevator-form');
const elevatorList = document.getElementById('elevator-list');
const noElevatorsMessage = document.getElementById('no-elevators');

const elevatorsRef = ref(db, "elevators");

function createElevatorCard(item) {

  const card = document.createElement('article');
  card.className = 'card';

  card.innerHTML = `
    ${item.image
      ? `<img src="${item.image}" alt="${item.name}" class="elevator-image">`
      : ''
    }

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

function renderElevators(data) {

  if (!elevatorList) return;

  elevatorList.innerHTML = '';

  if (!data) {

    if (noElevatorsMessage) {
      noElevatorsMessage.style.display = 'block';
    }

    return;
  }

  if (noElevatorsMessage) {
    noElevatorsMessage.style.display = 'none';
  }

  Object.values(data)
    .reverse()
    .forEach(item => {
      elevatorList.appendChild(
        createElevatorCard(item)
      );
    });
}

document.addEventListener('DOMContentLoaded', () => {

  onValue(elevatorsRef, (snapshot) => {
    renderElevators(snapshot.val());
  });

  if (adminElevatorForm) {

    adminElevatorForm.addEventListener('submit', async function (event) {

      event.preventDefault();

      const newElevator = {
        name: adminElevatorForm.elements['name'].value.trim(),
        type: adminElevatorForm.elements['type'].value,
        capacity: adminElevatorForm.elements['capacity'].value.trim(),
        image: adminElevatorForm.elements['image'].value.trim(),
        description: adminElevatorForm.elements['description'].value.trim()
      };

      if (
        !newElevator.name ||
        !newElevator.type ||
        !newElevator.description
      ) {
        alert('من فضلك أدخل البيانات المطلوبة');
        return;
      }

      await push(elevatorsRef, newElevator);

      adminElevatorForm.reset();

      alert('تمت إضافة المنتج بنجاح');
    });

  }

});