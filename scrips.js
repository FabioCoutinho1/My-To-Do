const form = document.querySelector("form");
const main = document.querySelector("main");
const editForm = document.querySelector("#edit_form");
const input = document.querySelector("#id_task");
const editInput = document.querySelector("#id_task_edit");
const divTarefas = document.querySelector(".box_tasks");
const tarefaFilha = document.querySelector(".task");
const cancalBtn = document.querySelector(".btn_cancel");
const search = document.querySelector("#search_task");
const menuRigth = document.querySelector(".menu_rigth");
const menuLeft = document.querySelector(".menu_left");
const menuMid = document.querySelector(".mid_task");
const btnDelete = document.querySelector(".btn_delete");
const btnEdit = document.querySelector(".btn_edit");
const buttonSaveEdit = document.querySelector(".btn_save_edit");
const tarefasFeitas = document.querySelector(".done");
const btnCloseMenu = document.querySelector("#btn_close_menu");
const btnSandwich = document.querySelectorAll(".btn_sandwich");

let arrTarefa = [];
let tarefas = [];
let oldText = "";
let titleTask;

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

const mostrarMenuDireita = (text) => {
  const titleMenu = menuRigth.querySelector("nav h1");
  if (titleMenu.textContent.trim() === text) {
    menuRigth.classList.toggle("hidden");
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

  menuRigth.querySelector("nav h1").textContent = text;
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
  const tasks = menuMid.querySelectorAll(".task h3");
  if (search.value !== "") {
    console.log(tasks);
    tasks.forEach((element, idx) => {
      if (!element.textContent.includes(search.value)) {
        element.parentNode.classList.add("hidden");
      }
    });
  } else {
    tasks.forEach((element) => {
      element.parentNode.classList.remove("hidden");
    });
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

  if (parent && parent.querySelector("div h3")) {
    titleTask = parent.querySelector("div h3").innerText;
  }

  if (element.classList.contains(".task") || element.closest("h3")) {
    console.log(element);
    const titleMenuRigth = menuRigth.querySelector("nav h1");
    titleMenuRigth.textContent = titleTask;

    if (titleMenuRigth.textContent.trim() === titleTask) {
      mostrarMenuDireita(titleTask);
    }
  }

  if (element.classList.contains("btn_done")) {
    marcarTarefaFeita(element, titleTask);
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

  mostrarMenuDireita(titleTask);
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
  menuRigth.classList.toggle("hidden");
});

btnSandwich.forEach((element) => {
  element.addEventListener("click", (e) => {
    e.stopPropagation();
    menuLeft.classList.toggle("hidden");
    menuMid.classList.toggle("overlay");
  });
});

document.addEventListener("click", (e) => {
  if (!e.target.contains(menuLeft) && e.target !== btnSandwich) {
    menuLeft.classList.add("hidden");
    menuMid.classList.remove("overlay");
  }
});

window.visualViewport.addEventListener("resize", () => {
  main.style.height = `${window.visualViewport.height}px`;
  main.style.overflow = "hidden";
});
