// Write your package code here!

ChromeExtension = {

  id: Meteor.settings.public.chromeExtension.id,

  /**
   * Gets the current
   * Webstore URL
   *
   * @return {[type]}
   */
  getWebstoreUrl: function() {
    return 'https://chrome.google.com/webstore/detail/' + this.id;
  },

  /**
   * Navigates to the webstore item
   */
  navigateToWebstore: function() {
    window.location.href = this.getWebstoreUrl();
  },

  /**
   * Installs the extension
   * inline
   *
   * @param  {Function} callback
   */
  install: function(callback) {
    var webstoreUrl = this.getWebstoreUrl();
    try {
      chrome.webstore.install(webstoreUrl,
        function success() {
          callback.call(this, null, webstoreUrl);
        }.bind(this),
        function failure() {
          callback.call(this, new Error('Could not install Extension'), webstoreUrl);
        }.bind(this)
      );
    } catch (e) {
      callback.call(this, e, webstoreUrl);
    }
  },

  /**
   * Checks if the 
   * browser is supported
   * 
   * @return {Boolean}
   */
  isBrowserSupported: !!window.chrome,

  /**
   * Checks if the extension 
   * is installed by sending a message to it.
   * 
   * @param  {Function} cb
   */
  isInstalled: function(cb) {
    this.call('isInstalled', function(isInstalled) {
      cb(isInstalled || false);
    });
  },

  /**
   * Sends a message
   * to the chrome extension
   *
   * @param  {Object}   payload
   * @param  {Function} callback
   */
  sendMessage: function(payload, callback) {
    if (typeof chrome === 'undefined' || typeof chrome.runtime === 'undefined') {
      throw new Meteor.error('Extension not installed');
    }
    chrome.runtime.sendMessage(this.id, payload, callback);
  },

  /**
   * Invokes a method passing
   * any number of arguments.
   *
   * @param {String}
   * @param {...args}
   * @param {Function}
   */
  call: function() {
    var args = _.toArray(arguments);
    var method = args.shift();
    var callback = _.last(args);

    if (typeof method !== 'string') {
      throw new Error('method argument must be a string!')
    }

    // Check if we have a callback function
    if (typeof callback === 'function') {
      args.pop();
    } else {
      callback = function() {};
    }

    this.sendMessage({
      method: method,
      args: args
    }, callback);
  }

};