const {Selector} = require('testcafe');

module.exports = function defineSteps({given, when, then}) {
	given(`I am open Google's search page`, t => {
		return t.navigateTo('http://www.google.com');
	});

	when(`I am typing my search request {string} on Google`, (t, searchRequest) => {
		const input = Selector('#lst-ib');

        return t.typeText(input, searchRequest);
	});

	then(`I am pressing {string} key on Google`, (t, key) => {
		return t.pressKey(key);
	});

	then(`I should see that the first Google's result is {string}`, (t, expectedSearchResult) => {
		const firstLink = Selector('#rso').find('a');

        return t.expect(firstLink.innerText).contains(expectedSearchResult);
	});
}
