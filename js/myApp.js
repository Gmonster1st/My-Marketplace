(function () {
    'use strict';

    var model = new myApp.Model(myApp.pubSub);
    var view = new myApp.View(myApp.pubSub);
    var controller = new myApp.Controller(model, view, myApp.pubSub);

    // Initialize controller (and application)
    controller.init();
})();