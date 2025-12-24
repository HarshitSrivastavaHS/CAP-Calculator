const subjectContainer = document.getElementById("subjects")

const grades = {
    'A+': 5.0,
    'A': 5.0,
    'A-': 4.5,
    'B+': 4.0,
    'B': 3.5,
    'B-': 3.0,
    'C+': 2.5,
    'C': 2.0,
    'D+': 1.5,
    'D': 1.0,
    'F': 0.0
}

function calculate() {
    let subjects = document.getElementsByClassName("subject")
    let prevGPA = parseFloat(document.getElementById("gpa-input").value) ? parseFloat(document.getElementById("gpa-input").value) : 0.0
    let prevMC = parseInt(document.getElementById("mc-input").value) ? parseInt(document.getElementById("mc-input").value) : 0
    let total = 0.0 + prevGPA*prevMC;
    let totalMC = prevMC;
    for (let sub of subjects) {
        let sucheck = sub.querySelector(".suCheckbox")
        if (sucheck.checked)
            continue
        let grade = parseFloat(grades[sub.querySelector(".grade").value])
        let mc = parseInt(sub.querySelector(".mc").value) ? parseInt(sub.querySelector(".mc").value) : 0
        total += grade*mc
        totalMC += mc
    }
    let GPA = total/(totalMC>0?totalMC:1)
    let gpafield = document.getElementById("showGPA")
    gpafield.innerText = `Calculated GPA: ${isNaN(GPA) ? "0.0" : GPA.toFixed(2)}`

    let totalMCField = document.getElementById("totalMC");
    totalMCField.innerText = `Total Credits Taken: ${prevMC} + ${totalMC - prevMC} = ${totalMC}`;
}

function sucheck(checkbox) {
    let subjectDiv = checkbox.closest(".subject");
    let subox = subjectDiv.querySelector(".suGrade");
    if (checkbox.checked) {
        let grade = subjectDiv.querySelector(".grade").value
        if (grade == 'F')
            grade = "U"
        else
            grade = "S"
        subox.innerText = grade
    } else {
        subox.innerText = ""
    }

}

backgroundColor = "#F8F9FA";
//colors = ["#66c5cc", "#f6cf71", "#f89c74", "#dcb0f2", "#87c55f"]
colors = ["#B2EBF2", "#FEEA9A", "#FFCCB6", "#E1BEE7", "#C8E6C9"];

lastColor = -1;
function addSubject() {

    const subjectDiv = document.createElement("div");
    subjectDiv.className = "subject"

    const srNumber = subjectContainer.children.length + 1

    subjectDiv.innerHTML = `<div class="sr">${srNumber}</div>
                <input type="text" class="code" placeholder="Module Code">
                <input type="text" inputmode="numeric" class="mc" placeholder="Module Credit" pattern="[0-9]*">
                <div class="gradebox">
                    <label>Select Grade:
                    <select class="grade">
                        <option value="A+" selected>A+</option>
                        <option value="A">A</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B">B</option>
                        <option value="B-">B-</option>
                        <option value="C+">C+</option>
                        <option value="C">C</option>
                        <option value="D+">D+</option>
                        <option value="D">D</option>
                        <option value="F">F</option>
                    </select>
                    </label>
                </div>
                <div class="suBox"><label>S/U <input type="checkbox" class="suCheckbox" onchange="sucheck(this)"></label><span class="suGrade"></span></div>
                <button class="remove" onclick="remove(this)">🗑</button>`

    
    randomColorNumber = Math.floor(Math.random() * colors.length);
    divColor = colors[randomColorNumber] == lastColor ? colors[(randomColorNumber + 1) % colors.length] : colors[randomColorNumber];
    subjectDiv.style.backgroundColor = divColor;
    subjectDiv.style.borderColor = divColor;
    subjectDiv.querySelector(".suCheckbox").style.accentColor = divColor;
    subjectContainer.appendChild(subjectDiv);
    colorForThisCard = colors[divColor]; 
    checkbox = subjectDiv.querySelector(".suCheckbox");

    checkbox.style.setProperty('--checked-color', colorForThisCard);
    attachListeners(subjectDiv);
    lastColor = divColor;
}

function attachListeners(subjectDiv) {
    const mcInput = subjectDiv.querySelector(".mc");
    
    mcInput.addEventListener("input", function() {
        this.value = this.value.replace(/[^0-9]/g, '');
        calculate(); 
    });

    subjectDiv.querySelector(".mc").addEventListener("change", calculate);
    subjectDiv.querySelector(".grade").addEventListener("change", calculate);
    subjectDiv.querySelector(".suCheckbox").addEventListener("change", calculate);
}

function remove(subject) {
    subject = subject.closest(".subject")
    subject.remove()
    renumber()
    calculate()
}

function renumber() {
    let subjects = subjectContainer.querySelectorAll(".subject")
    subjects.forEach((subject, index)=>{
        subject.querySelector(".sr").innerText = index+1
    })
}

window.onload = ()=>{
        addSubject()
        document.getElementById("gpa-container").style.backgroundColor = colors[0];
        document.getElementById("gpa-container").style.borderColor = colors[0];
        attachListenersForPrevGPA();
        document.body.style.backgroundColor = backgroundColor;
        document.getElementById("add-subject-button").style.backgroundColor = colors[3];
        document.getElementById("showGPA").style.backgroundColor = colors[4];
        document.getElementById("totalMC").style.backgroundColor = colors[1];
        calculate();
}

function attachListenersForPrevGPA() {
    const gpaInput = document.getElementById("gpa-input");
    gpaInput.addEventListener("input", function() {
        let targetValue = this.value;
        let value = targetValue.replace(/[^0-9.]/g, '');
        const parts = value.split('.');
        if (parts.length > 2) {
            value = parts[0] + '.' + parts.slice(1).join('');
        }
        if (parts[1] && parts[1].length > 2) {
            value = parts[0] + '.' + parts[1].slice(0, 2);
        }
        if (value !== "" && value !== ".") {
            if (parseFloat(value) > 5) {
                value = "5";
            }
        }   
        this.value = value;
    });

    const mcInput = document.getElementById("mc-input");
    mcInput.addEventListener("input", function() {
        this.value = this.value.replace(/[^0-9]/g, '');
        calculate(); 
    });

    gpaInput.addEventListener("change", calculate);
    mcInput.addEventListener("change", calculate);
}
