import React from 'react';

function TodoItem(props) {
  const completedStyles = {
    textDecoration: 'line-through',
    fontStyle: 'italic',
    color: '#828282',
  };
  return (
    <div className="todo-item">
      <input
        type="checkbox"
        checked={props.item.completed}
        onChange={() => props.handleChange(props.item._id)}
      />
      <p style={props.item.completed ? completedStyles : null}>
        {props.item.title}
      </p>
    </div>
  );
}

export default TodoItem;
