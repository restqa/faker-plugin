const Given = require('./handlers')

describe('Given handlers', () => {
  describe('defineVariable', () => {
    test('add a value into a variable', () => {
      const World = require('../../world.js')
      const attach = jest.fn()
      const $this = new World({ attach })
      $this.setConfig({ data: {} })
      const spy = jest.spyOn($this.faker, 'get')

      Given.defineVariable.call($this, 'name.firstName', 'firstName')

      const expectedName = spy.mock.results[0].value
      expect($this.data.get('{{ firstName }}')).toBe(expectedName)
      expect(spy).toHaveBeenCalled()
      expect(attach.mock.calls[0][0]).toBe(`[FAKER] Generate a value (name.firstName): ${expectedName}`)
      spy.mockRestore()
    })

    test('throw error if the faker property is not valid', () => {
      const World = require('../../world.js')
      const attach = jest.fn()
      const $this = new World({ attach })
      $this.setConfig({ data: {} })
      expect(() => {
        Given.defineVariable.call($this, 'name.fourstName', 'firstName')
      }).toThrow(new Error('The property "name.fourstName" is not valid. Available list at https://github.com/Marak/Faker.js#api-methods'))
    })
  })

  describe('locale', () => {
    test('set the locale', () => {
      const World = require('../../world.js')
      const attach = jest.fn()
      const $this = new World({ attach })
      $this.setConfig({ data: {} })
      const faker = require('faker')
      Given.locale.call($this, 'fr')
      expect(faker.locale).toBe('fr')
    })

    test('Throw an error if the locale is not a part of the available language', () => {
      const World = require('../../world.js')
      const attach = jest.fn()
      const $this = new World({ attach })
      $this.setConfig({ data: {} })
      expect(() => {
        Given.locale.call($this, 'cn')
      }).toThrow(new Error('The locale "cn" is not available please use the list from: https://github.com/Marak/faker.js#localization'))
    })
  })
})
