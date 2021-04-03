# DynamoDB benchworx

Open source GUI for working with AWS DynamoDB.

- 👍 Built on Electron for cross platform access
- 🚀 Uses the aws-sdk v3 to have a small footprint
- ✔️ Exposes multiple ways to configure aws

![User interface with tables and items](cypress/snapshots/end-to-end/index.spec.tsx/latest.snap.png)

- [DynamoDB benchworx](#dynamodb-benchworx)
  - [Features](#features)

## Features

- [x] Authenticate using AWS `~/.aws/credentials`
- [x] Show dynamoDB records as JSON using monaco editor
- [ ] Edit dynamoDB records as JSON using monaco editor
- [ ] Query and Scan on Primary, Local Secondary, and Global Secondary indexes
- [ ] Use the aws-sdk for dynamo to design and test queries inside an authenticated REPL
