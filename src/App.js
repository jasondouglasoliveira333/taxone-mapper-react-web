import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import Customer from './components/Customer';
import Address from './components/Address';
import Upload from './components/Upload';
import WithNavigate from './components/DataSourceConfigList';
import DataSourceConfig from './components/DataSourceConfig';
import MatcherList from './components/MatcherList';
import Matcher from './components/Matcher';
import ScheduleList from './components/ScheduleList';
import Schedule from './components/Schedule';
import Monitoring from './components/Monitoring';
import MonitoringDetail from './components/MonitoringDetail';
import Email from './components/Email';


class App extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      isLogged : true,
      loading: false,
      resourcePath: '.'
    }
  }
  
  render(){
    return (
      <BrowserRouter>
      {/*
        <div>Hi FOLKS</div>
      */}
        <div style={{display:'flex'}}>
          <div style={{display: this.state.isLogged ? 'block' : 'none'}} className="main-layout">
            <div style={{'marginTop': '30px'}}>
              <img src={this.state.resourcePath + '/img/Logo_LKM.png'} style={{marginLeft: '-5px', width: '126px'}}/>
            </div>
            <div style={{'marginTop': '10px'}}>
            </div>
            <Link to="/upload">
              <div className="div-link">
                <div style={{width:'18%'}}>
                  <i className="fas fa-upload" style={{color:'white', marginRight: '5px'}}></i>
                </div>
                <div style={{color: 'white'}}>Upload</div>
              </div>
            </Link>
            <Link to="/datasourceconfig-list">
              <div className="div-link">
                <div style={{width:'18%'}}>
                  <i className="fas fa-cogs" style={{color:'white', marginRight: '5px'}}></i>
                </div>
                <div style={{color: 'white'}}>Datasource</div>
              </div>
            </Link>
            <Link to="/matcher-list">
              <div className="div-link">
                <div style={{width:'18%'}}>
                  <i className="fas fa-link" style={{color:'white', marginRight: '5px'}}></i>
                </div>
                <div style={{color: 'white'}}>Mapeamento</div>
              </div>
            </Link>
            <Link to="/schedule-list">
              <div className="div-link">
                <div style={{width:'18%'}}>
                  <i className="fas fa-calendar" style={{color:'white', marginRight: '5px'}}></i>
                </div>
                <div style={{color: 'white'}}>Schedule</div>
              </div>
            </Link>
            <Link to="/monitoring">
              <div className="div-link">
                <div style={{width:'18%'}}>
                  <i className="fas fa-desktop" style={{color:'white', marginRight: '5px'}}></i>
                </div>
                <div style={{color: 'white'}}>Monitoramento</div>
              </div>
            </Link>
            <Link to="/email">
              <div className="div-link">
                <div style={{width:'18%'}}>
                  <i className="fas fa-bell" style={{color:'white', marginRight: '5px'}}></i>
                </div>
                <div style={{color: 'white'}}>Notificação</div>
              </div>
            </Link>
            <div className="div-link">
              <div style={{width:'18%'}}>
                <i className="fas fa-signal" style={{color:'white', marginRight: '5px'}}></i>
              </div>
              <div style={{color: 'white'}}>Relatório</div>
            </div>
          </div>
          <div style={{width: '90%'}}>
            {/* Header */}
            <div>
              <div className="local-card head">
                 Mapeador TaxONE
              </div>
              <div style={{height:'8px'}}>
              </div>
              <div>
              {/*Content*/}
                <Routes>
                  <Route path="/" element={<Customer/>}/>
                  <Route path="/upload" element={<Upload/>}/>
                  <Route path="/datasourceconfig-list" element={<WithNavigate/>}/>
                  <Route path="/datasourceconfig" element={<DataSourceConfig/>}/>
                  <Route path="/matcher-list" element={<MatcherList/>}/>
                  <Route path="/matcher" element={<Matcher/>}/>
                  <Route path="/schedule-list" element={<ScheduleList/>}/>
                  <Route path="/schedule" element={<Schedule/>}/>
                  <Route path="/monitoring" element={<Monitoring/>}/>
                  <Route path="/monitoring-detail" element={<MonitoringDetail/>}/>
                  <Route path="/email" element={<Email/>}/>
                </Routes>
              </div>
            </div>
          </div>
        </div>
        {
        /*
        <div style="position: absolute; left:0px; top:0px; width: 100%; height:100%; background-color: blue; opacity: 0.2">
          Hi FOLKS
        </div>
        */
        }
      </BrowserRouter>
    );
  }
  
  
}

export default App;