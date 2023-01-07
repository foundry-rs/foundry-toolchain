## `foundry-toolchain` Action

This GitHub Action installs [Foundry](https://github.com/foundry-rs/foundry), the blazing fast, portable and modular toolkit for Ethereum application development.

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

      - name: Run tests
        run: forge test -vvv

      - name: Run snapshot
        run: forge snapshot
```

### Inputs

| **Name**  | **Required** | **Default** | **Description**                                                                                              | **Type** |
| --------- | ------------ | ----------- | ------------------------------------------------------------------------------------------------------------ | -------- |
| `version` | No           | `nightly`   | Version to install, e.g. `nightly` or `1.0.0`. **Note:** Foundry only has nightly builds for the time being. | string   |

### Summaries

You can add the output of Forge and Cast commands to GitHub step summaries. The summaries support GitHub flavored Markdown.

For example, to add the output of `forge snapshot` to a summary, you would change the snapshot step to:

```yml
- name: Run snapshot
  run: NO_COLOR=1 forge snapshot >> $GITHUB_STEP_SUMMARY
```

See the official [GitHub docs](https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#adding-a-job-summary) for more information.
