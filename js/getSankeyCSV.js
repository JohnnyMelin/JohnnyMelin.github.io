function getSankeyCSV(data){
  var wantedCategories = ['country', 'main_category', 'date_range', 'state', 'profit'];
  var sankeyData = [];
  data.forEach(entry => {

    if(sankeyData.length == 0){
      console.log(entry)
      sankeyData.push(
      {
        country : entry.country,
        main_category : entry.main_category,
        date_range : entry.date_range,
        state : entry.state,
        profit : entry.profit,
        ID : entry.ID,
        value : 1
      })
    }
    else {
      var bool = false;
      for(i = 0; i < sankeyData.length; ++i)
      {
        if(entry[wantedCategories[0]] == sankeyData[i][wantedCategories[0]] && entry[wantedCategories[1]] == sankeyData[i][wantedCategories[1]] && entry[wantedCategories[2]] == sankeyData[i][wantedCategories[2]] && entry[wantedCategories[3]] == sankeyData[i][wantedCategories[3]] && entry[wantedCategories[4]] == sankeyData[i][wantedCategories[4]])
        {
          sankeyData[i].value += 1;
          bool = true;
          break;
        }
      }
      if(bool == false){
        sankeyData.push({
          country : entry.country,
          main_category : entry.main_category,
          date_range : entry.date_range,
          state : entry.state,
          profit : entry.profit,
          ID : entry.ID,
          value : 1
        });
      }
    }
  });
  var arr = [];
    sankeyData.forEach( entry => {
      for(id_section = 1; id_section < wantedCategories.length; id_section++ )
      {
        arr.push(
          {
            from: entry[wantedCategories[id_section - 1]],
            to: entry[wantedCategories[id_section]],
            value : entry.value,
            id: entry.ID + "-" + ((id_section % wantedCategories.length) - 1),
          });
      }
    });


// put it into a csv file
 let csv = ""
 let items = arr;
 console.log(items);
// Loop the array of objects
for(let row = 0; row < items.length; row++){
    let keysAmount = Object.keys(items[row]).length
    let keysCounter = 0
    // If this is the first row, generate the headings
    if(row === 0){

       // Loop each property of the object
       for(let key in items[row]){

                           // This is to not add a comma at the last cell
                           // The '\r\n' adds a new line
           csv += key + (keysCounter+1 < keysAmount ? ',' : '\r\n' )
           keysCounter++
       }
    }else{
       for(let key in items[row]){
           csv += items[row][key] + (keysCounter+1 < keysAmount ? ',' : '\r\n' )
           keysCounter++
       }
    }

    keysCounter = 0
}

// Once we are done looping, download the .csv by creating a link
let link = document.createElement('a')
link.id = 'download-csv'
link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csv));
link.setAttribute('download', 'yourfiletextgoeshere.csv');
document.body.appendChild(link)
document.querySelector('#download-csv').click()
}
