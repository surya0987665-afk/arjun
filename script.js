let students = JSON.parse(localStorage.getItem("students")) || [];

function showPage(page){
    document.querySelectorAll(".page").forEach(p=>{
        p.style.display="none";
    });
    document.getElementById(page).style.display="block";
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
}

function loadStudents(){
    let list=document.getElementById("studentList");
    if(!list) return;

    list.innerHTML="";
    students.forEach((s,i)=>{
        let li=document.createElement("li");
        li.innerText=s.name+" ₹"+s.fee;
        list.appendChild(li);
    });
}

function markPaid(){
    let index=document.getElementById("studentSelect").value;
    let date=document.getElementById("paidDate").value;

    let d=new Date(date);
    students[index].payments.push({
        month:d.getMonth()+1,
        year:d.getFullYear(),
        paidDate:date
    });

    localStorage.setItem("students", JSON.stringify(students));
}

function sendDueReminders(){
    students.forEach(s=>{
        let msg="Reminder: Fee ₹"+s.fee+" due soon";
        let url="https://wa.me/91"+s.phone+"?text="+encodeURIComponent(msg);
        window.open(url);
    });
}
