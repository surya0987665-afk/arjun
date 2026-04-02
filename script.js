let students = [];

// Load saved data when page opens
window.onload = function() {
    let savedStudents = localStorage.getItem("students");
    if (savedStudents) {
        students = JSON.parse(savedStudents);
    }
    displayStudents();
};

function saveData() {
    localStorage.setItem("students", JSON.stringify(students));
}

function logout() {
    localStorage.removeItem("loggedIn");
    window.location.href = "login.html";
}

function addStudent() {
    let name = document.getElementById("name").value;
    let amount = document.getElementById("amount").value;
    let dueDate = document.getElementById("dueDate").value;
    let phone = document.getElementById("phone").value;

    let student = {
        name: name,
        amount: amount,
        dueDate: dueDate,
        phone: phone,
        status: "Not Paid"
    };

    students.push(student);
    saveData();
    displayStudents();
}

function displayStudents() {
    let table = document.getElementById("studentTable");
    table.innerHTML = "";

    students.forEach((s, index) => {
        table.innerHTML += `
            <tr>
                <td>${s.name}</td>
                <td>${s.amount}</td>
                <td>${s.dueDate}</td>
                <td>${s.status}</td>
                <td>
                    <button onclick="markPaid(${index})">Paid</button>
                    <button onclick="sendReminder('${s.phone}','${s.name}', '${s.amount}', '${s.dueDate}')">Reminder</button>
                    <button onclick="sendReceipt('${s.phone}','${s.name}', '${s.amount}')">Receipt</button>
                    <button onclick="deleteStudent(${index})">Delete</button>
                </td>
            </tr>
        `;
    });
}

function markPaid(index) {
    students[index].status = "Paid";
    saveData();
    displayStudents();
    sendReceipt(students[index].phone, students[index].name, students[index].amount);
}

function deleteStudent(index) {
    students.splice(index, 1);
    saveData();
    displayStudents();
}

function sendReminder(phone, name, amount, dueDate) {
    phone = phone.replace(/\D/g, "");

    let message = `Hello ${name},

This is a gentle reminder from *Nandi Pipes Badminton Academy*.
Your fee of Rs. ${amount} is due on ${dueDate}.

Please complete the payment at the earliest.

Thank you.
Coach: Nagarjuna`;

    let url = "https://wa.me/91" + phone + "?text=" + encodeURIComponent(message);
    window.open(url, '_blank');
}

function sendReceipt(phone, name, amount) {
    phone = phone.replace(/\D/g, "");

    let today = new Date().toISOString().split('T')[0];

    let message = `*Nandi Pipes Badminton Academy*

Payment Receipt
----------------------
Name: ${name}
Amount: Rs. ${amount}
Mode: Online
Date: ${today}
Status: PAID

Thank you for your payment.

Coach: Nagarjuna
Phone: +91 8985809434`;

    let url = "https://wa.me/91" + phone + "?text=" + encodeURIComponent(message);
    window.open(url, '_blank');
}
