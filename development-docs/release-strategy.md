# Release strategy

## Release workflow

1. Checkout to main Branch and Pull Latest Changes:
    ```shell
    git checkout main
    git pull
    ```
<!-- 2. Create and checkout to a new local git branch for the release with
    ```shell
    git checkout -b release/<release-version>

    # Example: git checkout -b release/v0.0.1
    ``` -->

2. Copy the hash of the latest commit from `git log`

   ```shell
   git log -1 --pretty=format:"%h"

   # Example: c981e35
   ```

- Create a `git tag` for that commit hash with

  ```shell
  git tag <tag-name> <commit-hash>

  # Example: git tag v0.0.1 c981e35
  ```

  Depending on the specific release type you're making, can be of shape `v0.2.0-alpha.1` or `v1.0.0-beta.3`, etc.

- Generate a changelog with [git-cliff](https://git-cliff.org/)
    - by running a cli command:
        ```shell
        git cliff --config changelog-template.toml --output CHANGELOG.md
        ```
    - or by running a cli command:
        ```shell
        npm run generate:changelog
        ```  
- Commit changelog files (following [conventional commits format](https://www.conventionalcommits.org/en/v1.0.0/)):
  ```shell
  git add .
  git commit -m "chore(release): <release-version>"
      # Example: git commit -m "chore(release): v0.0.1"
      ```
  <!-- - Push the local release branch to remote repo with `git push` -->
- Push the local branch to remote repo, including git tags `git push --tags`
<!-- - Create a Pull Request from release branch `release/<release-version>` to `main` and merge it -->
- Go to [github.com/skyisuniverse/architecture-decision-records/releases](https://github.com/skyisuniverse/architecture-decision-records/releases)
- Create a new release
  - Select the `git tag` you have created (e.g. `v0.0.1`)
  - Select the target `main`
  - Tick the checkbox `Set as a pre-release` if the release you are publishing is not ready for production (will get a `Pre Release` label on github)
  - Paste the `release title` (can be any)
  - Manually copy the markdown of the release you're going to publish from the `CHANGELOG.md` file to Github (`Write` tab)
  - Click on the `Preview` tab to verify correct rendering of the markdown of the release
  - Click on `Publish Release`

## Additional Notes:

- Ensure that the changelog-template.toml file is correctly configured to generate the desired changelog format.
- Verify that the commit message format follows the Conventional Commits specification to ensure consistency and clarity.