/* eslint-disable @typescript-eslint/no-explicit-any */
import TodoForm from "./TodoForm";
import TodoItem from "./TodoItem";
import { useSelector } from "react-redux";
export default function Todolist() {
    const { todos } = useSelector((state: any) => state.todosReducer);

    
    return (
        <div>
      <h2>Todo List</h2>
      <ul className="list-group">
        <TodoForm />
        {todos.map((todo: any) => (
          <TodoItem todo={todo} />
        ))}
      </ul>
      <hr/>
    </div>
    );
}