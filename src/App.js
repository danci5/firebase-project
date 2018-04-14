import React, { Component } from 'react';
import './App.css';
import firebase from './firebase.js';

class App extends Component {

  constructor() {
    super();
    this.state = {
      todoName: '',
      workingOn: false,
      todoList: []
    }
  }

  componentDidMount() {
    const todoListRef =  firebase.database().ref('todo-list');
    todoListRef.on('value', snapshot => {
      const todoList = snapshot.val();
      let newTodoList = [];
      
      for(let todoItem in todoList) {
        newTodoList.push({
          id: todoItem,
          todoName: todoList[todoItem].todoName,
          workingOn: todoList[todoItem].workingOn
        })
      }

      this.setState({
        todoList: newTodoList
      });
    });
  
  }

  handleStartWork = (todoItem) => {
    const todoItemRef = firebase.database().ref(`/todo-list/${todoItem.id}`);
    todoItemRef.set({
      ...todoItem,
      workingOn: true
    })
  }

  handleFinish = (todoItem) => {
    const todoItemRef = firebase.database().ref(`/todo-list/${todoItem.id}`);
    todoItemRef.remove();
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit = (e)  => {
    e.preventDefault();
    const itemsRef = firebase.database().ref('todo-list');
    const todoItem = {
      todoName: this.state.todoName,
      workingOn: this.state.workingOn
    }
    itemsRef.push(todoItem);
    this.setState({
      todoName: '',
      workingOn: false
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to firebase Todo</h1>
        </header>
        <section className='add-item'>
            <form onSubmit={this.handleSubmit}>
              <input type="text" name="todoName" placeholder="What to do?" onChange={this.handleChange} value={this.state.todoName} />
              <button>Add Todo item</button>
            </form>
          </section>
          <section className='display-item'>
            <div className='wrapper'>
              <ul>
                {this.state.todoList.map(todoItem => {
                  return (
                    <li key={todoItem}>
                      <span>{todoItem.todoName}</span>
                      <span>{todoItem.workingOn ? 'DOING' : 'NOT STARTED'}</span>
                      {!todoItem.workingOn && <span onClick={() => this.handleStartWork(todoItem)}><i className="fas fa-hourglass-start"/></span>}
                      {todoItem.workingOn && <span onClick={() => this.handleFinish(todoItem)}><i className="fas fa-check"/></span>}
                    </li>
                  )
                })}
              </ul>
            </div>
          </section>
      </div>
    );
  }
}

export default App;
