import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import { Link } from 'react-router-dom';

import axios from 'axios';

import TaxOneRouters from './routes.js';

class App extends React.Component {
	
  constructor(props) {
    super(props);
    //alert("in Contructor");
    //alert("props:" + JSON.stringify(props));
    this.state = {name: 'HI FOLKS!'};
    this.OURnumbers = [1,2,3,4,5];
    this.state.numbers = this.OURnumbers;
    this.changeArray();
  };
  
  changeArray(){
    //this.state.numbers.push(this.state.numbers.length+1);
    this.OURnumbers.push(this.OURnumbers.length+1);
    this.setState({
      numbers: this.OURnumbers
    });
  }
  
  componentDidMount(){
    //alert("in componentDidMount");
    //setInterval(() => this.changeArray(), 3000);  
  }
  
  shouldComponentUpdate(){
    //alert("in shouldComponentUpdate()");
    return false;
  }

  componentDidUpdate(){
    //alert("in componentDidUpdate");
  }
  
  getSnapshotBeforeUpdate(){
    //alert("getSnapshotBeforeUpdate()");
  }
  
  componentWillUnmount(){
    //alert("componentWillUnmount()");
  }


  onOURClick = (id, e) => {
    alert("in onOURClick - id:" + id + " - e:" + e + " - this.state.customerName:" + this.state.customerName);
    this.forceUpdate();
    //axios.get("https://www.google.com")
    /*axios.get("http://localhost:8180/safxTables?justAssociated=false&page=0&size=10")
    .then( ( response ) => {
        alert("response:" + JSON.stringify(response));
    }).catch (e => {
        alert("error:" + e); 
    });*/
  }
  
  handleUpdate(field, value){
    this.setState({
        [field] : value
    });
  }
  
  render(){
    //alert("render");
	  return (
		<div className="App">
		  <div>Name:{this.state.name}</div>
      <div>Some value<input value={this.state.customerName} onChange={e => this.handleUpdate("customerName", e.target.value)}/></div>
      <div>Another value<input></input></div>
      <OURSelect values={this.state.numbers}></OURSelect>
      <button onClick={(e) => this.onOURClick(33, e)}>Click</button>
      <div>
        <TaxOneRouters/>
      </div>
		</div>
	  );
  }
}

export default App;

/*
      <div id="selectDiv">
      </div>
      
    let ele = document.getElementById("selectDiv");
    if (ele != null){
      ReactDOM.render(<OURSelect values={this.state.numbers}></OURSelect>, ele);
    }

*/


class OURSelect extends React.Component {
    
    constructor(props){
      super(props);
      this.state = {};
      //this.state.numbers = props.values; //[1,2,3,4,5];
      this.loadOptions();
    }
    
    loadOptions(){
      this.state.listItems = [];
      this.props.values.forEach((number) => 
        this.state.listItems.push(<option key={number}>{number}</option>)
      );
      //alert("this.state.listItems:" + JSON.stringify(this.state.listItems));
    }
    
    componentDidUpdate(){
      //alert("in OURSelect.componentDidUpdate:"); //+ JSON.stringify(this.props.values)
      this.loadOptions();
    }
    
    
    render (){
      return (
         <select>
          {this.state.listItems}
         </select>
      );
    }
}

