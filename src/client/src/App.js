import React, { useState, useEffect } from 'react';
import './materialize.scss';

import TodoItem from './components/TodoItem';

import M from 'materialize-css';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState([]);
  const [addNewInputText, setAddNewInputText] = useState('');

  const updateTodos = () => {
    fetch('/api/getTodos').then((value) => {
      value.json().then((value) => {
        setTodos(value);
      });
    });
  };
  const addTodo = (text) => {
    fetch('/api/addTodo', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({ title: text }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    updateTodos();
  };
  const removeTodo = (id) => {
    fetch('/api/removeTodo', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        criteria: { _id: id },
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    updateTodos();
  };
  const handleClick = (name, id, text) => {
    if (name === 'remove') {
      removeTodo(id);
    } else if (name === 'add') {
      addTodo(text);
    }
  };

  useEffect(() => {
    M.AutoInit();
    fetch('/api/getTodos').then((value) => {
      value.json().then((value) => {
        setTodos(value);
        setLoading(false);
      });
    });
  }, []);

  const todosList = todos.map((item) => {
    return (
      <TodoItem
        key={item._id}
        item={item}
        handleChange={(id) => {
          let completed = false;
          for (let i = 0; i < todos.length; ++i) {
            if (todos[i]._id === id) completed = !todos[i].completed;
          }

          fetch('/api/updateTodo', {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({
              criteria: { _id: id },
              completed: completed,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          }).then(() => updateTodos());
        }}
        handleClick={handleClick}
        updateTodos={updateTodos}
      />
    );
  });
  return (
    <div className="todo-list">
      {loading ? 'Loading...' : todosList}
      <div className="todo-item">
        <input
          type="text"
          value={addNewInputText}
          onChange={(event) => {
            setAddNewInputText(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.keyCode === 13) {
              addTodo(addNewInputText, setTodos);
              setAddNewInputText('');
            }
          }}
        />
        <button
          style={{ marginLeft: 'auto' }}
          className="btn btn-small btn-floating waves-effect waves-light red"
          onClick={() => {
            handleClick('add', undefined, addNewInputText);
            setAddNewInputText('');
          }}
        >
          <i className="material-icons">add</i>
        </button>
      </div>
    </div>
  );
};

export default App;
