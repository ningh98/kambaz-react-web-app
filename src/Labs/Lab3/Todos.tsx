/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";

export default function Todos() {
    const { todos } = useSelector((state: any) => state.todosReducer);
  return (
    <div>
        <ul className="list-group">
        {todos.map((todo: any) => (
          <li className="list-group-item" key={todo.id}>
            {todo.title}
          </li>
        ))}
      </ul>
      <hr />
    </div>
  )
}
