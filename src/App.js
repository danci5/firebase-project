import React, { Component } from 'react';
import './App.css';
import firebase from './firebase.js';

class App extends Component {

  constructor() {
    super();
    this.state = {
      todoName: '',
      workingOn: false,
      done: false,
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
          workingOn: todoList[todoItem].workingOn,
          done: todoList[todoItem].done
        })
      }

      this.setState({
        todoList: newTodoList
      });
    });
  
  }

  handleStartWork = (todoItem) => {
    const todoItemRef = firebase.database().ref(`/todo-list/${todoItem.id}`);
    todoItemRef.update({
      workingOn: true,
      done: false
    })
  }

  handleFinish = (todoItem) => {
    const todoItemRef = firebase.database().ref(`/todo-list/${todoItem.id}`);
    todoItemRef.update({
      done: true
    });
  }
  
  handleDelete = (todoItem) => {
    const todoItemRef = firebase.database().ref(`/todo-list/${todoItem.id}`);
    todoItemRef.remove();
  }
  
  handleDeleteAll() {
    const itemsRef = firebase.database().ref('todo-list');
    itemsRef.remove();
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
            <ul>
              {this.state.todoList.map(todoItem => {
                return (
                  <li key={todoItem}>
                    <span className={"name " + (todoItem.done ? 'done' : '')}>{todoItem.todoName}</span>
                    <span className="state">{todoItem.done ? 'DONE' : (todoItem.workingOn ? 'DOING' : 'NOT STARTED')}</span>
                    {!todoItem.workingOn && !todoItem.done && <span onClick={() => this.handleStartWork(todoItem)}><i className="fas fa-hourglass-start"/></span>}
                    {todoItem.workingOn && !todoItem.done && <span onClick={() => this.handleFinish(todoItem)}><i className="fas fa-sync"/></span>}
                    {todoItem.workingOn && todoItem.done && <span onClick={() => this.handleStartWork(todoItem)}><i className="fas fa-check"/></span>}
                    <span onClick={() => this.handleDelete(todoItem)}><i className="fas fa-trash-alt"/></span>
                  </li>
                )
              })}
            </ul>
        </section>
        <section className='delete-all'>
            <span onClick={() => this.handleDeleteAll()}>DELETE ALL <i className="fas fa-trash"/></span>
        </section>
      </div>
    );
  }
}

export default App;
