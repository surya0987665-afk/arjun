let students = [];
let editIndex = -1;

/* LOAD DATA */
window.onload = function() {
    let user = localStorage.getItem("currentUser");
    let savedStudents = localStorage.getItem("students_" + user);
    if(savedStudents) {
        students = JSON.parse(savedStudents);
    }
    displayStudents();
};

/* SAVE */
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

    let student = { name, amount, dueDate, phone, status:"Not Paid" };

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
function displayStudents(list = students) {
    let table = document.getElementById("studentTable");
    table.innerHTML = "";

    list.forEach((s) => {
        let i = students.indexOf(s);

        table.innerHTML += `
            <tr>
                <td onclick="openHistory(${i})" style="color:blue;cursor:pointer;">${s.name}</td>
                <td>${s.amount}</td>
                <td>${s.dueDate}</td>
                <td style="color:${s.status==='Paid'?'green':'red'}">${s.status}</td>
                <td>
                    <button onclick="markPaid(${i})">Paid</button>
                    <button onclick="editStudent(${i})">Edit</button>
                    <button onclick="sendReminder('${s.phone}','${s.name}','${s.amount}','${s.dueDate}')">Reminder</button>
                    <button onclick="sendReceipt('${s.phone}','${s.name}','${s.amount}')">Receipt</button>
                    <button onclick="deleteStudent(${i})">Delete</button>
                </td>
            </tr>
        `;
    });

    updateDashboard();
}

/* DASHBOARD */
function updateDashboard() {
    document.getElementById("totalStudents").innerText = students.length;
    document.getElementById("paidStudents").innerText =
        students.filter(s=>s.status==="Paid").length;
    document.getElementById("pendingStudents").innerText =
        students.filter(s=>s.status!=="Paid").length;
}

/* ACTIONS */
function markPaid(i){ students[i].status="Paid"; saveData(); displayStudents(); }
function editStudent(i){
    let s=students[i];
    name.value=s.name; amount.value=s.amount; dueDate.value=s.dueDate; phone.value=s.phone;
    editIndex=i;
}
function deleteStudent(i){ students.splice(i,1); saveData(); displayStudents(); }

/* SEARCH */
function searchStudent(){
    let v=search.value.toLowerCase();
    displayStudents(students.filter(s=>s.name.toLowerCase().includes(v)));
}

/* WHATSAPP */
function sendReminder(phone,name,amount,dueDate){
    phone=phone.replace(/\D/g,"");
    let msg=`Hello ${name},

This is a gentle reminder from *Nandi Pipes Badminton Academy*.
Your fee of Rs. ${amount} is due on ${dueDate}.

Please complete the payment at the earliest.

Thank you.
Coach: Nagarjuna`;
    window.open("https://wa.me/91"+phone+"?text="+encodeURIComponent(msg));
}

function sendReceipt(phone,name,amount){
    phone=phone.replace(/\D/g,"");
    let today=new Date().toISOString().split('T')[0];
    let msg=`*Nandi Pipes Badminton Academy*

Payment Receipt
----------------------
Name: ${name}
Amount: Rs.${amount}
Date: ${today}
Status: PAID

Thank you for your payment.

Coach: Nagarjuna`;
    window.open("https://wa.me/91"+phone+"?text="+encodeURIComponent(msg));
}

/* 12 MONTH HISTORY */
function openHistory(i){
    let s=students[i];
    if(!s.history){
        s.history={Jan:"Pending",Feb:"Pending",Mar:"Pending",Apr:"Pending",May:"Pending",Jun:"Pending",Jul:"Pending",Aug:"Pending",Sep:"Pending",Oct:"Pending",Nov:"Pending",Dec:"Pending"};
    }
    historyModal.style.display="block";
    historyTitle.innerText=s.name;
    historyTable.innerHTML="";
    for(let m in s.history){
        historyTable.innerHTML+=`
        <tr>
            <td>${m}</td>
            <td>${s.history[m]}</td>
            <td>
                <button onclick="setMonthStatus(${i},'${m}','Paid')">Paid</button>
                <button onclick="setMonthStatus(${i},'${m}','Pending')">Unpaid</button>
            </td>
        </tr>`;
    }
    saveData();
}
function setMonthStatus(i,m,status){ students[i].history[m]=status; saveData(); openHistory(i); }
function closeHistory(){ historyModal.style.display="none"; }
