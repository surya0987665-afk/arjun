let students = [];
let editIndex = -1;

/* LOAD DATA */
window.onload = function() {
    let user = localStorage.getItem("currentUser");
    if(!user) return;

    let savedStudents = localStorage.getItem("students_" + user);
    if (savedStudents) {
        students = JSON.parse(savedStudents);
    }
    displayStudents();
};

/* SAVE DATA */
function saveData() {
    let user = localStorage.getItem("currentUser");
    localStorage.setItem("students_" + user, JSON.stringify(students));
}

/* LOGOUT */
function logout() {
    localStorage.removeItem("loggedIn");
    window.location.href = "login.html";
}

/* ADD STUDENT */
function addStudent() {
    let name = document.getElementById("name").value;
    let amount = document.getElementById("amount").value;
    let dueDate = document.getElementById("dueDate").value;
    let phone = document.getElementById("phone").value;

    let student = {
        name, amount, dueDate, phone, status: "Not Paid"
    };

    if(editIndex === -1) {
        students.push(student);
    } else {
        students[editIndex] = student;
        editIndex = -1;
    }

    saveData();
    displayStudents();
}

/* DISPLAY */
function displayStudents() {
    let table = document.getElementById("studentTable");
    table.innerHTML = "";

    students.forEach((s, index) => {
        table.innerHTML += `
            <tr>
                <td onclick="openHistory(${index})" style="cursor:pointer; color:blue;">${s.name}</td>
                <td>${s.amount}</td>
                <td>${s.dueDate}</td>
                <td style="color:${s.status==='Paid'?'green':'red'}">${s.status}</td>
                <td>
                    <button onclick="markPaid(${index})">Paid</button>
                    <button onclick="deleteStudent(${index})">Delete</button>
                </td>
            </tr>
        `;
    });

    updateDashboard();
}

/* DASHBOARD */
function updateDashboard() {
    document.getElementById("totalStudents").innerText = students.length;
}

/* MARK PAID */
function markPaid(index) {
    students[index].status = "Paid";
    saveData();
    displayStudents();
}

/* DELETE */
function deleteStudent(index) {
    students.splice(index, 1);
    saveData();
    displayStudents();
}

/* 12 MONTH HISTORY */
function openHistory(index) {
    let student = students[index];

    if(!student.history) {
        student.history = {
            Jan:"Pending", Feb:"Pending", Mar:"Pending",
            Apr:"Pending", May:"Pending", Jun:"Pending",
            Jul:"Pending", Aug:"Pending", Sep:"Pending",
            Oct:"Pending", Nov:"Pending", Dec:"Pending"
        };
    }

    document.getElementById("historyModal").style.display = "block";
    document.getElementById("historyTitle").innerText = student.name;

    let table = document.getElementById("historyTable");
    table.innerHTML = "";

    for(let month in student.history) {
        table.innerHTML += `
            <tr>
                <td>${month}</td>
                <td>${student.history[month]}</td>
                <td>
                    <button onclick="setMonthStatus(${index}, '${month}', 'Paid')">Paid</button>
                    <button onclick="setMonthStatus(${index}, '${month}', 'Pending')">Unpaid</button>
                </td>
            </tr>
        `;
    }

    saveData();
}

function setMonthStatus(index, month, status) {
    students[index].history[month] = status;
    saveData();
    openHistory(index);
}

function closeHistory() {
    document.getElementById("historyModal").style.display = "none";
}
