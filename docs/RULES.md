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


## General

- Avoid vague regroupements. Ex: Instead of putting utility methods 
  under 'utils', opt for 'math' or 'string' or 'array', etc.
- Be aware of the service size once packaged with dependencies. 
- Avoid packages with addons when available.
- Build your paths.
- Use ES6 constructs only if necessary.
- Avoid constructors, the 'new' keyword and prototypes.
- Use short, but meaningful variable names.
- Avoid variable names with keywords in them. Ex: 'newThing'
- Functions and procedures should be identified as such
  and should not have a number of arguments greater than 4
- Disk operations should be kept to a minimum.
- Favor decoupling over closures, when possible.

