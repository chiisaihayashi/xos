# ngXosLib

This is a collection of helpers to develop views as Angular SPA.

## Tools

These tools are designed to help develop a GUI view. They assume XOS is running on your system and responding at: `localhost:9999`. The `xos/configurations/frontend` is normally sufficient for GUI development.

### Apigen

Usage: `npm run apigen`

This tool automatically generates an angular resource file for each endpoint available in Swagger.

>You can generate api related documentation with: `npm run apidoc`. The output is locate in `api/docs`. You can also see a list of available methods through Swagger at `http://localhost:9999/docs/`

### Vendors

XOS comes with a preset of common libraries, as listed in `bower.json`:
- angular
- angular-route
- angular-resource
- angular-cookie
- ng-lodash

These libraries are served through Django, so they will not be included in your minified vendor file. To add a library and generate a new file (that will override the old one), you should:
- enter `ngXosLib` folder
- run `bower install [myPackage] --save`
- rebuild the file with `gulp vendor`

>_NOTE before adding libraries please discuss it to avoid this file to became huge_

### Helpers

XOS comes with an helper library that is automatically loaded in the Django template.

To use it, add `xos.helpers` to your required modules:

```
angular.module('xos.myView', [
  'xos.helpers'
])
```

It will automatically ad a `token` to all your requests, eventually you can take advantage of some other services:

- **NoHyperlinks Interceptor**: will add a `?no_hyperlinks=1` to your request, to tell Django to return ids instead of links.
- **XosApi** wrapper for `/xos` endpoints.
- **XoslibApi** wrapper for `/xoslib` endpoints.
- **HpcApi** wrapper for `/hpcapi` endpoints.

>_NOTE: for the API related service, check documentation in [Apigen](#apigen) section._

# ngXosViews

On top of auto-generated Django Admin Views and developer-defined Service Views, a set of custom views can be generate in XOS.

These views are based on AngularJs and they communicate with XOS through the REST APIs, providing a powerful and flexible way to present and manage data.

## How to create a View

### Getting Started

We have created a [yeoman](http://yeoman.io/) generator to help you scaffolding views.

>As it is in an early stage of development you should manually link it to your system, to do this enter `/gui/ngXosLib/generator-xos` and run `npm link`.

#### To generate a new view

From `/gui` run `yo xos`. This command will create a new folder with the provided name in: `/gui/ngXosViews` that contain your application.

>If you left empty the view name it should be `/gui/ngXosViews/sampleView`

#### Run a development server

In your `view` folder and run `npm start`.

_This will install required dependencies and start a local server with [BrowserSync](http://www.browsersync.io/)_

#### Publish your view

Once your view is done, from your view root folder, run: `npm run build`.

This will build your application and copy files in the appropriate locations to be used by django.

At this point you can enter: `http://localhost:9999/admin/core/dashboardview/add/` and add your custom view.

>_NOTE url field should be `template:xosSampleView`_

##### Add this view to a configuration setup

You can easily set this as a default view in a configuration just editing the `{config}.yml` file for that configuration, adding this lines:

```
{TabName}:                                    
  type: tosca.nodes.DashboardView              
  properties:                                  
      url: template:{viewName}     
```

and the edit the _User_ section (normally it starts with `padmin@vicci.org`) in this way:

```
padmin@vicci.org:                                          
  type: tosca.nodes.User                                   
  properties:                                              
      firstname: XOS                                       
      lastname: admin                                      
      is_admin: true                                       
  requirements:                                            
      - tenant_dashboard:                                  
          node: Tenant                                     
          relationship: tosca.relationships.UsesDashboard  
      - {custom_dashboard}:                              
          node: {TabName}                                 
          relationship: tosca.relationships.UsesDashboard  
```

#### Install dependencies in your app

To install a local dependency use bower with `--save`. Common modules are saved in `devDependencies` as they already loaded in the Django template.

The `npm start` command is watching your dependencies and will automatically inject it in your `index.html`.

#### Linting

A styleguide is enforced trough [EsLint](http://eslint.org/) and is checked during the build process. We **highly** suggest to install the linter in your editor to have realtime hint.

#### Test

The generator set up a test environment with a default test.
To run it execute: `npm test`

