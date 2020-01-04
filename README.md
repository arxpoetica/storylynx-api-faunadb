# storylynx-api-faunadb

StoryLynx API plugin for FaunaDB support.

## Setup

First go to the [FaunaDB](https://fauna.com/) website, sign up for a new account, and create a new project.

<!-- Record the name of the project. We'll be adding it to the `LYNX_FAUNADB_PROJECT` environment variables below. -->

## Usage

This plugin requires several environment variables for FaunaDB to work. First, set the correct plugin variable in development (`.env`) and in production (`.env.enc-source`):

```
LYNX_API_PLUGIN=storylynx-api-faunadb
```
