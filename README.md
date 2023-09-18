# Agnostic Javascript Library

Agnostic library used to get informations from a micro service ([survey-back-api](https://github.com/optittm/survey-back-api)) in order to determine if a modal can be shown or not. It is also used to send feedback information from the user's perspective. 

## Requirements
- Nodejs with npm

## Build the library

In order to build the library, we use Babel framework. It allows us to create JS ES5 files from JS ES6 files.
First thing to do is to run these commands in the library's folder:
```
npm install
npm run build
```
It will create a dist folder where JS ES5 files will be inside.
The index.js file at the root of the project is used as an entry point of the library.
It retrieves all the functions / classes present in the dist folder to expose them to users.


## Test the library 

In order to test the library, we use the jest library, developped by Facebook. To run the UT, run the following command:
```
npm run test
```

## Usage 

In order to use the library, you juste need to import it in the way describe below:
```
import Network from '@ottm/survey-front-library';
```

**WARNING**  
This library is using [FingerprintJS](https://github.com/fingerprintjs/fingerprintjs) to generate a user ID. You should be aware of your compliance with laws such as GDPR regarding the collection and treatment of user data.  
If you are using this library with our [API](https://github.com/optittm/survey-back-api), the fingerprint usage can be disabled in the API configuration.

## Contribute

The tool is released under a MIT licence. Contributors are welcomed.
