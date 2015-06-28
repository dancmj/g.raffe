module.exports = function(app, express){
//  var apiRoutes = require('./api')(app, express);
//  app.use('/api', apiRoutes);
//  
  var path = require('path');
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname , '../../public/app/views/index.html'));
  });
};