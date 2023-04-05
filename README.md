
# 🚀 PR-Checker

Detect and update your Pull Requests in batches

English | [中文](https://github.com/baiwusanyu-c/pr-checker/blob/master/README.ZH-CN.md)
## Features

- ⚡️Check whether the `PR` submitted by you needs to be updated according to the warehouse
- ☘ Choose to update your submitted `PR` by command according to the repository
- 🔥️ Check whether all `PR` under your account need to be updated with one click of the command
- 🌷 Choose to update all `PR` under your account by command

## How to ues ?

#### 1.Install

```` shell
pnpm install pr-checker --global
````
or
```` shell
npm install pr-checker --global
````
or
```` shell
yarn install pr-checker --global
````

#### 2.Run command to use `pr-checker`

* Set up your GitHub token
> Please set GitHub Token for the first use
```bash
pr-checker -t #<GH_TOKEN> // set github token
```

* Please set your GitHub username for the first use.
> For v1.1.1 and lower versions, you need to set the GitHub username for the first use
Versions above v1.1.1 will automatically set the username according to the GitHub Token
```bash
pr-checker -u #<GH_USERNAME> // set github username
```

* Run the run command to check your pr
```` shell
pr-checker run
````

#### 3. Select type

```` shell
? Detect all Repo's PR? » - Use arrow-keys. Return to submit.
>   All Repo
    Detect the PR of a certain Repo

````

#### 4. Select Repo (if you choose `Detect the PR of a certain Repo`)

```` shell
? Please select a Repo » - Use arrow-keys. Return to submit.
>   baiwusanyu-c/pr-checker
    vuejs/core
    mistjs/vite-plugin-copy-files

````
After that, the `PR` will be checked to see if it can be updated
```shell
√ Please select a Repo » vuejs/core
| Checking PR by vuejs/core......✔ NO.1:Check PR #7662 completed
- Checking PR by vuejs/core......✔ NO.2:Check PR #7557 completed
/ Checking PR by vuejs/core......✔ NO.3:Check PR #7541 completed
\ Checking PR by vuejs/core......✔ NO.4:Check PR #7525 completed
/ Checking PR by vuejs/core......

```

#### 5. Select `PR` to update

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
After the last update is completed, those that do not meet the update conditions (such as code conflicts) will be deemed unable to be automatically updated.

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
### Other
#### -v ｜ --version
Display version message

```` shell
pr-checker -v
````

#### -h ｜ --help
Display help message

#### -m ｜ --mode
Use `rebase` mode or `merge` mode, the default value is `rebase` mode

> In `rebase` mode, you can choose a repository or directly `rebase` all your submitted `pr`
It will call `/repos/${repoName}/pulls/${prNumber}/update-branch`.

>In `merge` mode, you can `merge` on repositories you own (except `fork` repositories)
It will call `/repos/${repoName}/pulls/${prNumber}/merge`.
A typical usage scenario is batch processing `pr` of `dependabot` (the function of adding to `merge queue` has not yet been completed)

```` shell
pr-checker run -m merge ｜ rebase
````

```` shell
pr-checker -h
````

## Screenshot
<img src="./public/img1.png" alt="Detect and update your Pull Requests in batches"/>
<img src="./public/img2.png" alt="Detect and update your Pull Requests in batches"/>

## Thanks
* [cpr](https://github.com/edison1105/cpr)
