# earth-moon-sun

Example node.js server that makes use of js-spice javascript wrapper for the NASA SPICE library.

Server can be viewed here:
https://earth-moon-sun.gamedevtricks.com/

## Features

This example includes the js-spice module as a git submodule, since the package is not available
in the npm registry.

### Adding js-spice as a git submodule to a host app

Adding the js-spice module to a host application using Git submodules involves a series of steps. Here's a guide to help you through the process:

#### 1 Initialize the Host Application Repository (If Not Already Done):
* If your host application isn't already a Git repository, initialize it with `git init`.

#### 2 Add the Module as a Submodule:
* Navigate to the root directory of your host application.
* Use the command `git submodule add https://github.com/gamergenic/js-spice.git` to add your module as a submodule.

##### 3 Specify the Path for the Submodule:
* While adding the submodule, you can also specify a path where you want the submodule to be placed. For instance: `git submodule add https://github.com/gamergenic/js-spice.git <desired path>`.
* If you don't specify a path, the submodule will be placed in a directory with the same name as the repository by default.

#### 4 Initialize and Update the Submodule:
* Run `git submodule init` to initialize your submodule.
* Then, run `git submodule update` to fetch all the data from the submodule project and check out the specified commit in your submodule.

#### 5 Commit the Changes in the Host Application:
* After adding the submodule, you will see changes in your host application's repository. These changes include the addition of the `.gitmodules` file and the submodule's directory.
* Commit these changes with `git add .` and `git commit -m "Add js-spice as a submodule"`.

#### 6 Clone the Host Application Along with Submodules:
* If you need to clone the host application repository along with its submodules, use the command `git clone --recurse-submodules <repository URL of host application>`.

#### 7 Update the Submodule:
* To update the js-spice module to the latest commit available in its repository, navigate to the submodule's directory and run `git pull origin master` (or the branch you wish to pull from).
* Then, go back to your host application's root directory and commit the changes.

#### 8 Push the Changes to the Host Application Repository:
* After committing the changes, push them to the host application repository with `git push`.
Remember, each submodule is essentially a separate Git repository, so you need to commit and push changes within each submodule separately, as well as in the host repository.

#### 9 Updating the js-spice module to latest from your host app:
```sh
cd modules/js-spice
git pull origin main
npm install
```

### License
MIT License.
