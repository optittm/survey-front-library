# Agnostique Javascript Library

Agnostic library used to get informations from a micro service in order to determine if a modal can be shown or not. It is also used to send feedback information from the user's perspective. 

# Build the library

In order to build the library, we use Babel framework. It allows us to create JS ES5 files from JS ES6 files.
First thing to do is to run this command:
```
npm run build
```
It will create a dist folder where JS ES5 files will be inside.
The index.js file at the root of the project is used as an entry point of the library.
It retrieves all the functions / classes present in the dist folder to expose them to users.


# Test the library 

In order to test the library, we use the jest library, developped by Facebook. To run the UT, run the following command:
```
npm run test
```

# Usage 

In order to use the library, you juste need to import it in the way describe below:
```
import Network from 'ottm-connector-feedback';
```

# Todos

- Use a configuration file for the server adress. Actually it's just a local machine.

# Licence

MIT