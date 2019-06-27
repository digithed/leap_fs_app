import SearchField from "react-search-field";
import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import {Facebook, Twitter} from 'react-sharingbuttons';
import 'react-sharingbuttons/dist/main.css'

const superagent = require('superagent');

export default class List extends React.Component {

	state = {
		api_data: undefined,
		api_data2: undefined,
		api_data3: undefined,
		api_data4: undefined,
		data: undefined,
		time: undefined,
		time_acc: 0,
		user_time: undefined,		
		user_id: undefined,		
	}

	lookup = (a,job, hobby, company, id) => {

		this.setState({user_id: id})
		
		let job_link = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${job}&api-key=null`
		let hobby_link = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${hobby}&api-key=null`
		let company_link = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${company}&api-key=null`
		let both_link = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${job}+${hobby}&api-key=null`
		
		if(this.state.api_data == undefined && a==1) superagent.get(job_link)
		.end((err, res) => {
			if(err) return console.log(err);

			this.setState({api_data: res.body.response.docs});
		})
		if(this.state.api_data2 == undefined && a==2) superagent.get(hobby_link)
		.end((err, res) => {
			if(err) return console.log(err);
			this.setState({api_data2: res.body.response.docs});
		})
		if(this.state.api_data3 == undefined && a==3) superagent.get(both_link)
		.end((err, res) => {
			if(err) return console.log(err);
			this.setState({api_data3: res.body.response.docs});
		})

		if(this.state.api_data4 == undefined && a==4) superagent.get(company_link)
		.end((err, res) => {
			if(err) return console.log(err);
			this.setState({api_data4: res.body.response.docs});
		})

		this.setState({api_data: undefined})
		this.setState({api_data2: undefined})
		this.setState({api_data3: undefined})
		this.setState({api_data4: undefined})
	}

	check = (a1,a2,a3) => {

		let newArr = [];

		a1.map((item, index) => newArr.push(item.web_url))
		a2.map((item, index) => newArr.push(item.web_url))
		a3.map((item, index) => newArr.push(item.web_url))

		let unique = [...new Set(newArr)];
		return unique

	}

	set_search(name, value){
		let state = this.state
		state[name] = value
		this.setState({state})
		
	}



	timer_func = (link) => {
		
		var windowObjRef = window.open(link);
		console.log(windowObjRef)
			if(windowObjRef.window){
			console.log('starttttt')
			this.setState({
			start: Date.now(),
			timer_on: true,
			});
			
			};

		var timer = setInterval(() => {
        if (windowObjRef.closed) {
           let end = Date.now() - this.state.start
			let time_read = end/1000
			

			this.setState({time_acc: this.state.time_acc + time_read})
			clearInterval(timer);
			console.log(this.state.time_acc)
			const post_time = superagent.post('http://localhost:5000/timePost')
			.send({_id: this.state.user_id, time: this.state.time_acc})
			.end((err, res) => {
				if(err) return console.log(err)
			})
			


			}     
    }, 500);


		}	
		

	set_time = (time) => {
		
		return this.setState({time_acc: time})
	}	
		
	

	render() {

  		const url = 'https://github.com/caspg/react-sharingbuttons'
  		const shareText = `Nick's total time reading the NYT: ${this.state.time_acc}`

  		

		const data = this.props.listData || [];
		const api_data = this.state.api_data || [];
		const api_data2 = this.state.api_data2 || [];
		const api_data3 = this.state.api_data3 || [];
		const api_data4 = this.state.api_data4 || [];


		

		var myStyle = {
    	width: '18rem',

		}
		var padding = {
			'padding-right': '10px',
		}

		// let final_arr = this.check(api_data,api_data2,api_data3);
		// console.log(api_data.length)
		// console.log(final_arr.length)
	
		
	
		return(

			<div>


			<Facebook url={'https://www.indeed.co.uk/jobs?q=junior+developer&l=London'} />
			<SearchField
				placholder= "Search user"
				onChange={this.set_search.bind(this, 'search')}
				searchText={this.state.search}
				/>
			{data.map((item, index) => this.state.search == item.name && <p  onMouseOver={this.set_time.bind(this, item.time)} className="center" key={index}><p className="center">Time Read:<br></br>Hours: {Math.round(item.time/60/60)}<br></br>
			 Minutes:{Math.round(item.time/60)}<br></br>
			 seconds: {Math.round(item.time)}</p><br></br>Name: {item.name}<br></br> salary: {item.salary}<br></br>
				job: {item.job_title}<br></br> company: {item.company}<br></br> hobby: {item.hobby}<br></br>
				<br></br>
				<div>
				<label style={this.padding}> Job
				<input type="checkbox" onClick={this.lookup.bind(this, 1, item.job_title, item.hobby, item.company, item._id)} />
				</label>
				<label> Company
				<input type="checkbox" onClick={this.lookup.bind(this, 4, item.job_title, item.hobby, item.company, item._id)} />
				</label>
				<label> Hobby
				<input type="checkbox" onChange={this.lookup.bind(this, 2, item.job_title, item.hobby, item.company, item._id)} />
				</label>
				<label> Both
				<input type="checkbox" onChange={this.lookup.bind(this, 3, item.job_title, item.hobby, item.company, item._id)} />
				</label>
				</div>
				
				</p>)}
			
				{api_data.map((item, index) => <div className="card" style={this.myStyle}><ul className="list-group list-group-flush"><li onClick={this.timer_func.bind(this, item.web_url)} key={index} className="list-group-item"><a>{item.headline.main}</a></li></ul></div>)}
				{api_data2.map((item, index) => <div className="card" style={this.myStyle}><ul className="list-group list-group-flush"><li key={index} className="list-group-item"><a href={item.web_url}>{item.headline.main}</a></li></ul></div>)}
				{api_data3.map((item, index) => <div className="card" style={this.myStyle}><ul className="list-group list-group-flush"><li key={index} className="list-group-item"><a href={item.web_url}>{item.headline.main}</a></li></ul></div>)}
				{api_data4.map((item, index) => <div className="card" style={this.myStyle}><ul className="list-group list-group-flush"><li key={index} className="list-group-item"><a href={item.web_url}>{item.headline.main}</a></li></ul></div>)}
				
			


			</div>


			);
	}
}
