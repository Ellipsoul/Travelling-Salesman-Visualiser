# Travelling Salesman Visualiser

## Instructions for Development and Deployment

##### Running the project locally (for Justin):
+ No committing/special building is required
+ To start the app locally run: 
``` bash 
ng serve
```
+ If the app is successfully built a success message will show, and you will be able to view the app in the browser:
``` html
http://localhost:4200/
```
+ You will be able to edit the code and the results will be reflected live in the browser, with error messages produced if the project fails to compile

##### Project Workflow

+ Discuss clearly which member will edit which part of the app
+ Create a branch with an intuitive name and work only within that branch. NEVER work in the `master` branch or push code directly to master
+ Develop the app locally using `ng serve` to view live changes
+ Use this to ensure that the app compiles before committing and pushing any code to the origin
+ When ready, push the code to `master` and make a pull request on [GitHub.com](https://github.com/) (do NOT attempt to merge any branches with `master` within a GUI like SourceTree itself)
+ The other person will review the code and approve it, and the branch will be merged and can be deleted
+ Aron wil deploy the app to GitHub Pages after final testing
 

+ We are deploying the app using a package called `angular-cli-ghpages`, references:
    + [Angular Deployment](https://angular.io/guide/deployment)
    + [angular-cli-ghpages](https://github.com/angular-schule/angular-cli-ghpages)
 
##### Deploy Project to GitHub Pages (Aron only)

+ Leave the branch tracker tracking `gh-pages`
+ For safety only ever attempt to deploy in the master branch. Ensure the code is pushed to the origin as well
+ To deploy the app in production to GitHub Pages:
``` bash
ng deploy --base-href=/Travelling-Salesman-Visualiser/
```
+ It seems like no commit is necessary to deploy the Angular app, possible to deploy any tracked or untracked state of the app
+ To be safe NEVER deploy a detached uncommitted version of the app, ONLY deploy a master branch production build that is already pushed to the origin

---

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
