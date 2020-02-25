function world(dota)
{
    var div = '#world_map';
    var parentWidth = $(div).parent().width();
    var parentHeight = $(div).parent().height();
    var margin = { top: 40, right: 10, bottom: 10, left: 30 },
        width = parentWidth - margin.left - margin.right,
        height = parentHeight  - margin.top - margin.bottom;

    var svg = d3.select(div)
      .append("svg")
        .attr("width", width)
        .attr("height", height + margin.top + margin.bottom)

    const projection =  d3.geoNaturalEarth1();
    const pathGenerator = d3.geoPath().projection(projection);
    const data = dota;

    const h = svg.append('g');

    h.append('path')
      .attr("class","globe")
      .attr('d', pathGenerator({type: "Sphere"}));

    svg.call(d3.zoom().scaleExtent([1/2,4]).on('zoom', () => {
        return h.attr("transform", d3.event.transform);
    }));


    d3.tsv('https://unpkg.com/world-atlas@1.1.4/world/50m.tsv' , function(tsv){
        d3.json('https://unpkg.com/world-atlas@1.1.4/world/50m.json', function(json) {
              const countries = topojson.feature(json, json.objects.countries)
              const countryName = {}; // generate a lookup table for country name based on country ID
              tsv.forEach(d => {
                countryName[d.iso_n3] = d.name; // attach the country name in the tsv to the country ID in the json.
              });

              const country_w_data = [];  // create a list of countries that we have in the data set.
              data.forEach(d => {
                for(var i in countryName){
                  if(d.country === countryName[i]){
                    if(!country_w_data.includes(d.country)){
                      country_w_data.push(d.country);
                    }
                    break;
                  }
                }
              });

              const paths = h.selectAll('path')
                  .data(countries.features);
              paths.enter().append('path')
                .attr("class",d => {
                    if(country_w_data.includes(countryName[d.id])){
                      return 'countries';
                    }
                    return 'ignore';
                  })
                .attr('d', d => pathGenerator(d))
                .on('click', d => {
                  console.log(countryName[d.id])
                })
              .append('title')
                .text(d => countryName[d.id]);

              const country = d3.selectAll('path')





        });  // END of d3.json
    }); // END of d3.tsv

} // End of world
