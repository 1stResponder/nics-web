## Synopsis

The Next-Generation Incident Command System (NICS) web application

## Dependencies
- nics-tools
- iweb-modules

## Building

You can build a 'debug' build using:

	mvn install

Or a 'production' build using:

	mvn install -Dproduction


Both options will build nics.war to the webapp/target/ directory


## Frequently Asked Questions

### What is the difference between a debug and production build?

A production build takes some extra steps to optimize the static resources like minifying the Javascript.

### What are these 'modules'?

Each 'module' is a maven jar project. It will package any compiled Java code for that module, plus any static resources (Javascript, CSS, Images) in [META-INF/resources](https://blogs.oracle.com/alexismp/entry/web_inf_lib_jar_meta). When these jars are included in the webapp WAR project, they Java will be executed at runtime and the static resources will be available.

### How do I use these modules?

Just add the module as a dependency of the webapp WAR project and add any code to bootstrap your module. This will likely include adding your module to main.js in the webapp and adding html link tags for your CSS to be included. 

