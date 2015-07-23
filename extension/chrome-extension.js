/**********************************************************
 * Universal Module Definition
 ***********************************************************/

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.returnExports = factory();
  }
}(this, function() {

  var whitelistedURLs = [];
  var methodStore = {
    isInstalled: function(callback) {
      callback(true);
      return true;
    }
  };
  
  /**********************************************************
   * Polyfills
   ***********************************************************/

  if (!Object.assign) {
    Object.defineProperty(Object, 'assign', {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(target) {
        'use strict';
        if (target === undefined || target === null) {
          throw new TypeError('Cannot convert first argument to object');
        }

        var to = Object(target);
        for (var i = 1; i < arguments.length; i++) {
          var nextSource = arguments[i];
          if (nextSource === undefined || nextSource === null) {
            continue;
          }
          nextSource = Object(nextSource);

          var keysArray = Object.keys(Object(nextSource));
          for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
            var nextKey = keysArray[nextIndex];
            var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
            if (desc !== undefined && desc.enumerable) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
        return to;
      }
    });
  }

  /**********************************************************
   * Utils
   ***********************************************************/

  /**
   * Checks if a url is whitelisted
   *
   * @param  {String}  url
   * @return {Boolean}
   */
  function isURLWhitelisted(url) {
    return whitelistedURLs.some(function(whitelistedURL) {
      return url.indexOf(whitelistedURL) === 0;
    });
  }

  /**********************************************************
   * Chrome specific
   ***********************************************************/

  /**
   * Handles external messages
   *
   * @param  {Any}      message
   * @param  {Object}   sender
   * @param  {Function} sendResponse
   * @return {Boolean}
   */
  function externalMessageHandler(message, sender, sendResponse) {

    if (whitelistedURLs.length) {
      // Check if sender.url is from our app
      // Otherwise every website could overwrite
      // our loginToken.
      if (!isURLWhitelisted(sender.url)) {
        var error = 'ChromeExtension: The app you are connecting from is not authorized to connect to your installed extension.';
        console.warn(error);
        sendResponse({
          error: error
        });
        return;
      }
    }

    var method = message.method;
    var args = message.args || [];

    if (methodStore.hasOwnProperty(method)) {
      args.push(sendResponse);
      return methodStore[method].apply(this, args);
    }

    console.warn('ChromeExtension: Called extension method without handler', message);

    return false;
  }

  chrome.runtime.onMessageExternal.addListener(externalMessageHandler);

  /**********************************************************
   * Public API
   ***********************************************************/

  ChromeExtension = {

    /**
     * Restrict access by
     * whitelisting specific urls
     *
     * @param  {String|Array} url
     */
    whitelistUrl: function(url) {
      if (Array.isArray(url)) {
        url.forEach(this.whitelistUrl, this);
        return;
      }
      whitelistedURLs.push(url);
    },

    /**
     * Register methods that
     * can be called from meteor
     *
     * @param  {String|Array} url
     */
    methods: function(newMethods) {
      Object.assign(methodStore, newMethods);
    }

  }

  return ChromeExtension;

}));