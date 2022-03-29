import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

import Pagination, { PaginationModel } from './commons/Pagination';

class ScheduleInner extends React.Component {
  updated = false;
  scheduleBaseUrl = "http://localhost:8180/schedules";
  safxTableBaseUrl = "http://localhost:8180/safxTables";

  criteriaInitialState =  {
                            safxColumn: {
                              safxTable:{
                                id : ''
                              }
                            },
                            operator : '=',
                            value : '',
                            additionalValue : ''
                          };

  
  //for while
  daysValues = [
		{'value': '*', 'label': 'Todos'}, 
		{'value': '0', 'label': 'Segunda'},
		{'value': '1', 'label': 'Terça'},
		{'value': '2', 'label': 'Quarta'},
		{'value': '3', 'label': 'Quinta'},
		{'value': '4', 'label': 'Sexta'},
		{'value': '5', 'label': 'Sabado'},
		{'value': '6', 'label': 'Domingo'}
	];
  
  operatorsValues = ['=', '!=', '>=', '<=', 'between', 'not empty', 'empty'];
  
  constructor(props){
    super(props);
    //alert("this.props.state:" + JSON.stringify(this.props.state));
    //alert("localDays:" + localDays); //33
    this.state = {
      selectedAvaiableTables : [],
      selectedSelectedTables : [],
      availableTables : [],
      selectedTables : [],
      scheduleConfig : { 
        safxTables : [],
        criterias : []
      },
      days : [],
      hours : [],
      criteria: {
        safxColumn: {
          safxTable:{
            id : null
          }
        },
        operator : '='
      },
      totalPages : 0,
      pagination : new PaginationModel()
    }
    this.state.pagination.size = 2;
    this.fillHours();
  }
  
  componentDidMount = () => {
    this.loadSchedule();
    this.loadAvailableTables();
    this.loadOperatorsOptions();
  }
  
  loadSchedule = () => {
    if (this.props.state.id){
      //alert(`this.props.state.id:${this.props.state}`);
      axios.get(this.scheduleBaseUrl + `/${this.props.state.id}`)
      .then((response) => {
        this.setState({
          scheduleConfig : response.data
        });
        this.state.scheduleConfig = response.data;
        this.loadCriteriasRows();
        this.loadSelectedDays(this.state.scheduleConfig.days);
        this.loadSelectedHours(this.state.scheduleConfig.hours); 
        this.loadSelectedTablesOptions();
      }).catch((error) => {
        console.error(error);
        alert("Error getting the schedule");
      });
    }else{
      this.loadDaysOptions();
      this.loadHoursOptions();
    }
  }
  
  loadAvailableTables = () => {
    let availableTables = [];
    axios.get(this.safxTableBaseUrl)
    .then((response) => {
      //alert("response.data.content:" + response.data.content);
      this.state.safxTables = response.data.content;
      this.loadAvailableTableOptions();
      this.setState({
        safxTables : response.data.content
      });
    }).catch((error) => {
      alert("Error safxTable:" + error);
    });
  }
  
  loadAvailableTableOptions = () => {
    let availableTables = [];
    this.state.safxTables.forEach((safxTable) => {
      availableTables.push(<option value={safxTable.id}>{safxTable.name}</option>);
    });
    this.setState({
      availableTables : availableTables
    })
  }

  loadSelectedTablesOptions = () => {
    let selectedTables = [];
    this.state.scheduleConfig.safxTables.forEach((safxTable) => {
      selectedTables.push(<option value={safxTable.id}>{safxTable.name}</option>);
    });
    this.setState({
      selectedTables : selectedTables
    });
  }

  loadDaysOptions = () => {
    let days = [];
    this.daysValues.forEach((day) => {
      days.push(<option value={day.value}>{day.label}</option>);
    });
    this.setState({
      days : days
    });
  }

  loadHoursOptions = () => {
    let hours = [];
    this.state.hoursValues.forEach((hour) => {
      hours.push(<option value={hour.value}>{hour.label}</option>);
    });
    this.setState({
      hours : hours
    });
  }

  loadSafxColumnsOptions = () => {
    let safxColumns = [];
    this.state.safxColumnsValues.forEach((safxColumn) => {
      safxColumns.push(<option value={safxColumn.id}>{safxColumn.name}</option>);
    });
    this.setState({
      safxColumns : safxColumns
    });
  }
  
  loadOperatorsOptions = () => {
    let operators = [];
    this.operatorsValues.forEach((operator) => {
      operators.push(<option value={operator}>{operator}</option>);
    });
    this.setState({
      operators : operators
    })
  }

  updateField = (name, e) => {
    //alert("e.target.selectedOptions:" + e.target.selectedOptions);
    let opts = [];
    for (let op of e.target.selectedOptions) {
      console.log('op.value__:' + op.value + " - op.selected:" + op.selected)
      if (op.selected){
        opts.push(op.value);
      }
    }
    
    this.setState({
      [name] : opts
    });
    
  }
  
  componentDidUpdate(){
    //alert("componentDiddUpdate")
    if (this.updated){
      this.loadAvailableTableOptions();
      this.loadSelectedTablesOptions();
      this.updated = false;
    }
  }
  
  loadSelectedDays(days_schedule){
    let selectedDays = [];
		let days = days_schedule.split(",");
		days.forEach((day) => {
			selectedDays.push(day);
		});
    
    this.setState({
      selectedDays : selectedDays
    });
    //alert('this.state.selectedDays:' + this.state.selectedDays);
    this.state.selectedDays = selectedDays;
    this.loadDaysOptions();
	}
	
	loadSelectedHours(hours_schedule){
    let selectedHours = [];
		let hours = hours_schedule.split(",");
		hours.forEach((hour) => {
			selectedHours.push(hour);
		});
    
    this.setState({
      selectedHours : selectedHours
    });
    this.state.selectedHours = selectedHours;
    this.loadHoursOptions();
	}
  
  onAddSelected = () => {
		this.state.selectedAvaiableTables.forEach(t => {
			let el = this.state.safxTables.filter((at) => at.id == t)[0];
			this.state.scheduleConfig.safxTables.push(el);
			let i = this.state.safxTables.indexOf(el);
			this.state.safxTables.splice(i, 1);
		});
		this.state.scheduleConfig.safxTables.sort((a,b) => a.id-b.id);
    this.setState({
      scheduleConfig: this.state.scheduleConfig,
      safxTables : this.state.safxTables,
      selectedAvaiableTables : []
    });
    this.updated = true;
	}
	
	onAddAvailable = () => {
    let someSafxTableUsedInCriteria = false;
    //alert("this.state.selectedSelectedTables:" + this.state.selectedSelectedTables);
    console.log(this.state.selectedSelectedTables);
		this.state.selectedSelectedTables.forEach(t => {
      this.state.scheduleConfig.criterias.forEach((criteria) => {
				if (criteria.safxColumn.safxTable.id == t){
					someSafxTableUsedInCriteria = true;
				}
			});
		});
		if (!someSafxTableUsedInCriteria){
			this.state.selectedSelectedTables.forEach(t => {
				let el = this.state.scheduleConfig.safxTables.filter((at) => at.id == t)[0];
				this.state.safxTables.push(el);
				let i = this.state.scheduleConfig.safxTables.indexOf(el);
				this.state.scheduleConfig.safxTables.splice(i, 1);
			});
			this.state.safxTables.sort((a,b) => a.id-b.id);

      this.setState({
        scheduleConfig: this.state.scheduleConfig,
        safxTables : this.state.safxTables,
        selectedSelectedTables : []
      });
      this.updated = true;
		}else{
			alert("Existe tabela que esta sendo usadas em critérios. Remover os critérios corespondentes");
		}
	}
  
	fillHours = () => {
    this.state.hoursValues = [];
		for (let x=0; x < 24; x++){
			let hour = x + ":00";
			if (hour.length == 4){
				hour = "0" + hour;
			}
			this.state.hoursValues.push({ 'value': x + "", 'label': hour});
		}
	}
  
  onDateNumericKeydown = (e) => {
	  //alert("e.keyCode:" + e.keyCode);
		console.log(e);
		return this.isNumericInputKey(e);
	}
	
	isNumericInputKey = (e) => {
		let specialKeys = [8, 37, 38, 39, 40, 46];
		let numberKeys = [49, 50, 51, 52, 53, 54, 55, 56, 57];
		if (specialKeys.includes(e.keyCode) ||
			numberKeys.includes(e.keyCode)){
			return true;
		}else{
			return false;
		}
	}


  loadCriteriasRows = () => {
    let criteriaRows = [];
    this.state.totalPages = this.calcPages();
    let start = this.state.pagination.size*this.state.pagination.page;
    let criteriasChunck = this.state.scheduleConfig.criterias.slice(start, start + this.state.pagination.size);
    this.setState({
      totalPages : this.state.totalPages
    });
      
    criteriasChunck.forEach ((criteria) => {
      criteriaRows.push(
        <tr className="t-row">
          <td className="t-columns">{this.findTableName(criteria.safxColumn.safxTable.id)}</td>
          <td className="t-columns">{criteria.safxColumn.name}</td>
          <td className="t-columns">{criteria.operator}</td>
          <td className="t-columns">{criteria.additionalValue ? criteria.value + ' até ' + criteria.additionalValue : criteria.value}</td>
          <td class="t-columns" style={{width: '10px', padding: '1px'}}>
            <button onClick={() => this.onDelete(criteria)}>Delete</button>
          </td>
        </tr>
      );
    });
    //alert("criteriaRows:"  )
    this.setState({
      criteriaRows : criteriaRows
    });
  }
  
  calcPages = () => {
		let pages = Math.trunc(this.state.scheduleConfig.criterias.length / this.state.pagination.size);
		if (this.state.scheduleConfig.criterias.length%this.state.pagination.size != 0){
			pages++;
		}
		return pages;
	}

  
  findTableName = (id) => {
    //alert('id:' + id);
		return this.state.scheduleConfig.safxTables.filter((at) => at.id == id)[0].name;
	}

  updateScheduleConfig = (name, e) => {
    this.state.scheduleConfig[name] = e.target.value;
    this.setState({
        scheduleConfig : this.state.scheduleConfig
    });
  }
  
  onGetColumns = (e) => {
    this.state.criteria.safxColumn.safxTable.id = e.target.value;
    this.setState({
      criteria : this.state.criteria
    });
    
		axios.get(this.safxTableBaseUrl + `/${this.state.criteria.safxColumn.safxTable.id}/safxColumns?associated=true`)
		.then((response) => {
      //alert("response:" + JSON.stringify(response.data));
      if (response.data.length > 0){
        this.state.safxColumnsValues = response.data;
        //update the safxColumn to use in the criteria object
        this.state.criteria.safxColumn.id = this.state.safxColumnsValues[0].id;

        this.setState({
          safxColumnsValues : response.data,
          criteria : this.state.criteria
        })
        //reload
        this.loadSafxColumnsOptions();
      }else{
        this.state.safxColumnsValues = [];
        this.state.criteria.safxColumn.id = '';
        this.setState({
          safxColumnsValues : response.data,
          criteria : this.state.criteria
        });
        this.loadSafxColumnsOptions();
      }
		}).catch ((error) => {
      alert("Error getting columns");
    });
  }
  
  onUpdateCriteria = (name, e) => {
    //alert('name:' + name);
    if (name == 'safxColumn.id'){
      this.state.criteria.safxColumn.id = e.target.value;
      //this.state.criteria.safxColumn.safxTable.id = null;
      console.log(this.state.criteria);
    }else{
      this.state.criteria[name] = e.target.value;
    }
    this.setState({
      criteria : this.state.criteria
    });
  }

  onDateCheck = (e) => {
    this.setState({
      dateField : e.target.checked 
    });
  }
  
  onAdd = () => {
    let safxColumnName = this.state.safxColumnsValues.filter((c) => c.id == this.state.criteria.safxColumn.id)[0].name;
		this.state.criteria.safxColumn.name = safxColumnName;
    this.state.scheduleConfig.criterias.push(this.state.criteria);
    //this.state.criteria = {...this.criteriaInitialState}; for some reason dont clone!
    this.state.criteria = JSON.parse(JSON.stringify(this.criteriaInitialState));
    alert('this.state.!!!criteria:' + JSON.stringify(this.state.criteria));
    alert('this.state.criteria.value:' + this.state.criteria.value);
    this.setState({
      scheduleConfig : this.state.scheduleConfig,
      criteria : this.state.criteria,
      safxColumns : []
    });
    this.loadCriteriasRows();
  }

	generateDaysValue = () => {
		let days = '';
		//alert("this.selectedDays:" + JSON.stringify(this.selectedDays));
		this.state.selectedDays.forEach((day) => {
			days += day + ',';
		});
		
		if (days.length > 0){
			days = days.substring(0, days.length-1);
		}
		this.state.scheduleConfig.days = days;
	}

	generateHoursValue = () => {
		let hours = '';
		this.state.selectedHours.forEach((hour) => {
			hours += hour + ',';
		});
		
		if (hours.length > 0){
			hours = hours.substring(0, hours.length-1);
		}
		this.state.scheduleConfig.hours = hours;
	}


  onSave = () => {
		/*if (!this.valid()){
			return;
		}*/
		this.generateDaysValue();
		this.generateHoursValue();
		axios.post(this.scheduleBaseUrl, this.state.scheduleConfig)
		.then((response) => {
			alert("Agendamento salvo com sucesso");
		}).catch((error) => {
      alert("Error" + error);
    });
  }
  
  onBack = () => {
    this.props.navigate('/schedule-list');
  }
  
	onDelete = (criteria) => {
		let criteriaFound = this.state.scheduleConfig.criterias.indexOf(criteria);
		//alert("criteriaFound:" + criteriaFound);
		this.state.scheduleConfig.criterias.splice(criteriaFound, 1);
    this.setState({
      scheduleConfig : this.state.scheduleConfig
    });
    this.loadCriteriasRows();
	}
	
  onPage = (page) => {
		if (page >= 0 && page < this.state.totalPages){
			this.state.pagination.page=page;
			/*let start = this.state.pagination.page*this.state.pagination.size;
			this.state.emails = this.state.emailsFull.slice(start, start + this.state.pagination.size);
      this.setState({
        emails : this.state.emails
      });
      */
      this.loadCriteriasRows();
		}
	}


  render() {
    return (
      <div className="local-card content">
        <div>
          {/*
          <!--h1>HI FOLKS</h1-->
          */}
          <div className="tltle">Agendamento</div>
          <div className="bordered">
            <div style={{display: 'flex', margin: '30px 0 0 28px'}}>
              <div style={{fontSize: '14px', marginRight: '13px'}}>Nome</div>
              <input value={this.state.scheduleConfig.name} onChange={(e) => this.updateScheduleConfig('name', e) } type="text" maxLength="40" size="40"/>
            </div>
            <div style={{display:'flex'}}>
              <div style={{display: 'flex', width: '50%'}}>
                <div style={{margin: '32px 0 0 28px', display: 'flex', width: '35%'}}>
                  <div className="schedule-list-container" >Disponiveis</div>
                  <select className="height144" multiple value={this.state.selectedAvaiableTables} onChange={(e) => this.updateField('selectedAvaiableTables', e)}
                    style={{width: '100px', height: '144px !important', padding: '5px'}} draggable="true">
                    {this.state.availableTables}
                  </select>
                </div>
                <div style={{padding: '54px 20px 0 20px'}}>
                  <div>
                    <button onClick={this.onAddSelected}>></button>
                  </div>
                  <div>
                    <button onClick={this.onAddAvailable}>&lt;</button>
                  </div>
                </div>
                <div style={{marginTop: '32px', display: 'flex', width: '35%'}}>
                  <div className="schedule-list-container">Selecionadas</div>
                  <select className="height144" multiple value={this.state.selectedSelectedTables} onChange={(e) => this.updateField('selectedSelectedTables', e)}
                    style={{width: '100px', height: '144px !important', padding: '5px'}}>
                    {this.state.selectedTables}
                  </select>
                </div>
              </div>
              <div style={{display: 'flex', width: '37%'}}>
                <div style={{margin: '32px 0 0 100px', display: 'flex', width: '35%'}}>
                  <div className="schedule-list-container">Dias</div>
                  <select className="height144" multiple value={this.state.selectedDays} onChange={(e) => this.updateField('selectedDays', e)} style={{width: '100px', height: '144px !important', padding: '5px'}}>
                    {this.state.days}
                  </select>
                </div>
                <div style={{margin: '32px 0 0 28px', display: 'flex', width: '35%'}}>
                  <div className="schedule-list-container">Horas</div>
                  <select className="height144"  multiple value={this.state.selectedHours} onChange={(e) => this.updateField('selectedHours', e)} style={{width: '100px', height: '144px !important', padding: '5px'}}>
                    {this.state.hours}
                  </select>
                </div>
              </div>
            </div>
            <div style={{margin:'17px 0 0 28px'}}>
              <div className="table-title">Critérios</div>
              <div style={{margin: '5px 0 10px 0', width:'97%'}}>
                <table cellspacing="0" style={{width: '100%'}}>
                  <thead>
                    <tr>
                      <td className="table-header" style={{width: '12%'}}>Tabela</td>
                      <td className="table-header" style={{width: '21%'}}>Coluna</td>
                      <td className="table-header" style={{width: '12%'}}>Operador</td>
                      <td className="table-header" style={{width: '45%'}}>Valor</td>
                      <td className="table-header" style={{width: '7%'}}></td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="t-row">
                      <td className="t-columns" style={{padding: '1px'}}>
                        <select value={this.state.criteria.safxColumn.safxTable.id} onChange={(e) => this.onGetColumns(e)} style={{width: '85px'}}>
                          <option value="null"/>
                          {this.state.selectedTables}
                        </select>
                      </td>
                      <td className="t-columns" style={{padding: '1px'}}>
                        <select value={this.state.criteria.safxColumn.id} onChange={(e) => this.onUpdateCriteria('safxColumn.id', e)}
                          style={{width: '154px'}}>
                          {this.state.safxColumns}
                        </select>
                      </td>
                      <td className="t-columns" style={{padding: '1px'}}>
                        <select value={this.state.criteria.operator} onChange={(e) => this.onUpdateCriteria('operator', e)}>
                          {this.state.operators}
                        </select>
                      </td>
                      <td className="t-columns" style={{padding: '1px'}}>
                        <div style={{display:'flex'}}>
                          <div style={{display : (this.state.criteria.operator == '=' || 
                            this.state.criteria.operator == '!=') ? 'block' : 'none', width:'290px'}}>
                            <input type="text" value={this.state.criteria.value} onChange={(e) => this.onUpdateCriteria('value', e) } 
                              maxlength="40"/>
                          </div>
                          <div style={{display : (this.state.criteria.operator == '>=' || 
                            this.state.criteria.operator == '<=') ? 'block' : 'none', width:'290px'}}>
                            <input type={this.state.dateField == true ? 'date' : 'text'}
                              value={this.state.criteria.value} onChange={(e) => this.onUpdateCriteria('value', e)} 
                              onKeyDown={(e) => this.onDateNumericKeydown(e)} maxlength="40" style={{width:'120px'}}/>
                          </div>
                          <div style={{display : this.state.criteria.operator == 'between' ? 'flex' : 'none', width:'290px'}}>
                            <input type={this.state.dateField == true ? 'date' : 'text'} 
                              value={this.state.criteria.value} onChange={(e) => this.onUpdateCriteria('value', e)} 
                              onKeyDown={(e) => this.onDateNumericKeydown(e)} maxlength="40" style={{width:'120px'}}/>até
                            <input type={this.state.dateField == true ? 'date' : 'text'} 
                              value={this.state.criteria.additionalValue} onChange={(e) => this.onUpdateCriteria('additionalValue', e)} 
                              onKeyDown={(e) => this.onDateNumericKeydown(e)}  maxlength="40" style={{width:'120px'}}/>
                          </div>
                          <div style={{display : (this.state.criteria.operator == '<=' || 
                            this.state.criteria.operator == '>=' || this.state.criteria.operator == 'between') ? 'block' : 'none'}}>
                              <input type="checkbox" value={this.state.dateField} onClick={(e) => this.onDateCheck(e)}/>Date
                          </div>
                        </div>
                      </td>
                      <td className="t-columns" style={{width: '10px', padding: '1px'}}>
                        <button onClick={this.onAdd}>Add</button>
                      </td>
                    </tr>
                    {this.state.criteriaRows}
                  </tbody>
                </table>
                <div style={{display:'flex', marginLeft: '10px', marginTop:'5px'}}>
                  <div style={{width:'90%'}}></div>
                    <Pagination pagination={this.state.pagination} totalPages={this.state.totalPages} onPage={this.onPage} />
                </div>
              </div>
            </div>
            <div style={{width: '97%', direction: 'rtl', margin: '5px 0 12px 0'}}>
              <button onClick={this.onSave}>Salvar</button> 
              <button onClick={this.onBack} style={{marginRight:'5px'}}>Cancelar</button>
              <button onClick={this.onProcess} style={{marginRight:'5px'}}>Process</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  onProcess = () => {
    alert("in onProcess");
  }
  
  onOperatorChange = () => {
    alert("in onOperatorChange");
  }

}


function Schedule(props){
  let navigate = useNavigate();
  let { state } = useLocation();
  return (<ScheduleInner {...props} navigate={navigate} state={{...state}}/>);
}

export default Schedule;