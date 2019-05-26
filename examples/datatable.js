const { Given, When, Then } = require('cucumber');
const { Selector: NativeSelector } = require('testcafe');

const Selector = (input, t) => {
  return NativeSelector(input).with({ boundTestRun: t });
};

Given('I open TestCafe demo page', async t => {
  await t.navigateTo('https://devexpress.github.io/testcafe/example/');
});

When('I click some checkboxes', async (t, [], table) => {
  for (const { checkboxId } of table.hashes()) {
    await t.click('#' + checkboxId);
  }
});

Then('The amount of selected checkboxes is {int}', async (t, [amount]) => {
  const selectedCheckboxes = Selector('input[type="checkbox"]').filter(checkbox =>
    Boolean(checkbox && checkbox.checked)
  );

  const checkedCount = await selectedCheckboxes.count;

  await t.expect(checkedCount).eql(amount);
});
