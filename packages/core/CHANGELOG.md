## 1.2.1 (2026-04-21)


### Bug Fixes

* **@clack/core:** keyboard input not working after await in spinner ([a04e418](https://github.com/bombshell-dev/clack/commit/a04e4189411cae685c460064bc329e4439845d43))
* **@clack/core:** strip ANSI escape codes from session file ([2bc853c](https://github.com/bombshell-dev/clack/commit/2bc853c4c7ad6533bfd32e4b6cce1a8ddaf7f0c7))
* **#103:** restore raw mode on unblock ([83c18de](https://github.com/bombshell-dev/clack/commit/83c18dea253f22ca9b3071e287506283dadd85f5)), closes [#103](https://github.com/bombshell-dev/clack/issues/103)
* **#21:** ensure multiselect returns values ([2242f13](https://github.com/bombshell-dev/clack/commit/2242f132f125e3372a5032ae63fa16d76892b573)), closes [#21](https://github.com/bombshell-dev/clack/issues/21)
* **#29:** do not default value to placeholder ([7fb5375](https://github.com/bombshell-dev/clack/commit/7fb537573b675a72cfecfab909b6057225356de9)), closes [#29](https://github.com/bombshell-dev/clack/issues/29)
* **#3:** update readme ([491f9e0](https://github.com/bombshell-dev/clack/commit/491f9e0619097c1809487d9cc68e2b28928de73b)), closes [#3](https://github.com/bombshell-dev/clack/issues/3)
* **#40:** unpipe sink on close ([6663458](https://github.com/bombshell-dev/clack/commit/66634584f602a6ce5c718b9a110e8ecd3e7467f3)), closes [#40](https://github.com/bombshell-dev/clack/issues/40)
* **#67:** return `Value[]` instead of `Option[]` ([496cd49](https://github.com/bombshell-dev/clack/commit/496cd49bf1999748ac71c90c66592501f90c1bd6)), closes [#67](https://github.com/bombshell-dev/clack/issues/67)
* **#99:** enable hard wrapping for long words ([c96eda5](https://github.com/bombshell-dev/clack/commit/c96eda59db5234a449bcc7ce24b309308613ecaa)), closes [#99](https://github.com/bombshell-dev/clack/issues/99)
* `tsconfig.json` ([071b7ad](https://github.com/bombshell-dev/clack/commit/071b7ad1d1c51570f1a494ddaee3641d23496f0d))
* add missing null checks around values ([#386](https://github.com/bombshell-dev/clack/issues/386)) ([71b5029](https://github.com/bombshell-dev/clack/commit/71b5029502abd9702256ea0d863bdbd17c50df03))
* allow non-writestream writables to have columns ([#394](https://github.com/bombshell-dev/clack/issues/394)) ([2310b43](https://github.com/bombshell-dev/clack/commit/2310b439f55d1f04cfac9138745c22f643024f2c))
* **autocomplete:** use first option as initial value in non-multiple ([#332](https://github.com/bombshell-dev/clack/issues/332)) ([4f6b3c2](https://github.com/bombshell-dev/clack/commit/4f6b3c26101b76ddf2969a749114541f87a7404a))
* **core:** preserve value if validation fails ([b480679](https://github.com/bombshell-dev/clack/commit/b4806794db35a4f79d020f64d02a877ab5f8bf8e))
* cursor missing after submit ([143f921](https://github.com/bombshell-dev/clack/commit/143f92113434e409cb12557a2a3050e43490a21b))
* **date:** resolve timezone issues in DatePrompt ([#486](https://github.com/bombshell-dev/clack/issues/486)) ([52fce8a](https://github.com/bombshell-dev/clack/commit/52fce8a64fc3592e0967d2fd4a6714a7670e9b80))
* **deps:** remove unused export ([baf55cb](https://github.com/bombshell-dev/clack/commit/baf55cb2052a708b3228dab0401a4b4619d3b7b2))
* do not pass initialValue down ([#328](https://github.com/bombshell-dev/clack/issues/328)) ([8ead5d3](https://github.com/bombshell-dev/clack/commit/8ead5d39c279489a6f470d09882fe6682e4275ad))
* export missing types from @clack/core ([#238](https://github.com/bombshell-dev/clack/issues/238)) ([0718b07](https://github.com/bombshell-dev/clack/commit/0718b07d6912323ac84f1360e5ecbb766b5969db))
* export spinner type and add tests ([#265](https://github.com/bombshell-dev/clack/issues/265)) ([17342d2](https://github.com/bombshell-dev/clack/commit/17342d20db774b7a9f67f59543b95da06b183894))
* handle line duplication bug with proper line wrapping ([58a1df1](https://github.com/bombshell-dev/clack/commit/58a1df115024788d43a19977768ebdaf43e752e2))
* hanging readline ([60d500c](https://github.com/bombshell-dev/clack/commit/60d500c6890cdbd6b561a1374e81af5bce3a2db2))
* hanging readline ([2c9e8d9](https://github.com/bombshell-dev/clack/commit/2c9e8d9f1d0a479681c00024a45748b00008706c))
* member name in TextPrompt rendering ([#465](https://github.com/bombshell-dev/clack/issues/465)) ([2533180](https://github.com/bombshell-dev/clack/commit/253318016529200a37021e1d7beb32eedf84dbfd))
* multiple select default value incorrect logic ([d225b1f](https://github.com/bombshell-dev/clack/commit/d225b1ff117f27a911d5fba69da8952da35fb10a))
* prevent placeholder from being used as input value in text prompts ([bfe0dd3](https://github.com/bombshell-dev/clack/commit/bfe0dd3b3edfe42b5d1593421d0eb9688e2ea12d))
* remove all trailing space from output ([#351](https://github.com/bombshell-dev/clack/issues/351)) ([7df841d](https://github.com/bombshell-dev/clack/commit/7df841d0f30b38789c52a66e9d54ef80cb53ce7d))
* remove de-dup deps ([9e28ff1](https://github.com/bombshell-dev/clack/commit/9e28ff1cc9ceb904e238461a9bfc087ac97b99c5))
* select return undefined ([c30a1fe](https://github.com/bombshell-dev/clack/commit/c30a1fe48ee2bc203d868e19220ffeaf77a2a2da))
* support disabled options in autocomplete ([#466](https://github.com/bombshell-dev/clack/issues/466)) ([6404dc1](https://github.com/bombshell-dev/clack/commit/6404dc1054682c05b71ea2819888f9c8c48a5a97))
* support off-screen lines when re-rendering ([#414](https://github.com/bombshell-dev/clack/issues/414)) ([4ba2d78](https://github.com/bombshell-dev/clack/commit/4ba2d7830a66e1b6d51288d641946e37e61dd083))
* treat placeholders as visual element ([#323](https://github.com/bombshell-dev/clack/issues/323)) ([94fee2a](https://github.com/bombshell-dev/clack/commit/94fee2a90148c5c09503e9b6d7179fa740f08d7e))
* undefined `options` ([f9c7f83](https://github.com/bombshell-dev/clack/commit/f9c7f83d4c86d6e421516dc6e1f15d851009a2cc))
* use placeholder as value when input is empty ([#263](https://github.com/bombshell-dev/clack/issues/263)) ([a4f5034](https://github.com/bombshell-dev/clack/commit/a4f50347b1403aa6546d3b186e1f2d3ccfb7c65c))
* uv_tty_init error on Windows ([#235](https://github.com/bombshell-dev/clack/issues/235)) ([a36292b](https://github.com/bombshell-dev/clack/commit/a36292bd7ca372e1fc38977982fb8ae980fbeef4))
* validate initial values ([#316](https://github.com/bombshell-dev/clack/issues/316)) ([34f52fe](https://github.com/bombshell-dev/clack/commit/34f52fea98eb2b4752b07e401f5e42e4fc8534ee))
* wrap messages in select prompts ([#410](https://github.com/bombshell-dev/clack/issues/410)) ([7530af0](https://github.com/bombshell-dev/clack/commit/7530af07b7febe74c2d63f046ced8dc7bdaf3ab5))


### Features

* **@clack/core,@clack/prompts:** add `Error` support for `prompt.validate` ([#165](https://github.com/bombshell-dev/clack/issues/165)) ([8093f3c](https://github.com/bombshell-dev/clack/commit/8093f3c2a5f7db000b5869b65724c403651fa387))
* **@clack/core,@clack/prompts:** add agent mode ([f5a38c8](https://github.com/bombshell-dev/clack/commit/f5a38c867b0ce98cdfc118a14428074685e01ae0))
* **@clack/core,@clack/prompts:** Multiline text input ([#240](https://github.com/bombshell-dev/clack/issues/240)) ([814ab9a](https://github.com/bombshell-dev/clack/commit/814ab9ade277387b97d9ab812586247125df53c4))
* **@clack/core:** allow tab completion for placeholders ([1fab46a](https://github.com/bombshell-dev/clack/commit/1fab46a1780a988fc7bbaa3a59b88a191de080ef))
* **#45:** add support for neovim cursor motion ([6d9e675](https://github.com/bombshell-dev/clack/commit/6d9e675a718efbfb1f36a79bf630688fad8d5c56)), closes [#45](https://github.com/bombshell-dev/clack/issues/45)
* add `caseSensitive` option to select-key ([#443](https://github.com/bombshell-dev/clack/issues/443)) ([68dbf9b](https://github.com/bombshell-dev/clack/commit/68dbf9bc21e5c8a75f6825b68e4c93a39def2920))
* add `selectableGroups` option to group multi-select ([#255](https://github.com/bombshell-dev/clack/issues/255)) ([6868c1c](https://github.com/bombshell-dev/clack/commit/6868c1c4262f93f497c2c2288d278dfdd8ba1cfc))
* add customizable spinner cancel and error messages ([#278](https://github.com/bombshell-dev/clack/issues/278)) ([729bbb6](https://github.com/bombshell-dev/clack/commit/729bbb600ebd52718c3f7fe9a1f41493e5cfef41))
* add defaultValue option ([41b5d5c](https://github.com/bombshell-dev/clack/commit/41b5d5cab973fd394a2efa7869091c279c1109e5))
* add invert selection for multiselect prompt ([#358](https://github.com/bombshell-dev/clack/issues/358)) ([d98e033](https://github.com/bombshell-dev/clack/commit/d98e0331de7533ab434514f6ca02d5414c527e34))
* add multi-select prompt ([2838e6d](https://github.com/bombshell-dev/clack/commit/2838e6d3c0ac350cc7ad03a17b5c5c26ffcb0744))
* add note, update styles, better placeholder handling ([b1341d6](https://github.com/bombshell-dev/clack/commit/b1341d6ccc20e7f8a92bf6f3c141fede3c432033))
* add once for side effects ([0e6d4eb](https://github.com/bombshell-dev/clack/commit/0e6d4eb32b2c9555da260026b0c28264605e3bb3))
* add param to clear input after password prompt error ([#364](https://github.com/bombshell-dev/clack/issues/364)) ([1604f97](https://github.com/bombshell-dev/clack/commit/1604f9741eb2adc29e59012d89fca89c0b623691))
* add password prompt to @clack/prompts ([97c52ba](https://github.com/bombshell-dev/clack/commit/97c52ba0e1522e7b18cff6fb19d96f85f7025645))
* add select-key option ([691626f](https://github.com/bombshell-dev/clack/commit/691626fe6fed14e382f64a7f19454d6e1b0b6e4b))
* add withGuide option ([#409](https://github.com/bombshell-dev/clack/issues/409)) ([acc4c3a](https://github.com/bombshell-dev/clack/commit/acc4c3a81b7f05ad9ef5442af248fac9c6940cc1))
* add wraparound to autocomplete ([#463](https://github.com/bombshell-dev/clack/issues/463)) ([c697439](https://github.com/bombshell-dev/clack/commit/c697439aa9d6f5aa295265ec86dd3a0503e67b91))
* **autocomplete:** add wrapping and window limits ([#384](https://github.com/bombshell-dev/clack/issues/384)) ([55645c2](https://github.com/bombshell-dev/clack/commit/55645c28fdc07d4d1e5875fa2cdcbbc83d6bc767))
* **autocomplete:** do not set default filter for options getters ([#496](https://github.com/bombshell-dev/clack/issues/496)) ([417b451](https://github.com/bombshell-dev/clack/commit/417b45178b460f1342ffebf13fe25146876778fe))
* **core + prompts:** adds autocomplete ([#288](https://github.com/bombshell-dev/clack/issues/288)) ([f2c2b89](https://github.com/bombshell-dev/clack/commit/f2c2b8928f99cf5fd010974d167c9cc6bfd6f400))
* **core, prompts:** add DatePrompt for date input with customizable formats ([#448](https://github.com/bombshell-dev/clack/issues/448)) ([090902c](https://github.com/bombshell-dev/clack/commit/090902cfaf49379229a2a7995242723d7c2a7519))
* **core+prompts:** Add suggestion + path prompt ([#314](https://github.com/bombshell-dev/clack/issues/314)) ([2837845](https://github.com/bombshell-dev/clack/commit/28378453af9db1c3f747b2025c136c5c3db34eee))
* **core:** add password prompt ([4b98922](https://github.com/bombshell-dev/clack/commit/4b98922c0d88b5fa9e4989e9eb19c4cfd8274151))
* improve types event emitter & global aliases ([85cc1d5](https://github.com/bombshell-dev/clack/commit/85cc1d5533beb8931a77f09f3b58d1b897102dc9))
* **prompts,core:** make autocomplete placeholder tabbable ([#485](https://github.com/bombshell-dev/clack/issues/485)) ([bdf89a5](https://github.com/bombshell-dev/clack/commit/bdf89a5f80b9d2911cc64504b15de0cf6fd215bc))
* reorganise prompts ([#283](https://github.com/bombshell-dev/clack/issues/283)) ([3f7e1a4](https://github.com/bombshell-dev/clack/commit/3f7e1a4a00e65c45034b7088c32de7a6c92d26e2))
* rework path, remove suggestion prompt ([#335](https://github.com/bombshell-dev/clack/issues/335)) ([df4eea1](https://github.com/bombshell-dev/clack/commit/df4eea1c8d9fdff7752630da272a1490f7fdf928))
* rework values and user input to be separate ([#334](https://github.com/bombshell-dev/clack/issues/334)) ([7bc3301](https://github.com/bombshell-dev/clack/commit/7bc3301cdf2231bda0035a89d00ba151044896c2))
* support disabled for select and multiselect prompt  ([#393](https://github.com/bombshell-dev/clack/issues/393)) ([b103ad3](https://github.com/bombshell-dev/clack/commit/b103ad3d80d20cef7cca8756afe7b7f133960e2b))
* support initialValue for text prompt ([a99c458](https://github.com/bombshell-dev/clack/commit/a99c4580263369bd92733ab5779c6e1e6edbad1f))
* support isAllowEmpty for multi-select ([de1314e](https://github.com/bombshell-dev/clack/commit/de1314e0c81e394cd23ffa54c254e455b0d08f1a))
* unbuild builder ([90f5d1a](https://github.com/bombshell-dev/clack/commit/90f5d1ae35266bc2e0ca0ea9ca9b12db5c4e0777))
* update mutli-select styling ([e66e533](https://github.com/bombshell-dev/clack/commit/e66e5336b303a36d2a0be82d12aa5c57c212b15e))

# @clack/core

## 1.2.0

### Minor Changes

- 9786226: Externalize `fast-string-width` and `fast-wrap-ansi` to avoid double dependencies
- 090902c: Adds `date` prompt with `format` support (YMD, MDY, DMY)

### Patch Changes

- bdf89a5: Adds `placeholder` option to `autocomplete`. When the placeholder is set and the input is empty, pressing `tab` will set the value to `placeholder`.
- 417b451: Only apply autocomplete default filter if it has been explicitly set or if options is not a getter.

## 1.1.0

### Minor Changes

- e3333fb: Replaces `picocolors` with Node.js built-in `styleText`.

## 1.0.1

### Patch Changes

- 6404dc1: Disallows selection of `disabled` options in autocomplete.
- 2533180: Updates the documentation to mention `userInputWithCursor` when using the `TextPrompt` primitive.

## 1.0.0

### Major Changes

- c713fd5: The package is now distributed as ESM-only. In `v0` releases, the package was dual-published as CJS and ESM.

  For existing CJS projects using Node v20+, please see Node's guide on [Loading ECMAScript modules using `require()`](https://nodejs.org/docs/latest-v20.x/api/modules.html#loading-ecmascript-modules-using-require).

### Minor Changes

- 7bc3301: Prompts now have a `userInput` stored separately from their `value`.
- 2837845: Adds suggestion and path prompts
- 729bbb6: Add support for customizable spinner cancel and error messages. Users can now customize these messages either per spinner instance or globally via the `updateSettings` function to support multilingual CLIs.

  This update also improves the architecture by exposing the core settings to the prompts package, enabling more consistent default message handling across the codebase.

  ```ts
  // Per-instance customization
  const spinner = prompts.spinner({
    cancelMessage: "Operación cancelada", // "Operation cancelled" in Spanish
    errorMessage: "Se produjo un error", // "An error occurred" in Spanish
  });

  // Global customization via updateSettings
  prompts.updateSettings({
    messages: {
      cancel: "Operación cancelada", // "Operation cancelled" in Spanish
      error: "Se produjo un error", // "An error occurred" in Spanish
    },
  });

  // Settings can now be accessed directly
  console.log(prompts.settings.messages.cancel); // "Operación cancelada"

  // Direct options take priority over global settings
  const spinner = prompts.spinner({
    cancelMessage: "Cancelled", // This will be used instead of the global setting
  });
  ```

- 55645c2: Support wrapping autocomplete and select prompts.
- f2c2b89: Adds `AutocompletePrompt` to core with comprehensive tests and implement both `autocomplete` and `autocomplete-multiselect` components in prompts package.
- df4eea1: Remove `suggestion` prompt and change `path` prompt to be an autocomplete prompt.
- 1604f97: Add `clearOnError` option to password prompt to automatically clear input when validation fails

### Patch Changes

- 0718b07: fix: export `*Options` types for prompts.
- bfe0dd3: Prevents placeholder from being used as input value in text prompts
- 6868c1c: Adds a new `selectableGroups` boolean to the group multi-select prompt. Using `selectableGroups: false` will disable the ability to select a top-level group, but still allow every child to be selected individually.
- 7df841d: Removed all trailing space in prompt output and fixed various padding rendering bugs.
- a4f5034: Fixes an edge case for placeholder values. Previously, when pressing `enter` on an empty prompt, placeholder values would be ignored. Now, placeholder values are treated as the prompt value.
- b103ad3: Allow disabled options in multi-select and select prompts.
- 71b5029: Add missing nullish checks around values.
- a36292b: Fix "TTY initialization failed: uv_tty_init returned EBADF (bad file descriptor)" error happening on Windows for non-tty terminals.
- 1a45f93: Switched from wrap-ansi to fast-wrap-ansi
- 4ba2d78: Support short terminal windows when re-rendering by accounting for off-screen lines
- 34f52fe: Validates initial values immediately when using text prompts with initialValue and validate props.
- 94fee2a: Changes `placeholder` to be a visual hint rather than a tabbable value.
- 4f6b3c2: Set initial values of auto complete prompt to first option when multiple is false.
- 8ead5d3: Avoid passing initial values to core when using auto complete prompt
- acc4c3a: Add a new `withGuide` option to all prompts to disable the default clack border
- 68dbf9b: select-key: Fixed wrapping and added new `caseSensitive` option
- 2310b43: Allow custom writables as output stream.
- d98e033: add invert selection for multiselect prompt

## 0.4.1

### Patch Changes

- 8093f3c: Adds `Error` support to the `validate` function
- e5ba09a: Fixes a cursor display bug in terminals that do not support the "hidden" escape sequence. See [Issue #127](https://github.com/bombshell-dev/clack/issues/127).
- 8cba8e3: Fixes a rendering bug with cursor positions for `TextPrompt`

## 0.4.0

### Minor Changes

- a83d2f8: Adds a new `updateSettings()` function to support new global keybindings.

  `updateSettings()` accepts an `aliases` object that maps custom keys to an action (`up | down | left | right | space | enter | cancel`).

  ```ts
  import { updateSettings } from "@clack/core";

  // Support custom keybindings
  updateSettings({
    aliases: {
      w: "up",
      a: "left",
      s: "down",
      d: "right",
    },
  });
  ```

> [!WARNING]
> In order to enforce consistent, user-friendly defaults across the ecosystem, `updateSettings` does not support disabling Clack's default keybindings.

- 801246b: Adds a new `signal` option to support programmatic prompt cancellation with an [abort controller](https://kettanaito.com/blog/dont-sleep-on-abort-controller).

- a83d2f8: Updates default keybindings to support Vim motion shortcuts and map the `escape` key to cancel (`ctrl+c`).

  | alias | action |
  | ----- | ------ |
  | `k`   | up     |
  | `l`   | right  |
  | `j`   | down   |
  | `h`   | left   |
  | `esc` | cancel |

### Patch Changes

- 51e12bc: Improves types for events and interaction states.

## 0.3.5

### Patch Changes

- 4845f4f: Fixes a bug which kept the terminal cursor hidden after a prompt is cancelled
- d7b2fb9: Adds missing `LICENSE` file. Since the `package.json` file has always included `"license": "MIT"`, please consider this a licensing clarification rather than a licensing change.

## 0.3.4

### Patch Changes

- a04e418: fix(@clack/core): keyboard input not working after await in spinner
- 4f6fcf5: feat(@clack/core): allow tab completion for placeholders

## 0.3.3

### Patch Changes

- cd79076: fix: restore raw mode on unblock

## 0.3.2

### Patch Changes

- c96eda5: Enable hard line-wrapping behavior for long words without spaces

## 0.3.1

### Patch Changes

- 58a1df1: Fix line duplication bug by automatically wrapping prompts to `process.stdout.columns`

## 0.3.0

### Minor Changes

- 8a4a12f: Add `GroupMultiSelect` prompt

### Patch Changes

- 8a4a12f: add `groupMultiselect` prompt

## 0.2.1

### Patch Changes

- ec812b6: fix `readline` hang on Windows

## 0.2.0

### Minor Changes

- d74dd05: Adds a `selectKey` prompt type
- 54c1bc3: **Breaking Change** `multiselect` has renamed `initialValue` to `initialValues`

## 0.1.9

### Patch Changes

- 1251132: Multiselect: return `Value[]` instead of `Option[]`.
- 8994382: Add a password prompt to `@clack/prompts`

## 0.1.8

### Patch Changes

- d96071c: Don't mutate `initialValue` in `multiselect`, fix parameter type for `validate()`.

  Credits to @banjo for the bug report and initial PR!

## 0.1.7

### Patch Changes

- 6d9e675: Add support for neovim cursor motion (`hjkl`)

  Thanks [@esau-morais](https://github.com/esau-morais) for the assist!

## 0.1.6

### Patch Changes

- 7fb5375: Adds a new `defaultValue` option to the text prompt, removes automatic usage of the placeholder value.

## 0.1.5

### Patch Changes

- de1314e: Support `required` option for multi-select

## 0.1.4

### Patch Changes

- ca77da1: Fix multiselect initial value logic
- 8aed606: Fix `MaxListenersExceededWarning` by detaching `stdin` listeners on close

## 0.1.3

### Patch Changes

- a99c458: Support `initialValue` option for text prompt

## 0.1.2

### Patch Changes

- Allow isCancel to type guard any unknown value
- 7dcad8f: Allow placeholder to be passed to TextPrompt
- 2242f13: Fix multiselect returning undefined
- b1341d6: Improved placeholder handling

## 0.1.1

### Patch Changes

- 4be7dbf: Ensure raw mode is unset on submit
- b480679: Preserve value if validation fails

## 0.1.0

### Minor Changes

- 7015ec9: Create new prompt: multi-select

## 0.0.12

### Patch Changes

- 9d371c3: Fix rendering bug when using y/n to confirm

## 0.0.11

### Patch Changes

- 441d5b7: fix select return undefined
- d20ef2a: Update keywords, URLs
- fe13c2f: fix cursor missing after submit

## 0.0.10

### Patch Changes

- a0cb382: Add `main` entrypoint

## 0.0.9

### Patch Changes

- Fix node@16 issue (cannot read "createInterface" of undefined)

## 0.0.8

### Patch Changes

- a4b5e13: Bug fixes, exposes `block` utility

## 0.0.7

### Patch Changes

- Fix cursor bug

## 0.0.6

### Patch Changes

- Fix error with character check

## 0.0.5

### Patch Changes

- 491f9e0: update readme

## 0.0.4

### Patch Changes

- 7372d5c: Fix bug with line deletion

## 0.0.3

### Patch Changes

- 5605d28: Do not bundle dependencies (take II)

## 0.0.2

### Patch Changes

- 2ee67cb: don't bundle deps

## 0.0.1

### Patch Changes

- 306598e: Initial publish, still WIP
