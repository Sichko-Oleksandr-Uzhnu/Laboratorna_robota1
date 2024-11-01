document.addEventListener('DOMContentLoaded', () => {
    loadEmployeeData();
});

let employees = [];

async function loadEmployeeData() {
    try {
        const response = await fetch('employees.json');
        if (!response.ok) throw new Error('Не вдалося завантажити дані');
        employees = await response.json();
        populateDepartmentFilter();
        renderEmployeeTable(employees);
    } catch (error) {
        alert(error.message);
    }
}

function populateDepartmentFilter() {
    const departmentFilter = document.getElementById('departmentFilter');
    const departments = [...new Set(employees.map(emp => emp.department))];
    departments.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept;
        option.textContent = dept;
        departmentFilter.appendChild(option);
    });
}

function renderEmployeeTable(data) {
    const tableBody = document.querySelector('#employeeTable tbody');
    tableBody.innerHTML = '';
    data.forEach(employee => {
        const row = document.createElement('tr');
        row.className = `status-${employee.status.toLowerCase().replace(' ', '-')}`;
        row.innerHTML = `
            <td>${employee.employeeId}</td>
            <td>${employee.firstName} ${employee.lastName}</td>
            <td>${employee.department}</td>
            <td>${employee.position}</td>
            <td>${employee.status}</td>
        `;
        row.onclick = () => openModal(employee);
        tableBody.appendChild(row);
    });
}

function filterEmployees() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const departmentFilter = document.getElementById('departmentFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const filtered = employees.filter(emp => {
        return (emp.firstName.toLowerCase().includes(searchInput) || emp.lastName.toLowerCase().includes(searchInput)) &&
            (departmentFilter === '' || emp.department === departmentFilter) &&
            (statusFilter === '' || emp.status === statusFilter);
    });
    renderEmployeeTable(filtered);
}

function sortEmployeesByName() {
    const sorted = [...employees].sort((a, b) => a.firstName.localeCompare(b.firstName));
    renderEmployeeTable(sorted);
}

function sortEmployeesByHireDate() {
    const sorted = [...employees].sort((a, b) => new Date(a.hireDate) - new Date(b.hireDate));
    renderEmployeeTable(sorted);
}

function openModal(employee) {
    const modal = document.getElementById('employeeModal');
    const modalDetails = document.getElementById('modalDetails');
    modalDetails.innerHTML = `
        <p><strong>Ім'я:</strong> ${employee.firstName} ${employee.lastName}</p>
        <p><strong>Відділ:</strong> ${employee.department}</p>
        <p><strong>Посада:</strong> ${employee.position}</p>
        <p><strong>Email:</strong> ${employee.email}</p>
        <p><strong>Телефон:</strong> ${employee.phone}</p>
        <p><strong>Дата найму:</strong> ${employee.hireDate}</p>
        <p><strong>Статус:</strong> ${employee.status}</p>
    `;
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('employeeModal').style.display = 'none';
}

window.onclick = event => {
    const modal = document.getElementById('employeeModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};
