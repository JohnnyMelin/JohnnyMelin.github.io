/**
 * @Created Feb 18, 2020
 * @LastUpdate
 * @author Johnny Melin, Oscar Ullberg, Martin Marklund
 */

//import {create_parallelCoordinates} from './pc.js';
//import {create_parallelSet} from './pss.js';

queue()
  .defer(d3.csv,'data/ks-projects-201801.csv')
  .defer(d3.csv,'data/world_data.csv')
  .defer(d3.csv,'data/test.csv')
  .defer(d3.csv,'data/sankey.csv')
  .await(draw);

var pss, pc, world_map, points;
var parsed_map;

function draw(error, data2, world_data, data4, sankey) {
  if (error) throw error;
 console.log("Code Starts");
  var arr = [];
  var map_data = [];
  var sankey_data = [];
  for(var i = 0; i < world_data.length; ++i)
  {
    map_data.push(world_data[i]);
  }
  for(var i = 0; i < 5000; ++i){
    arr.push(data2[i]);
  }
  for(var i = 1; i < 250; ++i){
    sankey_data.push(sankey[i]);
  }

  //console.log(arr);

  parsed_map = parseMap(map_data);
  var parsedData = parseData(arr); // parse the data so we have no incomplete items.
  var parsed_sankey = parseSankey(sankey_data); // Format data so the pss can display it
  //Test different data at the end!

  //create_parallelCoordinates(parseData);
  //create_parallelSet(parseData);

  pc = new pc(parsedData);
  pss = new pss(parsed_sankey);
  map = new world_map(parsed_map, ['#74c476', '#238b45', '#005a32', 'yellow']);
  console.log("Code Ends");
}

function numberOfDays(d){
    var ymd = d.launched.substring(0,10);
    var launched = ymd.split('-');
    var startDate = new Date(launched[0], launched[1], launched[2]);

    var deadline = d.deadline.split('-');
    var endDate = new Date(deadline[0], deadline[1], deadline[2])

    return Math.round((endDate - startDate)/(1000*60*60*24));
}


function dateRange(numDays){
      if(numDays >= 50)
            return ">50 days"
      if(numDays >= 40)
            return "40-50 days"
      if(numDays >= 30)
            return "30-40 days"
      if(numDays >= 20)
            return "20-30 days"
      if(numDays >= 10)
            return "10-20 days"
      return "<10 days"
}

function profitRange(suc){
      if(suc >= 200)
            return ">200%"
      if(suc >= 120)
            return "120%-200%"
      if(suc >= 100)
            return "100%-120%"
      if(suc >= 50)
            return "50%-100%"
      if(suc >= 25)
            return "25%-50%"
      if(suc >= 10)
            return "10%-25%"

      return "<10%";
}

function getProfit(d){
    var test = Math.round((d.usd_pledged_real/d.usd_goal_real)*(100));
    return test;
}

function parseData(data){

  var arr = [];
  for (var i in data){
    var bool = true;
    var item = data[i];
    for (var j in item){
      // If an object is missing a property, exclude it.
      if(item[j] === "" || typeof item[j] === "undefined"){
        bool = false;
      }
    }
    if(bool){
          var test = 0;
          profit = getProfit(item);
      arr.push({
        backers: item.backers == 0 ? 1 : item.backers, // Must not be zero for log scale to work
        category: item.category,
        country: item.country,
        currency: item.currency,
        deadline: item.deadline,
        goal: item.goal,
        ID: item.ID,
        launched: item.launched,
        main_category: item.main_category,
        name: item.name,
        pledged: item.pledged == 0 ? 1 : item.pledged,  // Must not be zero for log scale to work
        state: item.state,
        usd_pledged: item["usd pledged"] == 0 ? 1 : item["usd pledged"],
        usd_goal_real: item.usd_goal_real == 0 ? 1 : item.usd_goal_real ,
        usd_pledged_real: item.usd_pledged_real == 0 ? 1 : item.usd_pledged_real,
        number_of_days : numberOfDays(item),
        //date_range : dateRange(numberOfDays(item)),
        profit_rate : profit == 0 ? 1 : profit, // Must not be zero for log scale to work
        //profit_range : profitRange(profit),

      });
    }
  }
  //console.log(`Number of invalid objects = ${data.length - arr.length}`);
  return arr;
}

//Function to see if we already have a connection from that specific
//from to to.
function contains(array, object){
      //We wanna know where the connection already exists so that we
      //can increment that connections' value.
  var positionInList = 0;
  array.forEach(item => {
    if(item.from == object.from && item.to == object.to)
      return positionInList;

    positionInList++;
  })
  return undefined;
}


function parseMap(data) {
  var arr = [];
  for(var i in data) {
    var valid = true;
    var item = data[i];
    // Filter out invalid objects
    for (var j in item) {
      if(item[j] === "" || typeof item[j] === "undefined") {
        valid = false;
      }
    }
    if(valid) {
      arr.push({
        country : item.country_3,
        //country_3  : item.country_3,
        state : item.state,
        state_value : item.state_value
      });
    }
  }

  return arr;

}


function parseSankey(data){
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
  console.log("Array:")
  console.log(arr)
  return arr;
}


// Fill all countries with default colors
function filterDefault() {
      colors = ['#74c476', '#238b45', '#005a32', 'yellow'];
      map = new world_map(parsed_map, colors);
}
// Fill all countries with gray except high
function filterHigh() {
      colors = ['gray', 'gray', '#005a32', 'gray'];
      map = new world_map(parsed_map, colors);
}
// Fill all countries with gray except low
function filterLow() {
      colors = ['#74c476', 'gray', 'gray', 'gray'];
      map = new world_map(parsed_map, colors);
}
// Fill all countries with gray except med
function filterMedium() {
      colors = ['gray', '#238b45', 'gray', 'gray'];
      map = new world_map(parsed_map, colors);
}
