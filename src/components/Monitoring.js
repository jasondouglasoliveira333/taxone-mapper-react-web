import React from 'react';
import { useNavigate } from 'react-router-dom';


import axios from 'axios';

import { formatDDMMYYYY } from './DateUtil'
import Pagination, { PaginationModel} from './commons/Pagination';


class MonitoringInner extends React.Component {
  
  scheduleLogsBaseUrl = "http://localhost:8180/schedulelogs";
  
  statuses = [
    {'name':'PROCESSING', 'value':'Processando'},
    {'name':'PROCESSING_ERROR', 'value':'Erro no processamento'},
    {'name':'SENT', 'value':'Enviado'},
    {'name':'PROCESSED', 'value':'Processado'},
    {'name':'ERROR_TAXONE', 'value':'Erro no retorno TaxOne'},
  ];

  
  constructor(props){
    super(props);
    this.state = {
      scheduleLogs : [],
      status : 'ERROR_TAXONE',
      pagination : new PaginationModel(),
      totalPages : 0
    }
  }
  
  componentDidMount = () =>{
    this.loadScheduleLogs();
    this.loadScheduleLogsStatisticts();
  }
  
  
  loadScheduleLogs = () => {
    axios.get(this.scheduleLogsBaseUrl + `?status=${this.state.status}&page=${this.state.pagination.page}&size=${this.state.pagination.size}`)
    .then((response) => {
      this.state.scheduleLogs = this.transleteStatusSchedules(response.data.content);
      this.setState({
        scheduleLogs : this.state.scheduleLogs,
        totalPages : response.data.totalPages
      });
    }).catch((error) => {
      alert("Error listing the safxtables:" + error);
    });
  }
  
  transleteStatusSchedules = (scheduleLogs) => {
    scheduleLogs.forEach((sl) => {
      sl.status = this.translateStatus(sl.status);
    });
    return scheduleLogs;
  }
  
  onPage = (page) => {
    if (page >= 0 && page < this.state.totalPages){
      this.state.pagination.page=page;
      this.loadScheduleLogs();
      //to update pagination component
      this.setState({ 
        pagination: this.state.pagination
      });
    }
  }
  
  onChartFilter = (status) => {
    this.state.status = status;
    this.loadScheduleLogs();
  }
  
  onPage = (page) => {
    if (page >= 0 && page < this.state.totalPages){
      this.state.pagination.page=page;
      this.loadScheduleLogs();
    }
  }  
  
  translateStatus = (status) => {
    for (let x=0; x < this.statuses.length; x++){
      let lStatus = this.statuses[x];
      if (lStatus.name == status){
        return lStatus.value;
      }
    }
  }
  
  loadScheduleLogsStatisticts = () => { 
    axios.get(this.scheduleLogsBaseUrl + '/statistics')
    .then((response) => {
      this.loadScheduleLogsArray(response.data);
      this.createChartElement();
    }).catch ((error) => {
      alert("error:" + error);
    });
  }
  
  loadScheduleLogsArray = (statistics) => {
    let statusAgendamentos = [];
    let PROCESSING_ST = this.findScheduleLogsByStatus(statistics, 'PROCESSING');
    //alert("PROCESSING_ST:" + PROCESSING_ST);
    let PROCESSING = null;
    if (PROCESSING_ST){
      PROCESSING = [this.translateStatus(PROCESSING_ST.status), PROCESSING_ST.quantity];
    }else{
      PROCESSING = [this.translateStatus('PROCESSING'), 0];
    }
    statusAgendamentos.push(PROCESSING);
    let PROCESSING_ERROR_ST = this.findScheduleLogsByStatus(statistics, 'PROCESSING_ERROR');
    let PROCESSING_ERROR = [this.translateStatus(PROCESSING_ERROR_ST.status), PROCESSING_ERROR_ST.quantity];
    statusAgendamentos.push(PROCESSING_ERROR);
    let SENT_ST = this.findScheduleLogsByStatus(statistics, 'SENT');
    let SENT = null;
    if (SENT_ST){
      SENT = [this.translateStatus(SENT_ST.status), SENT_ST.quantity];
    }else{
      SENT = [this.translateStatus('SENT'), 0];
    }
    statusAgendamentos.push(SENT);
    let PROCESSED_ST = this.findScheduleLogsByStatus(statistics, 'PROCESSED');
    let PROCESSED = [this.translateStatus(PROCESSED_ST.status), PROCESSED_ST.quantity];
    statusAgendamentos.push(PROCESSED);
    let ERROR_TAXONE_ST = this.findScheduleLogsByStatus(statistics, 'ERROR_TAXONE');
    let ERROR_TAXONE = [this.translateStatus(ERROR_TAXONE_ST.status), ERROR_TAXONE_ST.quantity];
    statusAgendamentos.push(ERROR_TAXONE);
    this.state.statusAgendamentos = statusAgendamentos;
    
  }

  findScheduleLogsByStatus = (statistics, status) => {
    for (let x=0; x < statistics.length; x++){
      if(statistics[x].status == status){
        return statistics[x];
      }
    }
  }
  
  createChartElement = () => {
    var s = document.createElement("script");
    s.type = "text/javascript";
    let script = "var chartData = [['Task', 'Hours per Day'],";
    this.state.statusAgendamentos.forEach(sa => {
      script += "['"  + sa[0] + "'," + sa[1] + "],";
    });
    script += "];";
    script += `
        var id = 'piechart';
        loadChart();
          var options = {'title':'Status Agendamentos', 'width':500, 'height':300, is3D: true,
          slices: {
            0: { color: 'blue' },
            1: { color: 'red' },
            2: { color: 'orange' },
            3: { color: 'green' },
            4: { color: 'purple' },
          }    
        };
    `;
    s.text = script;
    document.head.appendChild(s);
  }

  
  render(){
    return (
      <div className="local-card content">
        <div>
        {/*
          <!--h1>HI FOLKS</h1-->
        */}
          <div className="tltle">Monitoramento</div>
          <div className="bordered">
            <div style={{display:'flex'}}>
              <div id="piechart" style={{margin: '3px'}}></div>
              <div style={{margin: '0px 0 0 28px', width: '63%', zorder: 100}}>
                <div className="table-title">Agendamentos</div>
                <div style={{margin: '5px 0 10px 0'}}>
                  <table cellspacing="0" style={{width: '100%'}}>
                    <thead>
                      <td className="table-header" style={{width: '32%'}}>Nome</td>
                      <td className="table-header" style={{width: '24%'}}>Horário</td>
                      <td className="table-header" style={{width: '30%'}}>Status</td>
                      <td className="table-header" style={{width: '14%'}}></td>
                    </thead>
                    <MonitoringTableBody values={this.state.scheduleLogs} navigate={this.props.navigate}/>
                  </table>
                  <div style={{display:'flex', marginLeft: '10px', marginTop:'5px'}}>
                    <div style={{width:'90%'}}></div>
                      <Pagination pagination={this.state.pagination} totalPages={this.state.totalPages} onPage={this.onPage} />
                  </div>
                </div>
              </div>
            </div>
            <button id="processingButton" onClick={() => this.onChartFilter('PROCESSING')} className="invisible"></button>
            <button id="processingErrorButton" onClick={() => this.onChartFilter('PROCESSING_ERROR')} className="invisible"></button>
            <button id="sentButton" onClick={() => this.onChartFilter('SENT')} className="invisible"></button>
            <button id="processedButton" onClick={() => this.onChartFilter('PROCESSED')} className="invisible"></button>
            <button id="errorTaxoneButton" onClick={() => this.onChartFilter('ERROR_TAXONE')} className="invisible"></button>
          </div>
        </div>
      </div>
    );
  }
}

class MonitoringTableBody extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      scheduleLogsRows : []
    };
  }
    
  loadScheduleLogs = () => {
    //alert("in loadScheduleLogs:" + this.props.values);
    let scheduleLogsRows = [];
    if (this.props.values) {
      this.props.values.forEach((scheduleLog) => {
        scheduleLogsRows.push(
          <tr className="t-row">
            <td className="t-columns">{scheduleLog.scheduleName}</td>
            <td className="t-columns">{formatDDMMYYYY(scheduleLog.executionDate)}</td>
            <td className="t-columns" style={{width: '10px'}}>{scheduleLog.status}</td>
            <td className="t-columns" style={{height: '16px', padding:'1px'}}>
              <button onClick={() => this.onView(scheduleLog.id)} style={{display : scheduleLog.status == 'Erro no retorno TaxOne' 
              ? 'block' : 'none'}}>Detalhes
              </button>
            </td>
          </tr>
        );
      });
    }
    this.state.scheduleLogsRows = scheduleLogsRows;
  }
  
  onView = (id) => {
    //alert("onView:" + id)
    this.props.navigate('/monitoring-detail', { state : {'id' : id}});
  }  

  render(){
    this.loadScheduleLogs();
    return (
      <tbody>
      {this.state.scheduleLogsRows}
      </tbody>
    );
  }
  
}

function Monitoring(props){
  let navigate = useNavigate();
  return (<MonitoringInner {...props} navigate={navigate}/>);
}


export default Monitoring;