const form = document.querySelector("form");
const editForm = document.querySelector("#edit_form");
const input = document.querySelector("#id_tarefa");
const editInput = document.querySelector("#id_tarefa_edit");
const boxTarefa = document.querySelector(".mostrar");
const cancalBtn = document.querySelector("#cancel_btn");
const main = document.querySelector("main");

let arrTarefa = [];

let oldvalvue = "";

const cratTarefa = (text) => {
    const divTarefa = document.createElement("div");
    divTarefa.classList.add("tarefa");

    boxTarefa.appendChild(divTarefa);

    setTimeout(() => {
        divTarefa.classList.add("visible");
    }, 100);

    const textoTarefa = document.createElement("h3");
    textoTarefa.innerText = text;
    divTarefa.appendChild(textoTarefa);

    const checkBtn = document.createElement("button");
    checkBtn.classList.add("check");
    checkBtn.innerHTML = '<span class="material-symbols-outlined"> check </span>';
    divTarefa.appendChild(checkBtn);

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit");
    editBtn.innerHTML = '<span class="material-symbols-outlined"> edit </span>';
    divTarefa.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete");
    deleteBtn.innerHTML =
        '<span class="material-symbols-outlined"> delete </span>';
    divTarefa.appendChild(deleteBtn);
};

const animarMain = () => {
    main.style.transform = "scale(1)";

    setTimeout(() => {
        main.style.transform = "scale(0.98)";
    }, 500);
};

const remove = (element) => {
    setTimeout(() => {
        element.classList.add("remove");
    }, 100);
};

const saveStorage = (data) => {
    if (localStorage.myarr) {
        arrTarefa = JSON.parse(localStorage.getItem("myarr"));
    }

    arrTarefa.push(data);
    localStorage.myarr = JSON.stringify(arrTarefa);
    return arrTarefa;
};

function loadinPage() {
    if (localStorage.myarr) {
        arrTarefa = JSON.parse(localStorage.getItem("myarr"));
    }

    console.log(arrTarefa);

    arrTarefa.forEach((item) => {
        cratTarefa(item.tarefa);
        if (item.checked) {
            const div = boxTarefa.lastElementChild;
            div.classList.add("checked");
        }
    });

    setInterval(() => {
        main.style.opacity = "1";
    }, 500);

    input.focus();
}

const mostrarEnaoMostrar = () => {
    form.classList.toggle("hidden");
    editForm.classList.toggle("hidden");
    boxTarefa.classList.toggle("hidden");
};

const editTarefas = (text) => {
    const div = boxTarefa.querySelector(".tarefa");
    const h3 = div.querySelector("h3");

    h3.innerText = text;

    arrTarefa = arrTarefa.map((item) => {
        if (item.tarefa === oldvalvue) {
            item.tarefa = text;
            localStorage.myarr = JSON.stringify(arrTarefa);
        }
        return item;
    });
};

//enventos
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    const { tarefa } = data;
    animarMain();
    cratTarefa(tarefa);
    saveStorage(data);

    input.value = "";
    input.focus();
});

document.addEventListener("click", (e) => {
    const element = e.target;
    const parent = element.closest("div");

    let title;

    if (parent && parent.querySelector("h3")) {
        title = parent.querySelector("h3").innerText;
    }

    if (element.classList.contains("check")) {
        parent.classList.toggle("checked");
        if (parent.classList.contains("checked")) {
            arrTarefa = arrTarefa.map((item) => {
                if (item.tarefa === title) {
                    item.checked = true;
                    localStorage.myarr = JSON.stringify(arrTarefa);
                }
                return item;
            });
        } else {
            arrTarefa = arrTarefa.map((item) => {
                if (item.tarefa === title) {
                    item.checked = false;
                    localStorage.myarr = JSON.stringify(arrTarefa);
                }
                return item;
            });
        }
    }

    if (element.classList.contains("edit")) {
        mostrarEnaoMostrar();
        animarMain();

        editInput.value = title;
        oldvalvue = title;
        console.log(oldvalvue);

        editInput.focus();
    }

    if (element.classList.contains("delete")) {
        const div = element.parentNode;

        remove(div);

        setTimeout(() => {
            parent.remove();
            animarMain();
            arrTarefa = arrTarefa.filter((item) => item.tarefa !== title);
            localStorage.myarr = JSON.stringify(arrTarefa);
        }, 500);
    }
});

cancalBtn.addEventListener("click", (e) => {
    e.preventDefault();

    mostrarEnaoMostrar();
    animarMain();
});

editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const editInputValue = editInput.value;

    if (editInputValue) {
        editTarefas(editInputValue);
    }

    mostrarEnaoMostrar();
    animarMain();
});
