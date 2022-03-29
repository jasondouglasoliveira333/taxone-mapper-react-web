import React from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import Pagination, { PaginationModel } from './commons/Pagination'

class ScheduleListInner extends React.Component {
  
  scheduleBaseUrl = "http://localhost:8180/schedules";
  
  constructor(props){
    super(props);
    this.state = {
      pagination : new PaginationModel(),
      totalPages : 0
    };
    //this.state.pagination.size = 2;
  }
  
  onAdd = () => {
    alert("in onAdd");
    this.props.navigate('/schedule');
  }
  
  componentDidMount = () => {
    this.loadSchedules();
  }

  loadSchedules = () => {
    axios.get(this.scheduleBaseUrl + `?page=${this.state.pagination.page}&size=${this.state.pagination.size}`)
    .then((response) => {
      this.setState({
        schedules : response.data.content,
        totalPages : response.data.totalPages
      });
    }).catch((error) => {
      alert("Error getting schedule:" + error);
    });
  }
  
  onPage = (page) => {
    //alert("onPage:" + page);
    if (page >= 0 && page < this.state.totalPages){
      this.state.pagination.page=page;
      this.loadSchedules();
      //to update pagination component
      this.setState({ 
        pagination: this.state.pagination
      });
    }
  }
  
  render(){
    return (
      <div className="local-card content">
        <div>
          <div className="tltle">Agendamentos</div>
          <div className="bordered">
            <div style={{display: 'flex', margin:'20px 0 0 13px'}}>
              <div style={{width: '98%'}}>
                <div style={{display:'flex'}}>
                  <div className="table-title" style={{padding: '0px 8px 6px 0px'}}>Agendamentos</div>
                  <button onClick={this.onAdd} style={{marginLeft: '81%', padding: '1px 6px 1px 6px'}}>Adicionar</button>
                </div>
                <div style={{margin: '5px 0 10px 0', width:'100%'}}>
                  <table cellspacing="0" style={{width: '100%'}}>
                    <thead>
                      <td className="table-header" style={{padding: '0px 0 0 5px'}}>Nome</td>
                      <td className="table-header">Usuário</td>
                      <td className="table-header">Status</td>
                      <td className="table-header" style={{width: '6%'}}></td>
                      <td className="table-header" style={{width: '6%'}}></td>
                    </thead>
                    <ScheduleListTableBody value={this.state.schedules} navigate={this.props.navigate}/>
                  </table>
                  <div style={{display:'flex', marginLeft: '10px', marginTop:'5px'}}>
                    <div style={{width:'90%'}}></div>
                    <Pagination pagination={this.state.pagination} totalPages={this.state.totalPages} onPage={this.onPage} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class ScheduleListTableBody extends React.Component {
  
  scheduleBaseUrl = "http://localhost:8180/schedules";
  
  constructor(props){
    super(props);
    this.state = {};
  }
  
  loadScheduleList = () => {
    let schedules = [];
    if (this.props.value){
      this.props.value.forEach((schedule) => {
        schedules.push(
          <tr className="t-row">
            <td className="t-columns">{schedule.name}</td>
            <td className="t-columns">{schedule.userName}</td>
            <td className="t-columns">{schedule.status == 'ACTIVE' ? 'Ativo' : 'Inativo'}</td>
            <td className="t-columns" style={{padding: '1px'}}>
              <button onClick={() => this.onEdit(schedule.id)}>Editar</button>
            </td>
            <td className="t-columns" style={{padding: '1px'}}>
              <button onClick={() => this.onDelete(schedule.id)}>Excluir</button>
            </td>
          </tr>
        );
      });
    }
    this.state.schedules = schedules;
  }
  
  onEdit(id){
    this.props.navigate('/schedule', { state : {id : id}});
  }

  onDelete(id){
    axios.delete(this.scheduleBaseUrl + `id={id}`)
    .then((response) => {
      alert("Schedule deletado com sucesso");
    }).catch((error) => {
      alert("Error delete schedule:" + error);
    });
  }
  
  render(){
    this.loadScheduleList();
    return (
      <tbody>
      {this.state.schedules}
      </tbody>
    );
  }
}


function ScheduleList(props){
  let navigate = useNavigate();
  return (<ScheduleListInner {...props} navigate={navigate}/>);
}

export default ScheduleList;