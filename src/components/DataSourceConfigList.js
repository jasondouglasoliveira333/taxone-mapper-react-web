import React from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

class DataSourceConfigListInner extends React.Component {
  
  dataSourceConfigBaseUrl = "http://localhost:8180/dataSourceConfigs";
  
  sourceTypes = ['Database', 'TXT', 'FTP']; 
  
  constructor(props){
    super(props);
    this.state = {
      sourceType : this.sourceTypes[0]
    }
  }
  
  componentDidMount = () => {
    this.loadDataSourceConfigTypes();
    this.loadDataSourceConfigs();
  }
  
  loadDataSourceConfigTypes = () => {
    let sourceTypesList = [];
    this.sourceTypes.forEach((st) => {
      sourceTypesList.push(<option value={st}>{st}</option>);
    });
    this.state.sourceTypes = sourceTypesList;
  }
  
  updateField = (name, e) => {
    //alert('e.target.value:' + e.target.value);
    this.setState({
      [name] : e.target.value
    });
  }
  
  onAdd = (sourceType) => {
    this.props.navigate("/datasourceconfig", { state: {'sourceType': sourceType, 'operation': 'A'}});
  }
  
  loadDataSourceConfigs = () => {
    axios.get(this.dataSourceConfigBaseUrl)
    .then((response) => {
      this.setState({
        dataSourceConfigs : response.data
      });
    })
  }
  

  render(){
    return (
      <div className="local-card content">
        <div>
          {/*
          <!--h1>HI FOLKS</h1-->
          */}
          <div className="tltle">Datasources</div>
          <div className="bordered">
            <div style={{width: '97%', margin: '20px 0 0 13px'}}>
              <div style={{display:'flex'}}>
                <div className="table-title" style={{padding: '0px 8px 6px 0px', marginRight: '244px'}}>Datasources Configurados</div>
                <button onClick={() => this.onAdd(this.state.sourceType)} style={{marginLeft: '33%'}}>Adicionar</button>
                <select value={this.state.sourceType} onChange={(e) => this.updateField('sourceType', e)} style={{marginLeft: '8px', minWidth: '70px'}}>
                  {this.state.sourceTypes}
                </select>
              </div>
              <div style={{margin: '5px 0 10px 0'}}>
                <table cellspacing="0" style={{width: '100%'}}>
                  <thead>
                    <td className="table-header" style={{width: '23%'}}>Tipo</td>
                    <td className="table-header" style={{width: '71%'}}>Tabelas/Arquivos</td>
                    <td className="table-header" style={{width: '7%'}}></td>
                  </thead>
                  <DataSourceConfigTableBody values={this.state.dataSourceConfigs} navigate={this.props.navigate}/>
                </table>
                <div style={{display:'flex', marginLeft: '10px', marginTop:'5px'}}>
                  <div style={{width:'90%'}}></div>
                  <div style={{display:'flex'}}>
                    <button className="page-button" style={{borderRadius: '5px 0 0 5px'}}>&lt;&lt;</button>
                    <button className="page-button">&lt;</button>
                    <button className="page-button">1</button>
                    <button className="page-button">></button>
                    <button className="page-button" style={{borderRadius: '0 5px 5px 0'}}>>></button>
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

class DataSourceConfigTableBody extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {};
  }
  
  loadDataSourceConfigs = () => {
    let dataSourceConfigs = [];
    if (this.props.values != null){
      this.props.values.forEach((ds) => {
        dataSourceConfigs.push(
        <tr className="t-row">
          <td className="t-columns">{ds.dataSourceType}</td>
          <td className="t-columns">{ds.resourceNames}</td>
          <td className="t-columns" style={{padding: '1px'}}>
            <button onClick={() => this.onEdit(ds.dataSourceType)} >Editar</button>
          </td>
        </tr>
        );
      });
    }
    this.state.dataSourceConfigs = dataSourceConfigs;

  }
  
  onEdit = (sourceType) => {
    this.props.navigate("/datasourceconfig", { state: {'sourceType': sourceType, 'operation': 'E'}});
  }
  
  render() {
    this.loadDataSourceConfigs();
    return (
      <tbody>
      {this.state.dataSourceConfigs}
      </tbody>
    );
  }

}

function DataSourceConfigList(props) {
    let navigate = useNavigate();
    return <DataSourceConfigListInner {...props} navigate={navigate} />
}

export default DataSourceConfigList;