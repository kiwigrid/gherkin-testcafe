Feature: Datatable demo feature

  Scenario: Searching for Datatable by Google
    Given I open TestCafe demo page
    When I click some checkboxes
    | checkboxId                       |
    | remote-testing                   |
    | reusing-js-code                  |
    | background-parallel-testing      |
    | continuous-integration-embedding |
    | traffic-markup-analysis          |
    Then The amount of selected checkboxes is "5"
