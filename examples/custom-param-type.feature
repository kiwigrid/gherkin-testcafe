Feature: Using custom parameter types

  I want to demonstrate the use of a custom "Color" parameter type

  @googleHook
  Scenario: Searching for color in Google
    Given I open Google's search page
    When I am searching for the blue color on Google
    And I am pressing "enter" key on Google
    Then I should see the #0000FF value in the page
