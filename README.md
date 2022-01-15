## `foundry-toolchain` Action

This GitHub action installs [Foundry](https://github.com/gakonst/foundry).

### Example workflow

```yml
on: [push]

name: build

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
