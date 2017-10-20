
(function ($, W) {
    "use strict";

		/**
			* called when the Widget is rendered.
			* @param  {[jQuery Object]} container$ [the HTML container in the Widget.. ]
  	  * @param  {[Object]} widgetData [The widget data]
			**/
    function myCustomWidget(container$, widgetData) {
			var contents = 'Please edit this widget to select a Space.';
			// savedSettings will hold the configuration data
			var savedSettings = XCC.T.getXccPropertyByName(widgetData, "momentsWidgetConfig");
      console.log('savedSettings:', savedSettings);
			// if savedSettings does not exist, use default values
			var momentsSettings = savedSettings ? JSON.parse(savedSettings.propValue) : {};
      console.log('momentsSettings:', momentsSettings);
      if (typeof momentsSettings.nbrOfDays === 'undefined') {
        momentsSettings.nbrOfDays = 7;
      }
      // console.log('momentsSettings:', momentsSettings);
			if ( momentsSettings.spaceId ) {
        XCC.T.loadCSS('/xcc/rest/public/custom/jqcloud.min.css');
        XCC.require(['/xcc/rest/public/custom/jqcloud.min.js'], function() {
          console.log('loaded jqcloud');
          var url = '/communities/ajaxProxy/https/dpc-moments-service.mybluemix.net/getMoments?id='
            + momentsSettings.spaceId + '&days=' + momentsSettings.nbrOfDays;
          console.log('url is', url);
          $.get(url,
            function (data) {
              console.log('data is', data);
              var cloudData = [];
              for (var i = 0; i < data.moments.length; i++) {
                if ( data.moments[i].score > .80 ) {
                  var entry = {};
                  entry.text = data.moments[i].label;
                  entry.weight = data.moments[i].score;
                  cloudData.push(entry);
                }
              }
              console.log('widgetData.height:', widgetData.height);
              var theHeight = isNaN(widgetData.height) ? widgetData.height : widgetData.height + 'px';
              console.log('theHeight:', theHeight);
              var html = '<div id="cloud" onmouseover="" style="height:'
                + theHeight + ';width:100%;cursor:pointer;">';
              console.log('html is', html);
              container$.html(html);
              $('#cloud').jQCloud(cloudData);
              $("#cloud").click(function() {
                window.open('https://workspace.ibm.com/space/' + momentsSettings.spaceId);
              });
            },
            'json')
          .fail(function(err) {
            console.log('an error occurred getting moments:', err);
          }).
          always(function() {
            console.log('done');
          });
        });
			} else {
        container$.html('Please edit this widget to select a Watson Work Space');
      }
    }

		/**
			* Function which is called when the user edits the widget
			* @param  {[jQuery Object]} container$ [the HTML container in the Widget.. ]
			* @param  {[Object]} widgetData [The widget data]
			**/
    function myCustomEditor(container$, widgetData) {
			// get the saved settings, if any
			var savedSettings = XCC.T.getXccPropertyByName(widgetData, "momentsWidgetConfig");
      console.log('savedSettings:', savedSettings);
			var momentsSettings = savedSettings ? JSON.parse(savedSettings.propValue) : {spaceId:'',nbrOfDays:'',cloudHeight:'',cloudWidth:''};
			// most of the work here is in fitting in to the jQuery-ui autocomplete which is all ready for us

			// create some jQuery objects to render in the edit form
			var spaceId$ = $('<label><div class="input-group"><span class="input-group-addon"><span class="xccEllipsis" style="float: left;">Space ID' +
							'</span></span>' +
							'<input value="' + momentsSettings.spaceId + '" type="text" id="spaceId" class="form-control xccEllipsis ui-autocomplete-input formInput" autocomplete="off"></div></label>');
			// var	href$ = $('<label><div class="input-group"><span class="input-group-addon"><span class="xccEllipsis" style="float: left;">HREF' +
			// 				'</span></span>' +
			// 				'<input value="' + momentsSettings.href + '" type="hidden" name="formHref" id="formHref" class="form-control xccEllipsis" autocomplete="off"></div></label>').hide(),
      var nbrOfDays$ = $('<label><div class="input-group"><span class="input-group-addon"><span class="xccEllipsis" style="float: left;">Number of Days' +
							'</span></span>' +
							'<input value="' + momentsSettings.nbrOfDays + '" type="text" name="nbrOfDays" id="nbrOfDays" class="form-control xccEllipsis" autocomplete="off"></div></label>');
      var cloudHeight$ = $('<label><div class="input-group"><span class="input-group-addon"><span class="xccEllipsis" style="float: left;">Cloud Height' +
							'</span></span>' +
							'<input value="' + momentsSettings.cloudHeight + '" type="text" name="cloudHeight" id="cloudHeight" class="form-control xccEllipsis" autocomplete="off"></div></label>');
      var cloudWidth$ = $('<label><div class="input-group"><span class="input-group-addon"><span class="xccEllipsis" style="float: left;">Cloud Width' +
							'</span></span>' +
							'<input value="' + momentsSettings.cloudWidth + '" type="text" name="cloudWidth" id="cloudWidth" class="form-control xccEllipsis" autocomplete="off"></div></label>');

			// var inputForForm$ = formLabel$.find(".formInput");

			var editFields = [XCC.U.createTextInputOnTheFly("Widget Title ", widgetData.title, "title"),
					$('<div class="input-group input-group-sm input-group-xs glue-prev"><span class="input-group-addon">ID / Type </span><span class="form-control xccEllipsis" title="' +
							widgetData.contentType +
							'">' +
							widgetData.name +
							' / ' +
							XCC.W.getLabel(widgetData.contentType) +
							'</span></div>'),
					XCC.U.createTextInputOnTheFly("Height", widgetData.height, "height"),
					spaceId$,
					// href$,
					nbrOfDays$
        //  cloudHeight$,
        //  cloudWidth$
			];

			// convert array to object
			editFields = $($.map(editFields, function(el){return $.makeArray(el)}));

			// wait until the element with the class AdminUI exists, THEN render the edit fields
			container$.waitUntilExists(".AdminUI", function () {
					$(this).prepend(editFields);
			}, false);

    }

		/**
			* Called when the user clicks the Save button in edit mode
			* @param  {[jQuery Object]} container$ [the HTML container in the Widget.. ]
			* @param  {[Object]} widgetData [The widget data]
			**/
    function save(container$, widgetData) {
			// find the new values in the container and save them
			widgetData.title = container$.find("input[name=title]").val();
			widgetData.height = container$.find("input[name=height]").val();
			var spaceId = container$.find("input[id=spaceId]").val();
			// var theHref = container$.find("input[id=formHref]").val();
      var nbrOfDays = container$.find("input[id=nbrOfDays]").val();
      var cloudHeight = container$.find("input[id=cloudHeight]").val();
      var cloudWidth = container$.find("input[id=cloudWidth]").val();
			var momentsWidgetConfig = {
				spaceId: spaceId,
				// href: theHref,
				nbrOfDays: nbrOfDays,
        cloudHeight: cloudHeight,
        cloudWidth: cloudWidth
			};
			// persist the values as a property of this widget
			XCC.T.setXccPropertyString(widgetData, "momentsWidgetConfig", JSON.stringify(momentsWidgetConfig));
    }

		/**
		 * Wait until a selector exists
		 */
    $.fn.waitUntilExists = function (selector, handler, shouldRunHandlerOnce, isChild) {
        var found = 'found',
            $this = $(selector),
            $elements = $this.not(function () {
                return $(this).data(found);
            }).each(handler).data(found, true);

        if (!isChild) {
            (window.waitUntilExists_Intervals = window.waitUntilExists_Intervals || {})[selector] =
                window.setInterval(function () {
                    $this.waitUntilExists(selector, handler, shouldRunHandlerOnce, true);
                }, 50);
        } else if (shouldRunHandlerOnce && $elements.length) {
            window.clearInterval(window.waitUntilExists_Intervals[selector]);
        }
        return $this;
    };


		// this defines the above functions so they can be called from custom.js
    XCC.define([], function () {
      return {
          editor: myCustomEditor,
          widget: myCustomWidget,
          save: save
      };
    });

} (XCC.jQuery || jQuery, window));
