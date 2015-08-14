//Include d3.js + graffe logic here.
function d3Graffe(elementId) {
  var svg = d3.select(elementId).append('svg').attr('width', '1000px').attr('height', '600px');
  var data = d3.range(50, 650, 10).map(function(y_offset) {
    // generate a line of the form [[6,7],[22,34],...]
    return d3.range(100, 700, 10).map(function(d) {
      var y = d;
      y < 200 || y > 600 ? y = 100 : y = 1000;
      return [d, y_offset - Math.random() * Math.random() * y / 10];
    });
  });

  var line = d3.svg.line().x(function(d) {return d[0];}).y(function(d) {return d[1];}).interpolate('basis');

  svg.selectAll('path').data(data).enter()
    .append('path').attr('d', line);
};
