# Rules

^ [Back to home](../README.md)


## Module Structure

1. Requires
1. Local variables
1. Methods
1. Exports


## Export Structure

1. Namespace
1. Properties
1. Methods


## Example Module

```javascript
/**
 * InterProcessCall connector methods
 */

/* Requires ------------------------------------------------------------------*/

var path = require('path');

/* Local variables -----------------------------------------------------------*/

var loc = 'local';

/* Methods -------------------------------------------------------------------*/

function merge() {
  return path.join(loc, this.foo, this.bar);
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
  pkgName: 'myPackage',
  attributes: {
    foo: 'foo',
    bar: 'bar'
  }
};
```

## Definitions

1. Module folders

  General regroupements for submodules.

1. Submodule folders

  Specific group of classes and packages that take care of 
  a specific functionnality.

1. Classes

  Interfaces and programs that take care of a specific
  functionnality or task with the help of packages.

1. Packages

  Helpers, pieces of logic that can be of use by multiple
  classes. These are prefered to putting too much logic in
  the classes, for decoupling, reduction of redundancies and 
  ease of maintenance. They can be compared to npm packages.


## Coding

1. Style

- No more than 80 characters per line.
- Use short, but meaningful variable names.
- Avoid structures where you would need to perform a require
  from a higher directory. (../)
- ALWAYS run the linter before sending.

1. Philosophy

- Functions and procedures should be identified as such
  and should not have a number of arguments greater than 4
- Favor decoupling over closures, when possible.
- Choose clarity over optimization (unless you can get both)

1. Technical considerations

- Be aware of the service size once packaged with dependencies. 
- Avoid packages with addons when available.
- Build your paths.
- Use ES6 constructs only if necessary.
- Avoid constructors, the 'new' keyword and prototypes.
- Avoid variable names with keywords in them. Ex: 'newThing'
- Disk operations should be kept to a minimum.


## Contributing

1. Branching

Use the industry-wide branching conventions. 

1. Merge requests

Needs to be reviewed by a commity of contributors before integrating

1. Using Kalm

If you or your company use Kalm, or are planning to do so; please let
me know and I will do my best to provide support.