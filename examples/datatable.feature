Feature: Datatable demo feature

  I want to find TestCafe repository by Google search

  @googleHook
  Scenario: Searching for Datatable by Google
    Given I am open Google's search page
    When I am typing my search request on Google
    | searchText |
    | cucumber datatable |
    | github TestCafe |
    And I am pressing "enter" key on Google
    Then I should see that the first Google's result is "GitHub - DevExpress/testcafe:"
