module.exports = function (config, { Before, BeforeAll, After, AfterAll }) {
  Before(async function (scenario) {
    this.setConfig(config)
  })

  After(function () {
    const { results } = this.faker
    if (results.length === 0) return
    const msg = results.reduce((res, item) => {
      return `${res}\n  - ${item.property}: ${item.value}`
    }, `During the scenario faker has generated ${results.length} values for you`)
    this.attach(msg)
  })
}
