'use strict';

myApp.pubSub = (function () {
    var topics = {};

    return {
        subscribe: function (topic, func) {
            if ( !topics[topic] ) {
                topics[topic] = [];
            }
            topics[topic].push(func);
        },
        publish: function (topic, data) {
            var i, len;
            if ( topics[topic] ) {
                len = topics[topic].length;
                for (i=0; i<len; i++) {
                    topics[topic][i](data);
                }
            }
        }
    };
})();