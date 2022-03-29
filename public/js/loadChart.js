//'piechart'
function loadChart(){
  // Load google charts
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChart);
}


// Draw the chart and set the chart values
function drawChart() {
  var data = google.visualization.arrayToDataTable(chartData);

  // Display the chart inside the <div> element with id="piechart"
  var chart = new google.visualization.PieChart(document.getElementById(id));
  chart.draw(data, options);
  
  google.visualization.events.addListener(chart, 'click', selectHandler);
}

function selectHandler(e) {
  //alert('Chart clicked' + JSON.stringify(e));
  if(e.targetID == 'slice#0'){
	document.getElementById("processingButton").click();
  }else if(e.targetID == 'slice#1'){
	document.getElementById("processingErrorButton").click();
  }else if(e.targetID == 'slice#2'){
	document.getElementById("sentButton").click();
  }else if(e.targetID == 'slice#3'){
	document.getElementById("processedButton").click();
  }else	{
	document.getElementById("errorTaxoneButton").click();
  }
}

