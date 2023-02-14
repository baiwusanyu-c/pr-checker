
# 🚀 PR-Checker

检测您所提交的 `PR` 并自动更新

[English](https://github.com/baiwusanyu-c/pr-checker/blob/master/README.md) | 中文

## 特性

- ⚡️通过指令按照仓库检测您所提交的 `PR` 是否需要更新
- ☘️通过指令按照仓库选择更新您所提交的 `PR`
- 🔥️通过指令一键检测您账号下所有 `PR` 是否需要更新
- 🌷通过指令选择更新您账号下所有 `PR`

## 使用

#### 1.安装

```` shell
pnpm install pr-checker --global
````
或
```` shell
npm install pr-checker --global
````
或
```` shell
yarn install pr-checker --global
````

#### 2.运行命令 `pr-checker`

```` shell
pr-checker run
````

#### 3. 选择类型

```` shell
? Detect all Repo's PR? » - Use arrow-keys. Return to submit.
>   All Repo // 更新所有仓库的 PR
    Detect the PR of a certain Repo // 选择一个仓库的 PR

````

#### 4. 选择你仓库(如果你选择了 `Detect the PR of a certain Repo`)

```` shell
? Please select a Repo » - Use arrow-keys. Return to submit.
>   baiwusanyu-c/pr-checker
    vuejs/core
    mistjs/vite-plugin-copy-files

````
之后会开始对 `PR` 进行检测，是否能够进行更新
```shell
√ Please select a Repo » vuejs/core
| Checking PR by vuejs/core......✔ NO.1:Check PR #7662 completed
- Checking PR by vuejs/core......✔ NO.2:Check PR #7557 completed
/ Checking PR by vuejs/core......✔ NO.3:Check PR #7541 completed
\ Checking PR by vuejs/core......✔ NO.4:Check PR #7525 completed
/ Checking PR by vuejs/core......

```

#### 5. 选择 `PR` 进行更新

```` shell
? Please select the PR that needs to be updated »
Instructions:
    ↑/↓: Highlight option
    ←/→/[space]: Toggle selection
    a: Toggle all
    enter/return: Complete answer
(*)   <CanMerge:false>: [vuejs/core]-[#7662] -> feat(customElement): Additional event arguments of CustomEvent
(*)   <CanMerge:false>: [vuejs/core]-[#7557] -> fix(compiler-ssr): TransitionGroup owns style-scoped properties on SSR
(*)   <CanMerge:true>: [vuejs/core]-[#7541] -> fix(runtime-dom): `transitionGroup` can render `:slotted` styles
( )   <CanMerge:true>: [vuejs/core]-[#7525] -> feat(runtime-dom): custom element support v-model
( )   <CanMerge:true>: [vuejs/core]-[#7502] -> fix(server-renderer): getSSRProps can get exposed property
( )   <CanMerge:true>: [vuejs/core]-[#7475] -> fix(runtime-dom): undefined cssvars should not be bound to the element
( )   <CanMerge:true>: [vuejs/core]-[#7457] -> fix(runtime-core): boolean type and string type problem during props normalization process
( )   <CanMerge:true>: [vuejs/core]-[#7434] -> fix(runtime-core): Select elements can preserve data types when stringified
( )   <CanMerge:true>: [vuejs/core]-[#7344] -> fix(runtime): CSSVars can work with Teleport
( ) ↓ <CanMerge:true>: [vuejs/core]-[#7341] -> fix(runtime-core): Fix cssvars reporting error when teleport is disabled

````
最后更新完成，不符合更新条件的（例如存在代码冲突），会被认定为无法自动更新。
```shell
√ Update PR by vuejs/core......
✔ All PR updates completed
┌────────┬───────────┬─────────┬──────────────┬────────────────────────────────────────────────────────────────────────────────────────────────┐     
│ number │ can merge │ success │ repo         │ title                                                                                          │     
├────────┼───────────┼─────────┼──────────────┼────────────────────────────────────────────────────────────────────────────────────────────────┤     
│ #7662  │ false     │ false   │ <vuejs/core> │ feat(customElement): Additional event arguments of CustomEvent                                 │     
│ #7557  │ false     │ false   │ <vuejs/core> │ fix(compiler-ssr): TransitionGroup owns style-scoped properties on SSR                         │     
│ #7541  │ true      │ true    │ <vuejs/core> │ fix(runtime-dom): `transitionGroup` can render `:slotted` styles                               │     
│ #7525  │ true      │ true    │ <vuejs/core> │ feat(runtime-dom): custom element support v-model                                              │     
│ #7502  │ true      │ true    │ <vuejs/core> │ fix(server-renderer): getSSRProps can get exposed property                                     │     
│ #7475  │ true      │ true    │ <vuejs/core> │ fix(runtime-dom): undefined cssvars should not be bound to the element                         │     
│ #7457  │ true      │ true    │ <vuejs/core> │ fix(runtime-core): boolean type and string type problem during props normalization process     │     
│ #7434  │ true      │ true    │ <vuejs/core> │ fix(runtime-core): Select elements can preserve data types when stringified                    │     
│ #7344  │ true      │ true    │ <vuejs/core> │ fix(runtime): CSSVars can work with Teleport                                                   │     
│ #7341  │ true      │ true    │ <vuejs/core> │ fix(runtime-core): Fix cssvars reporting error when teleport is disabled                       │     
│ #7266  │ true      │ true    │ <vuejs/core> │ fix(runtime-core): Correct update renders both old and new dynamic child node arrays are empty │     
│ #7151  │ true      │ true    │ <vuejs/core> │ fix(suspense): In nested slots suspense should return to pending state                         │     
│ #7108  │ true      │ true    │ <vuejs/core> │ fix(compiler-core): custom directive to empty string syntax error in ssr(#6283 )               │     
│ #7004  │ true      │ true    │ <vuejs/core> │ fix(runtime-dom): `v-model` can update correctly when the element is an input of type number   │     
│ #6783  │ true      │ true    │ <vuejs/core> │ fix(runtime-core):transition missing root node warning used in prod #6752                      │     
│ #6224  │ true      │ true    │ <vuejs/core> │ feat(runtime-core): Update rendering error caused by shallow copy #6221                        │     
└────────┴───────────┴─────────┴──────────────┴────────────────────────────────────────────────────────────────────────────────────────────────┘  
```
## 快照
<img src="./public/img1.png" alt="Detect and update your Pull Requests in batches"/>
<img src="./public/img2.png" alt="Detect and update your Pull Requests in batches"/>

## 鸣谢
* [cpr](https://github.com/edison1105/cpr)