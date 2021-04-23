# Features

In order to undertand better the best way to write scenario, you should first be comfortable with cucumber, take a look at the [cucumber documentation](https://cucumber.io/docs/gherkin/reference/) to fully understand the diifferent definition on the current page.

## Dataset

On top of adding step definition this plugin is adding an extra capability to the dataset.


### Generate a fake data on the fly generation

If you have to deal with a lot of fake data, it will be inconvenient to multiple create step definition as share above.
This is why you could also generate your fake data on the fly, by using the dynamic data synthax.

As you know you can interact with the dataset using the pattern `{{ firstName }}` in order to print the `firstName` variable.
Then if you add the prefix `faker` you will be able to access directly to the Faker library properties.

Example: 

```gherkin
Then the response body at "user.firstname" should not be equal to {{ faker.name.firstName }}
```

While `faker.name.firstName` is refering the to property `name.firstName` from the [Faker.js](https://github.com/Marak/faker.js) library. ([full list properties available](https://github.com/Marak/faker.js#api-methods))
