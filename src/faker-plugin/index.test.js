const mockInstance = {}

beforeEach(() => {
  jest.resetModules()
  mockInstance.getConfig = jest.fn().mockReturnValue({})
  mockInstance.addGivenStep = jest.fn((step, fn, description, tags) => {
    return mockInstance
  })
  mockInstance.addState = jest.fn((key, value) => {
    return mockInstance
  })
  mockInstance.addBeforeHook = jest.fn((fn) => {
    return mockInstance
  })
  mockInstance.addAfterHook = jest.fn((fn) => {
    return mockInstance
  })

  jest.mock('@restqa/plugins', () => {
    return function () {
      return mockInstance
    }
  }, { virtual: true })
})

describe('#index', () => {
  test('Add Given steps to the plugin', () => {
    require('./index')
    expect(mockInstance.addGivenStep).toHaveBeenCalledTimes(require('./steps/1-given').length)
  })

  test('Add state', () => {
    const faker = require('faker')
    jest.spyOn(faker, 'fake')

    require('./index')
    expect(mockInstance.addState).toHaveBeenCalledTimes(2)
    expect(mockInstance.addState.mock.calls[0][0]).toBe('results')
    expect(mockInstance.addState.mock.calls[0][1]).toEqual([])
    expect(mockInstance.addState.mock.calls[1][0]).toBe('setLocale')

    const setLocale = mockInstance.addState.mock.calls[1][1]

    expect(faker.locale).toBe('en')
    expect(() => {
      setLocale('ht')
    }).toThrow('The locale "ht" is not available please use the list from: https://github.com/Marak/faker.js#localization')

    expect(() => {
      setLocale('fr')
    }).not.toThrow()

    expect(faker.locale).toBe('fr')
  })

  describe('Add BeforeHook', () => {
    test('throw an error if the faker property is invalid (prefix: xxx)', () => {
      const $this = {
        attach: jest.fn(),
        faker: {
          results: []
        },
        data: {
          addProcessor: jest.fn()
        }
      }
      mockInstance.getConfig.mockReturnValue({ prefix: 'xxx' })
      mockInstance.addBeforeHook = jest.fn((fn) => {
        fn.call($this, { name: 'scenario name' })
        return mockInstance
      })

      require('./index')

      expect($this.data.addProcessor).toHaveBeenCalled()
      expect($this.data.addProcessor.mock.calls[0][0]).toEqual('xxx')
      const processor = $this.data.addProcessor.mock.calls[0][1]
      expect(() => {
        processor('music.artist')
      }).toThrow('The property "music.artist" is not valid. Available list at https://github.com/Marak/Faker.js#api-methods')
    })

    test('Get data when its generated from faker (prefix: faker (default))', () => {
      const $this = {
        attach: jest.fn(),
        faker: {
          results: []
        },
        data: {
          addProcessor: jest.fn()
        }
      }
      mockInstance.addBeforeHook = jest.fn((fn) => {
        fn.call($this, { name: 'scenario name' })
        return mockInstance
      })

      const faker = require('faker')
      const spy = jest.spyOn(faker, 'fake')

      require('./index')

      expect($this.data.addProcessor).toHaveBeenCalled()
      expect($this.data.addProcessor.mock.calls[0][0]).toEqual('faker')
      const processor = $this.data.addProcessor.mock.calls[0][1]
      const result = processor('music.genre')
      expect(spy).toHaveBeenCalled()
      const expectedMusicGenre = spy.mock.results[0].value
      expect(result).toBe(expectedMusicGenre)
      expect($this.faker.results).toEqual([{
        property: 'music.genre',
        value: expectedMusicGenre
      }])
    })

    test('Get data when its generated from faker (prefix: _f, locale: es)', () => {
      const $this = {
        attach: jest.fn(),
        faker: {
          results: []
        },
        data: {
          addProcessor: jest.fn()
        }
      }
      mockInstance.getConfig.mockReturnValue({ prefix: '_f', locale: 'es' })
      mockInstance.addBeforeHook = jest.fn((fn) => {
        fn.call($this, { name: 'scenario name' })
        return mockInstance
      })

      const faker = require('faker')
      const spy = jest.spyOn(faker, 'fake')

      require('./index')

      expect($this.data.addProcessor).toHaveBeenCalled()
      expect($this.data.addProcessor.mock.calls[0][0]).toEqual('_f')
      const processor = $this.data.addProcessor.mock.calls[0][1]
      const result = processor('music.genre')
      expect(spy).toHaveBeenCalled()
      const expectedMusicGenre = spy.mock.results[0].value
      expect(result).toBe(expectedMusicGenre)
      expect($this.faker.results).toEqual([{
        property: 'music.genre',
        value: expectedMusicGenre
      }])
      expect(faker.locale).toBe('es')
    })
  })

  describe('Add AfterHook', () => {
    test('Do not attach the faker message if no faker has been generated during the scenario', () => {
      const $this = {
        attach: jest.fn(),
        faker: {
          results: []
        }
      }
      mockInstance.addAfterHook = jest.fn((fn) => {
        fn.call($this, { name: 'scenario name' })
        return mockInstance
      })

      require('./index')

      expect($this.attach).not.toHaveBeenCalled()
    })

    test('Attach the faker message if some faker has been generated during the scenario', () => {
      const $this = {
        attach: jest.fn(),
        faker: {
          results: [{
            property: 'name.firstName',
            value: 'Homer'
          }, {
            property: 'name.lastName',
            value: 'Simpson'
          }]
        }
      }
      mockInstance.addAfterHook = jest.fn((fn) => {
        fn.call($this, { name: 'scenario name' })
        return mockInstance
      })

      require('./index')

      const expectedMessage = `
During the scenario faker has generated 2 values for you
  - name.firstName: Homer
  - name.lastName: Simpson
      `.trim()
      expect($this.attach).toHaveBeenCalled()
      expect($this.attach.mock.calls[0][0]).toEqual(expectedMessage)
    })
  })
})
