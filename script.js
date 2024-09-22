const dataUrl = "https://gsmktg.azurewebsites.net/api/v1/techlabs/test/students";
let dataArray = [];
const getData = async (link) => {
    let response = await fetch(link);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    let data = await response.json();
    return data;
}

const display = document.querySelector("#displayData");


const displayFunction = async () => {
    dataArray = await getData(dataUrl);
    console.log(dataArray.length);
    dataArray.sort((element1, element2) => {
        return element1.id - element2.id;
    });
    populateTable();
};

displayFunction();

const populateTable = ()=>{
    let count = 1;
    display.innerHTML="";
    dataArray.forEach(element => {
        const row = document.createElement("tr");
        const cells = [
            count++,    
            element.rollNo,
            element.name,
            element.email,
            element.isMale ? "Male" : "Female"
        ];

        cells.forEach(cellContent => {
            const cell = document.createElement("td");
            cell.textContent = cellContent;
            row.appendChild(cell);
        });

        const deleteButtonCell = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteRow(row));
        deleteButtonCell.appendChild(deleteButton);
        deleteButton.className = "btn btn-danger btn-sm";
        row.appendChild(deleteButtonCell);
        display.appendChild(row);

        deleteButton.addEventListener("click", () => deleteRow(element.id));
    });

}
const deleteRow = (id) => {
    console.log(id);
    fetch(`${dataUrl}/${id}`,{
        method:'DELETE'
    })
    displayFunction();
}


const addStudent = () => {

    const formRollNo = document.querySelector("#formRollNo").value;
    const formName = document.querySelector("#formName").value;
    const formEmail = document.querySelector("#formEmail").value;
    const isMale = document.querySelector("#genderMale").checked;

    if (formRollNo && formName && formEmail) {
        const newStudent = {
            age: null,
            rollNo: formRollNo,
            name: formName,
            email: formEmail,
            isMale: isMale
        };
        console.log(newStudent);
        document.querySelector("#formRollNo").value = "";
        document.querySelector("#formName").value = "";
        document.querySelector("#formEmail").value = "";
        document.querySelector("#genderMale").checked = null;

        fetch(dataUrl,{
            method:'Post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newStudent)
        })
        populateTable();
    }
}
