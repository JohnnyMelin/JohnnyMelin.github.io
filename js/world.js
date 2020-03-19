
function world_map(data, colors) {

  // AUS, AUT, BEL, CAN, DNK, FRA, DEU, HKH, IRL, ITA, JPN, LUX, MEX, NZL, NOR, SGP, ESP, SWE, CHE, NLD, GBR, USA

  // No. projects in each country
  var frequency = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  // No. successful projects in each country
  var rate = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  // This array will hold the fill for each country
  var fills = ['UNKNOWN', 'UNKNOWN', 'UNKNOWN', 'UNKNOWN', 'UNKNOWN', 'UNKNOWN',
    'UNKNOWN', 'UNKNOWN', 'UNKNOWN', 'UNKNOWN', 'UNKNOWN', 'UNKNOWN',
    'UNKNOWN', 'UNKNOWN', 'UNKNOWN', 'UNKNOWN', 'UNKNOWN', 'UNKNOWN',
    'UNKNOWN', 'UNKNOWN', 'UNKNOWN', 'UNKNOWN'];

  calcFreq();
  calcRates();
  decideFill();

  var map = new Datamap(
    {
      scope: 'world',
      element: document.getElementById('map-container'),
      responsive: false,
      fills: {
        LOW: colors[0],
        MEDIUM: colors[1],
        HIGH: colors[2],
        UNKNOWN: colors[3],
        defaultFill: 'gray'
      },
      data: {
        AUS: {
          fillKey: fills[0],
          total: frequency[0],
          rate: rate[0]
        },
        AUT: {
          fillKey: fills[1],
          total: frequency[1],
          rate: rate[1]
        },
        BEL: {
          fillKey: fills[2],
          total: frequency[2],
          rate: rate[2]
        },
        CAN: {
          fillKey: fills[3],
          total: frequency[3],
          rate: rate[3]
        },
        DNK: {
          fillKey: fills[4],
          total: frequency[4],
          rate: rate[4]
        },
        FRA: {
          fillKey: fills[5],
          total: frequency[5],
          rate: rate[5]
        },
        DEU: {
          fillKey: fills[6],
          total: frequency[6],
          rate: rate[6]
        },
        HKG: {
          fillKey: fills[7],
          total: frequency[7],
          rate: rate[7]
        },
        IRL: {
          fillKey: fills[8],
          total: frequency[8],
          rate: rate[8]
        },
        ITA: {
          fillKey: fills[9],
          total: frequency[9],
          rate: rate[9]
        },
        JPN: {
          fillKey: fills[10],
          total: frequency[10],
          rate: rate[10]
        },
        LUX: {
          fillKey: fills[11],
          total: frequency[11],
          rate: rate[11]
        },
        MEX: {
          fillKey: fills[12],
          total: frequency[12],
          rate: rate[12]
        },
        NZL: {
          fillKey: fills[13],
          total: frequency[13],
          rate: rate[13]
        },
        NOR: {
          fillKey: fills[14],
          total: frequency[14],
          rate: rate[14]
        },
        SGP: {
          fillKey: fills[15],
          total: frequency[15],
          rate: rate[15]
        },
        ESP: {
          fillKey: fills[16],
          total: frequency[16],
          rate: rate[16]
        },
        SWE: {
          fillKey: fills[17],
          total: frequency[17],
          rate: rate[17]
        },
        CHE: {
          fillKey: fills[18],
          total: frequency[18],
          rate: rate[18]
        },
        NLD: {
          fillKey: fills[19],
          total: frequency[19],
          rate: rate[19]
        },
        GBR: {
          fillKey: fills[20],
          total: frequency[20],
          rate: rate[20]
        },
        USA: {
          fillKey: fills[21],
          total: frequency[21],
          rate: rate[21]
        }
      },
      // Create pop-up details
      geographyConfig: {
        popupTemplate:
          function (geo, data) {
            return ['<p>',
              'Total number of projects in ' + geo.properties.name,
              ': ' + data.total,
              '</p>',
              '<p>',
              'Success rate: ' + data.rate + '%',
              '</p>',
            ].join('');
          },
        popupOnHover: true
      }
    }
  );
  // Loop over all data and update sums array accordingly
  function calcFreq() {
    for (var i in data) {
      var item = data[i];
      // AUS, AUT, BEL, CAN, DNK, FRA, DEU, HKH, IRL, ITA, JPN, LUX, MEX, NZL, NOR, SGP, ESP, SWE, CHE, NLD, GBR, USA
      switch (item.country) {
        case "AUS":
          frequency[0]++;
          if (parseInt(item.state_value) == 1) // IF successful, then increment rate
            rate[0]++;
          break;
        case "AUT":
          frequency[1]++;
          if (parseInt(item.state_value) == 1)
            rate[1]++;
          break;
        case "BEL":
          frequency[2]++;
          if (parseInt(item.state_value) == 1)
            rate[2]++;
          break;
        case "CAN":
          frequency[3]++;
          if (parseInt(item.state_value) == 1)
            rate[3]++;
          break;
        case "DNK":
          frequency[4]++;
          if (parseInt(item.state_value) == 1)
            rate[4]++;
          break;
        case "FRA":
          frequency[5]++;
          if (parseInt(item.state_value) == 1)
            rate[5]++;
          break;
        case "DEU":
          frequency[6]++;
          if (parseInt(item.state_value) == 1)
            rate[6]++;
          break;
        case "HKG":
          frequency[7]++;
          if (parseInt(item.state_value) == 1)
            rate[7]++;
          break;
        case "IRL":
          frequency[8]++;
          if (parseInt(item.state_value) == 1)
            rate[8]++;
          break;
        case "ITA":
          frequency[9]++;
          if (parseInt(item.state_value) == 1)
            rate[9]++;
          break;
        case "JPN":
          frequency[10]++;
          if (parseInt(item.state_value) == 1)
            rate[10]++;
          break;
        case "LUX":
          frequency[11]++;
          if (parseInt(item.state_value) == 1)
            rate[11]++;
          break;
        case "MEX":
          frequency[12]++;
          if (parseInt(item.state_value) == 1)
            rate[12]++;
          break;
        case "NZL":
          frequency[13]++;
          if (parseInt(item.state_value) == 1)
            rate[13]++;
          break;
        case "NOR":
          frequency[14]++;
          if (parseInt(item.state_value) == 1)
            rate[14]++;
          break;
        case "SGP":
          frequency[15]++;
          if (parseInt(item.state_value) == 1)
            rate[15]++;
          break;
        case "ESP":
          frequency[16]++;
          if (parseInt(item.state_value) == 1)
            rate[16]++;
          break;
        case "SWE":
          frequency[17]++;
          if (parseInt(item.state_value) == 1)
            rate[17]++;
          break;
        case "CHE":
          frequency[18]++;
          if (parseInt(item.state_value) == 1)
            rate[18]++;
          break;
        case "NLD":
          frequency[19]++;
          if (parseInt(item.state_value) == 1)
            rate[19]++;
          break;
        case "GBR":
          frequency[20]++;
          if (parseInt(item.state_value) == 1)
            rate[20]++;
          break;
        case "USA":
          frequency[21]++;
          if (parseInt(item.state_value) == 1)
            rate[21]++;
          break;

      }
    }
  }

  function calcRates() {
    for (let i = 0; i < rate.length; i++) {
      rate[i] = Math.round((rate[i] / frequency[i]) * 100);
    }
  }

  function decideFill() {
    for (let i = 0; i < rate.length; i++) {
      if (rate[i] < 20)
        fills[i] = "LOW";
      else if (rate[i] < 30)
        fills[i] = "MEDIUM";
      else if (rate[i] < 40)
        fills[i] = "HIGH";
    }
  }
}
