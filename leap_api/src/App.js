import React from 'react';
import logo from './logo.svg';
import './App.css';
import List from './components/List';
import User from './components/User';


const superagent = require('superagent');
export default class App extends React.Component {

componentDidMount(){
  this.myFunc();
}
state = {
  listData: undefined,
  user: '',
  salary: '',
  job_title: '',
  company: '',
  hobby: '',
  show: undefined,

}

handleChange(name, e){
    var change = {};
    change[name] = e.target.value;
    this.setState(change);
  }


sendData = (e) => {
  e.preventDefault();
  const api_call = superagent.post('http://localhost:5000/inputData')
  .send({'name': this.state.user && this.state.user, 'salary': this.state.salary && this.state.salary,
    'job_title': this.state.job_title && this.state.job_title, 'hobby': this.state.hobby && this.state.hobby,
    'company': this.state.company && this.state.company, time: 0})
  .end((err, res) => {
    window.location.reload();
    return this.setState({show: false});
  })
}
myFunc = () => {
  const api_call = superagent.get('http://localhost:5000/financeData')
  .end((err, res) => {

    return this.setState({listData: res.body});
  });
}

show_form = () => {
  return this.setState({show: true})
}

 render() {
  return (
    <div>
    <button onClick={this.show_form.bind(this)}>Sign up</button>
    {this.state.show && <div>
    <form className="size" onSubmit={this.sendData.bind(this)}>
    <label>
    Name:
    <input type="text" onChange={this.handleChange.bind(this, 'user')} value={this.state.user} />
    <br></br>
    Salary:
    <input type="text" onChange={this.handleChange.bind(this, 'salary')} value={this.state.salary} />
    <br></br>
    Job title:
    <input type="text" onChange={this.handleChange.bind(this, 'job_title')} value={this.state.job_title} />
    <br></br>
    Company:
    <input type="text" onChange={this.handleChange.bind(this, 'company')} value={this.state.company} />
    <br></br>
    Favorite Hobby:
    <input type="text" onChange={this.handleChange.bind(this, 'hobby')} value={this.state.hobby} />
    <br></br>
    </label>
    <input type="submit" value="Submit" />
</form>

    <br></br>

    </div>}
        <List listData={this.state.listData} />
        <User data={this.state.listData} />
    </div>
      );
    }
}
      
