## 1.2.2 (2026-04-21)


### Bug Fixes

* **@clack/prompts:** clear spinner hooks on spinner.stop ([50ed94a](https://github.com/bombshell-dev/clack/commit/50ed94aad1e99f60db98b27ee072a1614e30e48c))
* **#106:** spinner conflict with terminal on error ([52183c4](https://github.com/bombshell-dev/clack/commit/52183c45f2cac26df71a5ea706aeec0c4ae167e4)), closes [#106](https://github.com/bombshell-dev/clack/issues/106)
* **#29:** do not default value to placeholder ([7fb5375](https://github.com/bombshell-dev/clack/commit/7fb537573b675a72cfecfab909b6057225356de9)), closes [#29](https://github.com/bombshell-dev/clack/issues/29)
* **#44:** support booleans and numbers in select values ([493c592](https://github.com/bombshell-dev/clack/commit/493c592ae164d9239ff3ec1f0438e18b5a424a21)), closes [#44](https://github.com/bombshell-dev/clack/issues/44)
* **#67:** return `Value[]` instead of `Option[]` ([496cd49](https://github.com/bombshell-dev/clack/commit/496cd49bf1999748ac71c90c66592501f90c1bd6)), closes [#67](https://github.com/bombshell-dev/clack/issues/67)
* `tsconfig.json` ([071b7ad](https://github.com/bombshell-dev/clack/commit/071b7ad1d1c51570f1a494ddaee3641d23496f0d))
* add hints for selected options in multiselect prompts & tests ([#279](https://github.com/bombshell-dev/clack/issues/279)) ([46dc0a4](https://github.com/bombshell-dev/clack/commit/46dc0a4bc1b4d8b5ad20aca628334be97887c959))
* add missing guide line in autocomplete-multiselect ([#430](https://github.com/bombshell-dev/clack/issues/430)) ([42adff8](https://github.com/bombshell-dev/clack/commit/42adff81ee6d7cde880c5d247d0d9d7f7f1f15c5))
* add missing null checks around values ([#386](https://github.com/bombshell-dev/clack/issues/386)) ([71b5029](https://github.com/bombshell-dev/clack/commit/71b5029502abd9702256ea0d863bdbd17c50df03))
* allow non-writestream writables to have columns ([#394](https://github.com/bombshell-dev/clack/issues/394)) ([2310b43](https://github.com/bombshell-dev/clack/commit/2310b439f55d1f04cfac9138745c22f643024f2c))
* **autocomplete:** display placeholder only when user input is empty ([#442](https://github.com/bombshell-dev/clack/issues/442)) ([55eb280](https://github.com/bombshell-dev/clack/commit/55eb280e0af10c4dab63d9afbafac349f7a46607))
* **autocomplete:** show correct selection text ([#378](https://github.com/bombshell-dev/clack/issues/378)) ([ae84dd0](https://github.com/bombshell-dev/clack/commit/ae84dd09ebeb3dbca7dc441afdba6725f3f18b5d))
* bundle is-unicode-supported ([31a4c49](https://github.com/bombshell-dev/clack/commit/31a4c49e738da4245b3f494af112c8976f269ae8))
* cancel with empty selection ([e502926](https://github.com/bombshell-dev/clack/commit/e502926cf554c1eb15446e8eaee9f21b3f25319f))
* correctly wrap multi-line messages in confirm prompt ([#495](https://github.com/bombshell-dev/clack/issues/495)) ([336495a](https://github.com/bombshell-dev/clack/commit/336495a670bc78549d5acb66ec0d58293f983870))
* **date:** resolve timezone issues in DatePrompt ([#486](https://github.com/bombshell-dev/clack/issues/486)) ([52fce8a](https://github.com/bombshell-dev/clack/commit/52fce8a64fc3592e0967d2fd4a6714a7670e9b80))
* do not pass initialValue down ([#328](https://github.com/bombshell-dev/clack/issues/328)) ([8ead5d3](https://github.com/bombshell-dev/clack/commit/8ead5d39c279489a6f470d09882fe6682e4275ad))
* do nothing if spinner already stopped and stop called ([#382](https://github.com/bombshell-dev/clack/issues/382)) ([0b852e1](https://github.com/bombshell-dev/clack/commit/0b852e10c00c9e23f999e32293aadbb0a9b7cd74))
* export spinner type and add tests ([#265](https://github.com/bombshell-dev/clack/issues/265)) ([17342d2](https://github.com/bombshell-dev/clack/commit/17342d20db774b7a9f67f59543b95da06b183894))
* fix autocomplete guide line color when validate ([#428](https://github.com/bombshell-dev/clack/issues/428)) ([8e2e30a](https://github.com/bombshell-dev/clack/commit/8e2e30a9f55a5d3f37f7070e1e758c31f028f391))
* fix note component overflow bug ([#376](https://github.com/bombshell-dev/clack/issues/376)) ([9999adf](https://github.com/bombshell-dev/clack/commit/9999adf03f2b784e1a9f76dd354d3bbe5a15840b))
* handle multi-line select options ([#413](https://github.com/bombshell-dev/clack/issues/413)) ([4d1d83b](https://github.com/bombshell-dev/clack/commit/4d1d83bff121e1400b4b1f79c953a5098136d6d1))
* hard wrap and clamp lines in limit-options ([#398](https://github.com/bombshell-dev/clack/issues/398)) ([aea4573](https://github.com/bombshell-dev/clack/commit/aea4573c36afd7efdc7dce70e77f5888bb6e3399))
* multiple select default value incorrect logic ([d225b1f](https://github.com/bombshell-dev/clack/commit/d225b1ff117f27a911d5fba69da8952da35fb10a))
* note title correctly evaluates title length with ansi ([ab51d29](https://github.com/bombshell-dev/clack/commit/ab51d29128ffb99c1fd94a08cf6ae120643d7e4e))
* **note,box:** handle cjk correctly ([#391](https://github.com/bombshell-dev/clack/issues/391)) ([d25f6d0](https://github.com/bombshell-dev/clack/commit/d25f6d03214b566e0e0e461bc2fa2ba6d2868205))
* **note:** hard wrap ([#383](https://github.com/bombshell-dev/clack/issues/383)) ([2839c66](https://github.com/bombshell-dev/clack/commit/2839c663d0a28115f687e6589d2ce17db6915136))
* prevent duplicated logs when scrolling with multiline messages ([#423](https://github.com/bombshell-dev/clack/issues/423)) ([2feaebb](https://github.com/bombshell-dev/clack/commit/2feaebb5f4695ff199d456fbde68dd91d4f99c6f))
* prevent placeholder from being used as input value in text prompts ([bfe0dd3](https://github.com/bombshell-dev/clack/commit/bfe0dd3b3edfe42b5d1593421d0eb9688e2ea12d))
* **prompts:** don't strip dots in spinner stop ([#287](https://github.com/bombshell-dev/clack/issues/287)) ([72c2f2d](https://github.com/bombshell-dev/clack/commit/72c2f2d521c231ecaa2442b8b7ec1c2fc2d7e6dd))
* **prompts:** Fix dots loader in spinner ([#309](https://github.com/bombshell-dev/clack/issues/309)) ([2048eb1](https://github.com/bombshell-dev/clack/commit/2048eb1cf40b6aa5c534045ac5b9c3b96c3ff4d8))
* **prompts:** Fix styling of taskLog + fix README ([#301](https://github.com/bombshell-dev/clack/issues/301)) ([bb5ef54](https://github.com/bombshell-dev/clack/commit/bb5ef54a9f5fdc4fccfc6462a91acc8e632f7430))
* **prompts:** honor withGuide for intro/outro/cancel messages ([#474](https://github.com/bombshell-dev/clack/issues/474)) ([ba3df8e](https://github.com/bombshell-dev/clack/commit/ba3df8e81abfd5aa8de7c49abe87901d1aac7713))
* **prompts:** respect directory option in path prompt ([#483](https://github.com/bombshell-dev/clack/issues/483)) ([134a1a1](https://github.com/bombshell-dev/clack/commit/134a1a1c446fc6a2cbd4a5c112057607487ce86a))
* **prompts:** submit initial directory value in path prompt ([#484](https://github.com/bombshell-dev/clack/issues/484)) ([29a50cb](https://github.com/bombshell-dev/clack/commit/29a50cb9f3cc66205010749b846cd17ff80817b1))
* remove all trailing space from output ([#351](https://github.com/bombshell-dev/clack/issues/351)) ([7df841d](https://github.com/bombshell-dev/clack/commit/7df841d0f30b38789c52a66e9d54ef80cb53ce7d))
* remove de-dup deps ([9e28ff1](https://github.com/bombshell-dev/clack/commit/9e28ff1cc9ceb904e238461a9bfc087ac97b99c5))
* remove invalid exports ([#293](https://github.com/bombshell-dev/clack/issues/293)) ([2f51685](https://github.com/bombshell-dev/clack/commit/2f51685a2b45da846fd86c028c9f5e9b23a71d3c))
* render guide with empty log lines ([#436](https://github.com/bombshell-dev/clack/issues/436)) ([f952592](https://github.com/bombshell-dev/clack/commit/f9525928ea9f51ff5775507ab79b36911a16d672))
* respect withGuide option in password and path prompts ([#460](https://github.com/bombshell-dev/clack/issues/460)) ([0e4ddc9](https://github.com/bombshell-dev/clack/commit/0e4ddc91cf1a3300a77814d3245ec51218541657))
* show symbol when guide enabled ([#425](https://github.com/bombshell-dev/clack/issues/425)) ([9b92161](https://github.com/bombshell-dev/clack/commit/9b92161670c8c15c40c6d3956fb519b771a0442f))
* spinner should only clear multi-line ([#374](https://github.com/bombshell-dev/clack/issues/374)) ([7b009df](https://github.com/bombshell-dev/clack/commit/7b009df9464285fad53f3cdeb75e555c45a262d2)), closes [#373](https://github.com/bombshell-dev/clack/issues/373)
* strip destructive ANSI codes from task logs ([#420](https://github.com/bombshell-dev/clack/issues/420)) ([69681ea](https://github.com/bombshell-dev/clack/commit/69681ea4422f973eca720b65b98ee5102c69a365))
* support disabled options in autocomplete ([#466](https://github.com/bombshell-dev/clack/issues/466)) ([6404dc1](https://github.com/bombshell-dev/clack/commit/6404dc1054682c05b71ea2819888f9c8c48a5a97))
* support off-screen lines when re-rendering ([#414](https://github.com/bombshell-dev/clack/issues/414)) ([4ba2d78](https://github.com/bombshell-dev/clack/commit/4ba2d7830a66e1b6d51288d641946e37e61dd083))
* treat placeholders as visual element ([#323](https://github.com/bombshell-dev/clack/issues/323)) ([94fee2a](https://github.com/bombshell-dev/clack/commit/94fee2a90148c5c09503e9b6d7179fa740f08d7e))
* use default import of picocolors ([#341](https://github.com/bombshell-dev/clack/issues/341)) ([17d3650](https://github.com/bombshell-dev/clack/commit/17d365065ce5db8a17a302c7cb405ff670a86840))
* use fast-wrap-ansi in box prompt ([#370](https://github.com/bombshell-dev/clack/issues/370)) ([ff286ef](https://github.com/bombshell-dev/clack/commit/ff286ef46696ca830dde11e6249182eb3e6fc7d2))
* use placeholder as value when input is empty ([#263](https://github.com/bombshell-dev/clack/issues/263)) ([a4f5034](https://github.com/bombshell-dev/clack/commit/a4f50347b1403aa6546d3b186e1f2d3ccfb7c65c))
* wrap messages in select prompts ([#410](https://github.com/bombshell-dev/clack/issues/410)) ([7530af0](https://github.com/bombshell-dev/clack/commit/7530af07b7febe74c2d63f046ced8dc7bdaf3ab5))
* wrap spinner output ([#359](https://github.com/bombshell-dev/clack/issues/359)) ([282b39e](https://github.com/bombshell-dev/clack/commit/282b39e637c3609bc707cc5c8fde81eb5f9832dc))
* wrapping in multi-selects ([#411](https://github.com/bombshell-dev/clack/issues/411)) ([b0fa7d8](https://github.com/bombshell-dev/clack/commit/b0fa7d89758d92f7e7e7a947ac11ce675d3ef3a4))


### Features

* **@clack/core,@clack/prompts:** add `Error` support for `prompt.validate` ([#165](https://github.com/bombshell-dev/clack/issues/165)) ([8093f3c](https://github.com/bombshell-dev/clack/commit/8093f3c2a5f7db000b5869b65724c403651fa387))
* **@clack/core,@clack/prompts:** add agent mode ([f5a38c8](https://github.com/bombshell-dev/clack/commit/f5a38c867b0ce98cdfc118a14428074685e01ae0))
* **@clack/core,@clack/prompts:** Multiline text input ([#240](https://github.com/bombshell-dev/clack/issues/240)) ([814ab9a](https://github.com/bombshell-dev/clack/commit/814ab9ade277387b97d9ab812586247125df53c4))
* **@clack/prompts:** adapt `spinner` to CI environment ([#169](https://github.com/bombshell-dev/clack/issues/169)) ([f9f139d](https://github.com/bombshell-dev/clack/commit/f9f139debce559ca91f6b18f2ed741f59f4b2c48))
* **@clack/prompts:** add tasks ([9acccde](https://github.com/bombshell-dev/clack/commit/9acccde58b1249b8321ccc3731cc91e2ea92ce3d))
* **@clack/prompts:** custom spinner indicator support ([#247](https://github.com/bombshell-dev/clack/issues/247)) ([19558b9](https://github.com/bombshell-dev/clack/commit/19558b9de8fb3be7d5d9da2ed2db4a59f1e75db9))
* **@clack/prompts:** new method `spinner.message(msg: string)` ([89371be](https://github.com/bombshell-dev/clack/commit/89371befc10e861e3298abd67f1d6961e12fc788))
* **@clack/promtps:** multiselect maxItems ([b5c6b9b](https://github.com/bombshell-dev/clack/commit/b5c6b9b4cccef2c652409576bd260ba2d0ef4693))
* `definePromptGroup` & `definePrompt` ([e9705e1](https://github.com/bombshell-dev/clack/commit/e9705e175bb3d4806a5f597b07b09dfdfc79eba3))
* adaptative max items ([360afeb](https://github.com/bombshell-dev/clack/commit/360afeb030c47768301d7b066a96bf1d9bcfa135))
* add `caseSensitive` option to select-key ([#443](https://github.com/bombshell-dev/clack/issues/443)) ([68dbf9b](https://github.com/bombshell-dev/clack/commit/68dbf9bc21e5c8a75f6825b68e4c93a39def2920))
* add `clear` to spinner ([#433](https://github.com/bombshell-dev/clack/issues/433)) ([372b526](https://github.com/bombshell-dev/clack/commit/372b526cdcd1fc33b95a4741e67fcddb3cfce9e2))
* add `CommonOptions` so all prompts accept a custom output/input ([#268](https://github.com/bombshell-dev/clack/issues/268)) ([7a556ad](https://github.com/bombshell-dev/clack/commit/7a556ad51e01073f9f93fd4d299fd8a3fad45d96))
* add `format` option to `note` prompt ([#284](https://github.com/bombshell-dev/clack/issues/284)) ([99c3530](https://github.com/bombshell-dev/clack/commit/99c35302f11ceaf6fd89f6d577447e07b3dd9dbd))
* add `groupSpacing` option to group multi select ([#256](https://github.com/bombshell-dev/clack/issues/256)) ([44df9af](https://github.com/bombshell-dev/clack/commit/44df9af1cb3081aece1bb43de05f05d1f821d546))
* add `required` option to autocomplete multiselect ([#329](https://github.com/bombshell-dev/clack/issues/329)) ([9bd8072](https://github.com/bombshell-dev/clack/commit/9bd8072561033b882bd6b1fe70fac9e6eb95c69a))
* add `selectableGroups` option to group multi-select ([#255](https://github.com/bombshell-dev/clack/issues/255)) ([6868c1c](https://github.com/bombshell-dev/clack/commit/6868c1c4262f93f497c2c2288d278dfdd8ba1cfc))
* add `vertical` option to `confirm` prompt ([#455](https://github.com/bombshell-dev/clack/issues/455)) ([0e93ccb](https://github.com/bombshell-dev/clack/commit/0e93ccb667debc4a06b2442dcdfb63150e8ebe95))
* add `withGuide` support to confirm prompt ([#450](https://github.com/bombshell-dev/clack/issues/450)) ([4e9ae13](https://github.com/bombshell-dev/clack/commit/4e9ae1390521682dc1e6b35b2281e0ab5c14b2cc))
* add `withGuide` support to password prompt ([#451](https://github.com/bombshell-dev/clack/issues/451)) ([f9b9953](https://github.com/bombshell-dev/clack/commit/f9b995317d2baaed649715acbdcc1d598fd697ad))
* add `withGuide` support to select prompt ([#453](https://github.com/bombshell-dev/clack/issues/453)) ([86e36d8](https://github.com/bombshell-dev/clack/commit/86e36d8caf56a9be23ce9b84bbf37339a101f824))
* add `withGuide` support to selectKey prompt ([#452](https://github.com/bombshell-dev/clack/issues/452)) ([76550d6](https://github.com/bombshell-dev/clack/commit/76550d6ffb2e64cab8bbe77b5488a4749e860426))
* add `withGuide` support to spinner prompt ([#454](https://github.com/bombshell-dev/clack/issues/454)) ([0256238](https://github.com/bombshell-dev/clack/commit/0256238922c93e05b7e5e76289b17fa67058d05e))
* add customizable spinner cancel and error messages ([#278](https://github.com/bombshell-dev/clack/issues/278)) ([729bbb6](https://github.com/bombshell-dev/clack/commit/729bbb600ebd52718c3f7fe9a1f41493e5cfef41))
* add defaultValue option ([41b5d5c](https://github.com/bombshell-dev/clack/commit/41b5d5cab973fd394a2efa7869091c279c1109e5))
* add log ([dfb796e](https://github.com/bombshell-dev/clack/commit/dfb796e232f38790821ddbe0f47955fddde6934f))
* add multi-select prompt ([2838e6d](https://github.com/bombshell-dev/clack/commit/2838e6d3c0ac350cc7ad03a17b5c5c26ffcb0744))
* add note, update styles, better placeholder handling ([b1341d6](https://github.com/bombshell-dev/clack/commit/b1341d6ccc20e7f8a92bf6f3c141fede3c432033))
* add once for side effects ([0e6d4eb](https://github.com/bombshell-dev/clack/commit/0e6d4eb32b2c9555da260026b0c28264605e3bb3))
* add param to clear input after password prompt error ([#364](https://github.com/bombshell-dev/clack/issues/364)) ([1604f97](https://github.com/bombshell-dev/clack/commit/1604f9741eb2adc29e59012d89fca89c0b623691))
* add password prompt to @clack/prompts ([97c52ba](https://github.com/bombshell-dev/clack/commit/97c52ba0e1522e7b18cff6fb19d96f85f7025645))
* add select-key option ([691626f](https://github.com/bombshell-dev/clack/commit/691626fe6fed14e382f64a7f19454d6e1b0b6e4b))
* add step log ([c23fff6](https://github.com/bombshell-dev/clack/commit/c23fff6dfb3e29f8cad0a1772e5ae8187a210797))
* add style function option to spinner ([#400](https://github.com/bombshell-dev/clack/issues/400)) ([8409f2c](https://github.com/bombshell-dev/clack/commit/8409f2ca11abd0e48d2ab1f780536680555e5120))
* add support for signals to prompts ([#340](https://github.com/bombshell-dev/clack/issues/340)) ([9e5bc6c](https://github.com/bombshell-dev/clack/commit/9e5bc6cbc95ecf2fe34e217d88bbcec6403fc344))
* add taskLog prompt ([#276](https://github.com/bombshell-dev/clack/issues/276)) ([0aaee4c](https://github.com/bombshell-dev/clack/commit/0aaee4c891c6a0167e8fbc68020aa35d5568f617))
* add unicode fallbacks ([1d4cec8](https://github.com/bombshell-dev/clack/commit/1d4cec88025c2e41eb93bcafd54e50f727fe6912))
* add withGuide option ([#409](https://github.com/bombshell-dev/clack/issues/409)) ([acc4c3a](https://github.com/bombshell-dev/clack/commit/acc4c3a81b7f05ad9ef5442af248fac9c6940cc1))
* add withGuide support to note prompt ([#418](https://github.com/bombshell-dev/clack/issues/418)) ([6176ced](https://github.com/bombshell-dev/clack/commit/6176ced662a7f1faec5d6dc110be891e065865ff))
* **autocomplete:** add wrapping and window limits ([#384](https://github.com/bombshell-dev/clack/issues/384)) ([55645c2](https://github.com/bombshell-dev/clack/commit/55645c28fdc07d4d1e5875fa2cdcbbc83d6bc767))
* box prompt ([#363](https://github.com/bombshell-dev/clack/issues/363)) ([76fd17f](https://github.com/bombshell-dev/clack/commit/76fd17f4369a333efa727fa01a8ddabe3af45ced))
* change disabled multi-select options to have strikethrough ([#419](https://github.com/bombshell-dev/clack/issues/419)) ([43aed55](https://github.com/bombshell-dev/clack/commit/43aed55337c0832ba2ca82e58f508362050247f5))
* **core + prompts:** adds autocomplete ([#288](https://github.com/bombshell-dev/clack/issues/288)) ([f2c2b89](https://github.com/bombshell-dev/clack/commit/f2c2b8928f99cf5fd010974d167c9cc6bfd6f400))
* **core, prompts:** add DatePrompt for date input with customizable formats ([#448](https://github.com/bombshell-dev/clack/issues/448)) ([090902c](https://github.com/bombshell-dev/clack/commit/090902cfaf49379229a2a7995242723d7c2a7519))
* **core+prompts:** Add suggestion + path prompt ([#314](https://github.com/bombshell-dev/clack/issues/314)) ([2837845](https://github.com/bombshell-dev/clack/commit/28378453af9db1c3f747b2025c136c5c3db34eee))
* handle missed errors ([4546906](https://github.com/bombshell-dev/clack/commit/4546906e876d368ca25d690cddce097be778c47d))
* improve group `types` for readability ([#105](https://github.com/bombshell-dev/clack/issues/105)) ([593f93d](https://github.com/bombshell-dev/clack/commit/593f93d06c1a53c8424e9aaf0c1c63fbf6975527))
* improve types event emitter & global aliases ([85cc1d5](https://github.com/bombshell-dev/clack/commit/85cc1d5533beb8931a77f09f3b58d1b897102dc9))
* **prompts,core:** make autocomplete placeholder tabbable ([#485](https://github.com/bombshell-dev/clack/issues/485)) ([bdf89a5](https://github.com/bombshell-dev/clack/commit/bdf89a5f80b9d2911cc64504b15de0cf6fd215bc))
* **prompts:** add cancellation support for spinners ([#264](https://github.com/bombshell-dev/clack/issues/264)) ([c45b9fb](https://github.com/bombshell-dev/clack/commit/c45b9fb0a62c0db02223bab5f55129d9b0c8a009))
* **prompts:** add custom filter option to autocomplete ([#444](https://github.com/bombshell-dev/clack/issues/444)) ([415410b](https://github.com/bombshell-dev/clack/commit/415410b89331e3df4ced69c872be90598c8d0276))
* **prompts:** Add progressbar ([#290](https://github.com/bombshell-dev/clack/issues/290)) ([9a09318](https://github.com/bombshell-dev/clack/commit/9a093181b0ec0ac66969db2f68930882745f006f))
* Refactor the API for stopping spinners & progress bars ([#405](https://github.com/bombshell-dev/clack/issues/405)) ([38019c7](https://github.com/bombshell-dev/clack/commit/38019c786efc28951a5921f26634cf4c4392367f))
* reorganise prompts ([#283](https://github.com/bombshell-dev/clack/issues/283)) ([3f7e1a4](https://github.com/bombshell-dev/clack/commit/3f7e1a4a00e65c45034b7088c32de7a6c92d26e2))
* respect `withGuide: false` in autocomplete and multiselect prompts ([#500](https://github.com/bombshell-dev/clack/issues/500)) ([9fe8de6](https://github.com/bombshell-dev/clack/commit/9fe8de6ac8169f0c1ddd1a51f6b062c696a3182e))
* rework path, remove suggestion prompt ([#335](https://github.com/bombshell-dev/clack/issues/335)) ([df4eea1](https://github.com/bombshell-dev/clack/commit/df4eea1c8d9fdff7752630da272a1490f7fdf928))
* rework values and user input to be separate ([#334](https://github.com/bombshell-dev/clack/issues/334)) ([7bc3301](https://github.com/bombshell-dev/clack/commit/7bc3301cdf2231bda0035a89d00ba151044896c2))
* support disabled for select and multiselect prompt  ([#393](https://github.com/bombshell-dev/clack/issues/393)) ([b103ad3](https://github.com/bombshell-dev/clack/commit/b103ad3d80d20cef7cca8756afe7b7f133960e2b))
* support initialValue for text prompt ([a99c458](https://github.com/bombshell-dev/clack/commit/a99c4580263369bd92733ab5779c6e1e6edbad1f))
* support isAllowEmpty for multi-select ([de1314e](https://github.com/bombshell-dev/clack/commit/de1314e0c81e394cd23ffa54c254e455b0d08f1a))
* tasklog groups ([#347](https://github.com/bombshell-dev/clack/issues/347)) ([f10071e](https://github.com/bombshell-dev/clack/commit/f10071e04c6a25c322bcb15e3584472c6b7c0bae))
* timer indicator for `spinner` ([#230](https://github.com/bombshell-dev/clack/issues/230)) ([613179d](https://github.com/bombshell-dev/clack/commit/613179d596dc850d77ebbce2059d8afffa44e058))
* unbuild builder ([90f5d1a](https://github.com/bombshell-dev/clack/commit/90f5d1ae35266bc2e0ca0ea9ca9b12db5c4e0777))
* update mutli-select styling ([e66e533](https://github.com/bombshell-dev/clack/commit/e66e5336b303a36d2a0be82d12aa5c57c212b15e))

# @clack/prompts

## 1.2.0

### Minor Changes

- 9786226: Externalize `fast-string-width` and `fast-wrap-ansi` to avoid double dependencies
- 090902c: Adds `date` prompt with `format` support (YMD, MDY, DMY)

### Patch Changes

- 134a1a1: Fix the `path` prompt so `directory: true` correctly enforces directory-only selection while still allowing directory navigation, and add regression tests for both directory and default file selection behavior.
- bdf89a5: Adds `placeholder` option to `autocomplete`. When the placeholder is set and the input is empty, pressing `tab` will set the value to `placeholder`.
- 336495a: Apply guide to wrapped multi-line messages in confirm prompt.
- 9fe8de6: Respect `withGuide: false` in autocomplete and multiselect prompts.
- 29a50cb: Fix `path` directory mode so pressing Enter with an existing directory `initialValue` submits that current directory instead of the first child option, and add regression coverage for immediate submit and child-directory navigation.
- Updated dependencies [9786226]
- Updated dependencies [bdf89a5]
- Updated dependencies [417b451]
- Updated dependencies [090902c]
  - @clack/core@1.2.0

## 1.1.0

### Minor Changes

- e3333fb: Replaces `picocolors` with Node.js built-in `styleText`.

### Patch Changes

- c3666e2: destruct `limitOption` param for better code readability, tweak types definitions
- ba3df8e: Fixes withGuide support in intro, outro, and cancel messages.
- Updated dependencies [e3333fb]
  - @clack/core@1.1.0

## 1.0.1

### Patch Changes

- 6404dc1: Disallows selection of `disabled` options in autocomplete.
- 86e36d8: Adds `withGuide` support to select prompt.
- c697439: Fixes line wrapping behavior in autocomplete.
- 0ded19c: Simplifies `withGuide` option checks.
- 0e4ddc9: Fixes `withGuide` support in password and path prompts.
- 76550d6: Adds `withGuide` support to selectKey prompt.
- f9b9953: Adds `withGuide` support to password prompt.
- 0e93ccb: Adds `vertical` arrangement option to `confirm` prompt.
- 4e9ae13: Adds `withGuide` support to confirm prompt.
- 0256238: Adds `withGuide` support to spinner prompt.
- Updated dependencies [6404dc1]
- Updated dependencies [2533180]
  - @clack/core@1.0.1

## 1.0.0

### Major Changes

- c713fd5: The package is now distributed as ESM-only. In `v0` releases, the package was dual-published as CJS and ESM.

  For existing CJS projects using Node v20+, please see Node's guide on [Loading ECMAScript modules using `require()`](https://nodejs.org/docs/latest-v20.x/api/modules.html#loading-ecmascript-modules-using-require).

### Minor Changes

- 415410b: This adds a custom filter function to autocompleteMultiselect. It could be used, for example, to support fuzzy searching logic.
- 7bc3301: Prompts now have a `userInput` stored separately from their `value`.
- 8409f2c: feat: add styleFrame option for spinner
- 2837845: Adds suggestion and path prompts
- 99c3530: Adds `format` option to the note prompt to allow formatting of individual lines
- 0aaee4c: Added new `taskLog` prompt for log output which is cleared on success
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

- 44df9af: Adds a new `groupSpacing` option to grouped multi-select prompts. If set to an integer greater than 0, it will add that number of new lines between each group.
- 55645c2: Support wrapping autocomplete and select prompts.
- 9e5bc6c: Add support for signals in prompts, allowing them to be aborted.
- f2c2b89: Adds `AutocompletePrompt` to core with comprehensive tests and implement both `autocomplete` and `autocomplete-multiselect` components in prompts package.
- 38019c7: Updates the API for stopping spinners and progress bars to be clearer

  Previously, both the spinner and progress bar components used a single `stop` method that accepted a code to indicate success, cancellation, or error. This update separates these into distinct methods: `stop()`, `cancel()`, and `error()`:

  ```diff
  const spinner = prompts.spinner();
  spinner.start();

  // Cancelling a spinner
  - spinner.stop(undefined, 1);
  + spinner.cancel();

  // Stopping with an error
  - spinner.stop(undefined, 2);
  + spinner.error();
  ```

  As before, you can pass a message to each method to customize the output displayed:

  ```js
  spinner.cancel("Operation cancelled by user");
  progressBar.error("An error occurred during processing");
  ```

- c45b9fb: Adds support for detecting spinner cancellation via CTRL+C. This allows for graceful handling of user interruptions during long-running operations.
- f10071e: Using the `group` method, task logs can now have groups which themselves can have scrolling windows of logs.
- df4eea1: Remove `suggestion` prompt and change `path` prompt to be an autocomplete prompt.
- 76fd17f: Added new `box` prompt for rendering boxed text, similar a note.
- 9a09318: Adds new `progress` prompt to display a progess-bar
- 1604f97: Add `clearOnError` option to password prompt to automatically clear input when validation fails
- 9bd8072: Add a `required` option to autocomplete multiselect.
- 19558b9: Added support for custom frames in spinner prompt

### Patch Changes

- 46dc0a4: Fixes multiselect only shows hints on the first item in the options list. Now correctly shows hints for all selected options with hint property.
- aea4573: Clamp scrolling windows to 5 rows.
- bfe0dd3: Prevents placeholder from being used as input value in text prompts
- 55eb280: Fix placeholder rendering when using autocomplete.
- 4d1d83b: Fixes rendering of multi-line messages and options in select prompt.
- 6176ced: Add withGuide support to note prompt
- 7b009df: Fix spinner clearing too many lines upwards when non-wrapping.
- 43aed55: Change styling of disabled multi-select options to have strikethrough.
- 17342d2: Exposes a new `SpinnerResult` type to describe the return type of `spinner`
- 282b39e: Wrap spinner output to allow for multi-line/wrapped messages.
- 2feaebb: Fix duplicated logs when scrolling through options with multiline messages by calculating `rowPadding` dynamically based on actual rendered lines instead of using a hardcoded value.
- 69681ea: Strip destructive ANSI codes from task log messages.
- b0fa7d8: Add support for wrapped messages in multi line prompts
- 9999adf: fix note component overflow bug
- 6868c1c: Adds a new `selectableGroups` boolean to the group multi-select prompt. Using `selectableGroups: false` will disable the ability to select a top-level group, but still allow every child to be selected individually.
- 7df841d: Removed all trailing space in prompt output and fixed various padding rendering bugs.
- 2839c66: fix(note): hard wrap text to column limit
- 7a556ad: Updates all prompts to accept a custom `output` and `input` stream
- 17d3650: Use a default import for picocolors to avoid run time errors in some environments.
- 7cc8a55: Messages passed to the `stop` method of a spinner no longer have dots stripped.
- b103ad3: Allow disabled options in multi-select and select prompts.
- 71b5029: Add missing nullish checks around values.
- 1a45f93: Switched from wrap-ansi to fast-wrap-ansi
- f952592: Fixes missing guide when rendering empty log lines.
- 372b526: Add `clear` method to spinner for stopping and clearing.
- d25f6d0: fix(note, box): handle CJK correctly
- 94fee2a: Changes `placeholder` to be a visual hint rather than a tabbable value.
- 7530af0: Fixes wrapping of cancelled and success messages of select prompt
- 4c89dd7: chore: use more accurate type to replace any in group select
- 0b852e1: Handle `stop` calls on spinners which have not yet been started.
- 42adff8: fix: add missing guide line in autocomplete-multiselect
- 8e2e30a: fix: fix autocomplete bar color when validate
- 2048eb1: Fix spinner's dots behavior with custom frames
- acc4c3a: Add a new `withGuide` option to all prompts to disable the default clack border
- 9b92161: Show symbol when withGuide is true for log messages
- 68dbf9b: select-key: Fixed wrapping and added new `caseSensitive` option
- 09e596c: refactor(progress): remove unnecessary return statement in start function
- 2310b43: Allow custom writables as output stream.
- ae84dd0: Update key binding text to show tab/space when navigating, and tab otherwise.
- Updated dependency on `@clack/core` to `1.0.0`

## 0.10.0

### Minor Changes

- 613179d: Adds a new `indicator` option to `spinner`, which supports the original `"dots"` loading animation or a new `"timer"` loading animation.

  ```ts
  import * as p from "@clack/prompts";

  const spin = p.spinner({ indicator: "timer" });
  spin.start("Loading");
  await sleep(3000);
  spin.stop("Loaded");
  ```

- a38b2bc: Adds `stream` API which provides the same methods as `log`, but for iterable (even async) message streams. This is particularly useful for AI responses which are dynamically generated by LLMs.

  ```ts
  import * as p from "@clack/prompts";

  await p.stream.step(
    (async function* () {
      yield* generateLLMResponse(question);
    })()
  );
  ```

## 0.9.1

### Patch Changes

- 8093f3c: Adds `Error` support to the `validate` function
- 98925e3: Exports the `Option` type and improves JSDocannotations
- 1904e57: Replace custom utility for stripping ANSI control sequences with Node's built-in [`stripVTControlCharacters`](https://nodejs.org/docs/latest/api/util.html#utilstripvtcontrolcharactersstr) utility.
- Updated dependencies [8093f3c]
- Updated dependencies [e5ba09a]
- Updated dependencies [8cba8e3]
  - @clack/core@0.4.1

## 0.9.0

### Minor Changes

- a83d2f8: Adds a new `updateSettings()` function to support new global keybindings.

  `updateSettings()` accepts an `aliases` object that maps custom keys to an action (`up | down | left | right | space | enter | cancel`).

  ```ts
  import { updateSettings } from "@clack/prompts";

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

  One example use case is automatically cancelling a prompt after a timeout.

  ```ts
  const shouldContinue = await confirm({
    message: "This message will self destruct in 5 seconds",
    signal: AbortSignal.timeout(5000),
  });
  ```

  Another use case is racing a long running task with a manual prompt.

  ```ts
  const abortController = new AbortController();

  const projectType = await Promise.race([
    detectProjectType({
      signal: abortController.signal,
    }),
    select({
      message: "Pick a project type.",
      options: [
        { value: "ts", label: "TypeScript" },
        { value: "js", label: "JavaScript" },
        { value: "coffee", label: "CoffeeScript", hint: "oh no" },
      ],
      signal: abortController.signal,
    }),
  ]);

  abortController.abort();
  ```

- a83d2f8: Updates default keybindings to support Vim motion shortcuts and map the `escape` key to cancel (`ctrl+c`).

  | alias | action |
  | ----- | ------ |
  | `k`   | up     |
  | `l`   | right  |
  | `j`   | down   |
  | `h`   | left   |
  | `esc` | cancel |

### Patch Changes

- f9f139d: Adapts `spinner` output for static CI environments
- Updated dependencies [a83d2f8]
- Updated dependencies [801246b]
- Updated dependencies [a83d2f8]
- Updated dependencies [51e12bc]
  - @clack/core@0.4.0

## 0.8.2

### Patch Changes

- Updated dependencies [4845f4f]
- Updated dependencies [d7b2fb9]
  - @clack/core@0.3.5

## 0.8.1

### Patch Changes

- 360afeb: feat: adaptative max items

## 0.8.0

### Minor Changes

- 9acccde: Add tasks function for executing tasks in spinners

### Patch Changes

- b5c6b9b: Feat multiselect maxItems option
- 50ed94a: fix: clear `spinner` hooks on `spinner.stop`
- Updated dependencies [a04e418]
- Updated dependencies [4f6fcf5]
  - @clack/core@0.3.4

## 0.7.0

### Minor Changes

- b27a701: add maxItems option to select prompt
- 89371be: added a new method called `spinner.message(msg: string)`

### Patch Changes

- 52183c4: Fix `spinner` conflict with terminal on error between `spinner.start()` and `spinner.stop()`
- ab51d29: Fixes cases where the note title length was miscalculated due to ansi characters
- Updated dependencies [cd79076]
  - @clack/core@0.3.3

## 0.6.3

### Patch Changes

- c96eda5: Enable hard line-wrapping behavior for long words without spaces
- Updated dependencies [c96eda5]
  - @clack/core@0.3.2

## 0.6.2

### Patch Changes

- 58a1df1: Fix line duplication bug by automatically wrapping prompts to `process.stdout.columns`
- Updated dependencies [58a1df1]
  - @clack/core@0.3.1

## 0.6.1

### Patch Changes

- ca08fb6: Support complex value types for `select`, `multiselect` and `groupMultiselect`.

## 0.6.0

### Minor Changes

- 8a4a12f: add `groupMultiselect` prompt
- 165a1b3: Add `log` APIs. Supports `log.info`, `log.success`, `log.warn`, and `log.error`. For low-level control, `log.message` is also exposed.

### Patch Changes

- Updated dependencies [8a4a12f]
- Updated dependencies [8a4a12f]
  - @clack/core@0.3.0

## 0.5.1

### Patch Changes

- cc11917: Update default `password` mask
- Updated dependencies [ec812b6]
  - @clack/core@0.2.1

## 0.5.0

### Minor Changes

- d74dd05: Adds a `selectKey` prompt type
- 54c1bc3: **Breaking Change** `multiselect` has renamed `initialValue` to `initialValues`

### Patch Changes

- Updated dependencies [d74dd05]
- Updated dependencies [54c1bc3]
  - @clack/core@0.2.0

## 0.4.5

### Patch Changes

- 1251132: Multiselect: return `Value[]` instead of `Option[]`.
- 8994382: Add a password prompt to `@clack/prompts`
- Updated dependencies [1251132]
- Updated dependencies [8994382]
  - @clack/core@0.1.9

## 0.4.4

### Patch Changes

- d96071c: Don't mutate `initialValue` in `multiselect`, fix parameter type for `validate()`.

  Credits to @banjo for the bug report and initial PR!

- Updated dependencies [d96071c]
  - @clack/core@0.1.8

## 0.4.3

### Patch Changes

- 83d890e: Fix text cancel display bug

## 0.4.2

### Patch Changes

- Update README

## 0.4.1

### Patch Changes

- 7fb5375: Adds a new `defaultValue` option to the text prompt, removes automatic usage of the placeholder value.
- Updated dependencies [7fb5375]
  - @clack/core@0.1.6

## 0.4.0

### Minor Changes

- 61b88b6: Add `group` construct to group many prompts together

### Patch Changes

- de1314e: Support `required` option for multi-select
- Updated dependencies [de1314e]
  - @clack/core@0.1.5

## 0.3.0

### Minor Changes

- 493c592: Improve types for select/multiselect prompts. Numbers and booleans are now supported as the `value` option.
- 15558e3: Improved Windows/non-unicode support

### Patch Changes

- ca77da1: Fix multiselect initial value logic
- Updated dependencies [ca77da1]
- Updated dependencies [8aed606]
  - @clack/core@0.1.4

## 0.2.2

### Patch Changes

- 94b24d9: Fix CJS `ansi-regex` interop

## 0.2.1

### Patch Changes

- a99c458: Support `initialValue` option for text prompt
- Updated dependencies [a99c458]
  - @clack/core@0.1.3

## 0.2.0

### Minor Changes

- Improved type safety
- b1341d6: Updated styles, new note component

### Patch Changes

- Updated dependencies [7dcad8f]
- Updated dependencies [2242f13]
- Updated dependencies [b1341d6]
  - @clack/core@0.1.2

## 0.1.1

### Patch Changes

- fa09bf5: Use circle for radio, square for checkbox
- Updated dependencies [4be7dbf]
- Updated dependencies [b480679]
  - @clack/core@0.1.1

## 0.1.0

### Minor Changes

- 7015ec9: Create new prompt: multi-select

### Patch Changes

- Updated dependencies [7015ec9]
  - @clack/core@0.1.0

## 0.0.10

### Patch Changes

- e0b49e5: Update spinner so it actually spins

## 0.0.9

### Patch Changes

- Update README

## 0.0.8

### Patch Changes

- Updated dependencies [9d371c3]
  - @clack/core@0.0.12

## 0.0.7

### Patch Changes

- Update README

## 0.0.6

### Patch Changes

- d20ef2a: Update keywords, URLs
- Updated dependencies [441d5b7]
- Updated dependencies [d20ef2a]
- Updated dependencies [fe13c2f]
  - @clack/core@0.0.11

## 0.0.5

### Patch Changes

- Update README

## 0.0.4

### Patch Changes

- 80404ab: Update README

## 0.0.3

### Patch Changes

- a0cb382: Add `main` entrypoint
- Updated dependencies [a0cb382]
  - @clack/core@0.0.10

## 0.0.2

### Patch Changes

- Updated dependencies
  - @clack/core@0.0.9

## 0.0.1

### Patch Changes

- a4b5e13: Initial release
- Updated dependencies [a4b5e13]
  - @clack/core@0.0.8
