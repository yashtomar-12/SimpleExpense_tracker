const API = '/api/expenses';
const form = document.getElementById('expense-form');
const list = document.getElementById('expense-list');
const totalEl = document.getElementById('total');
const emptyMsg = document.getElementById('empty-msg');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');

let editId = null;
let expensesCache = [];

document.getElementById('date').valueAsDate = new Date();

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

async function loadExpenses() {
  const res = await fetch(API);
  expensesCache = await res.json();

  list.innerHTML = '';
  let total = 0;

  expensesCache.forEach(e => {
    total += Number(e.amount);
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="info">
        <strong>${escapeHtml(e.title)}</strong> - ₹${e.amount}
        <small>${escapeHtml(e.category || '')} | ${e.date}</small>
      </div>
      <div class="actions">
        <button class="edit-btn" onclick="startEdit(${e.id})">✏️</button>
        <button class="delete-btn" onclick="deleteExpense(${e.id})">🗑️</button>
      </div>
    `;
    list.appendChild(li);
  });

  totalEl.textContent = total.toFixed(2);
  emptyMsg.hidden = expensesCache.length > 0;
}

form.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const data = {
    title: document.getElementById('title').value,
    amount: document.getElementById('amount').value,
    category: document.getElementById('category').value,
    date: document.getElementById('date').value
  };

  const url = editId ? `${API}/${editId}` : API;
  const method = editId ? 'PUT' : 'POST';

  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  resetForm();
  loadExpenses();
});

function startEdit(id) {
  const e = expensesCache.find(x => x.id === id);
  if (!e) return;
  editId = id;
  document.getElementById('title').value = e.title;
  document.getElementById('amount').value = e.amount;
  document.getElementById('category').value = e.category;
  document.getElementById('date').value = e.date;
  submitBtn.textContent = 'Update';
  cancelBtn.hidden = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
  editId = null;
  form.reset();
  document.getElementById('date').valueAsDate = new Date();
  submitBtn.textContent = 'Add';
  cancelBtn.hidden = true;
}

cancelBtn.addEventListener('click', resetForm);

async function deleteExpense(id) {
  if (!confirm('Do you want to delete this expense?')) return;
  await fetch(`${API}/${id}`, { method: 'DELETE' });
  loadExpenses();
}

loadExpenses();