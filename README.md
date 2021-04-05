# DynamoDB benchworx

Open source GUI for working with AWS DynamoDB.

- 👍 Built on Electron for cross platform access
- 🚀 Uses the aws-sdk v3 to have a small footprint
- ✔️ Exposes multiple ways to configure aws

![User interface with tables and items](cypress/snapshots/end-to-end/index.spec.tsx/latest.snap.png)

- [DynamoDB benchworx](#dynamodb-benchworx)
  - [Features](#features)
  - [Configuration](#configuration)
    - [Standard Profile](#standard-profile)
    - [MFA Profile](#mfa-profile)
    - [Assume Role in another Account](#assume-role-in-another-account)
    - [Assume Role with MFA](#assume-role-with-mfa)
    - [Local](#local)

## Features

- [x] Authenticate using AWS `~/.aws/credentials`
- [x] Show dynamoDB records as JSON using monaco editor
- [ ] Edit dynamoDB records as JSON using monaco editor
- [ ] Query and Scan on Primary, Local Secondary, and Global Secondary indexes
- [ ] Use the aws-sdk for dynamo to design and test queries inside an authenticated REPL

## Configuration

Configuration is supported via the AWS credentials and config files.

By default all available profiles are show in the profile selection.

Here are some examples:

### Standard Profile

```
~/.aws/credentials
[profile-name]
aws_access_key_id = id
aws_secret_access_key = secret
```

### MFA Profile

```
~/.aws/credentials
[profile-name]
aws_access_key_id = id
aws_secret_access_key = secret
```

```
~/.aws/config
[profile mfa-profile]
mfa_serial = arn:aws:iam::<aws_account_arn>:mfa/<username>
source_profile = profile-name
```

### Assume Role in another Account

```
~/.aws/credentials
[profile-name]
aws_access_key_id = id
aws_secret_access_key = secret
```

```
~/.aws/config
[profile assumed-role]
role_arn = arn:aws:iam::<aws_target_account_arn>:role/<RoleName>
source_profile = profile-name
```

### Assume Role with MFA

```
~/.aws/credentials
[profile-name]
aws_access_key_id = id
aws_secret_access_key = secret
```

```
~/.aws/config
[profile mfa-assumed-role]
mfa_serial = arn:aws:iam::<aws_account_arn>:mfa/<username>
role_arn = arn:aws:iam::<aws_target_account_arn>:role/<RoleName>
source_profile = profile-name
```

### Local

Setup a local dynamoDB agent on a specified port.

```
~/.aws/config
[profile local]
region = local
output = json
endpoint=http://localhost:8000
```
