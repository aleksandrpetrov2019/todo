(function () {
  function createAppTitle(title) {
    let appTitle = document.createElement("h2");
    appTitle.innerHTML = title;
    return appTitle;
  }

  function createTodoItemForm() {
    let form = document.createElement("form");
    let input = document.createElement("input");
    let buttonWrapper = document.createElement("div");
    let button = document.createElement("button");

    form.classList.add("input-group", "mb-3");
    input.classList.add("form-control");
    input.placeholder = "Введите название нового дела";
    buttonWrapper.classList.add("input-group-append");
    button.classList.add("btn", "btn-primary");
    button.textContent = "Добавить дело";

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button,
    };
  }

  function createTodoList() {
    let list = document.createElement("ul");
    list.classList.add("list-group");
    return list;
  }

  function getTaskID(relativeID = 0) {
    return +new Date() + relativeID;
  }

  function createTodoItem(taskObj) {
    let item = document.createElement("li");
    let buttonGroup = document.createElement("div");
    let doneButton = document.createElement("button");
    let deleteButton = document.createElement("button");

    item.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );
    item.textContent = taskObj.Name;
    item.id = taskObj.taskID;

    buttonGroup.classList.add("btn-group", "btn-group-sm");
    doneButton.classList.add("btn", "btn-success");
    doneButton.textContent = "Готово";
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.textContent = "Удалить";

    if (taskObj.Done) {
      item.classList.add("list-group-item-success");
    }

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    return {
      item,
      doneButton,
      deleteButton,
    };
  }

  function createTodoApp(
    container,
    title = "Список дел",
    pageKey,
    tasks = JSON.parse(localStorage.getItem(pageKey))
  ) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();
    todoItemForm.button.setAttribute("disabled", "disabled");
    let localList = [];
    let deltaID = 0;
    if (
      JSON.parse(localStorage.getItem(pageKey)) !== tasks &&
      JSON.parse(localStorage.getItem(pageKey)) !== null
    ) {
      localList = JSON.parse(localStorage.getItem(pageKey));
    } else if (tasks !== null) {
      for (let task of tasks) {
        task.taskID = getTaskID(deltaID++);
        localList.push(task);
        localStorage.removeItem(pageKey);
        localStorage.setItem(pageKey, JSON.stringify(localList));
      }
    }

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    for (let task of localList) {
      let todoItem1 = createTodoItem(task);
      todoList.append(todoItem1.item);
      todoItem1.doneButton.addEventListener("click", function () {
        todoItem1.item.classList.toggle("list-group-item-success");
        task.Done = !task.Done;
        localStorage.removeItem(pageKey);
        localStorage.setItem(pageKey, JSON.stringify(localList));
      });
      todoItem1.deleteButton.addEventListener("click", function () {
        if (confirm("Вы уверены?")) {
          todoItem1.item.remove();
          localList.splice(localList.indexOf(task), 1);
          localStorage.removeItem(pageKey);
          localStorage.setItem(pageKey, JSON.stringify(localList));
        }
      });
    }

    todoItemForm.input.addEventListener("input", function () {
      if (todoItemForm.input.value) {
        todoItemForm.button.removeAttribute("disabled");
      } else {
        todoItemForm.button.setAttribute("disabled", "disabled");
      }
    });

    todoItemForm.form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!todoItemForm.input.value) {
        return;
      }

      let todoItem = createTodoItem({
        Name: todoItemForm.input.value,
        Done: false,
        taskID: getTaskID(),
      });
      todoList.append(todoItem.item);

      localList.push({
        Name: todoItemForm.input.value,
        Done: false,
        taskID: todoItem.item.id,
      });
      localStorage.removeItem(pageKey);
      localStorage.setItem(pageKey, JSON.stringify(localList));

      for (let task of localList) {
        if (todoItem.item.id === task.taskID) {
          todoItem.doneButton.addEventListener("click", function () {
            todoItem.item.classList.toggle("list-group-item-success");
            task.Done = !task.Done;
            localStorage.removeItem(pageKey);
            localStorage.setItem(pageKey, JSON.stringify(localList));
          });
          todoItem.deleteButton.addEventListener("click", function () {
            if (confirm("Вы уверены?")) {
              todoItem.item.remove();
              localList.splice(localList.indexOf(task), 1);
              localStorage.removeItem(pageKey);
              localStorage.setItem(pageKey, JSON.stringify(localList));
            }
          });
        }
      }

      todoItemForm.input.value = "";
      todoItemForm.button.setAttribute("disabled", "disabled");
    });
  }
  window.createTodoApp = createTodoApp;
})();
