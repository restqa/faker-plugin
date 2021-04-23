module.exports = function ({ Given, When, Then }) {
  /*********************************************
   * GIVEN
   ********************************************/
  require('./1-given').forEach(step => Given.apply(this, step))
}
