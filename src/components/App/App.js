import { TodoList } from 'components/ToDoList';
import { Component } from 'react';
import {
  Container,
  Header,
  Title,
  Btns,
  BtnPage,
  AddBtn,
  AddDelBtnWrap,
  Controls,
} from './App.styled';
import { FormAdd } from 'components/FormAdd/FormAdd';
import { GlobalStyle } from 'constants/GlobalStyle';
import { Modal } from 'components/Modal';

export class App extends Component {
  state = {
    todos: [],
    showModal: false,
    page: 'all',
  };

  componentDidMount() {
    const todos = JSON.parse(localStorage.getItem('todos'));
    if (todos !== null) {
      this.setState({ todos });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.todos !== this.state.todos) {
      localStorage.setItem('todos', JSON.stringify(this.state.todos));
    }
  }

  changePage = type => {
    this.setState({ page: type });
  };

  toggleModal = () =>
    this.setState(({ showModal }) => ({ showModal: !showModal }));

  onDeleteTodo = id =>
    this.setState(prevState => ({
      todos: prevState.todos.filter(todo => todo.id !== id),
    }));

  onCompletedTodo = id => {
    this.setState(prevState => ({
      todos: prevState.todos.map(todo => {
        if (todo.id === id) {
          return {
            ...todo,
            completed: !todo.completed,
            priority: false,
          };
        }
        return todo;
      }),
    }));
  };

  onHighPriorityTodo = id => {
    this.setState(prevState => ({
      todos: prevState.todos.map(todo => {
        if (todo.id === id) {
          return {
            ...todo,
            priority: !todo.priority,
          };
        }
        return todo;
      }),
    }));
  };

  fulfillmentCount = () =>
    this.state.todos.reduce(
      (acc, { completed }) => (completed ? acc : acc + 1),
      0
    );

  onChangeTodos = addsTodos => {
    this.setState(prevState => ({
      todos: [...prevState.todos, addsTodos],
    }));
  };

  render() {
    const { todos, showModal, page } = this.state;
    const fulfillmentCount = this.fulfillmentCount;
    const onChangeTodos = this.onChangeTodos;
    const onCompletedTodo = this.onCompletedTodo;
    const onHighPriorityTodo = this.onHighPriorityTodo;
    const onDeleteTodo = this.onDeleteTodo;
    const toggleModal = this.toggleModal;
    const changePage = this.changePage;

    return (
      <>
        <Header>
          <Container>
            <Title>To Do</Title>
            <div>
              <p>Загальна кількість: {todos.length}</p>
              <p>До виконання: {fulfillmentCount()}</p>
            </div>

            <Controls>
              <Btns>
                <BtnPage
                  type="button"
                  page={page}
                  onClick={() => {
                    changePage('all');
                  }}
                >
                  Всі
                </BtnPage>
                <BtnPage
                  type="button"
                  page={page}
                  onClick={() => {
                    changePage('active');
                  }}
                >
                  Активні
                </BtnPage>
                <BtnPage
                  page={page}
                  type="button"
                  onClick={() => {
                    changePage('completed');
                  }}
                >
                  Виконані
                </BtnPage>
              </Btns>

              <AddDelBtnWrap>
                <AddBtn type="button" onClick={toggleModal}>
                  Додати картку
                </AddBtn>
                <AddBtn type="button" onClick={toggleModal}>
                  Очистити все
                </AddBtn>
              </AddDelBtnWrap>
            </Controls>
          </Container>
        </Header>
        <Container>
          <TodoList
            todos={todos}
            page={page}
            onDeleteTodo={onDeleteTodo}
            onCompletedTodo={onCompletedTodo}
            onHighPriorityTodo={onHighPriorityTodo}
            onToggleModal={toggleModal}
          />
          {showModal && (
            <>
              <Modal toggleModal={toggleModal}>
                <FormAdd onChange={onChangeTodos}></FormAdd>
                <button type="button" onClick={toggleModal}>
                  Close
                </button>
              </Modal>
            </>
          )}
        </Container>
        <GlobalStyle />
      </>
    );
  }
}
