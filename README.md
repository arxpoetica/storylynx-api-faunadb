# storylynx-api-faunadb

StoryLynx API plugin for FaunaDB support.

## Install

From the root of your StoryLynx project:

```
npm install storylynx-api-faunadb
```

## Setup

Go to the [FaunaDB](https://fauna.com/) website. After signing up for a new account (you can do a free account for starters), click the "new database" button, and give your database a name. Save this name. (NOTE: do *not* click "Pre-populate with demo data"—we'll be migrating our own schemas and GraphQL data.) We'll put this database name in the `LYNX_FAUNADB_DB` environment variables.

After creating your database, head to the "security" section of the database and click "new key" to create an API key. Make sure you've selected the right database. For "role" change permissions to "Server" and name the key "server-key". Save it and copy the resulting key (this key won't be displayed again). We'll be saving this in the environment variables as `LYNX_FAUNADB_API_KEY`.

## Usage

This plugin requires several environment variables for FaunaDB to work. First, set the correct plugin variable in development (`.env`) and in production (`.env.enc-source`):

```
LYNX_API_PLUGIN=storylynx-api-faunadb
```

As mentioned above, there are additional environment variables also needed. These include:

```
LYNX_FAUNADB_DB=faunadb-name-here
LYNX_FAUNADB_API_KEY=storylynx-api-key-goes-here
```

## Database Initialization

Now that you've set up your database, initialize it from the root of your StoryLynx project like so:

```
npm run lynx-init
```
