(function($) {
    var windowResized = false,
        doWindowSize,
        setMobile,
        shrinkLeftNav,
        shrinkLeftNavMobile,
        growLeftNav,
        growLeftNavMobile,
        clearHoverNav,
        clearDropNav;

    doWindowSize = function() {
        var win = $(this); //this = window
        if ((win.width() <= 1000) && (win.width() >= 401)) {
            if (!$('.leftNavWrapper').hasClass('lCollapsed')) {
                $('.leftNavWrapper').removeClass('mCollapsed');
                $('.ft-breadcrumb').removeClass('mobilerViewCrumb');
                shrinkLeftNav();
                $('.mobileHam').hide();
                $('.toggleWrapper').show();
                $('.buildingTop').show();
                $('.toggleButton').show();
                $('.ft-breadcrumb').addClass('windowSmall');
                windowResized = true;
            }
        } else if (win.width() >= 1001) {
            if (windowResized) {
                growLeftNav();
                $('.leftNavWrapper').removeClass('mCollapsed');
                $('.mobileHam').hide();
                $('.toggleButton').show();
                $('.ft-breadcrumb').removeClass('mobilerViewCrumb');
                $('.ft-breadcrumb').removeClass('windowSmall');
                windowResized = false;
            }
        } else if (win.width() <= 400) {
            setMobile();
            $('.toggleButton').hide();
            $('.ft-breadcrumb').addClass('mobilerViewCrumb');
            windowResized = true;
        }
    };

    setMobile = function() {
        if (!$('.leftNavWrapper').hasClass('mCollapsed')) {
            $('.leftNavWrapper').animate({
                width: '0rem'
            }, 500);
            $('.topNavHeaderText, .endPoint, .subNavItemWrapper').hide();
            $('.contentWrapper, .whiteBar').animate({
                marginLeft: '0rem'
            }, 500);
            $('.subNavWrapper.active').parents('.subNavMouseOver').siblings('.topNavHeaderClick').css('backgroundColor', '#37474f');
            $('.leftNavWrapper').addClass('mCollapsed');
            $('.mobileView').addClass('mobilerView');
            $('.leftNavWrapper').removeClass('lCollapsed');
            $('.mobileHam').show().addClass('mOpen');
            $('.navbar-form').hide();
            $('.brandClick').hide();
            $('.toggleWrapper').hide();
            $('.buildingTop').hide();
        }
    };

    shrinkLeftNav = function() {
        if (!$('.leftNavWrapper').hasClass('lCollapsed')) {
            $('.leftNavWrapper').animate({
                width: '5rem'
            }, 500);
            $('.topNavHeaderText, .endPoint, .subNavItemWrapper').hide();
            $('.contentWrapper, .whiteBar').animate({
                marginLeft: '5rem'
            }, 500);
            $('.subNavWrapper.active').parents('.subNavMouseOver').siblings('.topNavHeaderClick').css('backgroundColor', '#37474f');
            $('.leftNavWrapper').addClass('lCollapsed');
            $('.navbar-form').hide();
        }
    };

    shrinkLeftNavMobile = function() {
        if (!$('.leftNavWrapper').hasClass('mCollapsed')) {
            $('.leftNavWrapper').animate({
                width: '0rem'
            }, 500);
            $('.topNavHeaderText, .endPoint, .subNavItemWrapper').hide();
            $('.contentWrapper, .whiteBar').animate({
                marginLeft: '0rem'
            }, 500);
            $('.subNavWrapper.active').parents('.subNavMouseOver').siblings('.topNavHeaderClick').css('backgroundColor', '#37474f');
            $('.leftNavWrapper').addClass('mCollapsed');
        }
    };

    growLeftNav = function() {
        clearHoverNav();
        $('.leftNavWrapper').animate({
            width: '300px'
        }, 500);

        $('.contentWrapper, .whiteBar').animate({
            marginLeft: '300px'
        }, 500);
        setTimeout(function() {
            $('.topNavHeaderText, .endPoint, .subNavItemWrapper').show('fast');
        }, 500);
        $('.leftNavWrapper').removeClass('lCollapsed');
        $('.navbar-form').show();
        $('.brandClick').show();
        $('.mobileHam').hide();
    };

    growLeftNavMobile = function() {
        clearHoverNav();
        $('.leftNavWrapper').animate({
            width: '300px'
        }, 500);

        $('.contentWrapper, .whiteBar').animate({
            marginLeft: '300px'
        }, 500);
        setTimeout(function() {
            $('.topNavHeaderText, .endPoint, .subNavItemWrapper').show('fast');
        }, 500);
        $('.leftNavWrapper').removeClass('mCollapsed');
    };

    clearHoverNav = function() {
        $('.subNavMouseOver').removeClass('overActive');
        $('.subNavMouseOver').children().find('.subNavItemWrapper').removeClass('subNavItemOverActive');
        $('.subNavMouseOver').children().find('.subNavItemWrapper').hide();
        $('.subNavMouseOver').css('top', 'initial');
        $('.topNavWrapper').height('auto');
    };

    clearDropNav = function() {
        $('.subNavWrapper').slideUp('slow');
        $('.subNavWrapper.active').parents('.subNavMouseOver').siblings('.topNavHeaderClick').css('backgroundColor', '#495e69');
        $('.subNavWrapper').removeClass('active');
        $('.endPoint').removeClass('fa-chevron-up').addClass('fa-chevron-down');
    };

    $(function() {

        $('.topNavHeaderClick').click(function() {

            var currentSubHead = $(this).siblings('.subNavMouseOver').children('.subNavWrapper');

            if ($(currentSubHead).hasClass('active')) {
                return false;
            } else {
                clearDropNav();
                $(currentSubHead).slideToggle("slow");
                $(currentSubHead).addClass('active');
                $('.subNavWrapper.active').parents('.subNavMouseOver').siblings('.topNavHeaderClick').css('backgroundColor', '#37474f');
                $(this).find('.endPoint').removeClass('fa-chevron-down').addClass('fa-chevron-up');
            }
        });

        $('.toggleButton').click(function() {
            if ($('.leftNavWrapper').hasClass('lCollapsed')) {
                growLeftNav();
            } else {
                shrinkLeftNav();
            }
        });

        $('.topNavHeaderClick').on('click', function(event) {
            var offset = $(this).position();
            var targetTop = offset.top;
            if ($(this).parents('.leftNavWrapper').hasClass('lCollapsed')) {
                clearHoverNav();
                $('.topNavWrapper').css('height', 70);
                $(this).siblings('.subNavMouseOver').addClass('overActive');
                $(this).siblings('.subNavMouseOver').children().find('.subNavItemWrapper').addClass('subNavItemOverActive');
                $(this).siblings('.subNavMouseOver').css('top', targetTop);
                $(this).siblings('.subNavMouseOver').children().find('.subNavItemWrapper').show();
            } else {
                return; }
        });

        $('.contentWrapper').on('click', function(event) {
            if ($('.leftNavWrapper').hasClass('lCollapsed')) {
                clearHoverNav();
            }
        });

        $('.subNavClick').on('click', function(event) {
            if (!$(this).hasClass('subNavItemActive')) {
                $('.subNavClick').removeClass('subNavItemActive');
                $(this).addClass('subNavItemActive');
            }
        });

        $('.mobileHam').on('click', function() {
            if ($('.leftNavWrapper').hasClass('mCollapsed')) {
                growLeftNavMobile();
            } else {
                shrinkLeftNavMobile();
            }
        });

        $(window).on('load resize', function() {
            doWindowSize();
        });

        $('.subNavWrapper.active').parents('.subNavMouseOver').siblings('.topNavHeaderClick').css('backgroundColor', '#37474f');

    });
}(jQuery));
