import React from 'react';
import axios from 'axios';

import Pagination, { PaginationModel } from './commons/Pagination';

class Email extends React.Component {

  emailsBaseUrl = "http://localhost:8180/emails";
  notificationTypes = ['ALL', 'OK', 'ERROR'];

  constructor(props){
    super(props);
    this.state = {
      emailsFull : [],
      emails : [],
      email : { type : 'ALL' },
      pagination : new PaginationModel(),
      totalPages : 0
    };
  }
  
  componentDidMount = () => {
    this.loadEmails();
    this.loadNotificationTypesOptions();
  }
  
  loadNotificationTypesOptions = () => {
    let notificationTypesOptions = [];
    this.notificationTypes.forEach((notificationType) => {
      notificationTypesOptions.push(<option value={notificationType}>{notificationType}</option>);
    });
    this.state.notificationTypesOptions = notificationTypesOptions;
  }
  
  loadEmails = () => {
    axios.get(this.emailsBaseUrl + '?page=0&size=1000')
    .then ((response) => {
      this.state.emailsFull = response.data.content;
      //alert("this.state.emailsFull :" + this.state.emailsFull );
      this.state.totalPages = this.calcPages();
			this.state.emails = this.state.emailsFull.slice(0, this.state.pagination.size);
      this.setState({
        emails : this.state.emails,
        totalPages : this.state.totalPages
      });
    }).catch ((error)  => {
      alert("Error:" + error);
    });
  }
  
  calcPages = () => {
		let pages = Math.trunc(this.state.emailsFull.length / this.state.pagination.size);
		if (this.state.emailsFull.length%this.state.pagination.size != 0){
			pages++;
		}
		return pages;
	}
  
  updateEmailField = (name, e) => {
    this.state.email[name] = e.target.value;
    this.setState({
      email : this.state.email
    });
  }
  
  onAdd = () => {
		/*if (!this.valid()){
			alert("Todos os campos são oberigatório");
			return;
		}*/
		
		this.state.emailsFull.splice(0,0,this.state.email);
		this.state.email = { email: '', type : 'ALL' };
		this.state.totalPages = this.calcPages(); 
    this.setState({
      email : this.state.email,
      totalPages : this.state.totalPages
    });
		this.onPage(this.state.pagination.page);
	}
  
  onSave = () => {
		axios.post(this.emailsBaseUrl, this.state.emails)
		.then((response) => {
			alert("Email salvo com sucesso");
      this.loadEmails();
		}).catch((error) => {
			alert("Erro salvando email" + error);
		});
	}
  
  onPage = (page) => {
		if (page >= 0 && page < this.state.totalPages){
			this.state.pagination.page=page;
			let start = this.state.pagination.page*this.state.pagination.size;
			this.state.emails = this.state.emailsFull.slice(start, start + this.state.pagination.size);
      this.setState({
        emails : this.state.emails
      });
		}
	}
  
  onDelete = (id) => {
    axios.delete(this.emailsBaseUrl + `/${id}`)
		.then(() => {
			alert("Email excluido com sucesso");
			this.loadEmails();
		});
	}

  render(){
    return(
      <div className="local-card content">
        <div>
        {/*
          <!--h1>HI FOLKS</h1-->
        */}
          <div className="tltle">Notificações de Status de Processos</div>
          <div className="bordered">
              <div style={{margin:'17px 0 0 28px'}}>
              <div className="table-title">Emails</div>
              <div style={{margin: '5px 0 10px 0', width:'98%'}}>
                <table cellspacing="0" style={{width: '100%'}}>
                  <thead>
                    <td className="table-header" style={{width: '71%'}}>Email</td>
                    <td className="table-header" style={{width: '23%'}}>Tipo Notificação</td>
                    <td className="table-header" style={{width: '6%'}}></td>
                  </thead>
                  <tbody>
                    <tr className="t-row">
                      <td className="t-columns">
                        <input type="text" value={this.state.email.email} onChange={(e) => this.updateEmailField('email', e)} 
                          maxLength="60" size="50"/>
                      </td>
                      <td className="t-columns">
                        <select value={this.state.email.type} onChange={(e) => this.updateEmailField('type', e)} >
                          {this.state.notificationTypesOptions}
                        </select>
                      </td>
                      <td className="t-columns" style={{width: '10px', padding: '1px'}}>
                        <button onClick={this.onAdd}>Add</button>
                      </td>
                    </tr>
                    <EmailTableBody values={this.state.emails} onDelete={this.onDelete}/>
                  </tbody>
                </table>
                <div style={{display:'flex', marginLeft: '10px', marginTop:'5px'}}>
                  <div style={{width:'90%'}}></div>
                    <Pagination pagination={this.state.pagination} totalPages={this.state.totalPages} onPage={this.onPage} />
                </div>
              </div>
            </div>
            <div style={{width: '98%', direction: 'rtl', margin: '20px 0px 15px 0px'}}>
              <button onClick={this.onSave}>Save</button> 
            </div>
          </div>
        </div>
      </div>
    );
  }
  
}

class EmailTableBody extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      emailRows : []
    }
  }
  
  loadEmailRows = () => {
    let emailRows = [];
    for (let e of this.props.values){
      emailRows.push(
        <tr className="t-row">
          <td className="t-columns">{e.email}</td>
          <td className="t-columns">{e.type}</td>
          <td className="t-columns" style={{width: '10px', padding: '1px'}}>
            <button onClick={() => this.props.onDelete(e.id)} 
              style={{display: e.id != null ? 'block' : 'none'}}>Delete</button>
          </td>
        </tr>
      );
    }
    this.state.emailRows = emailRows;
  }
  
  render(){
    this.loadEmailRows();
    return (
      <>
      {this.state.emailRows}
      </>
    );
  }
}



export default Email;
