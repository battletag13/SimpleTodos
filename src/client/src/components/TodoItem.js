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
        className="reset-checkbox"
        type="checkbox"
        checked={props.item.completed}
        onChange={() => props.handleChange(props.item._id)}
      />
      <p style={props.item.completed ? completedStyles : null}>
        {props.item.title}
      </p>
      <button
        style={{ marginLeft: 'auto' }}
        className="btn btn-small btn-floating waves-effect waves-light red"
        onClick={() => {
          props.handleClick('remove', props.item._id, undefined);
          props.updateTodos();
        }}
      >
        <i className="material-icons">remove</i>
      </button>
    </div>
  );
}

export default TodoItem;
