import React, { useState, useEffect } from 'react';

import TodoItem from './components/TodoItem';

function updateList(setTodos) {
  fetch('/api/getTodos').then((value) => {
    value.json().then((value) => {
      setTodos(value);
    });
  });
}

const App = () => {
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
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
          }).then(() => updateList(setTodos));
        }}
      />
    );
  });
  return <div className="todo-list">{loading ? 'Loading...' : todosList}</div>;
};

export default App;
