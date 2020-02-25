/**
 * @Created Feb 25, 2019
 * @LastUpdate Feb 25, 2019
 * @author Johnny Melin
 */
queue()
  .defer(d3.csv,'data/ks-projects-201612.csv')
  .defer(d3.csv,'data/ks-projects-201801.csv')
  .defer(d3.csv,'data/test.csv')
  .await(draw);

var pc, world_map, points;

function draw(error, data1, data2, data3) {
    if (error) throw error;
    console.log("Code Starts");
    var arr = [];
    for(var i = 0; i < 100; ++i){
      //console.log(data2[i]);
      arr.push(data2[i]);
    }

    var parsedData = parseData(arr); // parse the data so we have no incomplete items.
  //Test different data at the end!
  pc = new pc(parsedData);
  console.log("Code Ends");
}

function rangeDays(d){
      var ymd = d.launched.substring(0,10);
      var launched = ymd.split('-');
      var deadline = d.deadline.split('-');
      var startDate = new Date(launched[0], launched[1], launched[2]);
      var endDate = new Date(deadline[0], deadline[1], deadline[2])


      return Math.round((endDate - startDate)/(1000*60*60*24));
}

function getSuccess(d){
      var test = Math.round((d.usd_pledged_real/d.usd_goal_real)*(100));
      return test;
}

function parseData(data){
  console.log(data.length);
  var arr = [];
  for (var i in data){
    var bool = true;
    var item = data[i];
    for (var j in item){
      if(item[j] === ""){
        bool = false;
      }
    }
    if(bool){
          var test = 0;
          test = getSuccess(item);
      arr.push({
        backers: item.backers,
        category: item.caregory,
        country: item.country,
        currency: item.currency,
        deadline: item.deadline,
        goal: item.goal,
        ID: item.ID,
        launched: item.launched,
        main_category: item.main_category,
        name: item.name,
        pledged: item.pledged,
        state: item.state,
        usd_pledged: item["usd pledged"],
        usd_goal_real: item.usd_goal_real,
        usd_pledged_real: item.usd_pledged_real,
        dateRange : rangeDays(item),
        successRate : test,
      });
    }
  }
  console.log(arr.length);
  return arr;
}
