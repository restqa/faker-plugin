Feature: faker-plugin Example

Scenario: Generate fake value
Given I use the "fr" language to generate fake data
  And I generate a fake data for "name.firstName" and store it into the dataset as "firstName"
#The following step is not a part of the plugin it is just showing an example of usage
Then my fake value is accessible through "{{ firstName }}" 


Scenario: Generate fake value (data placeholder)
Given I use the "nl_BE" language to generate fake data
  And fake data "name.lastName" => "lastName"
#The following step is not a part of the plugin it is just showing an example of usage
Then my fake value is accessible through {{ lastName }}

Scenario: Generate fake value (minimalist)
Given fake locale = "cz"
  And fake data "animal.bird" => "birdName"
#The following step is not a part of the plugin it is just showing an example of usage
Then my fake value is accessible through "{{ birdName }}"

Scenario: Generate fake value (data on the fly)
Given fake locale = "cz"
#The following step is not a part of the plugin it is just showing an example of usage
Then my fake value is accessible through {{ faker.animal.bird }}

