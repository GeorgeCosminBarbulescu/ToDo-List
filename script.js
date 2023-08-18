'use strict';

// This is the array that will hold the todo list items
let todoItems = [];

const renderTodo = function (todo) {
  localStorage.setItem('todoItemsRef', JSON.stringify(todoItems));
  const list = document.querySelector('.js-todo-list');
  // Select the first element with a class of `js-todo-list`
  const item = document.querySelector(`[data-key='${todo.id}']`);

  if (todo.deleted) {
    // remove the item from the DOM
    item.remove();
    // when `todoItems` is empty
    if (todoItems.length === 0) list.innerHTML = '';
    return;
  }

  const isChecked = todo.checked ? 'done' : '';
  const node = document.createElement('li');
  node.setAttribute('class', `todo-item ${isChecked}`);
  node.setAttribute('data-key', todo.id);
  node.innerHTML = `
    <input id="${todo.id}" type="checkbox"/>
    <span class="created-at">Date, time: ${todo.createdAt}</span>
    <br>
    <span>${todo.text}</span>
    <label for="${todo.id}" class="tick js-tick"></label>
    <button class="delete-todo js-delete-todo">
    <svg><use href="#delete-icon"></use></svg>
    </button>
  `;

  // If the item already exists in the DOM
  if (item) {
    // replace it
    list.replaceChild(node, item);
  } else {
    list.append(node);
  }
};

// declare function that will create a new todo object based on the text that was entered in the text input area, and push it into the array `todoItems`
const addTodo = function (text) {
  const todo = {
    text,
    checked: false,
    id: Date.now(),
    createdAt: new Date().toLocaleString(), // Add current date and time
  };

  todoItems.push(todo);
  renderTodo(todo);
};

const toggleDone = function (key) {
  const index = todoItems.findIndex(item => item.id === Number(key));
  // Locate the todo item in the `todoItems` array and set its checked property to opposite state. So this means that `true` will become `false` and `false` will become `true`.
  todoItems[index].checked = !todoItems[index].checked;
  renderTodo(todoItems[index]);
};

const deleteTodo = function (key) {
  // find the corresponding todo object in the todoItems array
  const index = todoItems.findIndex(item => item.id === Number(key));

  // Create new object with properties of the current todo item and also a property `deleted` which is set to true
  const todo = {
    deleted: true,
    ...todoItems[index],
  };

  // remove todo item by filtering it out from the array
  todoItems = todoItems.filter(item => item.id !== Number(key));
  renderTodo(todo);
};

// Select the form element
const form = document.querySelector('.js-form');

// Add a submit event listener
form.addEventListener('submit', event => {
  // prevent page refresh on form submission
  event.preventDefault();

  // select the text input
  const input = document.querySelector('.js-todo-input');

  // Get the value of the input and remove whitespace
  const text = input.value.trim();
  if (text !== '') {
    addTodo(text);
    input.value = '';
    input.focus();
  }

  // Select the entire list
  const list = document.querySelector('.js-todo-list');

  // Add a click event listener to the list and its children
  list.addEventListener('click', event => {
    if (event.target.classList.contains('js-tick')) {
      const itemKey = event.target.parentElement.dataset.key;
      toggleDone(itemKey);
    }

    if (event.target.classList.contains('js-delete-todo')) {
      const itemKey = event.target.parentElement.dataset.key;
      deleteTodo(itemKey);
    }
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const ref = localStorage.getItem('todoItemsRef');
  if (ref) {
    todoItems = JSON.parse(ref);
    todoItems.forEach(t => {
      renderTodo(t);
    });
  }
});
