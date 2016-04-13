# Candycane CLI

The Candycane command line utility.

This will compile, test, and run development versions of our Candycane API projects.

## Installing the Candycane CLI

To install the Candycane CLI run:

```bash
npm install -g candycane-cli nodemon
```

> **NOTE** We install `nodemon` because the `candycane serve` command currently doesn't restart quite correctly...

## Creating a new Candycane Project

Now that we have a the Candycane CLI installed, we can create a new project with the command `candycane new my-new-app -sn`.

The Candycane CLI will create a new project in a directory called `my-new-app`.

> **BUG** The `-sn` flag is because right now there is an issue with installing NPM dependencies when running the `new` command.

Next move into the new project directory and install NPM dependencies:

```bash
cd my-new-app
npm install
```

After installing, Candycane will create a new build of our app to start with in the `dist` directory.
This is a compiled code is a Node 5 compatible build of our ES6 code.

Candycane can be used with any ORM, Serialization, or Express Middleware: but, the `candycane new` command installs a few nice defaults:

* [`candycane-knex`](https://github.com/candycanejs/candycane-knex) - Sets up KNEX database connection for the application
* [`candycane-bookshelf`](https://github.com/candycanejs/candycane-bookshelf) - Sets up and registers models for the application
* [`candycane-jsonapi-mapper`](https://github.com/candycanejs/candycane-jsonapi-mapper) - Provides decorators for serializing Bookshelf models for JSON-API

## Developing using Candycane CLI

When working on a project using Candycane, we'll write our application code in the `app` directory.
This will be ES6 code that needs to be compiled down to be used with Node 5.

To build these files using Babel on each change, run the following command:

```bash
candycane build --watch
```

This will build all of our files into the `dist` directory.

To run our server for development, we can run the command in another tab in our terminal:

```bash
nodemon dist/bin/www
```

## Registering Routes

When working in our application, the first thing we will need to do is register a new route in our application.
This will allow us to respond to new urls.

Under the hood, Candycane is using Express.js for mapping URLs.

Our router is described in the `app/router.js` file within the `registerRoutes` method.
Within this method, we'll need to call `this.get`, `this.post`, etc.
These functions take two arguments:

* The url or url pattern that we want to match
* The action module that we want to use to respond as an action

For instance if we want to respond to the url `posts` with the `app/actions/posts/index` module, we can have the following code:

```js
this.get(`posts`, `posts/index`);
```

## Action Modules

Instead of creating Middleware functions, Candycane uses `Action` classes to help manage asynchronous data lookup and manipulation.
This means for our `posts` example above, we will need to create a new `posts/index.js` action in the `app/actions` directory.
This file will need to export a class that extends from `candycane/dist/http/action`.

```js
// app/actions/posts/index.js
import Action from 'candycane/dist/http/action';

export default class extends Action {

}
```

### Returning Data From Actions

The `Action` class will automatically call a `data` hook and return the returned data as a JSON response.
Here, we'll use a POJO to return our data:

```js
// app/actions/posts/index.js
import Action from 'candycane/dist/http/action';

export default class extends Action {
  data() {
    return [
      {
        id: 1,
        title: `You gotta start somewhere`,
      },
      {
        id: 2,
        title: `10 things you'd never believe about Nic Cage`,
      },
    ];
  }
}
```

### Dealing with Promises

The `data` method is promise aware and will await any returned promise.
This means that our data could take a while and we don't have to worry about callbacks.

```js
// app/actions/posts/index.js
import Action from 'candycane/dist/http/action';

export default class extends Action {
  data() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            title: `You gotta start somewhere`,
          },
          {
            id: 2,
            title: `10 things you'd never believe about Nic Cage`,
          },
        ]);
      }, 200);
    });
  }
}
```
