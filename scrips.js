const form = document.querySelector("form");
const editForm = document.querySelector("#edit_form");
const input = document.querySelector("#id_tarefa");
const editInput = document.querySelector("#id_tarefa_edit");
const divTarefas = document.querySelector(".mostrar");
const tarefaFilha = document.querySelector(".tarefa");
const cancalBtn = document.querySelector("#cancel_btn");
const main = document.querySelector("main");
const search = document.querySelector("#search_tarefa");
const menuRigth = document.querySelector(".more_opition_for_tasks_rigth");
const btnDelete = document.querySelector(".delete");
const btnEdit = document.querySelector(".edit");
const buttonSaveEdit = document.querySelector(".edit_form_buttons_save");
const tarefasFeitas = document.querySelector(".feitas");

let arrTarefa = [];
let tarefas = [];
let oldText = "";

const arrayMostrarNaoMostrar = [
  form,
  editForm,
  divTarefas,
  tarefasFeitas,
  cancalBtn,
  buttonSaveEdit,
  btnDelete,
  btnEdit,
];

function carregarPagina() {
  if (localStorage.myarr) {
    arrTarefa = JSON.parse(localStorage.getItem("myarr"));
  }
  arrTarefa.forEach((item) => {
    criarTarefa(item.tarefa);
    if (item.checked) {
      const div = divTarefas.lastElementChild;
      div.classList.add("checked");
      tarefasFeitas.appendChild(div);
    }
  });

  input.focus();
  mostrarMenuDireita();
}

const criarTarefa = (text) => {
  const tarefaClonada = tarefaFilha.cloneNode(true);
  tarefaClonada.querySelector("h3").textContent = text;
  tarefaClonada.style.display = "flex";
  divTarefas.appendChild(tarefaClonada);
};

const salvarNoLocalStorage = (data) => {
  if (localStorage.myarr) {
    arrTarefa = JSON.parse(localStorage.getItem("myarr"));
  }

  arrTarefa.push(data);
  localStorage.myarr = JSON.stringify(arrTarefa);
};

const mostrarMenuDireita = () => {
  const titleMenu = menuRigth.querySelector("nav h1");
  if (titleMenu.textContent.trim() === "") {
    menuRigth.style.display = "none";
  }
};

const mostrarEnaoMostrar = () => {
  arrayMostrarNaoMostrar.forEach((element) => {
    element.classList.toggle("hidden");
  });
};

const editTarefaDom = (text) => {
  const h3 = document.querySelectorAll(".tarefa h3");

  h3.forEach((tarefa) => {
    if (tarefa.textContent.trim() === oldText) {
      tarefa.textContent = text;
    }
  });
};

const editarTarefaStorage = (text) => {
  arrTarefa.map((element) => {
    if (element.tarefa.trim() === oldText) {
      element.tarefa = text;
    }

    localStorage.setItem("myarr", JSON.stringify(arrTarefa));
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

const marcarTarefaFeita = (botaDinamico, title) => {
  const paiBotao = botaDinamico.parentNode;
  paiBotao.classList.toggle("checked");

  if (paiBotao.classList.contains("checked")) {
    tarefasFeitas.appendChild(paiBotao);
    botaDinamico.innerHTML = `<span class="material-symbols-outlined"> radio_button_checked </span>`;
  } else {
    divTarefas.appendChild(paiBotao);
    botaDinamico.innerHTML = `<span class="material-symbols-outlined"> radio_button_unchecked </span>`;
  }

  arrTarefa = arrTarefa.map((element) => {
    if (element.tarefa === title) {
      element.checked = true;
      localStorage.setItem("myarr", JSON.stringify(arrTarefa));
    }
  });
};

//enventos
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  formData.append("checked", false);
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

  if (element.classList.contains("btn_checkd")) {
    marcarTarefaFeita(element, title);
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
    editTarefaDom(editInputValue);
    editarTarefaStorage(editInputValue);
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

  arrTarefa = arrTarefa.filter(
    (item) => item.tarefa.trim() !== tituloMenuDireita
  );
  localStorage.myarr = JSON.stringify(arrTarefa);
});

search.addEventListener("input", searchFunction);
