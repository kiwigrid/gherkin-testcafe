const { Given, When, Then, Before } = require('cucumber');
const { Selector: NativeSelector } = require('testcafe');

const Selector = (input, t) => {
	return NativeSelector(input).with({ boundTestRun: t });
};

Before('@googleHook', async () => {
    console.log('Running Google e2e test.');
});

Given(/^I am open Google's search page$/, async t => {
	await t.navigateTo('http://www.google.com');
});

When(/^I am typing my search request "(.+)" on Google$/, async (t, searchRequest) => {
	const input = Selector('#lst-ib', t);

	await t.typeText(input, searchRequest);
});

When(/I am pressing "(.+)" key on Google/, async (t, key) => {
	await t.pressKey(key);
});

Then(/I should see that the first Google's result is "(.+)"/, async (t, expectedSearchResult) => {
	const firstLink = Selector('#rso', t).find('a');

	await t.expect(firstLink.innerText).contains(expectedSearchResult);
	console.log('testing stuff');
});
