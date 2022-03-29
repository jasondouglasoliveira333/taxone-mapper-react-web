import React from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import Pagination, { PaginationModel } from './commons/Pagination'

class MatcherListInner extends React.Component {
  
  safxTablesBaseUrl = "http://localhost:8180/safxTables";
  
  //S
  constructor(props){
    super(props);
    this.state = {
      tableName : '',
      justAssociated : '',
      pagination : new PaginationModel(),
      totalPages : 0
    }
  }
  
  componentDidMount = () => {
    this.loadSAFXTables();
  }
  
  loadSAFXTables = () => {
    //alert('this.state.justAssociated:' + this.state.justAssociated);
    let justAssociated = this.state.justAssociated == 'checked' ? 'true' : 'false';
    
    axios.get(this.safxTablesBaseUrl + `?tableName=${this.state.tableName}&justAssociated=${justAssociated}
      &page=${this.state.pagination.page}&size=${this.state.pagination.size}`)
    .then ((response) => {
      this.setState({
        safxTables : response.data.content,
        totalPages : response.data.totalPages
      });
    }).catch((error) => {
      alert("Error listing the safxtables:" + error);
    });
  }
  
  onFilter = () => {
    alert("in onFilter");
    this.loadSAFXTables();
  }
  
  updateField = (name, e) => {
    //alert(name + ' - ' +  e.target.value);
    console.log(e.target);
    //checkbox
    if (name == 'justAssociated'){
      if (e.target.checked){
        e.target.value = 'checked';
      }else{
        e.target.value = '';
      }
    }
    this.setState({
      [name] : e.target.value
    });
  }
  
  onPage = (page) => {
		//alert("onPage:" + page);
		if (page >= 0 && page < this.state.totalPages){
			this.state.pagination.page=page;
			this.loadSAFXTables();
      //to update pagination component
      this.setState({ 
        pagination: this.state.pagination
      });
		}
	}
  
  render() {
    return (
      <div className="local-card content">
        <div>
          <div className="tltle">Mapeamentos</div>
          <div className="bordered">
          {/*
            <!-- Filtro  -->
          */}
            <div style={{width:'98%', marginLeft: '7px'}}>
              <div className="filter-label">Filtro</div>
              <div style={{display:'flex'}}>	
                <div style={{display: 'flex', margin: '5px 0 0 10px'}}>
                  <div style={{fontSize: '14px', marginRight: '13px'}}>Nome</div>
                  <input value={this.state.tableName} onChange={(e) => this.updateField('tableName', e)} type="text" size="20"/>
                </div>
                <div style={{display: 'flex', margin: '5px 0 0 63px'}}>
                  <div style={{fontSize: '14px', marginRight: '13px'}}>Associada</div>
                  <input value={this.state.justAssociated} onChange={(e) => this.updateField('justAssociated', e)} type="checkbox"/>
                </div>
              </div>
              <div style={{direction: 'rtl', marginRight: '28px'}}>
                <button onClick={this.onFilter}>
                  Filtrar
                </button>
              </div>
            </div>
            {/*
            <div style={{marginTop:'22px', width:'98%'}}>
              <div className="line-divider"></div>
            </div>
            */}
            <div style={{margin:'5px 0 0 13px'}}>
              <div className="table-title">Tabelas TaxONE</div>
              <div style={{margin: '5px 0 10px 0', width:'98%'}}>
                <table cellspacing="0" style={{width: '100%'}}>
                  <thead>
                    <tr>
                      <td className="table-header" style={{width: '10%'}}>SAFX</td>
                      <td className="table-header" style={{width: '65%'}}>Nome</td>
                      <td className="table-header" style={{width: '20%'}}>Fonte Origem</td>
                      <td className="table-header" style={{width: '5%'}}></td>
                    </tr>
                  </thead>
                  <MatcherListTableBody values={this.state.safxTables} navigate={this.props.navigate}/>
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
    );
  }
}

class MatcherListTableBody extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {};
  }
  
  loadSAFXTables = () => {
    let safxTables = [];
    if (this.props.values){
      this.props.values.forEach((safxTable) => {
        safxTables.push(
          <tr className="t-row">
            <td className="t-columns">{safxTable.name}</td>
            <td className="t-columns">{safxTable.description.substr(0,50)}</td>
            <td className="t-columns">{safxTable.dsTableName ? safxTable.dsTableName : 'Não Associado'}</td>
            <td className="t-columns" style={{padding: '1px'}}>
              <button onClick={() => this.onEdit(safxTable.id)} style={{margin: '1px 0px 1px 0px'}}>Editar</button>
            </td>
          </tr>
        );
      });
      this.state.safxTables = safxTables;
    }
  };
  
  onEdit = (id) => {
    this.props.navigate('/matcher', { state : {'id' : id}});
  }
  
  render(){
    this.loadSAFXTables();
    //alert("this.state.safxTables:" + this.state.safxTables);
    return (
      <tbody>
      {this.state.safxTables}
      </tbody>
    );
  }
}

function MatcherList(props){
  let navigate = useNavigate();
  return <MatcherListInner {...props} navigate={navigate}/>;
}  

export default MatcherList;