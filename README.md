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

By default, this server will run on `http://localhost:3000`.

## Registering Routes

When working in our application, the first thing we will need to do is register a new route in our application.
This will allow us to respond to new urls.

Under the hood, Candycane is using Express.js for mapping URLs.

Our router is described in the `app/router.js` file within the `registerRoutes` method.
Within this method, we'll need to call `this.get`, `this.post`, etc.
These functions take two arguments:

* The url or url pattern that we want to match
* The action module that we want to use to respond as an action

For instance if we want to respond to the url `blogs` with the `app/actions/blogs/index` module, we can have the following code:

```js
this.get(`/blogs`, `blogs/index`);
```

## Action Modules

Instead of creating Middleware functions, Candycane uses `Action` classes to help manage asynchronous data lookup and manipulation.
This means for our `blogs` example above, we will need to create a new `blogs/index.js` action in the `app/actions` directory.
This file will need to export a class that extends from `candycane/dist/http/action`.

```js
// app/actions/blogs/index.js
import Action from 'candycane/dist/http/action';

export default class extends Action {

}
```

### Returning Data From Actions

The `Action` class will automatically call a `data` hook and return the returned data as a JSON response.
Here, we'll use a POJO to return our data:

```js
// app/actions/blogs/index.js
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
// app/actions/blogs/index.js
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

This becomes really cool when coupled with something like [`candycane-bookshelf`](https://github.com/candycanejs/candycane-bookshelf) to query model information from the database.

### Working with the Request

In order to respond to HTTP requests, we will need to look up information from the incoming request such as the body or HTTP headers.
Within any method in the action class, the current express request object is available as `this.request`.

To see this in action, let's register a post route for `blogs` to our `registerRoutes` method in `app/router.js`.

```js
this.get(`/blogs`, `blogs/index`);
this.post(`/blogs`, `blogs/create`);
```

Then, we will need to create our Action for `blogs/create`:

```js
// app/actions/blogs/index.js
import Action from 'candycane/dist/http/action';

export default class extends Action {
  data() {
    return this.request.body;
  }
}
```

Now, let's make a `curl` request to test this out:

```bash
curl -X POST -H "Content-Type: application/json" -d '{
    "title": "This is post data"
}' "http://localhost:3000/blogs"
```

And we should see the result:

```json
{
  "title":"This is post data"
}
```

## Application

One thing that makes Candycane different is the application container which allows things like database connections, serialization libraries, and other object instances to be shared across all of your actions.
This application container is heavily influenced by the lookup containers from Laravel and Ember.

Within actions, the current application is available using `this.app`.

The application container has the following methods:

* `make` - Gets a registered instance from the application container, if not found: look the module up using `require`
* `singleton` - Registers a singleton instance into the application container
* `pathsForNamespace` - Walks all files in a directory within `app` and returns an array of objects with the following properties:
  - `fullPath` - Full file path
  - `fileName` - Filename including extension
  - `module` - Filename without extension

See this in action in the [`candycane-bookshelf`](https://github.com/candycanejs/candycane-bookshelf) documentation.

## Path to 1.0

There is still a lot to consider before hitting 1.0 in Candycane, Candycane CLI, and the first party addon eco-system.
This issue below will be used to track progress and seen as a master todo list.
If you have other feature requests, [add an issue](https://github.com/candycanejs/candycane-cli/issues/new) to this repository.

* https://github.com/candycanejs/candycane-cli/issues/1

## Contributing

Candycane in early stages, but we want to make sure that the community is inclusive and welcoming.
Be sure to follow the [community contributing guidelines](https://github.com/candycanejs/candycane-cli/blob/master/CONTRIBUTING.md).

## License

Candycane and Candycane CLI is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).
