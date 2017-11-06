//  Configure Notifications

(function (angular) {
    "use strict";

    function config(prov) {
        var defaults = {
            delay: 4000,
            buttons: {
                closer: false,
                closer_hover: false,
                sticker: false,
                sticker_hover: false
            },
            type: 'error'
        };

        prov.setDefaults(defaults);

        prov.setStack('bottom_right', 'stack-bottomright', {
            dir1: 'up',
            dir2: 'left',
            firstpos1: 25,
            firstpos2: 25
        });

        prov.setStack('top_left', 'stack-topleft', {
            dir1: 'down',
            dir2: 'right',
            push: 'top'
        });
    }

    angular
        .module("budgeting")
        .config(['notificationServiceProvider', config]);
})(angular);
