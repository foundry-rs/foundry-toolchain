## [`foundry-toolchain`](https://github.com/foundry-rs/foundry-toolchain/edit/master/README.md)

This GitHub Action installs [Foundry](https://github.com/foundry-rs/foundry).

### Example workflow

```yml
on: [push]

name: test

jobs:
  check:
    name: Foundry project
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: recursive

      - name: Install Foundry
        uses: foundry-rs/foundry-toolchain@v1
        with:
          version: nightly

      - name: Run tests
        run: forge test -vvv

      - name: Run snapshot
        run: forge snapshot >> $GITHUB_STEP_SUMMARY
```

### Inputs

| **Name**  | **Required** | **Description**                                                                                               | **Type** |
|-----------|--------------|---------------------------------------------------------------------------------------------------------------|----------|
| `version` | Yes          | Version to install, e.g. `nightly` or `1.0.0`.  **Note:** Foundry only has nightly builds for the time being. | string   |


### Outputs

> [see the offical GitHub docs for more information](https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#adding-a-job-summary)

| **Name**              	| **Required** 	| **Description**                                         	| **Example**                                	|
|-----------------------	|--------------	|---------------------------------------------------------	|--------------------------------------------	|
| `GITHUB_STEP_SUMMARY` 	|      No      	|  Outputs unique input for each job	| `forge snapshot >> $GITHUB_STEP_SUMMARY` 	|

