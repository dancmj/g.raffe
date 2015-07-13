module.exports = function(app, express){
  var apiRouter = express.Router();
  // var auth       = require('../middlewares/auth');
  // var User       = require('../models/user');
  // var Thread     = require('../models/thread');
  // var Comment    = require('../models/comment');

  apiRouter.get('/', function(req, res) {
    res.json({ message: 'Here be API' });
  });

  return apiRouter;
};
