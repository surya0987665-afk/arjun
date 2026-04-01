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
    let month = document.getElementById("month").value;
    let year = document.getElementById("year").value;
    let status = document.getElementById("status").value;

    let student = students.find(s => s.name === name);

    if(!student){
        student = {
            name: name,
            phone: phone,
            fee: fee,
            dueDay: dueDay,
            yearData: {}
        };
        students.push(student);
    }

    if(!student.yearData[year]){
        student.yearData[year] = {};
    }

    student.yearData[year][month] = status;

    localStorage.setItem("students", JSON.stringify(students));

    loadStudents();
    loadDashboard();
}

function loadStudents(){
    let list = document.getElementById("studentList");
    if(!list) return;

    list.innerHTML = "";

    students.forEach((s,i)=>{
        let li = document.createElement("li");

        let data = "";
        let reminderBtn = "";

        for(let y in s.yearData){
            for(let m in s.yearData[y]){
                let status = s.yearData[y][m];
                data += y + "-" + m + ":" + status + " ";

                if(status == "UNPAID"){
                    let msg = "Hello " + s.name +
                    ", your fee of ₹" + s.fee +
                    " for month " + m +
                    " is pending.";

                    let url = "https://wa.me/91" + s.phone +
                    "?text=" + encodeURIComponent(msg);

                    reminderBtn += " <a href='"+url+"' target='_blank'>Reminder</a>";
                }
            }
        }

        li.innerHTML = s.name + " | ₹" + s.fee + " | " + data + reminderBtn;
        list.appendChild(li);
    });
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

function sendAllReminders(){
    students.forEach(s=>{
        for(let y in s.yearData){
            for(let m in s.yearData[y]){
                if(s.yearData[y][m] == "UNPAID"){
                    let msg = "Hello " + s.name +
                    ", your fee of ₹" + s.fee +
                    " is pending.";

                    let url = "https://wa.me/91" + s.phone +
                    "?text=" + encodeURIComponent(msg);

                    window.open(url);
                }
            }
        }
    });
}
