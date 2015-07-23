Package.describe({
  name: 'handtrix:chrome-extension-utils',
  version: '0.0.1',
  summary: 'Lets you call extension methods from the meteor client',
  git: 'https://github.com/HaNdTriX/meteor-chrome-extension-utils.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.use('underscore', 'client');
  api.addFiles('meteor/client/chrome-extension.js', 'client');
  api.export('ChromeExtension', 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('handtrix:chrome-extension-client');
  api.addFiles('meteor/client/chrome-extension-tests.js');
});
