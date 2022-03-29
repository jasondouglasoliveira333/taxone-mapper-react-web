import moment from 'moment';


export function formatDDMMYYYY(sDate){
  let newDate = moment(sDate).format('DD/MM/YYYY hh:mm:ss');
  return newDate;
}