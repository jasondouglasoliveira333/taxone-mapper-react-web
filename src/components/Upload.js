import React from 'react';

import axios from 'axios';

import { formatDDMMYYYY } from './DateUtil'
import Pagination, { PaginationModel } from './commons/Pagination'


class Upload extends React.Component {
  
  uploadsBaseUrl = "http://localhost:8180/uploads";
  
  constructor(props){
    super(props);
    
    this.state = {
      layoutVersion : '',
      pagination : new PaginationModel(),
      totalPages : 0
    }
  }
  
  componentDidMount(){
    this.loadUploads();
  }
  
  loadUploads = () =>{
    axios.get(this.uploadsBaseUrl + `?page=${this.state.pagination.page}&size=${this.state.pagination.size}`)
    .then((response) => {
      //alert("response:" + JSON.stringify(response.data.content));
      this.setState({
        uploads : response.data.content,
        totalPages : response.data.totalPages
      });
    });
  }
  
  onUpload = () =>  {
    alert("in onUpload");
    let formData = new FormData();
    formData.append("file", this.state.file);
    formData.append("layoutVersion", this.state.layoutVersion);
    //alert('this.state.layoutVersion' + this.state.layoutVersion);
    axios.post(this.uploadsBaseUrl, formData)
    .then((response) => {
      alert("upload realizado com sucesso");
      this.loadUploads();
    }).catch ((error) => {
      alert("Error:" + error);
    });
  }
  
  onOpenUpload = () => {
    //alert("in onOpenUpload");
    let fileInput = document.getElementById('fileInput');
    fileInput.click();
  }
  
  onSelectFiles = (e) => {
    //alert("in onSelectFiles - e:" + e);
    let files = e.target.files;
    this.setState({
      file : files[0]
    })
  }
  
  updateField = (name, e) => {
    //alert('e.target.value:' + e.target.value);
    this.setState({
      [name] : e.target.value
    });
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
  


  render(){
    return (
      <div className="local-card content">
        {/*
        <input style={{width: '222px', height: '22px', padding: '0.375rem 0.75rem', border: '1px solid rgb(184 205 241)'}}/>
        <div style={{fontSize: '14.24px'}}>Text Font</div>
        */}
        <div>
          <div className="tltle">Upload</div>
          <div className="bordered">
            
            <div style={{margin: '25px 0 0 13px', display: 'flex', width: '72%'}}>
              <div onClick={this.onOpenUpload} style={{display: 'flex', border: '1px solid rgb(184 205 241)', borderRadius: '4px', width: '81%'}}>
                <input id="fileInput" type="file" onChange={e => this.onSelectFiles(e)}
                  style={{position: 'absolute', top: '-10px', left:'-10px', width:'0px', height: '0px', opacity: 0}}/>
                <div style={{width:'100%'}}>
                  <div style={{margin: '2px 5px 0 23px', fontSize: '14px'}}>{this.state.file != null ? this.state.file.name : ''}</div>
                </div>
                <div style={{width:'16%'}}>
                  <button>Upload</button>
                </div>
              </div>
              <div style={{display: 'flex', margin: '0px 0 0 42px'}}>
                <div style={{fontSize: '14.24px', margin: '3px 13px 0 0'}}>Versão</div>
                <input value={this.state.layoutVersion} onChange={(e) => this.updateField('layoutVersion', e)} 
                  type="text" maxlength="10" size="7" style={{width: '90px', height: '22px'}}/>
              </div>
              <div style={{width:'10%', margin: '1px 0px 0px 7%'}}>
                <button onClick={this.onUpload}>Send</button>
              </div>
            </div>
            <div style={{margin:'17px 0 0 13px'}}>
              <div className="table-title">Uploads</div>
              <div style={{margin: '5px 0 10px 0', width:'98%'}}>
                <table cellspacing="0" style={{width: '100%'}}>
                  <thead>
                    <td className="table-header">Nome do Arquivo</td>
                    <td className="table-header">Versão do Layout</td>
                    <td className="table-header">Data Upload</td>
                    <td className="table-header">Usuário</td>
                    <td className="table-header" style={{width: '14%'}}>Status</td>
                  </thead>
                  <UploadList values={this.state.uploads}/>
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

class UploadList extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {};
  }
  
  loadUploadItens = () => {
    let uploadItens = [];
    if (this.props.values != null){
      this.props.values.forEach( (upload: any) => {
        uploadItens.push(<tr className="t-row">
          <td className="t-columns">ID do Documento</td>
          <td className="t-columns">{upload.layoutVersion}</td>
          <td className="t-columns">{formatDDMMYYYY(upload.creationDate)}</td>
          <td className="t-columns">{upload.userName}</td>
          <td className="t-columns">{upload.status == 'ACTIVE' ? 'Vigente' : 'Cancelado' }</td>
        </tr>);
      });
    }
    this.state.uploadItens = uploadItens;
  }
  
  render() {
    this.loadUploadItens();
    return (
      <tbody>
      {this.state.uploadItens}
      </tbody>
    );
  }
}

export default Upload

//{upload.fileName} 
