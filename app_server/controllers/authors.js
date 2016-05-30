/*Get Authors page*/
module.exports.authors = function(req, res) {
  res.render('authors',
  	{ title: 'Authors'});
};
