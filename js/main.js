/**
 * @Created Feb 18, 2020
 * @LastUpdate
 * @author Johnny Melin, Oscar Ullberg, Martin Marklund
 */

queue()
  .defer(d3.csv, 'data/ks-projects-201801.csv')
  .defer(d3.csv, 'data/world_data.csv')
  .defer(d3.csv, 'data/sankey.csv')
  .await(draw);

var parsed_full, parsed_sankey, parsed_map;
var pss, pc, world_map, points;

function draw(error, full, world_data, sankey) {
  if (error) throw error;
  console.log("Code Starts");

  var full_data = [];
  var map_data = [];
  var sankey_data = [];

  for (var i = 0; i < world_data.length; ++i) {
    map_data.push(world_data[i]);
  }
  for (var i = 0; i < 2500; ++i) {
    full_data.push(full[i]);
  }
  for (var i = 1; i < 250; ++i) {
    sankey_data.push(sankey[i]);
  }

  // Parse the data so we have no incomplete items.
  parsed_map = parseMap(map_data);
  parsed_full = parseFull(full_data);
  parsed_sankey = parseSankey(sankey_data);

  // Create views
  map = new world_map(parsed_map, ['#74c476', '#238b45', '#005a32', 'yellow']); // With default fills
  pss = new pss(parsed_sankey);
  pc = new pc(parsed_full);

  console.log("Code Ends");
}

function numberOfDays(d) {
  var ymd = d.launched.substring(0, 10);
  var launched = ymd.split('-');
  var startDate = new Date(launched[0], launched[1], launched[2]);

  var deadline = d.deadline.split('-');
  var endDate = new Date(deadline[0], deadline[1], deadline[2])

  return Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
}

function getProfit(d) {
  var profit = Math.round((d.usd_pledged_real / d.usd_goal_real) * (100));
  return profit;
}

function parseFull(data) {

  var arr = [];
  for (var i in data) {
    var valid = true;
    var item = data[i];
    for (var j in item) {
      var days = numberOfDays(item)
      // If an object is missing a property or includes faulty data, exclude it.
      if (item[j] === "" || typeof item[j] === "undefined" || days > 1000) {
        valid = false;
      }
    }
    if (valid) {
      var profit = getProfit(item);
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
        usd_goal_real: item.usd_goal_real == 0 ? 1 : item.usd_goal_real,
        usd_pledged_real: item.usd_pledged_real == 0 ? 1 : item.usd_pledged_real,
        number_of_days: days,
        profit_rate: profit == 0 ? 1 : profit, // Must not be zero for log scale to work
      });
    }
  }
  return arr;
}

function parseMap(data) {
  var arr = [];
  for (var i in data) {
    var valid = true;
    var item = data[i];
    // Filter out invalid objects
    for (var j in item) {
      if (item[j] === "" || typeof item[j] === "undefined") {
        valid = false;
      }
    }
    if (valid) {
      arr.push({
        country: item.country_3,
        state: item.state,
        state_value: item.state_value
      });
    }
  }
  return arr;
}

function parseSankey(data) {
  var wantedCategories = ['country', 'main_category', 'date_range', 'state', 'profit'];
  var sankeyData = [];
  data.forEach(entry => {
    // Push initial element
    if (sankeyData.length == 0) {
      sankeyData.push(
        {
          country: entry.country,
          main_category: entry.main_category,
          date_range: entry.date_range,
          state: entry.state,
          profit: entry.profit,
          ID: entry.ID,
          value: 1
        })
    }
    // If array isn't empty, check if identical element already is present in array
    else {
      let exists = false;
      for (i = 0; i < sankeyData.length; ++i) {
        // If identical element already exist, increment its value property
        if (entry[wantedCategories[0]] == sankeyData[i][wantedCategories[0]] &&
          entry[wantedCategories[1]] == sankeyData[i][wantedCategories[1]] &&
          entry[wantedCategories[2]] == sankeyData[i][wantedCategories[2]] &&
          entry[wantedCategories[3]] == sankeyData[i][wantedCategories[3]] &&
          entry[wantedCategories[4]] == sankeyData[i][wantedCategories[4]]) {
          sankeyData[i].value += 1;
          exists = true;
          break;
        }
      }
      // Push the new, unique, element to the array
      if (exists == false) {
        sankeyData.push({
          country: entry.country,
          main_category: entry.main_category,
          date_range: entry.date_range,
          state: entry.state,
          profit: entry.profit,
          ID: entry.ID,
          value: 1
        });
      }
    }
  });
  // Set the paths
  var arr = [];
  sankeyData.forEach(entry => {
    for (id_section = 1; id_section < wantedCategories.length; id_section++) {
      arr.push(
        {
          from: entry[wantedCategories[id_section - 1]],
          to: entry[wantedCategories[id_section]],
          value: entry.value,
          id: entry.ID + "-" + ((id_section % wantedCategories.length) - 1),
        });
    }
  });
  return arr;
}

// Fill all countries with default colors
function filterDefault() {
  colors = ['#74c476', '#238b45', '#005a32', 'yellow'];
  map = new world_map(parsed_map, colors);
}
// Fill all countries except high with gray
function filterHigh() {
  colors = ['gray', 'gray', '#005a32', 'gray'];
  map = new world_map(parsed_map, colors);
}
// Fill all countries except low with gray 
function filterLow() {
  colors = ['#74c476', 'gray', 'gray', 'gray'];
  map = new world_map(parsed_map, colors);
}
// Fill all countries except med with gray 
function filterMedium() {
  colors = ['gray', '#238b45', 'gray', 'gray'];
  map = new world_map(parsed_map, colors);
}
