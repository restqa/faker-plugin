# Faker-plugin

> Generate fake data for Test Scenarios

### Introduction

Are you not fed up of using John Doe in your test automation? 😆 

Or What will be the behavior of your product on the production while using real data?

It's a good question right? The best way to answer is to start thinking of having test scenario that are using different data each time.

This should help you on doing more exploration testing... It's exactly how this plugin want to help you.

Once installed this plugin will extend the RestQA capability in order to generate fake data on your scenario.

This plugins is based on the [faker.js](https://github.com/Marak/faker.js) library

## Usage


The plugin is providing 2 capabilities:

### 1. Step definition

A few built-in step definition can be enabled while using the plugin

Example:

```gherkin
Given I generate a fake data for "name.firstName" and store it into the dataset as "firstName"
```   

While we `name.firstName` is refering to the property `name.firstName` of the [faker.js](https://github.com/Marak/faker.js) library. ([full list properties available](https://github.com/Marak/faker.js#api-methods))
The step above will create a new data into the dataset named "firstName" in order to use it in another step like : 

```gherkin
Then the response body at "user.firstname" should not be equal to {{ firstName }}
```

During the execution of all the steps containing `{{ firtName }}` will be updated to include the generated value from the initial step.

[Check the full list of step definition available](./docs/steps-catalog.md)


### 2. On the fly generation

If you need to deal with a lot of fake data, it can be inconvenient to multiple create step definition as share above.
This is why you could also generate your fake data on the fly, by using the dynamic data synthax.

Example: 

```gherkin
Then the response body at "user.firstname" should not be equal to {{ faker.name.firstName }}
```

While `faker.name.firstName` is refering the to property `name.firstName` from the [Faker.js](https://github.com/Marak/faker.js) library. ([full list properties available](https://github.com/Marak/faker.js#api-methods))

### Quick demo

[Example](./example)



## Getting Started

This plugin can be used to extend the [RestQA](https://github.com/restqa/restqa) capability or on a raw [CucumberJs](https://github.com/cucumber/cucumber-js) install

### Using the plugin with RestQA

#### Requirements

 * Node.js >= 12
 * RestQA installed

#### Installation

Using npm:

```
npm install @restqa/faker-plugin
```

Then in your `.restqa.yml` configuration file you will need to add the follow snippet under the `environments.*.plugins` section:

```
- name: @restqa/faker-plugin
  config:
    locale: 'fr' # default en
    prefix: 'faker' # the prefix used for the place holders
  
```

Exmaple: 

```
version: 0.0.1
metadata:
  code: APP
  name: app
  description: Configuration generated by restqa init
environments:
  - name: local
    default: true
    plugins:
      - name: restqapi
        config:
          url: https://api.restqa.io
      - name: @restqa/faker-plugin
        config:
          locale: 'fr' # default en
          prefix: 'faker' # the prefix used for the place holders
    outputs:
      - type: html
        enabled: true
```

### Using the plugin with CucumberJs

#### Requirements

 * Node.js >= 12
 * Cucumber >= 6.0.5

#### Installation

Using npm:

```
npm install @restqa/faker-plugin cucumber
```

Using yarn:

```
yarn add @restqa/faker-plugin cucumber
```

Then you will need to create or update your world.js file:

```
//support/world.js

const {
  After, AfterAll, Before, BeforeAll,
  Given, When, Then,
  defineParameterType,
  setWorldConstructor
} = require('cucumber')

const FakerPlugin = require('faker-plugin')

const config = {
  name: 'local',
  data: {
    startSymbol: '{[',
    endSymbol: ']}'
  },
  locale: 'fr',
  prefix: 'faker'
}

const instance = new FakerPlugin(config)

instance.setParameterType(defineParameterType)
instance.setSteps({ Given, When, Then })
instance.setHooks({ Before, BeforeAll, After, AfterAll })

setWorldConstructor(instance.getWorld())
```

Run your Spec

```
./node_modules/.bin/cucumber-js
```

## Options

| *Variable*               | *Description*                                                                                                       | *Default*          |
|:-------------------------|:--------------------------------------------------------------------------------------------------------------------|:-------------------|
| `locale`                 | The local to use in order to generate fake data [available values](https://github.com/Marak/Faker.js#Localization)  | `en`               |
| `prefix`                 | The prefix to identify the placeholder that required to be faked (example: `{{ faker.music.genre }}`                | `faker`            |


## Getting To Know RestQA 🦏

[RestQA](https://restqa.io) is an Open Source Test Automation Framework.

> "With Great Power Comes Great Responsibility"

Gherkin is a powerful language if we understand it. RestQA helps anyone to master this power!


## Developement Setting

Run the example

```
$ npm run example
```

Generating the documentation: 

```
$ npm run doc
```

Run Unit test:

```
$ npm test
```

Style check:

```
$ npm run lint
```


## Contributing

Contributions are very welcome! If you'd like to contribute
