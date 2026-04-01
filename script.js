let students = JSON.parse(localStorage.getItem("students")) || [];

function showPage(page){
    document.querySelectorAll(".page").forEach(p=>{
        p.style.display="none";
    });
    document.getElementById(page).style.display="block";

    if(page === "students"){
        loadStudents();
    }
    if(page === "dashboard"){
        loadDashboard();
    }
}

showPage("dashboard");

function saveStudent(){
    let name=document.getElementById("name").value;
    let phone=document.getElementById("phone").value;
    let fee=document.getElementById("fee").value;
    let dueDay=document.getElementById("dueDay").value;

    students.push({name,phone,fee,dueDay,payments:[]});
    localStorage.setItem("students", JSON.stringify(students));

    loadStudents();
    loadDashboard();
}

function loadStudents(){
    let list=document.getElementById("studentList");
    if(!list) return;

    list.innerHTML="";
    students.forEach((s,i)=>{
        let li=document.createElement("li");
        li.innerHTML =
        s.name + " ₹" + s.fee +
        " <button onclick='deleteStudent("+i+")'>Delete</button>";
        list.appendChild(li);
    });
}

function deleteStudent(i){
    students.splice(i,1);
    localStorage.setItem("students", JSON.stringify(students));
    loadStudents();
    loadDashboard();
}

function loadDashboard(){
    document.getElementById("totalStudents").innerText = students.length;

    let totalIncome = 0;
    students.forEach(s=>{
        s.payments.forEach(p=>{
            totalIncome += Number(s.fee);
        });
    });

    document.getElementById("income").innerText = totalIncome;
}
