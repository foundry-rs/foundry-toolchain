## `foundry-toolchain` Action

This GitHub action installs [Foundry](https://github.com/gakonst/foundry).

### Example workflow

```yml
on: [push]

name: test

jobs:
  check:
    name: Foundry project
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          submodules: recursive

      - name: Install Foundry
        uses: onbjerg/foundry-toolchain@v1
        with:
          version: nightly

      - name: Run tests
        run: forge test -vvv
```

### Inputs

| **Name**  | **Required** | **Description**                                                                                               | **Type** |
|-----------|--------------|---------------------------------------------------------------------------------------------------------------|----------|
| `version` | Yes          | Version to install, e.g. `nightly` or `1.0.0`.  **Note:** Foundry only has nightly builds for the time being. | string   |
