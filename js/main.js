(function ($) {
    "use strict";
    var $window = $(window);
    var $document = $(document);
    var root = $('html, body');
    var isMobile = jQuery.browser.mobile;
    var geocoder;
    var map;
    var hash = window.location.hash.replace("#", "");
    var $photoContainer = $('#photo');
    var $blogContainer = jQuery('#blog-list-item');
    var $versionMenu = jQuery('.main-top').data('version');
    var $ofst = ($versionMenu == 'version2') ? 62 : 110;
    var touch = Modernizr.touch;
    var $mapColors = [];
    var $mapMarker = 'marker.png';
    /**-------------------- Scrolling Page Settings --------------------**/   
    var ScrollTo = {
        init: function () {
            ScrollTo.hash();
            ScrollTo.links();
            ScrollTo.stop();
        },
        hash: function () {
            if (jQuery('*[data-hash="' + hash + '"]').length) {
                    var $target = (jQuery(hash).length) ? jQuery(hash) : jQuery('*[data-hash="' + hash + '"]');
                    ScrollTo.scroll($target);
            } else {
                    if (typeof (jQuery.fn.waypoint) !== undefined) {
                            Waypoints.init();
                    }
            }
        },
        links: function () {
            jQuery(".navbar-nav li a, .btn-top").on({
                click: function (e) {
                    e.preventDefault();
                    if (this.hash.length && (jQuery(this.hash).length || jQuery('*[data-hash="' + this.hash.replace("#", "") + '"]').length)) {
                            var $target = (jQuery(this.hash).length) ? jQuery(this.hash) : jQuery('*[data-hash="' + this.hash.replace("#", "") + '"]');
                            ScrollTo.scroll($target);
                    } else {
                        window.location.href = $(this).attr('href');
                    }
                },
            });
        },
        scroll: function ($target) {
            if (typeof (jQuery.fn.waypoint) !== undefined) {
                    jQuery('.waypoint').waypoint('destroy');
            }
            var offset;

            if ($target.offset().top > $ofst) {
                    offset = $target.offset().top - $ofst+1;
            } else {
                    offset = $target.offset().top;
            }

            root.stop().animate({
                    'scrollTop': offset
            }, 1500, 'swing', function(){
                    if (typeof (jQuery.fn.waypoint) !== undefined) {
                            Waypoints.init();
                    }
            });
        },
        stop: function() {
            $(window).on('scroll', function() {
                if($(window).scrollTop() + $(window).height() == $(document).height()) {
                        $('.btn-telephone').addClass('btn-action-scroll-finished');
                        $('.btn-top').addClass('btn-action-scroll-finished');
                } else {
                        $('.btn-telephone').removeClass('btn-action-scroll-finished');
                        $('.btn-top').removeClass('btn-action-scroll-finished');
                }
            });
        }
    }
    
/**-------------------- Revolution Slider Settings --------------------**/      
    var RsSlider = {
        init: function() {
            jQuery('.tp-banner').revolution({
                sliderType:"standard",
                sliderLayout:"fullscreen",                
                dottedOverlay:"none",
                delay:9000,
                navigation: {
                    keyboardNavigation:"off",
                    keyboard_direction: "horizontal",
                    mouseScrollNavigation:"off",
                    onHoverStop:"off",
                    touch:{
                        touchenabled:"on",
                        swipe_threshold: 75,
                        swipe_min_touches: 50,
                        swipe_direction: "horizontal",
                        drag_block_vertical: false
                    }
                    ,
                    arrows: {
                        style:"",
                        enable:true,
                        hide_onmobile:false,
                        hide_onleave:true,
                        hide_delay:200,
                        hide_delay_mobile:1200,
                        tmp:'',
                        left: {
                            h_align:"left",
                            v_align:"center",
                            h_offset:30,
                            v_offset:0
                        },
                        right: {
                            h_align:"right",
                            v_align:"center",
                            h_offset:30,
                            v_offset:0
                        }
                    }
                },
                responsiveLevels:[1240,1024,778,480],
                gridwidth:[1240,1024,778,480],
                gridheight:[868,768,960,720],
                lazyType:"smart",
                parallax: {
                    type:"scroll",
                    origo:"slidercenter",
                    speed:2000,
                    levels:[100,-80,0,0,0,0,0,0,0,0],
                },
                shadow:0,
                spinner:"spinner2",
                stopLoop:"off",
                stopAfterLoops:-1,
                stopAtSlide:-1,
                shuffle:"off",
                autoHeight:"off",
                fullScreenAutoWidth:"off",
                fullScreenAlignForce:"off",
                fullScreenOffsetContainer: "",
                fullScreenOffset: "",
                hideThumbsOnMobile:"off",
                hideSliderAtLimit:0,
                hideCaptionAtLimit:0,
                hideAllCaptionAtLilmit:0,
                debugMode:false,
                fallbacks: {
                    simplifyAll:"off",
                    nextSlideOnWindowFocus:"off",
                    disableFocusListener:false,
                },
                panZoomDisableOnMobile:"on",
            });
        }
    }
    
/**-------------------- Waypoints Settings --------------------**/   
     var Waypoints = {
        init: function () {
            jQuery('.waypoint').waypoint(function (direction) {
                    var obj = jQuery(this);

                    if (direction === "up") {
                            obj = obj.waypoint('prev');
                    }
                    window.location.hash = obj.data('hash')
                
                    jQuery('nav li a').each(function () {
                        jQuery(this).removeClass('current');
                    });
                    jQuery('nav li a[href="#' + obj.data('hash') + '"]').each(function () {
                        jQuery(this).addClass('current');
                    });
            },{ 
                offset: function () { 
                    return  $ofst; 
                }
            });
        },
        animation: function () {
            jQuery('[data-animation]').waypoint({
                    triggerOnce: true,
                    offset: '95%',
                    handler: function () {
                        var obj = jQuery(this);
                        if (!isMobile) {
                            var dataAnimation = obj.attr('data-animation');
                            var dataDelay = obj.attr('data-delay');
                            if (typeof dataDelay === undefined) {
                                dataDelay = 0;
                            } else {
                                dataDelay = parseFloat(dataDelay.replace(",", "."));
                            }
                            setTimeout(function () {
                                obj.addClass('animated ' + dataAnimation).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend notAnimated', function () {
                                    obj.css({'opacity': 1}).removeClass('animated ' + dataAnimation);
                                });
                            }, dataDelay * 800);
                        }
                    }
            });
        }
    }
    
/**-------------------- TopBar Settings --------------------**/
    var Topbar = {
        init: function() {
            Topbar.onHover();
             if(isMobile) {
                Topbar.onClick();
            }
            Topbar.onScroll();
        },
        
        onHover: function() {
            if (!isMobile) {
                jQuery('.navbar .dropdown').on({
                    mouseover: function () {
                        jQuery(this).find('.dropdown-menu').first().stop(true, true).delay(250).slideDown();
                    },
                    mouseout: function () {
                        jQuery(this).find('.dropdown-menu').first().stop(true, true).delay(100).slideUp();
                    }
                });

                jQuery('.navbar .dropdown > a').on({
                    click: function(e){
                        e.preventDefault();
                        location.href = this.href;
                    }
                });
            }
         },
         
         onClick: function() {
            jQuery(".main-top nav li a").on({
                click: function(e) {
                    e.preventDefault();
                    if(!$(this).parent().hasClass('dropdown')) {
                        jQuery(".navbar-collapse").collapse('hide');
                    }
                }
            });
         },
         
         onScroll: function() {
                    var maintop = jQuery(".main-top");
                    var actions = jQuery('.action-to-scroll');
                    if(isMobile) {
                        if($versionMenu == 'version2') {
                            maintop.addClass('menu-version-2')
                        }
                        maintop.addClass("sticky");
                    }
                    
                    $document.on("scroll", function() {
                        if (jQuery(this).scrollTop() > 120 ) {
                          if(!isMobile) {
                                if($versionMenu == 'version2') {
                                    maintop.addClass('menu-version-2')
                                }
                                maintop.addClass("sticky");
                          }
                          actions.fadeIn();                         
                        } else {
                          if(!isMobile) {
                                if($versionMenu == 'version2') {
                                    maintop.removeClass('menu-version-2')
                                }
                                maintop.removeClass("sticky");
                          }
                          actions.fadeOut();
                        }
                    });
         }
    }
 
/**-------------------- Parallax Stellar Settings --------------------**/

    var Parallax = {
        init : function() {
            $window.stellar({
                horizontalOffset:0,
                horizontalScrolling:false
            });
        }
    }
    
/**-------------------- Owl Carousel Settings --------------------**/

    var OwlCarousel = {
        init : function() {
            $("#our-services .owl-carousel").owlCarousel({
                items : 3,
                itemsDesktop : [1199,3],
                itemsDesktopSmall : [979,2],
                itemsMobile: [480, 1],
                itemsTablet: [800,1]
            });
        
            $("#testimonials .owl-carousel").owlCarousel({
                navigation : false,
                slideSpeed : 300,
                paginationSpeed : 400,
                singleItem:true
            });
        }
    }
    
/**-------------------- Masonry Gallery Settings --------------------**/
    var MasonryGallery = {
        init : function() {
            MasonryGallery.imagesLoaded();
            MasonryGallery.magnificPopup();
        },
        
        imagesLoaded: function() {
            $photoContainer.imagesLoaded(function() {
                $photoContainer.isotope( { 
                        itemSelector : '.photo-item', 
                        layoutMode : 'masonry',
                        resizable: false
               } );
           });
        },
        
        magnificPopup: function() {
            $photoContainer.magnificPopup({
                    delegate: 'a',
                    fixedContentPos: false,
                    removalDelay: 100,
                    closeBtnInside: true,
                    preloader: false,
                    type: 'image',
                    gallery:{ enabled:true }
            });
        }
    }
    
/**-------------------- Masonry Blog Settings --------------------**/
    var MasonryBlog = {
        init : function() {
            MasonryBlog.imagesLoaded();
        },
        
        imagesLoaded: function() {
            $blogContainer.imagesLoaded(function() {
                $blogContainer.isotope( { 
                        itemSelector : '.blog-item', 
                        layoutMode : 'masonry',
                        resizable: false
                });
                
                MasonryBlog.showMore($blogContainer);
           });
        },
        
        showMore: function(blogContainer) {
            jQuery('.blog-btn-read-more .button-style1').on('click', function (e) {
                    e.preventDefault();
                    var href = $(this).data('url');
                    jQuery.ajax({
                            url: href,
                            dataType: "html",
                            success: function (response) {
                                var content = response;
                                var items = $(content);
                                var newItems = $(items).appendTo(blogContainer);
                                
                                blogContainer.imagesLoaded(function() {
                                    blogContainer.isotope('appended', newItems );
                                });
                            }
                    });
            });
        }
    }
    
    var Theme =  {
        setStyleSheet: function(color) {
            var i, link;
            for(i=0; (link = document.getElementsByTagName("link")[i]); i++) {
                if(link.getAttribute("rel").indexOf("style") != -1 && link.getAttribute("title")) {
                  link.disabled = true;
                  if(link.getAttribute("title") == color) {
                      link.disabled = false;
                  }
                }
            }
            GoogleMaps.init(color);
        }
    }
    
/**-------------------- Google Maps Settings --------------------**/

    var GoogleMaps = {
        init: function(color) {
            var title = 'The Butcher';
            var address = 'Sidney';
            var latlng = new google.maps.LatLng(-33.8674869, 151.20699020000006);
            switch(color) {
                case 'light':
                    $mapColors = new Array('#c2c2c2', '#6d1a37', '#ff0000');
                    $mapMarker = 'marker.png';
                    break;
                case 'turtledove':
                    $mapColors = new Array('#c2c2c2', '#59534d', '#958b82');
                    $mapMarker = 'marker-turtledove.png';
                    break;
                 case 'darkbrown':
                    $mapColors = new Array('#c2c2c2', '#2f1f19', '#9f8c85');
                    $mapMarker = 'marker-darkbrown.png';
                    break;
                 case 'zephir':
                    $mapColors = new Array('#c2c2c2', '#c1cacc', '#a6c6cd');
                    $mapMarker = 'marker-zephir.png';
                    break;
                default:
                    $mapColors = new Array('#c2c2c2', '#6d1a37', '#ff0000');
                    $mapMarker = 'marker.png';
                    break
            }

            var styles = [{"featureType": "landscape", "stylers": [{ "color": $mapColors[0] }]}, {"featureType": "road.highway", "stylers": [{ "color": $mapColors[1]}]}, {"stylers": [{ "saturation": -48 }, { "hue": $mapColors[2] }]}];
            
            var myOptions = {zoom: 16, center: latlng, mapTypeId: google.maps.MapTypeId.ROADMAP, scrollwheel: false, styles: styles}
            map = new google.maps.Map(document.getElementById("map"), myOptions);
            map.setOptions({draggable: (isMobile) ? false : true });
            
            GoogleMaps.showMap(title, address, $mapMarker);
        },
        showMap: function(title, address, $mapMarker) {
            var geo = new google.maps.Geocoder;
            var infoWindow = new google.maps.InfoWindow({content: '...'});
            infoWindow.setOptions({maxWidth:250});
            geo.geocode({address: address}, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                            map.setCenter(results[0].geometry.location);
                            var marker = new google.maps.Marker({
                                    map: map,
                                    title: title,
                                    address: address,
                                    position: results[0].geometry.location,
                                    animation: google.maps.Animation.DROP,
                                    icon: 'img/'+$mapMarker,
                            });
                            google.maps.event.addListener(marker, 'click', function() {
                                infoWindow.setContent('<div class="marker-map-info"><h3>'+this.title+'</h3></div>');
                                infoWindow.open(map, this);
                            });
                    } else {
                        alert("Geocode was not successful for the following reason: " + status);
                    }
            });

            google.maps.event.addDomListener(window, 'load');
        },
    }
   
   /**-------------------- Validation Reservation Form Settings --------------------**/   
    var ValidationForm = {
        init: function() {
            $(".reservation-form").validate({
                rules: {
                        name: {
                                required: true,
                                minlength: 2,
                                maxlength: 125
                        },
                        email: {
                                required: true,
                                email: true
                        },
                        message: {
                                required: true,
                                minlength: 2,
                                maxlength: 500
                        },
                },
                messages: {
                        name: {
                                required: "Please enter a name",
                                minlength: "Your name must consist of at least 2 characters",
                                maxlength: "Your name to have a maximum of 125 characters"
                        },
                        email: "Please enter a valid email address",
                        message: {
                                required: "Please enter a message",
                                minlength: "Your message must consist of at least 2 characters",
                                maxlength: "Your message to have a maximum of 500 characters"
                        },
                },
                submitHandler: false
            });

            $('.reservation-form').on('submit', function(e){
                e.preventDefault()
                var action = $(this).attr('action');
                    $.ajax({
                        'url': action,
                        'type': 'POST',
                        'data': $(this).serialize()
                    }).done(function(data) {
                        var json = $.parseJSON(data);
                        var alert = json.alert;
                        var notice = json.notice;
                        $('.alert').remove();
                        $('<div class="alert alert-'+alert+'">'+notice+'</div>').insertBefore($('.reservation-form').first());
                    })
            });
        }
    }
   
 /**-------------------- Ajax Complete Menu Settings --------------------**/   
    var AjaxMenu = {
        init: function () {
            jQuery('.our-menu-btn-complete-menu .button-style1').on('click', function (e) {
                    e.preventDefault();
                    var href = $(this).data('url');
                    AjaxMenu.show(href);
            });
        },
        show: function (href) {
                jQuery("#ajax-content-menu").slideUp(500);
                ScrollTo.scroll(jQuery('#ajax-content-menu'));
                setTimeout(function () {
                        jQuery('#ajax-content-menu').html('');
                        jQuery.ajax({
                                url: href,
                                dataType: "html",
                                success: function (response) {
                                        setTimeout(function () {
                                                var content = response;
                                                jQuery("#ajax-content-menu").html(content);

                                                jQuery("#ajax-content-menu").slideDown(300);

                                                jQuery('#ajax-content-menu [data-animation]').css({'opacity': 0 });

                                                jQuery("#ajax-content-menu [data-animation]").each(function () {
                                                        var obj = jQuery(this);
                                                        var dataAnimation = obj.attr('data-animation');
                                                        var dataDelay = obj.attr('data-delay');
                                                        if (typeof dataDelay === "undefined") {
                                                            dataDelay = 0;
                                                        } else {
                                                            dataDelay = parseFloat(dataDelay.replace(",", "."));
                                                        }
                                                        $('.our-menu-btn-complete-menu').hide();
                                                        setTimeout(function () {
                                                            obj.addClass('animated ' + dataAnimation).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend notAnimated', function () {
                                                                obj.css({'opacity': 1}).removeClass('animated ' + dataAnimation);
                                                            });
                                                            
                                                            jQuery('#ajax-content-menu .our-menu-btn-close-menu .button-style1').on('click', function (e) {
                                                                e.preventDefault();
                                                                ScrollTo.scroll(jQuery('.our-menu-food'));
                                                                jQuery("#ajax-content-menu").slideUp(500);
                                                                setTimeout(function () {
                                                                        jQuery("#ajax-content-menu").html('');
                                                                        $('.our-menu-btn-complete-menu').show();
                                                                }, 500);
                                                            });
                                                        }, dataDelay * 800);
                                                });
                                        }, 1000);
                                }
                        });
                }, 500);    
        },
    }
    
    var Starting = function() {
        Theme.setStyleSheet(); //passing one of this value: 'light', 'turtledove', 'darkbrown', 'zephir'
        ScrollTo.init();
        Topbar.init($versionMenu);
        Parallax.init();
        OwlCarousel.init();
        MasonryGallery.init();
        MasonryBlog.init();
        ValidationForm.init();
        AjaxMenu.init();
        RsSlider.init();
    }
    
   jQuery(document).ready(function(){
        if (isMobile && touch) {
                $('*').removeAttr('data-animation');
                $('*').removeAttr('data-delay');
        } else {
            if (checkMsie() == 0) {
                $('[data-animation]').css({
                    'opacity': 0
                });
                Waypoints.animation();
            }
        }
        Starting(function(){});
 
        function checkMsie() {
            var uAgent = window.navigator.userAgent;
            var Id = uAgent.indexOf("MSIE");

            if (Id > 0) {
              return parseInt(uAgent.substring(Id+ 5, uAgent.indexOf(".", Id)));
           } else if (!!navigator.userAgent.match(/Trident\/7\./)) {
              return 11;
           } else {
              return 0;
          }
        }
    });

    jQuery(window).on( 'load', function(){
        $('#preloader-wrapper').fadeOut( 'slow' );
    });
})(jQuery);