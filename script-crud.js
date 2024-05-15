//botão add task
const btnAddTask = document.querySelector('.app__button--add-task');
const formAddTask = document.querySelector('.app__form-add-task');
const textarea = document.querySelector('.app__form-textarea');
const tasksUl = document.querySelector('.app__section-task-list');
const descriptionParagraph = document.querySelector('.app__section-active-task-description');
const btnRemoveCompleted = document.querySelector('#btn-remover-concluidas');
const btnRemoveAll = document.querySelector('#btn-remover-todas');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let selectedTask = null;
let selectedTaskLi = null;

function updateTasks () {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}

function addTaskElement(task) {
  const li = document.createElement('li');
  li.classList.add('app__section-task-list-item');

  const svg = document.createElement('svg');
  svg.innerHTML = `
  <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
      <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
  </svg>
  `
  const paragraph = document.createElement('p')
  paragraph.textContent = task.description;
  paragraph.classList.add('app__section-task-list-item-description')

  const button = document.createElement('button');
  const imgBtn = document.createElement('img');
  button.classList.add('app_button-edit');

  button.onclick = () => {
    //debugger
    const newDescription = prompt("Novo nome da tarefa");
    //console.log('nova descrição da tarefa: ', newDescription);
    if (newDescription) {
      paragraph.textContent = newDescription;
      task.description = newDescription;
      updateTasks();
    }
   
  }

  imgBtn.setAttribute('src', '/imagens/edit.png')

  button.append(imgBtn)

  li.append(svg)
  li.append(paragraph)
  li.append(button)

  if (task.complete) {
    li.classList.add('app__section-task-list-item-complete');
    button.setAttribute('disabled', 'disabled')
  } else { li.onclick = () => {
    document.querySelectorAll('.app__section-task-list-item-active')
      .forEach(element => {
        element.classList.remove('app__section-task-list-item-active')
      })
    if (selectedTask == task) {
      descriptionParagraph.textContent = ''
      selectedTask = null;
      selectedTaskLi = null;
      return
    }
    selectedTask = task;
    selectedTaskLi = li;
    descriptionParagraph.textContent = task.description;
    li.classList.add('app__section-task-list-item-active')
  }

  return li
}
}

btnAddTask.addEventListener('click', () => {
  formAddTask.classList.toggle('hidden')
});

formAddTask.addEventListener('submit', (event) => {
  event.preventDefault();
  const task = {
    description: textarea.value
  }
  tasks.push(task)
  const taskElement = addTaskElement(task)
  tasksUl.append(taskElement)
  localStorage.setItem('tasks', JSON.stringify(tasks))
  updateTasks();
  textarea.value = ''
  formAddTask.classList.add('hidden')
})

tasks.forEach(task => {
  const taskElement = addTaskElement(task);
  tasksUl.append(taskElement)
});

document.addEventListener('focoFinalizado', () => {
  if (selectedTask && selectedTaskLi) {
    selectedTaskLi.classList.remove('app__section-task-list-item-active');
    selectedTaskLi.classList.add('app__section-task-list-item-complete');
    selectedTaskLi.querySelector('button').setAttribute('disabled', 'disabled')
    selectedTask.complete = true
    updateTasks()
  }
})

const removeTasks = (completedOnly) => {
  const seletor = completedOnly ? '.app__section-task-list-item-complete' : '.app__section-task-list-item'
  document.querySelectorAll(seletor).forEach(element => {
    element.remove()
  })
  tasks = completedOnly ? tasks.filter(element => !element.complete) : []
  updateTasks()
}

btnRemoveCompleted.onclick = () => removeTasks(true)
btnRemoveAll.onclick = () => removeTasks(false)