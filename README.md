# chrome-extension-utils

This package bundles useful utils for working with a chrome extension.


## Install 

This package has two parts. 

1. meteor package
2. chrome extension package

## Install Meteor package

    meteor add handtrix:chrome-extension-utils

And add your [extension id](https://developer.chrome.com/apps/manifest/key) to your `Meteor.settings`

    {
      "public": {
        "chromeExtension": {
          "id": "fclmgmkhbncahpifpidimcjhbfaaiplh"
        }
    }

## Install Chrome Extension Package

In your chrome extension install this package via:

### NPM

    npm install --save meteor-chrome-extension-utils

### Bower

    bower install --save meteor-chrome-extension-utils

### Manually

Include the [file](extension/chrome-extension.js) manually.


## Features

### Check if extension is installed

*meteor client* 

    ChromeExtension.isInstalled(function(isInstalled){

    });

### Check if the browser supports chrome extensions

*meteor client* 

    ChromeExtension.isBrowserSupported;

### Trigger inline install

*meteor client* 

    ChromeExtension.install(function(err, success){

    });

### Get the webstore url

*meteor client* 

    ChromeExtension.getWebstoreUrl();

### Navigate to webstore item

*meteor client* 

    ChromeExtension.navigateToWebstore;

### Call methods in a chrome extension.

*meteor client*

    ChromeExtension.call('foo', 'param1', 'param2', function(result){
      console.log(result);
    });


*chrome extension*

    ChromeExtension.methods({
      foo: function(param1, param2, callback){
        // To something here
        callback('bar');
      }
    });

By default all urls will be allowed to connect to your extension.
But you can secure it by whitelisting specific urls:

    ChromeExtension.whitelistUrl('http://localhost:3000/');
    ChromeExtension.whitelistUrl('http://myapp.meteor.com/');
