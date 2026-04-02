/* 12 MONTH HISTORY WITH PAID / UNPAID */
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
        let status = student.history[month];
        let color = status === "Paid" ? "green" : "red";

        table.innerHTML += `
            <tr>
                <td>${month}</td>
                <td style="color:${color}">${status}</td>
                <td>
                    <button onclick="setMonthStatus(${index}, '${month}', 'Paid')">Paid</button>
                    <button onclick="setMonthStatus(${index}, '${month}', 'Pending')">Unpaid</button>
                </td>
            </tr>
        `;
    }

    saveData();
}

/* SET MONTH STATUS */
function setMonthStatus(index, month, status) {
    students[index].history[month] = status;
    saveData();
    openHistory(index);
}

/* CLOSE HISTORY */
function closeHistory() {
    document.getElementById("historyModal").style.display = "none";
}
