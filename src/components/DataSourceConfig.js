import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import axios from 'axios';

import Pagination, { PaginationModel } from './commons/Pagination';

class DataSourceConfigInner extends React.Component {
  
  dataSourceConfigBaseUrl = "http://localhost:8180/dataSourceConfigs";
  
  constructor(props){
    super(props);
    //alert("state:" +  JSON.stringify(this.props.state));
    let dataSourceType = this.props.state.sourceType;
    if (!dataSourceType){
      dataSourceType = 'Database';
    }
    this.state = {
      dataSourceType: dataSourceType,
      dataSourceConfig : {},
      ...this.props.state,
      pagination : new PaginationModel(),
      totalPages : 0
    }
    
    this.state.pagination.size = 2;
  }
  
  componentDidMount(){
    this.loadDataSourceConfig();
    this.loadDataSourceTables();
  }
  
  loadDataSourceConfig = () => {
    axios.get(this.dataSourceConfigBaseUrl + '/' + this.state.sourceType)
    .then((response) => {
      this.setState({
        dataSourceConfig : response.data
      });
    }).catch((error) => {
      alert("Error dsConfig" + error);
    });
  }
  
  loadDataSourceTables = () => {
    axios.get(this.dataSourceConfigBaseUrl + '/' + this.state.sourceType + "/dsTables")
    .then((response) => {
      if (response.data){
        let dsTables = [];
        response.data.forEach((dsTable) => {
          dsTables.push(<option value={dsTable.id}>{dsTable.name}</option>);
        });
        this.setState({
          dsTables : dsTables,
          dsTable : response.data[0].id
        });
        this.state.dsTable = response.data[0].id;
        this.loadDataSourceColumns();
      }
    }).catch((error) => {
      alert("Error dsTables" + error);
    });
  }

  loadDataSourceColumns = () => {
    axios.get(this.dataSourceConfigBaseUrl + '/' + this.state.sourceType + "/dsTables/" + this.state.dsTable 
      + `/dsColumns?page=${this.state.pagination.page}&size=${this.state.pagination.size}`)
    .then((response) => {
      let dataSourceColumns = [];
      if (response.data){
        response.data.content.forEach((dsColumn) => {
          dataSourceColumns.push(
            <tr className="t-row">
              <td className="t-columns" style={{padding: '3px'}}>{dsColumn.dsTable.name}</td>
              <td className="t-columns" style={{padding: '3px'}}>{dsColumn.name}</td>
              <td className="t-columns">{dsColumn.columnType}</td>
              <td className="t-columns">{dsColumn.size}</td>
            </tr>
          );
        });
        this.setState({
          dataSourceColumns : dataSourceColumns,
          totalPages : response.data.totalPages
        });
      }
    }).catch((error) => {
      alert("Error columns" + error);
    });
  }
  
  updateField = (name, e) => {
    //alert('e.target.value:' + e.target.value);
    let dataSourceConfig = this.state.dataSourceConfig;
    dataSourceConfig[name] = e.target.value;
    this.setState({
      dataSourceConfig : dataSourceConfig
    });
  }
  
  onDSCnage = (e) => {
    //alert("in onDSCnage - e:" + e);
    this.state.dsTable = e.target.value;
    this.loadDataSourceColumns();
  }
  
  onGetMetadata = () => {
    alert("in onGetMetadata");
    axios.post(this.dataSourceConfigBaseUrl + "/" + this.state.sourceType + "/metadata", this.state.dataSourceConfig)
    .then(() => {
      this.loadDataSourceTables();
    }).catch((error) => {
        alert("Error getting metadata");
    });
  }
  
  onSave = () => {
    alert("in onSave");
    axios.post(this.dataSourceConfigBaseUrl + "/" + this.state.sourceType, this.state.dataSourceConfig)
    .then(() => {
      this.loadDataSourceTables();
    }).catch((error) => {
        alert("Error getting metadata");
    });
  }
  
  onBack = () => {
    this.props.navigate("/datasourceconfig-list");
  }
  
  onPage = (page) => {
    //alert("onPage:" + page);
    if (page >= 0 && page < this.state.totalPages){
      this.state.pagination.page=page;
      this.loadDataSourceColumns();
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
          {/*
          <!--h1>HI FOLKS</h1-->
          */}
          <div className="tltle">Datasource</div>
          <div className="bordered">
          {/*
            <!-- JDBC -->
          */}
            <div style={{display: 'flex', marginTop: '15px'}}>
              <div style={{width: '60%'}}>
                <div style={{fontSize: '17px', fontWeight: 600, marginLeft:'13px'}}>Detalhes</div>
                <div style={{display: this.state.dataSourceType == 'Database' ? 'display' : 'none'}} className="mapping-panel">
                  <div className="mapping-field-container" style={{marginTop: '18px'}}>
                    <div className="mapping-field">JDBC url</div>
                    <input value={this.state.dataSourceConfig.url} onChange={(e) => this.updateField('url', e)} maxLength="100" type="text" size="60"/>
                  </div>
                  <div className="mapping-field-container">
                    <div className="mapping-field">username</div>
                    <input value={this.state.dataSourceConfig.username} onChange={(e) => this.updateField('username', e)} type="text" maxLength="25" size="13"/>
                  </div>
                  <div className="mapping-field-container">
                    <div className="mapping-field">password</div>
                    <input value={this.state.dataSourceConfig.password} onChange={(e) => this.updateField('password', e)} type="text" maxLength="25" size="13"/>
                  </div>
                  <div className="mapping-field-container">
                    <div className="mapping-field">tabela/view</div>
                    <textarea value={this.state.dataSourceConfig.resourceNames} onChange={(e) => this.updateField('resourceNames', e)} type="text" maxLength="500" cols="65" rows="10" 
                      style={{height: '100px',resize: 'none'}}>
                    </textarea>
                  </div>
                  <div style={{margin: '10px 10px 0 13px', display: 'flex', direction: 'rtl'}}>
                    <button onClick={this.onGetMetadata}>Get Metadata</button> 
                  </div>
                  <div style={{marginTop: '15px'}}>
                  </div>
                </div>
                <div style={{display: this.state.dataSourceType == 'TXT' ? 'display' : 'none'}} className="mapping-panel">
                  <div className="mapping-field-container" style={{marginTop: '18px'}}>
                    <div className="mapping-field">IP/DNS</div>
                    <input value={this.state.dataSourceConfig.url} onChange={(e) => this.updateField('url', e)} maxLength="100" type="text" size="60"/>
                  </div>
                  <div className="mapping-field-container">
                    <div className="mapping-field">Arquivo Exemplo/view</div>
                    <textarea value={this.state.dataSourceConfig.resourceNames} onChange={(e) => this.updateField('resourceNames', e)} type="text" maxLength="500" cols="70" rows="10" 
                      style={{height: '100px',resize: 'none'}}>
                    </textarea>
                  </div>
                  <div style={{height: '74px'}}>
                  </div>
                  <div style={{margin: '10px 10px 0 13px', display: 'flex', direction: 'rtl'}}>
                    <button onClick={this.onGetMetadata}>Get Metadata</button> 
                  </div>
                  <div style={{marginTop: '15px'}}>
                  </div>
                </div>
                <div style={{display: this.state.dataSourceType == 'FTP' ? 'display' : 'none'}} className="mapping-panel">
                  <div className="mapping-field-container" style={{marginTop: '18px'}}>
                    <div className="mapping-field">IP/DNS</div>
                    <input value={this.state.dataSourceConfig.url} onChange={(e) => this.updateField('url', e)} maxLength="100" type="text" size="60"/>
                  </div>
                  <div className="mapping-field-container">
                    <div className="mapping-field">username</div>
                    <input value={this.state.dataSourceConfig.username} onChange={(e) => this.updateField('username', e)} type="text" maxLength="25" size="13"/>
                  </div>
                  <div className="mapping-field-container">
                    <div className="mapping-field">password</div>
                    <input value={this.state.dataSourceConfig.password} onChange={(e) => this.updateField('password', e)} type="text" maxLength="25" size="13"/>
                  </div>
                  <div className="mapping-field-container">
                    <div className="mapping-field">Arquivo Exemplo/view</div>
                    <textarea value={this.state.dataSourceConfig.resourceNames} onChange={(e) => this.updateField('resourceNames', e)} type="text" maxLength="500" cols="70" rows="10" 
                      style={{height: '100px',resize: 'none'}}>
                    </textarea>
                  </div>
                  <div style={{margin: '10px 10px 0 13px', display: 'flex', direction: 'rtl'}}>
                    <button onClick={this.onGetMetadata}>Get Metadata</button> 
                  </div>
                  <div style={{marginTop: '15px'}}>
                  </div>
                </div>
              </div>
              <div style={{width: '38%'}}>
                <div style={{display: 'flex'}}>
                  <div className="table-title" style={{padding: '0px 8px 6px 0px'}}>Campos</div>
                  <select value={this.state.dsTable} onChange={(e) => this.onDSCnage(e)} style={{height: '24px !important', padding: '0px', marginTop: '-3px'}}>
                    {this.state.dsTables}
                  </select>
                </div>
                <div style={{margin: '5px 0 10px 0'}}>
                  <table cellspacing="0" style={{width: '100'}}>
                    <thead>
                      <tr>
                        <td className="table-header" style={{width: '35%'}}>Tabela/Arquivo</td>
                        <td className="table-header" style={{width: '35%'}}>Coluna</td>
                        <td className="table-header" style={{width: '23%'}}>Tipo</td>
                        <td className="table-header">Tamanho</td>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.dataSourceColumns}
                    </tbody>
                  </table>
                  <div style={{display:'flex', marginLeft: '10px', marginTop:'5px'}}>
                    <div style={{width:'90%'}}></div>
                      <Pagination pagination={this.state.pagination} totalPages={this.state.totalPages} onPage={this.onPage} />
                  </div>
                </div>
              </div>
            </div>
            <div style={{width: '60%', direction: 'rtl', marginTop: '10px'}}>
              <button onClick={this.onSave}>Salvar</button> 
              <button onClick={this.onBack} style={{marginRight: '5px'}}>Cancelar</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
}

function DataSourceConfig(props) {
    let navigate = useNavigate();
    let state = useLocation();
    let { sourceType, operation} = state.state;
    //alert("in DataSourceConfig - state::" + JSON.stringify(state));
    return <DataSourceConfigInner {...props} navigate={navigate} state={{ 'sourceType': sourceType, 'operation' : operation}}/>
}


export default DataSourceConfig;