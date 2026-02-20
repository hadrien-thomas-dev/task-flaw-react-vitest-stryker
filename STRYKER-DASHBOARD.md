# Setup github pipeline and stryker dashboard

Stryker dashboard provides an online interface showing your mutation test results.
Let’s automate sending your mutation reports directly to the Stryker Dashboard.

Edit the **stryker.config.json**
```json
{
    "incremental": true, // 🚨
    "checkers": [
        "typescript"
    ],
    "tsconfigFile": "tsconfig.json",
    "reporters": [
        "html",
        "clear-text",
        "progress",
        "dashboard" // 🚨
    ]
}
```

You need to add all the reporters you need to override the default configuration which does not include dashboard.
The **incremental** option allows the run of stryker to write a **stryker-incremental.json** file to at like a diff for performance.
It will be used later in the pipeline.

To be able to send the report, you need to register your repository at https://dashboard.stryker-mutator.io/
It will provide you an api key which you will paste into your github repository in Settings > Security | Secrets and variables > Actions > Repository secrets.
I named mine `STRYKER_MUTATOR_DASHBOARD_API_KEY`.

Create file **mutation.yml** in .github/workflows
```yml
name: Mutation Testing
on: [push, pull_request]

jobs:
  stryker:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Cache Stryker Incremental
        uses: actions/cache@v4
        with:
          path: .stryker-tmp/incremental-report.json
          key: stryker-${{ runner.os }}-${{ github.ref_name }}
          restore-keys: |
            stryker-${{ runner.os }}-

      - name: Run Stryker
        run: npm run mutation
        env:
          STRYKER_DASHBOARD_API_KEY: ${{ secrets.STRYKER_MUTATOR_DASHBOARD_API_KEY }}
```

`STRYKER_DASHBOARD_API_KEY` is the name of the variable used automatically by the dashboard reporter
whereas `STRYKER_MUTATOR_DASHBOARD_API_KEY` is the name of my secret in github
The **Cache Stryker Incremental** step is the way to keep track of the last mutation run without having to commit anything on the repository.

The pipeline triggers on pushes and pull requests, including merges. This can be refined based on your branching strategy.

Here is my report https://dashboard.stryker-mutator.io/reports/github.com/hadrien-thomas-dev/starter-react-vitest-stryker/main#mutant