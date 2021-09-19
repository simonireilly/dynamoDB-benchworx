# Contributing

All contributions, issues, and pull requests are welcome.

- [Contributing](#contributing)
    - [Local Run](#local-run)
    - [Tests](#tests)
    - [End to End testing](#end-to-end-testing)
  - [Releasing](#releasing)
    - [Example](#example)

### Local Run

Running the project locally by pull/forking:

```
yarn install

yarn start
```

### Tests

jest is the test runner used for unit testing:

```
yarn test

```

### End to End testing

Cypress is used for end to end testing using component mounting:

```
yarn cy
```

To update failing snapshots run:

```
yarn cy:u
```

## Releasing

Currently the release process is automated to produce drafts as Beta releases until a stable version is ready.

The release process is.

1. Create a release branch
2. Run the release command
   1. `yarn pub:beta`
   2. Answer yes to all
3. Github Actions will kick off following the creation of the tag, and binaries for the supported operating systems will be produced.

### Example

```
get checkout -b release/0.0.x
git push --set-upstream origin
yarn pub:beta
```
