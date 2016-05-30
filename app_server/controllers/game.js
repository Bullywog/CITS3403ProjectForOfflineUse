/*Get Game page*/
module.exports.game = function(req, res) {
  res.render('game',
  	{ title: 'Bacterial Battles Game'});
};
