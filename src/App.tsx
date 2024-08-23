/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import cn from 'classnames';
import { FilterMethods } from './types/FilterMethods';
import { wait } from './utils/fetchClient';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeFilter, setActiveFilter] = useState(FilterMethods.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodosId, setLoadingTodosId] = useState<number[]>([]);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const fetchedTodos = await getTodos();

        setTodos(fetchedTodos);
      } catch (error) {
        setErrorMessage('Unable to load todos');
      }
    };

    fetchTodos();
  }, [setErrorMessage, setTodos]);

  useEffect(() => {
    if (errorMessage) {
      wait(3000).then(() => setErrorMessage(''));
    }
  }, [errorMessage]);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (activeFilter) {
        case FilterMethods.All:
          return todo;
        case FilterMethods.ACTIVE:
          return !todo.completed;
        case FilterMethods.COMPLETED:
          return todo.completed;
        default:
          return todo;
      }
    });
  }, [todos, activeFilter]);

  const handleOnClickHideError = () => setErrorMessage('');

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setErrorMessage={setErrorMessage}
          setTempTodo={setTempTodo}
          setTodos={setTodos}
          todos={todos}
          errorMessage={errorMessage}
          setLoadingTodosId={setLoadingTodosId}
          loadingTodosId={loadingTodosId}
          editingTodo={editingTodo}
        />

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList
            setTodos={setTodos}
            setErrorMessage={setErrorMessage}
            filteredTodos={filteredTodos}
            todos={todos}
            tempTodo={tempTodo}
            setLoadingTodosId={setLoadingTodosId}
            loadingTodosId={loadingTodosId}
            setEditingTodo={setEditingTodo}
            editingTodo={editingTodo}
          />
        </section>
        <Footer
          todos={todos}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          setLoadingTodosId={setLoadingTodosId}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
        />
      </div>
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleOnClickHideError}
        />
        {errorMessage}
      </div>
    </div>
  );
};
