const { Given, When, Then } = require('cucumber');
const { Selector: NativeSelector } = require('testcafe');

const Selector = (input, t) => {
  return NativeSelector(input).with({ boundTestRun: t });
};

Given(/I open TestCafe demo page/, async t => {
  await t.navigateTo('https://devexpress.github.io/testcafe/example/');
});

When(/I click some checkboxes/, async (t, table) => {

  for (let i = 0; i < table.hashes().length; i++) {
    await t.click('#'+table.hashes()[i].checkboxId);
  }

});


Then(/The amount of selected checkboxes is "(.+)"/, async (t, [amount]) => {

  const selectedCheckboxes = Selector('input[type="checkbox"]')
  // select all checboxes whose name value is in a set of predefined values
    .withAttribute("name", /custom-name|remote|re-using|background|CI|analysis/)
    .filter((node) => {
      const checkbox = node;
      if (checkbox && checkbox.checked) {
        return true;
      }
      return false;
    });
  const checkedCount = await selectedCheckboxes.count;

  await t.expect(checkedCount).eql(Number(amount));
});
