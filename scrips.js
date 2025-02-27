const form = document.querySelector("form");
const editForm = document.querySelector("#edit_form");
const input = document.querySelector("#id_task");
const editInput = document.querySelector("#id_task_edit");
const divTarefas = document.querySelector(".box_tasks");
const tarefaFilha = document.querySelector(".task");
const cancalBtn = document.querySelector(".btn_cancel");
const search = document.querySelector("#search_task");
const menuRigth = document.querySelector(".menu_rigth");
const btnDelete = document.querySelector(".btn_delete");
const btnEdit = document.querySelector(".btn_edit");
const buttonSaveEdit = document.querySelector(".btn_save_edit");
const tarefasFeitas = document.querySelector(".done");
const btnCloseMenu = document.querySelector("#btn_close_menu");

let arrTarefa = [];
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
    criarTarefa(item.task);
    if (item.checked) {
      const div = divTarefas.lastElementChild;
      div.classList.add("checked");
      tarefasFeitas.appendChild(div);
      div.querySelector(
        "button"
      ).innerHTML = `<span class="material-symbols-outlined"> radio_button_checked </span>`;
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
  const h3 = divTarefas.querySelectorAll(".task h3");

  h3.forEach((task) => {
    if (task.textContent.trim() === oldText) {
      task.textContent = text;
    }
  });
};

const editarTarefaStorage = (text) => {
  arrTarefa.map((element) => {
    if (element.task.trim() === oldText) {
      element.task = text;
    }

    localStorage.setItem("myarr", JSON.stringify(arrTarefa));
  });
};

const searchFunction = () => {
  if (search.value !== "") {
    for (let task of tarefas) {
      let title = task.querySelector("h3");
      title = title.textContent.toLowerCase();
      let textOfSearch = search.value.toLowerCase();
      if (!title.includes(textOfSearch)) {
        task.style.display = "none";
      } else {
        task.style.display = "flex";
      }
    }
  } else {
    for (let task of tarefas) {
      task.style.display = "flex";
    }
  }
};

const marcarTarefaFeita = (botaDinamico, title) => {
  const paiBotao = botaDinamico.parentNode;
  const estaMaracado = paiBotao.classList.toggle("checked");

  if (estaMaracado) {
    tarefasFeitas.appendChild(paiBotao);
    botaDinamico.innerHTML = `<span class="material-symbols-outlined"> radio_button_checked </span>`;
  } else {
    divTarefas.appendChild(paiBotao);
    botaDinamico.innerHTML = `<span class="material-symbols-outlined"> radio_button_unchecked </span>`;
  }

  arrTarefa = JSON.parse(localStorage.getItem("myarr"));
  arrTarefa = arrTarefa.map((element) => {
    if (element.task === title) {
      return { ...element, checked: estaMaracado };
    }
    return element;
  });

  localStorage.setItem("myarr", JSON.stringify(arrTarefa));
};

//enventos
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = {
    task: input.value.trim(),
    checked: false,
  };

  const { task } = data;
  criarTarefa(task);
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

  if (element.closest(".task") || element.closest("h3")) {
    const titleMenuRigth = menuRigth.querySelector("nav h1");
    titleMenuRigth.textContent = title;

    if (titleMenuRigth.textContent.trim() === title) {
      menuRigth.style.display = "flex";
    }
  }

  if (element.classList.contains("btn_done")) {
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
  const tituloTarefas = document.querySelectorAll(".task h3");

  tituloTarefas.forEach((tarefas) => {
    if (tarefas.textContent.trim() === tituloMenuDireita.trim()) {
      tarefas.parentNode.remove();
    }
  });

  arrTarefa = arrTarefa.filter(
    (item) => item.task.trim() !== tituloMenuDireita
  );
  localStorage.myarr = JSON.stringify(arrTarefa);
});

btnEdit.addEventListener("click", () => {
  const tituloMenuDireita = menuRigth.querySelector("nav h1").textContent;

  mostrarEnaoMostrar();

  editInput.value = tituloMenuDireita.trim();
  oldText = tituloMenuDireita.trim();

  editInput.focus();
});

search.addEventListener("input", searchFunction);

btnCloseMenu.addEventListener("click", () => {
  menuRigth.style.display = "none";
});
