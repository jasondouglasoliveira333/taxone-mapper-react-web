import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import axios from 'axios';

import Pagination, { PaginationModel } from './commons/Pagination'

class MatcherInner extends React.Component {
  
  safxTablesBaseUrl = "http://localhost:8180/safxTables";
  dsTablesBaseUrl = "http://localhost:8180/dsTables";

  constructor(props){
    super(props);
    this.state = {
      pagination : new PaginationModel(),
      totalPages : 0,
      dsPagination : new PaginationModel(),
      dsTotalPages : 0
    };
    this.state.dsPagination.size = 3;
  }

  componentDidMount = () => {
    this.loadSAFXTable();
    this.loadSAFXColumns();
    this.loadDSTables();
  }
  
  loadSAFXTable = () => {
    axios.get(this.safxTablesBaseUrl +  `/${this.props.value.id}`)
    .then((response) => {
      this.setState({
        safxTableName : response.data.name
      });
    }).catch((error) => {
      alert("Error getting safxTable: " + error);
    });
  }
  
  loadSAFXColumns = () => {
    axios.get(this.safxTablesBaseUrl + `/${this.props.value.id}/safxColumns`)
    .then((response) => {
      this.state.safxColumnsFull = response.data;
      let pages = Math.trunc(this.state.safxColumnsFull.length / this.state.pagination.size);
      if (this.state.safxColumnsFull.length%this.state.pagination.size != 0){
        pages++;
      }
      this.state.safxTotalPages = pages;
      this.state.safxColumns = this.state.safxColumnsFull.slice(0, this.state.pagination.size);
      
      this.setState({
        safxColumnsFull: this.state.safxColumnsFull,
        safxTotalPages: this.state.safxTotalPages,
        safxColumns: this.state.safxColumns
      });
    }).catch((error) => {
      alert("Error getting columns: " + error);
    });
  }

  loadDSTables = () => {
    axios.get(this.dsTablesBaseUrl)
    .then((response) => {
      let dsTables = [];
      response.data.forEach((dsTable) => {
        dsTables.push(<option value={dsTable.id}>{dsTable.name}</option>);
      });
      this.setState({
        dsTables : dsTables
      });
      //alert("response.data[0].id:" + response.data[0].id);
      this.state.dsTableId = response.data[0].id;
      this.loadDSColumns(this.state.dsTableId);
    }).catch((error) => {
      alert("Error getting safxTable: " + error);
    });
  }
  
  loadDSColumns = (id) => {
    //alert("loadDSColumns:" + id);
    axios.get(this.dsTablesBaseUrl +  `/${id}/dsColumns?page=${this.state.dsPagination.page}&size=${this.state.dsPagination.size}`)
    .then((response) => {
      this.setState({
        dsColumns : response.data.content,
        dsTotalPages : response.data.totalPages
      });
    }).catch((error) => {
      alert("Error getting columns: " + error);
    });
  }

  onPageSAFX = (page) => {
    if (page >= 0 && page < this.state.safxTotalPages){
      this.state.pagination.page=page;
      let start = this.state.pagination.page*this.state.pagination.size;
      this.state.safxColumns = this.state.safxColumnsFull.slice(start, start + this.state.pagination.size);
      this.setState({
        safxColumns : this.state.safxColumns
      });
    }
  }


  onDSCnage = (e) => {
    this.setState({
      dsTableId : e.target.value
    });
    this.loadDSColumns(e.target.value);
  }

  //drag and drop
  allowDrop = (ev) => {
    //alert("allowDrop");
    ev.preventDefault();
  }

  drag = (ev, sField) => {
    //alert("drag");
    let fData = {
      'id': sField.id,
      'name': sField.name
    };
    ev.dataTransfer.setData("value", JSON.stringify(fData));
  }
  
  drop = (ev, field) => {
    //alert("drop:" + JSON.stringify(field));
    ev.preventDefault();
    let fData = JSON.parse(ev.dataTransfer.getData("value"));
    field.dsColumnId = fData.id;
    field.dsColumnName = fData.name;
    this.props.forceUpdate();
  }
  
  onRemoveAssociation = (field) => {
    field.dsColumnId = null;
    field.dsColumnName = null;
    this.props.forceUpdate();
  }
  
  onPage = (page) => {
    //alert("onPage:" + page);
    if (page >= 0 && page < this.state.totalPages){
      this.state.pagination.page=page;
      this.loadUploads();
      //to update pagination component
      this.setState({  
        pagination: this.state.pagination
      });
    }
  }
  
  onPageDS = (page) => {
    //alert("onPage:" + page);
    if (page >= 0 && page < this.state.dsTotalPages){
      this.state.dsPagination.page=page;
      this.loadDSColumns(this.state.dsTableId);
      //to update pagination component
      this.setState({  
        dsPagination: this.state.dsPagination
      });
    }
  }

  onSave = () => {
    alert("in onSave");
    axios.put(this.safxTablesBaseUrl +  `/${this.props.value.id}/dsTables/${this.state.dsTableId}`)
    .then(() => {
      alert("Save sucessfull");
    }).catch((error) => {
      alert("Error saving safxColumns");
    });
    axios.put(this.safxTablesBaseUrl +  `/${this.props.value.id}/safxColumns`, this.state.safxColumns)
    .then(() => {
      alert("Save sucessfull");
    }).catch((error) => {
      alert("Error saving safxColumns");
    });
  }
  
  onBack = () => {
    //alert("in onBack");
    this.props.navigate("/matcher-list");
  }

  render() {
    //alert("Main render");
    return (
      <div className="local-card content">
        <div>
          <div className="tltle">Mapeamento</div>
          <div className="bordered">
            <div style={{display: 'flex', margin:'20px 0 0 13px'}}>
              <div style={{width: '45%'}}>
                <div style={{fontSize: '13px', padding: '17px 8px 13px 0px', fontWeight: '600'}}>TaxOne ({this.state.safxTableName})</div>
                <div style={{margin: '5px 0 10px 0', width:'100%'}}>
                  <table cellspacing="0" style={{width: '100%'}}>
                    <thead>
                      <td className="table-header" style={{width: '30%', padding: '0px 0 0 5px'}}>Nome Coluna</td>
                      <td className="table-header" style={{width: '15%'}}>Obrigatório</td>
                      <td className="table-header" style={{width: '10%'}}>Tamanho</td>
                      <td className="table-header" style={{width: '10%'}}>Tipo</td>
                      <td className="table-header" style={{width: '30%'}}></td>
                    </thead>
                    <MatcherTableBody value={this.state.safxColumns} onDrop={this.drop} onAllowDrop={this.allowDrop} onRemoveAssociation={this.onRemoveAssociation}/>
                  </table>
                  <div style={{display:'flex', marginLeft: '10px', marginTop:'5px'}}>
                    <div style={{width:'90%'}}></div>
                      <Pagination pagination={this.state.pagination} totalPages={this.state.safxTotalPages} onPage={this.onPageSAFX} />
                  </div>
                </div>
              </div>
            
              <div style={{width: '45%', marginLeft: '100px'}}>
                <div style={{display:'flex'}}>
                  <div style={{display: 'flex', fontSize: '13px', padding: '18px 8px 13px 0px', fontWeight: 600}}>
                    <div style={{marginRight: '7px'}}>Campos Origem</div>
                    <select onChange={(e) => this.onDSCnage(e)} value={this.state.dsTableId} 
                      style={{height: '24px !important', padding: '0px', marginTop: '-3px'}}>
                        {this.state.dsTables}
                    </select>
                  </div>
                </div>
                <div style={{marginBottom: '10px'}}>
                  <table cellspacing="0" style={{width: '100%'}}>
                    <thead>
                      <td className="table-header" style={{width: '28%'}}>Nome Coluna</td>
                      <td className="table-header" style={{width: '20%'}}>Tipo</td>
                      <td className="table-header">Tamanho</td>
                    </thead>
                    <MatcherDSColumnsTableBody value={this.state.dsColumns} onDrag={this.drag}/>
                  </table>
                  <div style={{display:'flex', marginLeft: '10px', marginTop:'5px'}}>
                    <div style={{width:'90%'}}></div>
                    <Pagination pagination={this.state.dsPagination} totalPages={this.state.dsTotalPages} onPage={this.onPageDS} />
                  </div>
                </div>
              </div>
            </div>
            <div style={{direction: 'rtl', margin: '42px 13px 0 0'}}>
              <button onClick={this.onSave}>Salvar</button>
              <button onClick={this.onBack} style={{marginRight:'5px'}}>Cancelar</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
}

function useForceUpdate(){
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update the state to force render
}

class MatcherTableBody extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {};
  }
  
  loadSAFXColumn = () => {
    if (this.props.value) {
      let safxColumns = [];
      this.props.value.forEach((safxColumn) => {
        safxColumns.push(
          <tr className="t-row">
            <td className="t-columns">{safxColumn.name}</td>
            <td className="t-columns">{safxColumn.required ? '*' : ''}</td>
            <td className="t-columns">{safxColumn.size}</td>
            <td className="t-columns">{safxColumn.type}</td>
            <td className="t-columns" style={{padding: '1px'}}>
              <div onDrop={(e) => this.props.onDrop(e, safxColumn)} onDragOver={(e) => this.props.onAllowDrop(e)} 
                style={{display: 'flex', border: '1px solid', height: '16px', padding: '0px 0 0 4px'}}>
                <div style={{width:'90%'}}>{safxColumn.dsColumnName}</div>
                <div style={{display : safxColumn.dsColumnName != '' ? 'block': 'none'}} onClick={() => this.props.onRemoveAssociation(safxColumn)} 
                  style={{display: safxColumn.dsColumnId != null ? 'block' : 'none', width: '15%', textAlign: 'center', 
                    marginTop: '-2px', cursor: 'pointer'}}>x</div>
              </div>
            </td>
          </tr>);
        this.state.safxColumns = safxColumns;
     });
    }
  }
  
  render() {
    this.loadSAFXColumn();
    //alert("render rows:" + this.state.safxColumns);
    return (
      <tbody>
      {this.state.safxColumns}
      </tbody>
    );
  }
}

class MatcherDSColumnsTableBody extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {};
  }
  
  
  loadDSColumns = () => {
    if (this.props.value){
      let dsColumns = [];
      let counter = 0;
      this.props.value.forEach((dsColumn) => { 
        let idx = "dd_" + counter++;
        dsColumns.push(
          <tr className="t-row">
            <td className="t-columns">
              <div id={idx} draggable="true" onDragStart={(e) => this.props.onDrag(e, dsColumn)}>{dsColumn.name}</div>
            </td>
            <td className="t-columns">{dsColumn.columnType}</td>
            <td className="t-columns">{dsColumn.size}</td>
          </tr>
        );
      });
      this.state.dsColumns = dsColumns;
    }
  }
  
  render(){
    this.loadDSColumns();
    return (
      <tbody>
      {this.state.dsColumns}
      </tbody>
    );
  }
}

function Matcher (props){
  let navigate = useNavigate();
  let location = useLocation();
  let forceUpdate = useForceUpdate();
  let { state } = location;
  //alert("Matcher state:" + JSON.stringify(state));
  return <MatcherInner {...props} navigate={navigate} value={{id : state.id }} forceUpdate={forceUpdate}/>;
}


export default Matcher;