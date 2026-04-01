let students = JSON.parse(localStorage.getItem("students")) || [];

function showAddForm() {
    document.getElementById("studentForm").style.display = "block";
}

function addStudent() {
    let student = {
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value,
        fee: document.getElementById("fee").value,
        dueDate: document.getElementById("dueDate").value,
        joinDate: document.getElementById("joinDate").value,
        payments: []
    };

    students.push(student);
    localStorage.setItem("students", JSON.stringify(students));
    loadStudents();
}

function loadStudents() {
    let table = document.getElementById("studentTable");
    table.innerHTML = "";

    let paid = 0;

    students.forEach((s, index) => {
        let status = s.payments.length > 0 ? "Paid" : "Unpaid";
        if(status == "Paid") paid++;

        table.innerHTML += `
        <tr>
            <td onclick="viewStudent(${index})">${s.name}</td>
            <td>${s.phone}</td>
            <td>${s.fee}</td>
            <td>${s.dueDate}</td>
            <td>${status}</td>
            <td>
                <button onclick="deleteStudent(${index})">Delete</button>
            </td>
        </tr>
        `;
    });

    document.getElementById("totalStudents").innerText = students.length;
    document.getElementById("paidStudents").innerText = paid;
    document.getElementById("unpaidStudents").innerText = students.length - paid;
}

function deleteStudent(index) {
    students.splice(index, 1);
    localStorage.setItem("students", JSON.stringify(students));
    loadStudents();
}

function viewStudent(index) {
    let s = students[index];
    alert(
        "Name: " + s.name +
        "\nPhone: " + s.phone +
        "\nFee: " + s.fee +
        "\nJoin Date: " + s.joinDate +
        "\nPayments Done: " + s.payments.length
    );
}

loadStudents();
