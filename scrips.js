const form = document.querySelector("form");
const editForm = document.querySelector("#edit_form");
const input = document.querySelector("#id_tarefa");
const editInput = document.querySelector("#id_tarefa_edit");
const boxTarefa = document.querySelector(".mostrar");
const cancalBtn = document.querySelector("#cancel_btn");
const main = document.querySelector("main");
const search = document.querySelector("#search_tarefa");
const menuRigth = document.querySelector(".more_opition_for_tasks_rigth");
const btnDelete = document.querySelector(".delete");
const btnEdit = document.querySelector(".edit");
const tarefasFeitas = document.querySelector(".feitas");

let arrTarefa = [];
let tarefas = [];
let oldvalvue = "";

const criarTarefa = (text) => {
  const divTarefa = document.createElement("div");
  divTarefa.classList.add("tarefa");

  boxTarefa.appendChild(divTarefa);

  divTarefa.classList.add("visible");

  const checkBtn = document.createElement("button");
  checkBtn.classList.add("check");
  checkBtn.innerHTML =
    '<span class="material-symbols-outlined">radio_button_unchecked</span>';
  divTarefa.appendChild(checkBtn);

  const textoTarefa = document.createElement("h3");
  textoTarefa.innerText = text;
  divTarefa.appendChild(textoTarefa);

  const divStar = document.createElement("div");
  divStar.classList.add("star");
  divStar.innerHTML = '<span class="material-symbols-outlined"> star </span>';
  divTarefa.appendChild(divStar);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit");
  editBtn.innerHTML = '<span class="material-symbols-outlined"> edit </span>';

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete");
  deleteBtn.innerHTML =
    '<span class="material-symbols-outlined"> delete </span>';

  tarefas.push(divTarefa);
};

const salvarNoLocalStorage = (data) => {
  if (localStorage.myarr) {
    arrTarefa = JSON.parse(localStorage.getItem("myarr"));
  }

  arrTarefa.push(data);
  localStorage.myarr = JSON.stringify(arrTarefa);
  return arrTarefa;
};

function carregarPagina() {
  if (localStorage.myarr) {
    arrTarefa = JSON.parse(localStorage.getItem("myarr"));
  }
  arrTarefa.forEach((item) => {
    criarTarefa(item.tarefa);
    if (item.checked) {
      const div = boxTarefa.lastElementChild;
      div.classList.add("checked");
      tarefasFeitas.appendChild(div);
    }
  });

  input.focus();
  mostrarMenuDireita();
}

const mostrarMenuDireita = () => {
  const titleMenu = menuRigth.querySelector("nav h1");
  console.log(typeof titleMenu.textContent);
  if (titleMenu.textContent.trim() === "") {
    menuRigth.style.display = "none";
  }
};

const mostrarEnaoMostrar = () => {
  form.classList.toggle("hidden");
  editForm.classList.toggle("hidden");
  boxTarefa.classList.toggle("hidden");
  tarefasFeitas.classList.toggle("hidden");
  cancalBtn.classList.toggle("hidden");
  document.querySelector(".edit_form_buttons_save").classList.toggle("hidden")
  btnDelete.classList.toggle("hidden")
  btnEdit.classList.toggle("hidden")
};

const editTarefas = (text) => {
  const h3 = document.querySelectorAll(".tarefa h3");

  h3.forEach((tarefa) => {
    if (tarefa.textContent.trim() === oldvalvue) {
      tarefa.textContent = text;
    }
  });

  arrTarefa = arrTarefa.map((item) => {
    if (item.tarefa.trim() === oldvalvue) {
      item.tarefa = text;
      localStorage.myarr = JSON.stringify(arrTarefa);
    }
    return item;
  });
};

const searchFunction = () => {
  if (search.value !== "") {
    for (let tarefa of tarefas) {
      let title = tarefa.querySelector("h3");
      title = title.textContent.toLowerCase();
      let textOfSearch = search.value.toLowerCase();
      if (!title.includes(textOfSearch)) {
        tarefa.style.display = "none";
      } else {
        tarefa.style.display = "flex";
      }
    }
  } else {
    for (let tarefa of tarefas) {
      tarefa.style.display = "flex";
    }
  }
};

//enventos
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  const { tarefa } = data;
  criarTarefa(tarefa);
  salvarNoLocalStorage(data);

  input.value = "";
  input.focus();
});

document.addEventListener("click", (e) => {
  const element = e.target;
  const parent = element.closest("div");

  let title;

  if (parent && parent.querySelector("div h3")) {
    title = parent.querySelector("div h3").innerText;
  }

  if (element.closest(".tarefa") || element.closest("h3")) {
    const titleMenuRigth = menuRigth.querySelector("nav h1");
    titleMenuRigth.textContent = title;

    if (titleMenuRigth.textContent.trim() === title) {
      menuRigth.style.display = "flex";
    }
  }

  if (element.classList.contains("check")) {
    parent.classList.toggle("checked");

    if (parent.classList.contains("checked")) {
      tarefasFeitas.appendChild(parent);
      parent.querySelector(
        "button"
      ).innerHTML = `<span class="material-symbols-outlined"> radio_button_checked </span>`;

      arrTarefa = arrTarefa.map((item) => {
        if (item.tarefa === title) {
          item.checked = true;
          localStorage.myarr = JSON.stringify(arrTarefa);
          if (item.checked === true) {
            tarefasFeitas.appendChild(parent);
          }
        }
        return item;
      });
    } else {
      boxTarefa.appendChild(parent);

      parent.querySelector("button").innerHTML =
        '<span class="material-symbols-outlined">radio_button_unchecked</span>';

      arrTarefa = arrTarefa.map((item) => {
        if (item.tarefa === title) {
          item.checked = false;
          localStorage.myarr = JSON.stringify(arrTarefa);
        }
        return item;
      });
    }
  }
});

cancalBtn.addEventListener("click", (e) => {
  e.preventDefault();

  mostrarEnaoMostrar();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const editInputValue = editInput.value;

  if (editInputValue) {
    editTarefas(editInputValue);
  }

  mostrarEnaoMostrar();
});

btnDelete.addEventListener("click", () => {
  const tituloMenuDireita = menuRigth.querySelector("nav h1").textContent;
  const tituloTarefas = document.querySelectorAll(".tarefa h3");

  tituloTarefas.forEach((tarefas) => {
    if (tarefas.textContent.trim() === tituloMenuDireita.trim()) {
      tarefas.parentNode.remove();
    }
  });

  setTimeout(() => {
    arrTarefa = arrTarefa.filter(
      (item) => item.tarefa.trim() !== tituloMenuDireita
    );
    localStorage.myarr = JSON.stringify(arrTarefa);
  }, 500);
});

btnEdit.addEventListener("click", () => {
  const tituloMenuDireita = menuRigth.querySelector("nav h1").textContent;

  mostrarEnaoMostrar();

  editInput.value = tituloMenuDireita.trim();
  oldvalvue = tituloMenuDireita.trim();

  editInput.focus();
});
search.addEventListener("input", searchFunction);
