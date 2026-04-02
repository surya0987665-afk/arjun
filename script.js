let students = [];

function addStudent() {
    let name = document.getElementById("name").value;
    let amount = document.getElementById("amount").value;
    let dueDate = document.getElementById("dueDate").value;

    let student = {
        name: name,
        amount: amount,
        dueDate: dueDate,
        status: "Not Paid"
    };

    students.push(student);
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
                    <button onclick="sendWhatsApp('${s.name}', '${s.amount}')">Reminder</button>
                    <button onclick="deleteStudent(${index})">Delete</button>
                </td>
            </tr>
        `;
    });
}

function markPaid(index) {
    students[index].status = "Paid";
    displayStudents();
}

function deleteStudent(index) {
    students.splice(index, 1);
    displayStudents();
}

function sendWhatsApp(name, amount) {
    let message = `Hello ${name}, your fee of Rs.${amount} is pending. Please pay.`;
    let url = "https://wa.me/?text=" + encodeURIComponent(message);
    window.open(url);
}
