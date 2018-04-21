import React, { Component } from 'react';
import './App.css';
import firebase, { auth, provider } from './firebase.js';


class App extends Component {

  constructor() {
    super();
    this.state = {
      todoName: '',
      workingOn: false,
      done: false,
      todoList: [],
      user: null
    }

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
        const todoListRef =  firebase.database().ref(`todo-list/${this.state.user.uid}`);
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
    });
  }

  handleStartWork = (todoItem) => {
    const todoItemRef = firebase.database().ref(`/todo-list/${this.state.user.uid}/${todoItem.id}`);
    todoItemRef.update({
      workingOn: true,
      done: false
    })
  }

  handleFinish = (todoItem) => {
    const todoItemRef = firebase.database().ref(`/todo-list/${this.state.user.uid}/${todoItem.id}`);
    todoItemRef.update({
      done: true
    });
  }
  
  handleDelete = (todoItem) => {
    const todoItemRef = firebase.database().ref(`/todo-list/${this.state.user.uid}/${todoItem.id}`);
    todoItemRef.remove();
  }
  
  handleDeleteAll() {
    const itemsRef = firebase.database().ref(`todo-list/${this.state.user.uid}`);
    itemsRef.remove();
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit = (e)  => {
    e.preventDefault();
    const itemsRef = firebase.database().ref(`todo-list/${this.state.user.uid}`);
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

  logout() {
    auth.signOut()
      .then(() => {
        this.setState({
          user: null
        });
      });
  }

  login() {
    auth.signInWithPopup(provider) 
      .then((result) => {
        const user = result.user;
        this.setState({
          user
        });
      });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to firebase Todo</h1>
          <div className="Authentication-wrapper">
          {this.state.user ?
            <button onClick={this.logout}>Log Out</button>                
            :
            <button onClick={this.login}>Log In</button>              
          }
        </div>
        </header>
        {this.state.user == null && <div>
          <section className='info'>
          <br/>
            <h2>Please, login to the app with the button above.</h2>
          </section>
        </div>}
        {this.state.user && <div>
        <section className='user-info'>
          <span>Logged as: {this.state.user.displayName}</span>
          <img src={this.state.user.photoURL} alt='profile'/>
        </section>
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
                  <li key={todoItem.id}>
                    <span className={"name " + (todoItem.done ? 'done' : '')}>{todoItem.todoName}</span>
                    <span className="state">{todoItem.done ? 'DONE' : (todoItem.workingOn ? 'DOING' : 'NOT STARTED')}</span>
                    <div className='buttons'>
                    {!todoItem.workingOn && !todoItem.done && <span onClick={() => this.handleStartWork(todoItem)}><i className="fas fa-hourglass-start"/></span>}
                    {todoItem.workingOn && !todoItem.done && <span onClick={() => this.handleFinish(todoItem)}><i className="fas fa-sync"/></span>}
                    {todoItem.workingOn && todoItem.done && <span onClick={() => this.handleStartWork(todoItem)}><i className="fas fa-check"/></span>}
                    <span onClick={() => this.handleDelete(todoItem)}><i className="fas fa-trash-alt"/></span>
                    </div>
                  </li>
                )
              })}
            </ul>
        </section>
        <section className='delete-all'>
            <span onClick={() => this.handleDeleteAll()}>DELETE ALL <span className='delete'><i className="fas fa-trash-alt"/></span></span>
        </section>
        </div>}
      </div>
    );
  }
}

export default App;
