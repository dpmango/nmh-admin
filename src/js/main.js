$(document).ready(function() {

    //////////
    // Global variables
    //////////

    var _window = $(window);
    var _document = $(document);

    // BREAKPOINT SETTINGS
    var bp = {
        mobileS: 375,
        mobile: 680,
        tablet: 768,
        desktop: 992,
        wide: 1336,
        hd: 1680
    }

    var easingSwing = [.02, .01, .47, 1]; // default jQuery easing for anime.js

    ////////////
    // READY - triggered when PJAX DONE
    ////////////
    function pageReady() {
        legacySupport();
        initSticky();
        initSelectric();
        initMasks();
        initPopups();
        initAutocompleate();
        initValidations();
        initMaps();
        initDatepicker();
        initTeleport();
        initDropzone();
        initSortable();
    }

    // this is a master function which should have all functionality
    pageReady();


    function isMobile() {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            return true
        } else {
            return false
        }
    }

    function msieversion() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");

        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
            return true
        } else {
            return false
        }
    }

    if (msieversion()) {
        $('body').addClass('is-ie');
    }

    if (isMobile()) {
        $('body').addClass('is-mobile');
    }


    //////////
    // COMMON
    //////////
    function legacySupport() {
        // svg support for laggy browsers
        svg4everybody();

        // Viewport units buggyfill
        window.viewportUnitsBuggyfill.init({
            force: true,
            refreshDebounceWait: 150,
            appendToBody: true
        });
    }


    // CLICK HANDLERS
    _document
        .on('click', '[href="#"]', function(e) {
            e.preventDefault();
        })

        // sidebar
        .on('click', '.sidebar li a', function() {
            $('.sidebar__secondary li').removeClass('is-active');
            $(this).parent().addClass('is-active');
        })
        .on('mouseup', function(e) {
            var div = $("[js-sidebar]");
            if (!div.is(e.target) &&
                div.has(e.target).length === 0) {
                $('.sidebar').removeClass('is-open');
                $('.show-menu-link').removeClass('is-active');
            }
        })

        .on('click', '[js-open-menu]', function() {
            $(this).toggleClass('is-active');
            $(this).parent().toggleClass('is-open');
        })

        .on('click', '[js-btn-save]', function() {
            $('[js-status-bar-num]').html('#4842');
            $('[js-status-bar-action]').html('Объект сохранен');

            $('.status-bar').addClass('is-active');
            setTimeout(function(){
              $('.status-bar').removeClass('is-active')
            }, 3000)
        })

        // PROPERTY LIST CHANGE
        .on('click', '.property__change', function(e) {
            e.preventDefault();
            $('.property__change').removeClass('is-active');
            $(this).addClass('is-active');
        })
        .on('click', '.property__change.is-active', function(e) {
            e.preventDefault();
            $('.property__change').removeClass('is-active');
        })

        // C SEO
        .on('click', '.c-seo a', function() {
            $(this).parents('.content__item').toggleClass('is-open');
            $(this).parents('.content__item').find('.c-edit').slideToggle();
        })


    ////////////
    // AUTOCOMPLEATE
    ////////////
    function initAutocompleate() {
        var autocompleate = $('[js-autocomplete]');

        if (autocompleate.length > 0) {
            autocompleate.each(function(i, input) {
                $(input).easyAutocomplete({
                    url: $(input).data('url'),
                    getValue: "name",
                    list: {
                        match: {
                            enabled: true
                        },
                        showAnimation: {
                            type: "fade", //normal|slide|fade
                            time: 200,
                        },
                        hideAnimation: {
                            type: "slide", //normal|slide|fade
                            time: 200,
                        }
                    },
                });

            })
        }
    }

    // sticky kit
    function initSticky() {
        var sticky = $('[js-sticky]');

        if (sticky.length > 0) {
            sticky.each(function(i, el) {
                $(el).stick_in_parent({
                    offset_top: 25
                })

            })
        }
    }

    // MAGNIFIC POPUP
    function initPopups(){
        $('[js-open-image]').magnificPopup({
            type: 'image',
            removalDelay: 500,
            overflowY: 'auto',
            callbacks: {
                beforeOpen: function() {
                    this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
                    this.st.mainClass = this.st.el.attr('data-effect');
                }
            },
            closeOnContentClick: true,
            midClick: true
        });


        // dropzone preview
        _document.on('click', '.dz-image img', function(){
          var targetEl = $(this);
          $.magnificPopup.open({
              items: {
                  src: targetEl.attr('href')
              },
              type: 'image',
              // delegate: 'img',
              tLoading: 'Загрузка #%curr%...',
              removalDelay: 500,
              overflowY: 'auto',
              callbacks: {
                  beforeOpen: function() {
                      this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
                      this.st.mainClass = "mfp-zoom-in";
                  }
              },
              closeOnContentClick: true,
              midClick: true
          });
        });
    }


    // DATEPICKER
    function initDatepicker() {
        $('.datepicker').datepicker({
            dateFormat: 'M d, yyyy'
        });
        $('.datepicker').data('datepicker');
    };

    // SORTABLE (for DZ Uploads)
    function initSortable(){
      var dropzones = $('.dropzone');
      if ( dropzones.length > 0 ){
        dropzones.each(function(i, dropzone){
          // https://github.com/RubaXa/Sortable
          var sortable = Sortable.create( dropzone, {
            filter: ".dz-message, .dz-add",
            forceFallback: true,
            fallbackTolerance: 3,
            touchStartThreshold: 3,
          } );
        })
      }
    }


    // ADD PHOTOS - DROPZONE JS
    function initDropzone() {
        if ($("[js-add-photos]").length > 0) {

            Dropzone.autoDiscover = false;

            var uploadUrl = "http://nmh.khmelevskoy.club/";
            // var uploadUrl = "http://localhost:8090/";

            var dropzone = new Dropzone('[js-add-photos]', {
                // previewTemplate: document.querySelector('#preview-template').innerHTML,
                url: uploadUrl,
                parallelUploads: 2,
                thumbnailHeight: 65,
                thumbnailWidth: 100,
                maxFilesize: 3,
                filesizeBase: 1000,
                addRemoveLinks: true,
                success: function(file, resp){
                  var fileName = resp.originalname;
                  var fileUrl = uploadUrl + resp.path;
                  setTimeout(function(){
                    $('img[href="'+fileName+'"]').attr('href', fileUrl)
                  }, 300)
                },
                thumbnail: function(file, dataUrl) {
                    if (file.previewElement) {
                        file.previewElement.classList.remove("dz-file-preview");
                        var images = file.previewElement.querySelectorAll("[data-dz-thumbnail]");
                        for (var i = 0; i < images.length; i++) {
                            var thumbnailElement = images[i];
                            thumbnailElement.alt = file.name;
                            thumbnailElement.src = dataUrl;
                            $(thumbnailElement).attr('href', file.name);
                        }
                        setTimeout(function() { file.previewElement.classList.add("dz-image-preview"); }, 1);

                        keepDzAddLastChild(1);
                    }
                }
            });

            // plans
            var dropzone2 = new Dropzone('[js-add-plans]', {
                // previewTemplate: document.querySelector('#preview-template').innerHTML,
                url: uploadUrl,
                parallelUploads: 2,
                thumbnailHeight: 65,
                thumbnailWidth: 100,
                maxFilesize: 3,
                filesizeBase: 1000,
                addRemoveLinks: true,
                success: function(file, resp){
                  var fileName = resp.originalname;
                  var fileUrl = uploadUrl + resp.path;
                  setTimeout(function(){
                    $('img[href="'+fileName+'"]').attr('href', fileUrl)
                  }, 300);

                },
                thumbnail: function(file, dataUrl) {
                    if (file.previewElement) {
                        file.previewElement.classList.remove("dz-file-preview");
                        var images = file.previewElement.querySelectorAll("[data-dz-thumbnail]");
                        for (var i = 0; i < images.length; i++) {
                            var thumbnailElement = images[i];
                            thumbnailElement.alt = file.name;
                            thumbnailElement.src = dataUrl;
                            $(thumbnailElement).attr('href', file.name);
                        }
                        setTimeout(function() { file.previewElement.classList.add("dz-image-preview"); }, 1);

                        keepDzAddLastChild(2);
                    }
                },
                previewTemplate: $('[js-preview-template-plans]').html()
            });

            // emulate dz add click
            _document
              .on('click', '.dz-add', function(){
                $(this).closest('.dropzone').click();
              })

            function keepDzAddLastChild(dropzoneID){
              var parentDropzone = $('.dropzone[data-dropzone-id="'+dropzoneID+'"]');
              parentDropzone.find('.dz-add').insertAfter('.dropzone[data-dropzone-id="'+dropzoneID+'"] .dz-preview:last-child');
            }
        };
    };

    // TAGS ADD
    $.expr[":"].contains = $.expr.createPseudo(function(arg) {
        return function(elem) {
            return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
        };
    });
    _document.on('click', '[js-remove-tag]', function(event) {
        event.preventDefault();
        $(this).parent().remove();
    });
    _document.on('click', 'ul.tags', function() {
        $('[js-search-field]').focus();
    });
    _document.on('keypress', '[js-search-field]', function(event) {
        if (event.which == '13') {
            if (($(this).val() != '') && ($(".tags .tags__added:contains('" + $(this).val() + "') ").length == 0)) {

                $('<li class="tags__added">' + $(this).val() + '<span js-remove-tag></span><input type="hidden" value="' + $(this).val() + '" name="tags[]"></li>').insertBefore('.tag__input');
                $(this).val('');

            } else {
                $(this).val('');

            }
        }
    });


    ////////////
    // UI
    ////////////

    // selectric

    function initSelectric() {
        $('[js-selectric]').each(function(i, select) {
            var icon = $(select).data('icon') || 'drop-arrow';
            var btn = '<b class="button"><svg class="ico ico-' + icon + '"><use xlink:href="img/sprite.svg#ico-' + icon + '"></use></svg></b>';

            $(select).selectric({
                maxHeight: 300,
                arrowButtonMarkup: btn,

                onInit: function(element, data) {
                    var $elm = $(element),
                        $wrapper = $elm.closest('.' + data.classes.wrapper);

                    $wrapper.find('.label').html($elm.attr('placeholder'));
                },
                onBeforeOpen: function(element, data) {
                    var $elm = $(element),
                        $wrapper = $elm.closest('.' + data.classes.wrapper);

                    $wrapper.find('.label').data('value', $wrapper.find('.label').html()).html($elm.attr('placeholder'));
                },
                onBeforeClose: function(element, data) {
                    var $elm = $(element),
                        $wrapper = $elm.closest('.' + data.classes.wrapper);

                    $wrapper.find('.label').html($wrapper.find('.label').data('value'));
                }
            });
        });

        $('[js-select-okrug]').on('selectric-select', function(event, element, selectric) {
            var curVal = $(element).val();
            var novomosc = $('[js-opened-novomosc]');
            var troitsk = $('[js-opened-troitsk]');

            if ( curVal == "Новомосковский" ){
              novomosc.attr('disabled', false).addClass('active').selectric('refresh');
              troitsk.attr('disabled', true).removeClass('active').selectric('refresh');
            } else if ( curVal == "Троицкий" ){
              novomosc.attr('disabled', true).removeClass('active').selectric('refresh');
              troitsk.attr('disabled', false).addClass('active').selectric('refresh');
            } else {
              novomosc.attr('disabled', true).addClass('active').selectric('refresh');
              troitsk.attr('disabled', true).removeClass('active').selectric('refresh');
            }
        });


    }

    // textarea autoExpand
    _document
        .one('focus.autoExpand', '.ui-group textarea', function() {
            var savedValue = this.value;
            this.value = '';
            this.baseScrollHeight = this.scrollHeight;
            this.value = savedValue;
        })
        .on('input.autoExpand', '.ui-group textarea', function() {
            var minRows = this.getAttribute('data-min-rows') | 0,
                rows;
            this.rows = minRows;
            rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 17);
            this.rows = minRows + rows;
        });

    // Masked input
    function initMasks() {
        $("[js-dateMask]").mask("99.99.99", { placeholder: "ДД.ММ.ГГ" });
        $("input[type='tel']").mask("+7 (000) 000-0000", { placeholder: "+7 (___) ___-____" });
        $("[js-mask-number]").mask("999 999 999");


        $("[js-mask-numbers]").mask("#");
        $("[js-mask-floor]").mask("99/99");
        $("[js-mask-number-price]").mask('999 999 999 999');

        // $('form').on('focus', 'input[type=number]', function(e) {
        //     $(this).on('wheel', function(e) {
        //         e.preventDefault();
        //     });
        // });
        // $('form').on('blur', 'input[type=number]', function(e) {
        //     $(this).off('wheel');
        // });
        // $('form').on('keydown', 'input[type=number]', function(e) {
        //     if ( e.which == 38 || e.which == 40 )
        //         e.preventDefault();
        // });

        _document
            .on('keydown', '[js-mask-price]', function(e) {
                // https://stackoverflow.com/questions/22342186/textbox-mask-allow-number-only
                // Allow: backspace, delete, tab, escape, enter and .
                // dissallow . (190) for now
                if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
                    // Allow: Ctrl+A
                    (e.keyCode == 65 && e.ctrlKey === true) ||
                    // Allow: home, end, left, right
                    (e.keyCode >= 35 && e.keyCode <= 39)) {
                    return;
                }
                // Ensure that it is a number and stop the keypress
                if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                    e.preventDefault();
                }
                if ($(this).val().length > 10) {
                    e.preventDefault();
                }
            })
            .on('keyup', '[js-mask-price]', function(e) {
                // if number is typed format with space
                if ($(this).val().length > 0) {
                    $(this).val($(this).val().replace(/ /g, ""))
                    $(this).val($(this).val().replace(/\B(?=(\d{3})+(?!\d))/g, " "));
                }
            })

    }


    //////////
    // BARBA PJAX
    //////////

    Barba.Pjax.Dom.containerClass = "page";

    var FadeTransition = Barba.BaseTransition.extend({
        start: function() {
            Promise
                .all([this.newContainerLoading, this.fadeOut()])
                .then(this.fadeIn.bind(this));
        },

        fadeOut: function() {
            var deferred = Barba.Utils.deferred();

            anime({
                targets: this.oldContainer,
                opacity: .5,
                easing: easingSwing, // swing
                duration: 300,
                complete: function(anim) {
                    deferred.resolve();
                }
            })

            return deferred.promise
        },

        fadeIn: function() {
            var _this = this;
            var $el = $(this.newContainer);

            $(this.oldContainer).hide();

            $el.css({
                visibility: 'visible',
                opacity: .5
            });

            anime({
                targets: "html, body",
                scrollTop: 1,
                easing: easingSwing, // swing
                duration: 150
            });

            anime({
                targets: this.newContainer,
                opacity: 1,
                easing: easingSwing, // swing
                duration: 300,
                complete: function(anim) {
                    triggerBody()
                    _this.done();
                }
            });
        }
    });

    // set barba transition
    Barba.Pjax.getTransition = function() {
        return FadeTransition;
    };

    Barba.Prefetch.init();
    Barba.Pjax.start();

    Barba.Dispatcher.on('newPageReady', function(currentStatus, oldStatus, container, newPageRawHTML) {

        pageReady();
        closeMobileMenu();

    });

    // some plugins get bindings onNewPage only that way
    function triggerBody(shouldScroll) {
        if (shouldScroll) {
            _window.scrollTop(0);
        }
        $(window).scroll();
        $(window).resize();
    }


    function initMaps() {
        if ($("#property-map").length > 0) {
            ymaps.ready(init);
        }
        var myMap, dynamicPlacemark, hasPlacemark = false;

        function init() {
            myMap = new ymaps.Map("property-map", {
                center: [55.753215, 37.622504],
                zoom: 10
            });

            myMap.controls.remove('trafficControl');
            myMap.controls.remove('searchControl');
            myMap.controls.remove('fullscreenControl');
            myMap.controls.remove('rulerControl');
            // myMap.controls.remove('geolocationControl');
            myMap.controls.remove('routeEditor');
            myMap.controls.remove('typeSelector');
            // myMap.controls.remove('zoomControl');

            // click
            myMap.events.add('click', function (e) {
                var coords = e.get('coords');

                ymaps.geocode(coords).then(function (res) {
                    // get name
                    var newObj = res.geoObjects.get(0);
                    var newObjName = newObj.properties.get('name');

                    $('[js-set-placemark]').val(newObjName);
                    $('[js-set-placemark]').keydown();
                });
            });


            // suggestons
            var suggestInput = $('[js-map-suggestions]').get(0);
            var suggestView = new ymaps.SuggestView(suggestInput,{
              // options
              offset: [-1, 5]
            });
            // trigger update
            suggestView.events.add('select', function (event) {
              $('[js-set-placemark]').keydown();
            });

        }

        // input lister
        _document.
            on('keydown', '[js-set-placemark]', debounce(function(e){
                var currentVal = $(this).val();

                // gecoder
                ymaps.geocode(currentVal, { results: 1 }).then(function (res) {
                    var geoObj = res.geoObjects.get(0),
                        geoObjCoords = geoObj.geometry.getCoordinates();

                    if ( geoObjCoords ){
                        // attach or update position
                        if ( !hasPlacemark ){
                            // add placemark
                            dynamicPlacemark = new ymaps.Placemark(geoObjCoords, {
                                balloonContent: currentVal
                            }, {
                                draggable: true
                            });
                            myMap.geoObjects.add(dynamicPlacemark);
                            hasPlacemark = true;
                            attachReverseGeocode(); // because bindings for placemark is ready only at this point
                        } else{
                            dynamicPlacemark.geometry.setCoordinates(geoObjCoords);
                        }
                        // set center
                        myMap.setCenter(geoObjCoords, 14);
                        setLatLongInputs(geoObjCoords);
                    }

                }, function (err) {
                    console.log(err);
                });
            }, 1000));

        // search by lat, long
        _document.
          on('keydown', '[js-set-lat], [js-set-long]', debounce(function(e){
              var latVal = $('[js-set-lat]').val();
              var longVal = $('[js-set-long]').val();
              function isLatitude(lat) {return lat.length > 3 && isFinite(lat) && Math.abs(lat) <= 90;}
              function isLongitude(lng) {return lng.length > 3 && isFinite(lng) && Math.abs(lng) <= 180;}

              if ( isLatitude(latVal) && isLongitude(longVal) ){
                // geocode from pos
                ymaps.geocode([latVal, longVal]).then(function (res) {
                    var newObj = res.geoObjects.get(0);
                    var newObjName = newObj.properties.get('name');

                    $('[js-set-placemark]').val(newObjName);
                    $('[js-set-placemark]').keydown();
                });
              }

          }, 1000));

        function attachReverseGeocode() {
            // reverse geocoding
            dynamicPlacemark.events.add("dragend", function (e) {
                var newPos = dynamicPlacemark.geometry.getCoordinates();

                ymaps.geocode(newPos).then(function (res) {
                    // set name in input
                    var newObj = res.geoObjects.get(0);
                    var newObjName = newObj.properties.get('name');

                    $('[js-set-placemark]').val(newObjName);
                    setLatLongInputs(newPos);
                    // myMap.setCenter(newPos, 14);
                });
            }, dynamicPlacemark);
        }

        function setLatLongInputs(data){
          $('[js-set-lat]').val(data[0]);
          $('[js-set-long]').val(data[1]);
        }
    }

    ////////////
    // TELEPORT PLUGIN
    ////////////
    function initTeleport() {
        $('[js-teleport]').each(function(i, val) {
            var self = $(val)
            var objHtml = $(val).html();
            var target = $('[data-teleport-target=' + $(val).data('teleport-to') + ']');
            var conditionMedia = $(val).data('teleport-condition').substring(1);
            var conditionPosition = $(val).data('teleport-condition').substring(0, 1);

            if (target && objHtml && conditionPosition) {

                function teleport() {
                    var condition;

                    if (conditionPosition === "<") {
                        condition = _window.width() < conditionMedia;
                    } else if (conditionPosition === ">") {
                        condition = _window.width() > conditionMedia;
                    }

                    if (condition) {
                        target.html(objHtml)
                        self.html('')
                    } else {
                        self.html(objHtml)
                        target.html("")
                    }
                }

                teleport();
                _window.on('resize', debounce(teleport, 100));


            }
        })
    }



    ////////////////
    // FORM VALIDATIONS
    ////////////////
    function initValidations() {

        // GENERIC FUNCTIONS
        ////////////////////

        var validateErrorPlacement = function(error, element) {
            error.addClass('ui-input__validation');
            error.appendTo(element.parent("div"));
        }
        var validateHighlight = function(element) {
            $(element).parent('div').addClass("has-error");
            $(element).parent().parent().addClass("has-error");
        }
        var validateUnhighlight = function(element) {
            $(element).parent('div').removeClass("has-error");
            $(element).parent().parent().removeClass("has-error");
        }
        var validateSubmitHandler = function(form) {
            $(form).addClass('loading');
            // window.location.href = '/log-page.html'
        }

        ////////
        // FORMS
        _document.on('submit', '[js-validate-property-add]', function(e){
          e.preventDefault();
        })

        /////////////////////
        // REGISTRATION FORM
        ////////////////////
        $(".login__form").validate({
            errorPlacement: validateErrorPlacement,
            highlight: validateHighlight,
            unhighlight: validateUnhighlight,
            submitHandler: validateSubmitHandler,
            rules: {
                email: {
                    required: true,
                    email: true
                },
                password: {
                    required: true,
                    minlength: 6,
                }
            },
            messages: {
                email: {
                    required: "Заполните это поле",
                    email: "Email содержит неправильный формат"
                },
                password: {
                    required: "Заполните это поле",
                    minlength: "Пароль мимимум 6 символов"
                },
            }
        });


    }
});
