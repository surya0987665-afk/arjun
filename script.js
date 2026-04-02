let students = [];
let editIndex = -1;

/* LOAD DATA */
window.onload = function() {
    let user = localStorage.getItem("currentUser");
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

/* ADD / UPDATE STUDENT */
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

    // Clear form
    document.getElementById("name").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("dueDate").value = "";
    document.getElementById("phone").value = "";
}

/* DISPLAY STUDENTS */
function displayStudents(list = students) {
    let table = document.getElementById("studentTable");
    table.innerHTML = "";

    list.forEach((s) => {
        let realIndex = students.indexOf(s);

        table.innerHTML += `
            <tr>
                <td onclick="openHistory(${realIndex})" style="cursor:pointer; color:blue;">
                    ${s.name}
                </td>
                <td>${s.amount}</td>
                <td>${s.dueDate}</td>
                <td style="color:${s.status==='Paid'?'green':'red'}">${s.status}</td>
                <td>
                    <button onclick="markPaid(${realIndex})">Paid</button>
                    <button onclick="editStudent(${realIndex})">Edit</button>
                    <button onclick="sendReminder('${s.phone}','${s.name}', '${s.amount}', '${s.dueDate}')">Reminder</button>
                    <button onclick="sendReceipt('${s.phone}','${s.name}', '${s.amount}')">Receipt</button>
                    <button onclick="deleteStudent(${realIndex})">Delete</button>
                </td>
            </tr>
        `;
    });

    updateDashboard();
}

/* DASHBOARD */
function updateDashboard() {
    let total = students.length;
    let paid = students.filter(s => s.status === "Paid").length;
    let pending = total - paid;

    let totalAmount = students.reduce((sum, s) => sum + Number(s.amount), 0);
    let paidAmount = students.filter(s => s.status === "Paid")
                    .reduce((sum, s) => sum + Number(s.amount), 0);
    let pendingAmount = totalAmount - paidAmount;

    document.getElementById("totalStudents").innerText = total;
    document.getElementById("paidStudents").innerText = paid;
    document.getElementById("pendingStudents").innerText = pending;
    document.getElementById("totalAmount").innerText = totalAmount;
    document.getElementById("paidAmount").innerText = paidAmount;
    document.getElementById("pendingAmount").innerText = pendingAmount;
}

/* ACTIONS */
function markPaid(index) {
    students[index].status = "Paid";
    saveData();
    displayStudents();
    sendReceipt(students[index].phone, students[index].name, students[index].amount);
}

function editStudent(index) {
    let s = students[index];
    document.getElementById("name").value = s.name;
    document.getElementById("amount").value = s.amount;
    document.getElementById("dueDate").value = s.dueDate;
    document.getElementById("phone").value = s.phone;
    editIndex = index;
}

function deleteStudent(index) {
    if(confirm("Delete this student?")) {
        students.splice(index, 1);
        saveData();
        displayStudents();
    }
}

/* SEARCH */
function searchStudent() {
    let value = document.getElementById("search").value.toLowerCase();
    let filtered = students.filter(s => s.name.toLowerCase().includes(value));
    displayStudents(filtered);
}

/* WHATSAPP REMINDER */
function sendReminder(phone, name, amount, dueDate) {
    phone = phone.replace(/\D/g, "");

    let message = `Hello ${name},

This is a gentle reminder from *Nandi Pipes Badminton Academy*.
Your fee of Rs. ${amount} is due on ${dueDate}.

Please complete the payment at the earliest.

Thank you.
Coach: Nagarjuna`;

    window.open("https://wa.me/91" + phone + "?text=" + encodeURIComponent(message));
}

/* WHATSAPP RECEIPT */
function sendReceipt(phone, name, amount) {
    phone = phone.replace(/\D/g, "");
    let today = new Date().toISOString().split('T')[0];

    let message = `*Nandi Pipes Badminton Academy*

Payment Receipt
----------------------
Name: ${name}
Amount: Rs.${amount}
Date: ${today}
Status: PAID

Thank you for your payment.

Coach: Nagarjuna
Phone: +91 8985809434`;

    window.open("https://wa.me/91" + phone + "?text=" + encodeURIComponent(message));
}

/* SEND REMINDER TO ALL */
function sendReminderToAll() {
    students.forEach(s => {
        if(s.status !== "Paid") {
            sendReminder(s.phone, s.name, s.amount, s.dueDate);
        }
    });
}

/* BACKUP */
function backupData() {
    let data = JSON.stringify(students);
    let blob = new Blob([data], {type: "application/json"});
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "students_backup.json";
    a.click();
}

/* RESTORE */
function restoreData(event) {
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.onload = function() {
        students = JSON.parse(reader.result);
        saveData();
        displayStudents();
    };
    reader.readAsText(file);
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
    document.getElementById("historyTitle").innerText = student.name + " - 12 Month Fee History";

    let table = document.getElementById("historyTable");
    table.innerHTML = "";

    for(let month in student.history) {
        table.innerHTML += `
            <tr>
                <td>${month}</td>
                <td>${student.history[month]}</td>
                <td>
                    <button onclick="markMonthPaid(${index}, '${month}')">Paid</button>
                </td>
            </tr>
        `;
    }

    saveData();
}

function markMonthPaid(index, month) {
    students[index].history[month] = "Paid";
    saveData();
    openHistory(index);
}

function closeHistory() {
    document.getElementById("historyModal").style.display = "none";
}
