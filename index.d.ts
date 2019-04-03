import { TableDefinition } from 'cucumber';
import testcafe, { t } from 'testcafe';

export * from 'testcafe';
export default testcafe;

declare module 'cucumber' {
  export type HookFunction = (testController: typeof t) => Promise<void>;
  export type GlobalHookFunction = (fixtureContext: { [key: string]: string }) => Promise<void>;

  export function After(code: HookFunction): void;
  export function After(options: string, code: HookFunction): void;
  export function AfterAll(code: GlobalHookFunction): void;
  export function Before(code: HookFunction): void;
  export function Before(options: string, code: HookFunction): void;
  export function BeforeAll(code: GlobalHookFunction): void;

  export type StepFunction = (
    testController: typeof t,
    parameters: string[],
    dataTable: TableDefinition | null
  ) => Promise<void>;

  export function Given(pattern: RegExp | string, code: StepFunction): void;
  export function When(pattern: RegExp | string, code: StepFunction): void;
  export function Then(pattern: RegExp | string, code: StepFunction): void;
}
