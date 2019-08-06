import { Given, When, Then } from 'cucumber';
import { Selector as NativeSelector } from 'testcafe';

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

Then(/^The amount of selected checkboxes is "(.+)"$/, async (t, [amount]) => {
  const selectedCheckboxes = Selector('input[type="checkbox"]').filter(checkbox =>
    Boolean(checkbox && checkbox.checked)
  );

  const checkedCount = await selectedCheckboxes.count;

  await t.expect(checkedCount).eql(Number(amount));
});
