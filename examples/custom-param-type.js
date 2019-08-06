import { When, Then } from 'cucumber';
import { Selector as NativeSelector } from 'testcafe';

const Selector = (input, t) => {
  return NativeSelector(input).with({ boundTestRun: t });
};

When('I am searching for the {color} color on Google', async (t, [color]) => {
  const input = Selector('[name="q"]', t);
  await t.typeText(input, color.name);
});

Then('I should see the {word} value in the page', async (t, [value]) => {
  const result = Selector('span', t).withText(value);
  await t.expect(result.visible).ok();
});
