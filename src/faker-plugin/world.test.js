beforeEach(() => {
  jest.resetModules()
})

describe('#World', () => {
  test('Get data when its not generated from faker', () => {
    const World = require('./world')
    const world = new World({})
    const config = {
      data: {}
    }
    world.setConfig(config)
    world.data.set('year', '2k21')
    expect(world.data.get('{{ year }}')).toBe('2k21')
    expect(world.data.get('yearz')).toBe('yearz')
  })

  test('Get data when its generated from faker (prefix: faker)', () => {
    const faker = require('faker')
    const spy = jest.spyOn(faker, 'fake')

    const World = require('./world')
    const world = new World({})
    const config = {
      data: {}
    }
    world.setConfig(config)
    const result = world.data.get('{{ faker.music.genre }}')

    expect(spy).toHaveBeenCalled()
    const expectedMusicGenre = spy.mock.results[0].value
    expect(result).toBe(expectedMusicGenre)
  })

  test('Get data when its generated from faker (prefix: _f)', () => {
    const faker = require('faker')
    const spy = jest.spyOn(faker, 'fake')

    const World = require('./world')
    const world = new World({})
    const config = {
      prefix: '_f',
      data: {}
    }
    world.setConfig(config)
    const result = world.data.get('{{ _f.music.genre }}')

    expect(spy).toHaveBeenCalled()
    const expectedMusicGenre = spy.mock.results[0].value
    expect(result).toBe(expectedMusicGenre)
  })

  test('throw an error if the faker property is invalid (prefix: xxx)', () => {
    const World = require('./world')
    const world = new World({})
    const config = {
      prefix: 'xxx',
      data: {}
    }
    world.setConfig(config)

    expect(() => {
      world.data.get('{{ xxx.music.artist }}')
    }).toThrow('The property "music.artist" is not valid. Available list at https://github.com/Marak/Faker.js#api-methods')
  })
})
