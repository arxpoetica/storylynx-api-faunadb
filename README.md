# storylynx-api-graphcms

StoryLynx API plugin for GraphCMS support.

## Install

From the root of your StoryLynx project:

```
npm install storylynx-api-graphcms
```

## Setup

Go to the [GraphCMS](https://graphcms.com/) website. After signing up for a new account (you can do a free account for starters)...

...TODO: finish this section...

## Usage

This plugin requires several environment variables for GraphCMS to work. First, set the correct plugin variable in development (`.env`) and in production (`.env.enc-source`):

```
LYNX_API_PLUGIN=storylynx-api-graphcms
```

As mentioned above, there are additional environment variables also needed. These include:

```
LYNX_GRAPHCMS_ENDPOINT=xxx
LYNX_GRAPHCMS_TOKEN=xxx
LYNX_GRAPHCMS_MUTATE_TOKEN=xxx
```

## Database Initialization

FIXME: the following currently does not work...

Now that you've set up your database, initialize it from the root of your StoryLynx project like so:

```
npm run lynx-init
```
