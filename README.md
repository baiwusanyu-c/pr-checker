
# π PR-Checker

Detect and update your Pull Requests in batches

English | [δΈ­ζ](https://github.com/baiwusanyu-c/pr-checker/blob/master/README.ZH-CN.md)
## Features

- β‘οΈCheck whether the `PR` submitted by you needs to be updated according to the warehouse
- β Choose to update your submitted `PR` by command according to the repository
- π₯οΈ Check whether all `PR` under your account need to be updated with one click of the command
- π· Choose to update all `PR` under your account by command

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

```` shell
pr-checker run
````

#### 3. Select type

```` shell
? Detect all Repo's PR? Β» - Use arrow-keys. Return to submit.
>   All Repo
    Detect the PR of a certain Repo

````

#### 4. Select Repo (if you choose `Detect the PR of a certain Repo`)

```` shell
? Please select a Repo Β» - Use arrow-keys. Return to submit.
>   baiwusanyu-c/pr-checker
    vuejs/core
    mistjs/vite-plugin-copy-files

````
After that, the `PR` will be checked to see if it can be updated
```shell
β Please select a Repo Β» vuejs/core
| Checking PR by vuejs/core......β NO.1:Check PR #7662 completed
- Checking PR by vuejs/core......β NO.2:Check PR #7557 completed
/ Checking PR by vuejs/core......β NO.3:Check PR #7541 completed
\ Checking PR by vuejs/core......β NO.4:Check PR #7525 completed
/ Checking PR by vuejs/core......

```

#### 5. Select `PR` to update

```` shell
? Please select the PR that needs to be updated Β»
Instructions:
    β/β: Highlight option
    β/β/[space]: Toggle selection
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
( ) β <CanMerge:true>: [vuejs/core]-[#7341] -> fix(runtime-core): Fix cssvars reporting error when teleport is disabled

````
After the last update is completed, those that do not meet the update conditions (such as code conflicts) will be deemed unable to be automatically updated.

```shell
β Update PR by vuejs/core......
β All PR updates completed
ββββββββββ¬ββββββββββββ¬ββββββββββ¬βββββββββββββββ¬βββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββ     
β number β can merge β success β repo         β title                                                                                          β     
ββββββββββΌββββββββββββΌββββββββββΌβββββββββββββββΌβββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββ€     
β #7662  β false     β false   β <vuejs/core> β feat(customElement): Additional event arguments of CustomEvent                                 β     
β #7557  β false     β false   β <vuejs/core> β fix(compiler-ssr): TransitionGroup owns style-scoped properties on SSR                         β     
β #7541  β true      β true    β <vuejs/core> β fix(runtime-dom): `transitionGroup` can render `:slotted` styles                               β     
β #7525  β true      β true    β <vuejs/core> β feat(runtime-dom): custom element support v-model                                              β     
β #7502  β true      β true    β <vuejs/core> β fix(server-renderer): getSSRProps can get exposed property                                     β     
β #7475  β true      β true    β <vuejs/core> β fix(runtime-dom): undefined cssvars should not be bound to the element                         β     
β #7457  β true      β true    β <vuejs/core> β fix(runtime-core): boolean type and string type problem during props normalization process     β     
β #7434  β true      β true    β <vuejs/core> β fix(runtime-core): Select elements can preserve data types when stringified                    β     
β #7344  β true      β true    β <vuejs/core> β fix(runtime): CSSVars can work with Teleport                                                   β     
β #7341  β true      β true    β <vuejs/core> β fix(runtime-core): Fix cssvars reporting error when teleport is disabled                       β     
β #7266  β true      β true    β <vuejs/core> β fix(runtime-core): Correct update renders both old and new dynamic child node arrays are empty β     
β #7151  β true      β true    β <vuejs/core> β fix(suspense): In nested slots suspense should return to pending state                         β     
β #7108  β true      β true    β <vuejs/core> β fix(compiler-core): custom directive to empty string syntax error in ssr(#6283 )               β     
β #7004  β true      β true    β <vuejs/core> β fix(runtime-dom): `v-model` can update correctly when the element is an input of type number   β     
β #6783  β true      β true    β <vuejs/core> β fix(runtime-core):transition missing root node warning used in prod #6752                      β     
β #6224  β true      β true    β <vuejs/core> β feat(runtime-core): Update rendering error caused by shallow copy #6221                        β     
ββββββββββ΄ββββββββββββ΄ββββββββββ΄βββββββββββββββ΄βββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββ  
```
### Other
#### -v ο½ --version
Display version message

```` shell
pr-checker -v
````

#### -h ο½ --help
Display help message

```` shell
pr-checker -h
````

## Screenshot
<img src="./public/img1.png" alt="Detect and update your Pull Requests in batches"/>
<img src="./public/img2.png" alt="Detect and update your Pull Requests in batches"/>

## Thanks
* [cpr](https://github.com/edison1105/cpr)
