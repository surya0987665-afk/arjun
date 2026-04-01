let students = JSON.parse(localStorage.getItem("students")) || [];

function showPage(page){
    document.querySelectorAll(".page").forEach(p=>{
        p.style.display="none";
    });
    document.getElementById(page).style.display="block";

    if(page === "students") loadStudents();
    if(page === "dashboard") loadDashboard();
}

showPage("dashboard");

function saveStudent(){
    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let fee = document.getElementById("fee").value;
    let dueDay = document.getElementById("dueDay").value;
    let editIndex = document.getElementById("editIndex").value;

    if(editIndex === ""){
        students.push({
            name:name,
            phone:phone,
            fee:fee,
            dueDay:dueDay,
            yearData:{}
        });
    } else {
        students[editIndex].name = name;
        students[editIndex].phone = phone;
        students[editIndex].fee = fee;
        students[editIndex].dueDay = dueDay;
        document.getElementById("editIndex").value="";
    }

    localStorage.setItem("students", JSON.stringify(students));

    loadStudents();
    loadDashboard();
}

function loadStudents(){
    let list = document.getElementById("studentList");
    list.innerHTML = "";

    students.forEach((s,i)=>{
        let li = document.createElement("li");

        li.innerHTML =
        "<b onclick='showStudentRecord("+i+")'>" + s.name + "</b> | ₹" + s.fee +
        " <button onclick='editStudent("+i+")'>Edit</button>" +
        " <button onclick='deleteStudent("+i+")'>Delete</button>";

        list.appendChild(li);
    });
}

function editStudent(i){
    let s = students[i];
    document.getElementById("name").value = s.name;
    document.getElementById("phone").value = s.phone;
    document.getElementById("fee").value = s.fee;
    document.getElementById("dueDay").value = s.dueDay;
    document.getElementById("editIndex").value = i;
}

function deleteStudent(i){
    students.splice(i,1);
    localStorage.setItem("students", JSON.stringify(students));
    loadStudents();
    loadDashboard();
}

function showStudentRecord(index){
    let student = students[index];
    let year = new Date().getFullYear();
    let recordDiv = document.getElementById("studentRecord");

    let html = "<table border='1'><tr>";
    let months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    months.forEach((m,mi)=>{
        html += "<th>"+m+"</th>";
    });
    html += "</tr><tr>";

    months.forEach((m,mi)=>{
        let month = mi+1;
        let status = "UNPAID";

        if(student.yearData[year] && student.yearData[year][month]){
            status = student.yearData[year][month];
        }

        let color = status == "PAID" ? "lightgreen" : "salmon";

        html += "<td style='background:"+color+"' onclick='toggleStatus("+index+","+month+")'>"+status+"</td>";
    });

    html += "</tr></table>";

    recordDiv.innerHTML = html;
}

function toggleStatus(studentIndex, month){
    let year = new Date().getFullYear();

    if(!students[studentIndex].yearData[year]){
        students[studentIndex].yearData[year] = {};
    }

    let current = students[studentIndex].yearData[year][month];

    if(current == "PAID"){
        students[studentIndex].yearData[year][month] = "UNPAID";
    } else {
        students[studentIndex].yearData[year][month] = "PAID";
    }

    localStorage.setItem("students", JSON.stringify(students));
    showStudentRecord(studentIndex);
    loadDashboard();
}

function loadDashboard(){
    document.getElementById("totalStudents").innerText = students.length;

    let today = new Date();
    let month = today.getMonth()+1;
    let year = today.getFullYear();

    let income = 0;

    students.forEach(s=>{
        if(s.yearData[year] && s.yearData[year][month] == "PAID"){
            income += Number(s.fee);
        }
    });

    document.getElementById("income").innerText = income;
        }
