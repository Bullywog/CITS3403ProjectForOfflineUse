/*Get Home page*/
module.exports.home = function(req, res) {
  res.render('home',
  	{ title: 'Bacterial Battles'});
};
