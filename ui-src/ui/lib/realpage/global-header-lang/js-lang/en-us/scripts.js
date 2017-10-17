//  Source: _lib\realpage\global-header-lang\js-lang\_keys\keys.js
(function () {
    "use strict";

    function config(appLangKeys) {
        var keys = [
            "82F7C646-599D-4AA5-A4D1-D951CCE21280-title",
            "0C9DA909-71FA-4807-BA36-7CCDE6E580EC-title",
            "F80209A2-EFF4-4DBF-8A3D-785BCDF031A3-title",
            "07B352BA-1001-41FB-99CD-DBA778C70914-title",
            "7E298848-4A6D-4042-BE9C-29FF2A73186C-title",
            "C9D127AA-E694-4394-8D6D-AADB2A37B50B-title",
            "2F29D8F5-3E6F-428A-A89C-D808C2ADFC86-title",
            "6BA23040-6B36-402A-86D9-60C3594A5712-title",
            "514469EE-C813-483B-9A3A-C778209BC0A1-title",
            "A6239C5A-8B0F-415E-BD7F-83D48C47388E-title",
            "EED3BAF4-46B3-48AC-A576-43659B233BA1-title",
            "D174779E-9DD6-4D7D-A57F-21B3FAEF611F-title",
            "A3EB1EAF-D7A8-41DA-9CF1-596B188BA616-title",
            "0AE2B7C9-6492-4F8F-BC1B-6C0B1D8663C1-title",
            "D2E30084-1F8F-46D2-A7F2-B668C423E61E-title",
            "702AFBCB-0BDB-4360-B120-C852FB593512-title",
            "CCFE2F2B-BE0B-4075-B673-110F683E51C4-title",
            "1B6A6DDF-4476-4C02-93D1-A7CEB345F39A-title",
            "955F9930-0753-43A1-9304-EAEC9F4B5626-title",
            "696E482C-D4BA-4ECB-ADF1-7E7A7C6D606D-title",
            "EA018F00-F2CE-41BF-8E87-38C84F4B40F4-title",
            "EA66353F-338E-444E-8775-06FDC6B4D020-title",

            "manage",
            "all",
            "favorites",
            "my-realpage"
        ];

        appLangKeys.app("rpGlobalHeader").set(keys);
    }

    angular
        .module("rpGlobalHeader")
        .config(["appLangKeysProvider", config]);
})();

//  Source: _lib\realpage\global-header-lang\js-lang\en-us\resource.js
(function () {
    "use strict";

    function config(appLangBundle) {
        var bundle = appLangBundle.lang("en-us").app("rpGlobalHeader");

        bundle.set({
            "82F7C646-599D-4AA5-A4D1-D951CCE21280-title": "Property Management",

            "0C9DA909-71FA-4807-BA36-7CCDE6E580EC-title": "OneSite",
            "F80209A2-EFF4-4DBF-8A3D-785BCDF031A3-title": "Spend<br/>Management",
            "07B352BA-1001-41FB-99CD-DBA778C70914-title": "Vendor<br/>Compliance",
            "7E298848-4A6D-4042-BE9C-29FF2A73186C-title": "Realpage<br/>Accounting",

            "C9D127AA-E694-4394-8D6D-AADB2A37B50B-title": "Resident Services",

            "2F29D8F5-3E6F-428A-A89C-D808C2ADFC86-title": "OneSite",
            "6BA23040-6B36-402A-86D9-60C3594A5712-title": "Resident<br/>Portals",
            "514469EE-C813-483B-9A3A-C778209BC0A1-title": "Resident<br/>Contact Center",
            "A6239C5A-8B0F-415E-BD7F-83D48C47388E-title": "Resident &<br/>Utility Billing",
            "EED3BAF4-46B3-48AC-A576-43659B233BA1-title": "Renters<br/>Insurance",

            "D174779E-9DD6-4D7D-A57F-21B3FAEF611F-title": "Lease Management",

            "A3EB1EAF-D7A8-41DA-9CF1-596B188BA616-title": "OneSite",
            "0AE2B7C9-6492-4F8F-BC1B-6C0B1D8663C1-title": "Lead2Lease",
            "D2E30084-1F8F-46D2-A7F2-B668C423E61E-title": "Prospect<br/>Contact Center",
            "702AFBCB-0BDB-4360-B120-C852FB593512-title": "Websites<br/>& Syndication",

            "CCFE2F2B-BE0B-4075-B673-110F683E51C4-title": "Asset Optimization",

            "1B6A6DDF-4476-4C02-93D1-A7CEB345F39A-title": "Business<br/>Intelligence",
            "955F9930-0753-43A1-9304-EAEC9F4B5626-title": "Revenue<br/>Management",
            "696E482C-D4BA-4ECB-ADF1-7E7A7C6D606D-title": "Performance<br/>Analytics",
            "EA018F00-F2CE-41BF-8E87-38C84F4B40F4-title": "Data<br/>Analytics",
            "EA66353F-338E-444E-8775-06FDC6B4D020-title": "Asset & Inv.<br/>Management",

            "manage": "Manage Products & Resources",
            "all": "All",
            "favorites": "Favorites",
            "my-realpage": "My RealPage"
        });

        bundle.test();
    }

    angular
        .module("rpGlobalHeader")
        .config(["appLangBundleProvider", config]);
})();

