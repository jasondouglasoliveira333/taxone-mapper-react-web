import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import axios from 'axios';

import { formatDDMMYYYY } from './DateUtil'
import Pagination, { PaginationModel} from './commons/Pagination';

class MonitoringDetailInner extends React.Component {
  
  scheduleLogsBaseUrl = "http://localhost:8180/schedulelogs";
  
  constructor(props){
    super(props);
    this.state = {
      scheduleLog : {},
      taxOneErrors : [],
      pagination : new PaginationModel(),
      totalPages : 0
    }
    this.state.pagination.size = 2;
  }
  
  componentDidMount = () => {
    this.loadScheduleLog();
    this.loadErrorsTaxOne();
  }
  
  loadScheduleLog = () => {
    axios.get(this.scheduleLogsBaseUrl + `/${this.props.state.id}`)
    .then((response) => {
      this.setState({
        scheduleLog : response.data
      });
    }).catch((error) => {
      alert('error:' + error);
    });
  }

  loadErrorsTaxOne = () => {
    axios.get(this.scheduleLogsBaseUrl + `/${this.props.state.id}/taxOneErrors?page=${this.state.pagination.page}&size=${this.state.pagination.size}`)
    .then((response) => {
      const { data } = response;
      this.setState({
        taxOneErrors : data.content,
        totalPages : data.totalPages
      });
    }).catch((error) => {
      alert('error:' + error);
    });
  }
  
  onPage = (page) => {
    if (page >= 0 && page < this.state.totalPages){
      this.state.pagination.page=page;
      this.loadErrorsTaxOne();
    }
  }  
  
  onBack = () => {
    this.props.navigate('/monitoring');
  }
  
  render(){
    return (
      <div className="local-card content">
        <div>
          <div className="tltle">Monitoramento</div>
          <div className="bordered">
          {/*
            <!-- Filtro  -->
          */}
            <div style={{width:'60%', marginLeft: '7px'}}>
              <div className="filter-label">Detalhes</div>
              <div style={{display:'flex'}}>  
                <div style={{display: 'flex', margin: '5px 0 0 10px'}}>
                  <div style={{fontSize: '14px', marginRight: '13px'}}>Nome</div>
                  <div style={{fontSize: '15px'}}>{this.state.scheduleLog.scheduleName}</div>
                </div>
                <div style={{display: 'flex', margin: '5px 0 0 63px'}}>
                  <div style={{fontSize: '14px', marginRight: '13px'}}>Horário</div>
                  <div style={{fontSize: '15px'}}>{formatDDMMYYYY(this.state.scheduleLog.executionDate)}</div>
                </div>
                <div style={{display: 'flex', margin: '5px 0 0 63px'}}>
                  <div style={{fontSize: '14px', marginRight: '13px'}}>Status</div>
                  <div style={{fontSize: '15px'}}>{this.state.scheduleLog.status}</div>
                </div>
              </div>
            </div>
            <div style={{marginTop:'22px', width:'60%'}}>
              <div className="line-divider"></div>
            </div>
            <div style={{margin:'17px 0 0 13px'}}>
              <div className="table-title">Erros TaxONE</div>
              <div style={{margin: '5px 0 10px 0', width:'98%'}}>
                <table cellspacing="0" style={{width: '100%'}}>
                  <thead>
                    <td className="table-header" style={{width: '14%'}}>N# Registro</td>
                    <td className="table-header" style={{width: '14%'}}>Código Erro</td>
                    <td className="table-header" style={{width: '48%'}}>Descrição Erro</td>
                    <td className="table-header" style={{width: '20%'}}>Nome Campo</td>
                    <td className="table-header" style={{width: '11%'}}>Chave</td>
                  </thead>
                  <ScheduleLogErrorsTableBody values={this.state.taxOneErrors}/>
                </table>
                <div style={{display:'flex', marginLeft: '10px', marginTop:'5px'}}>
                  <div style={{width:'90%'}}></div>
                    <Pagination pagination={this.state.pagination} totalPages={this.state.totalPages} onPage={this.onPage} />
                </div>
              </div>
            </div>
            <div style={{width: '98%', direction: 'rtl', marginTop: '10px'}}>
              <button onClick={this.onBack} style={{marginRight: '5px'}}>Voltar</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  

}

class ScheduleLogErrorsTableBody extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      taxOneErrors : []
    };
  }

  loadScheduleLogErrosRows = () => {
    let taxOneErrors = [];
    if (this.props.values){
      this.props.values.forEach((taxOneError) => {
        taxOneErrors.push(
          <tr className="t-row">
            <td className="t-columns">{taxOneError.numeroReg}</td>
            <td className="t-columns">{taxOneError.codigoErro}</td>
            <td className="t-columns">{taxOneError.descricaoErro}</td>
            <td className="t-columns">{taxOneError.nomeCampo}</td>
            <td className="t-columns">{taxOneError.chaveRegistro}</td>
          </tr>
        );
      });
    }
    this.state.taxOneErrors = taxOneErrors;
  }
  
  render() {
    this.loadScheduleLogErrosRows();
    return (
      <tbody>
        {this.state.taxOneErrors}
      </tbody>
    );
  }

}
  
function MonitoringDetail(props){
  let navigate = useNavigate();
  let { state } = useLocation();
  return (<MonitoringDetailInner {...props} navigate={navigate} state={{...state}}/>);
}

export default MonitoringDetail;