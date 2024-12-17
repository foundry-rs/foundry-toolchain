## Releasing

- Make sure the dist folder is up to date (run `npm run build` and make sure there is no diff)
- Create a new tag (`vx.y.z`) and push it (or create it through GitHub)
- Publish a new GitHub release, ensuring "Publish to GitHub Marketplace" is checked
- **Important**: You should also move the `vx` tag to the new release. For example, if you are releasing a `v1.y.z` version, also move the `v1` tag to the same commit.
