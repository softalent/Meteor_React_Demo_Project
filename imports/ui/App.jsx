import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';

import {createContainer} from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks.js';

import Task from './Task.jsx';

class App extends Component{
	constructor(props){
		super(props);
		this.state = {
			hideCompleted:false
		}
	}
	handleSubmit(event){
		event.preventDefault();
		const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
		Tasks.insert({
			text,
			createdAt:new Date(),
		});
		ReactDOM.findDOMNode(this.refs.textInput).value='';
	}

	toggleHideCompleted(event){
		//event.preventDefault();
		this.setState({
			hideCompleted: !this.state.hideCompleted
		});
	}

	renderTasks(){
		let filteredTasks = this.props.tasks;
		console.log('before filter');
		console.log(filteredTasks);
		// console.log(task.checked);
		if(this.state.hideCompleted){
			filteredTasks = filteredTasks.filter(task => !task.checked);
		}
		console.log('after filtered');
		console.log(filteredTasks);
		return filteredTasks.map((task)=>(
			<Task key={task._id} task={task}/>
		));
	}
	render(){
		return(
			<div className="container">
				<header>
					<h1>Todo List</h1>
					<label className='hide-completed'>
						<input 
							type='checkbox'
							readOnly
							checked={this.state.hideCompleted}
							onClick={this.toggleHideCompleted.bind(this)}
						/>
							Hide Completed Tasks
					</label>
					<form className='new-task' onSubmit={this.handleSubmit.bind(this)} >
						<input
							type = 'text'
							ref = 'textInput'
							placeholder = 'type to add new tasks'
						/> 
					</form>
				</header>
				<ul>
					{this.renderTasks()}
				</ul>
			</div>);
	}
}

App.propTypes = {
	tasks: PropTypes.array.isRequired,
};

export default createContainer(()=>{
	return {
		tasks: Tasks.find({},{sort:{createdAt:-1}}).fetch(),
	};
}, App);