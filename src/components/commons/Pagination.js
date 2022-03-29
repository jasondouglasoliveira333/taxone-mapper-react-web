import React from 'react';

class Pagination extends React.Component {
	
	constructor(props){
    super(props);
    this.state = {
      buttons : []
    }
	}
	
	pages(){
		let pages = new Array();
		for (let x=this.props.pagination.page; x < this.props.pagination.page+3 && x < this.props.totalPages; x++){
			pages.push(x);
		}
		let length = pages.length;
		for (let x=0; x < Math.min(3, this.props.totalPages) - length; x++){
			pages.splice(0,0, pages[0]-1);
		}
		return pages;
	}
  
  generateButtons = () => {
    let buttonsHtml = [];
    this.pages().forEach ((page) => {
      buttonsHtml.push(<button onClick={() => this.props.onPage(page)} className="page-button">{page+1}</button>);
    });
    this.state.buttons = buttonsHtml;
  }

	render() {
    this.generateButtons();
	  return (
      <div style={{display:'flex'}}>
        <button onClick={() => this.props.onPage(0)} className="page-button" style={{borderRadius: '5px 0 0 5px'}}>&lt;&lt;</button>
        <button onClick={() => this.props.onPage(this.props.pagination.page-1)} className="page-button">&lt;</button>
        <button style={{display: this.props.pagination.page > 0 ? 'block' : 'none'}} className="page-button">...</button>
        {this.state.buttons}
        <button style={{dsiplay: this.props.totalPages > 3 && this.props.pagination.page+1 != this.props.totalPages ? 'block' : 'none'}} className="page-button">...</button>
        <button onClick={() => this.props.onPage(this.props.pagination.page+1)} className="page-button">></button>
        <button onClick={() => this.props.onPage(this.props.totalPages-1)} className="page-button" style={{borderRadius: '0 5px 5px 0'}}>>></button>
      </div>
	  );
	}

}

class PaginationModel {
  page = 0;
	size = 10;
}

export default Pagination;
export { PaginationModel };