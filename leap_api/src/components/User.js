import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
const superagent = require('superagent');



export default class User extends React.Component {

	state = {
		user_id: undefined,
	}



	fetch_id = (id) => {
		this.setState({user_id: id})
		const fetch_id = superagent.post("http://localhost:5000/getID")
			.send({_id: this.state.user_id})
			.end((err, res) => {
				if(err) return console.log(err)
				console.log(res)
		})
	}



	render(){

		const data = this.props.data || [];
		console.log(data[0])
		

		return(

			<div>
			
			</div>

			);

	}

}