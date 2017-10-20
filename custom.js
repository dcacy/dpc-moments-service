/**
* TIMETOACT Web CMS Extension for IBM Connections (XCC) - {custom}.js
*/
(function (W) {
	  XCC.X = XCC.X || {
		  /**
		* Init function, please use this function as your constructor.
		*/
		init : function() {
			XCC.require.s.contexts._.config.paths.embedded = "/xcc/rest/public/custom/CUSTOM-XCC-EE";

		/**
			* Function which is called when the Widget is rendered.
			* @param  {[Jquery-Object]} container$ [the HTML-container in the Widget.. ]
  			  * @param  {[Object]} widgetData [The widget data]
			* */
			function myCustomWidget(container$, widgetData) {
				container$.html("Hello World!");
			}
			/**
			* The myCustomEditor will be called immediately if the editor is opened.
			* You have to code here your html-code for the editor.
			* Default is only a save button.
			*
			* @param container$ {jQuery} the parent node that will hold the editor
			* @param widgetData {Object} the widget object to work on
			*
			* @return a HTML-String, Jquery-Objekt or an array of Jquery-Objects!
			* */
			function myCustomEditor (container$, widgetData) {
				return [XCC.U.createTextInputOnTheFly("Widget Title ", widgetData.title, "title"),
				XCC.U.createTextInputOnTheFly("Height", widgetData.height, "height")];
			}
			/**
			* Function to synch the UI-Data to the widget.
			* @param  {[type]} container$ [the Editor as a Jquery-Object]
			* @param  {[type]} widgetData  [the widget data]
			*/
			function save (container$, widgetData) {
				widgetData.title = container$.find("input[name=title]").val();
				widgetData.height = container$.find("input[name=height]").val();
			}
			/**
			* This function is used to register a Custom Widget
			* @param name {String} Name of the Custom Widget,
			*  which is shown in the Create-Widget ModalBox
			* @param icon {String} name of the icon. Without the "fa-" at the beginning.
			* You have to use the fontawesome.io library.
			* @param createCustomWidget {function} Function which should be called when rendering
			* the Widget
			* @param CreateCustomEditor {function} optional: Use an own Editor instance!
			* @param synchUiToWidgetDataObjekt {function} optional: Synch your Data from the UI into the Widget.
			* @param dontShowIn {String} optional: e.g.: Should not show in ":cloud:communites:cnx5:"
			*/
			XCC.W.registerCustomWidget("Custom", "flag", myCustomWidget, myCustomEditor, save);


			XCC.X.febWidget();
			XCC.X.momentsWidget();
		},


		momentsWidget: function() {

		  function myCustomWidget(container$, widgetData) {
		    XCC.require(["/xcc/rest/public/custom/momentsWidget.js"], function(momentsWidget) {
		      momentsWidget.widget(container$, widgetData);
		    });
		  }

		  function myCustomEditor(container$, widgetData) {
		    XCC.require(["/xcc/rest/public/custom/momentsWidget.js"], function(momentsWidget) {
		      momentsWidget.editor(container$, widgetData);
		    });
		  }

		  function save(container$, widgetData) {
		    XCC.require(["/xcc/rest/public/custom/momentsWidget.js"], function(momentsWidget) {
		      momentsWidget.save(container$, widgetData);
		    });
		  }
		  XCC.W.registerCustomWidget("Moments Widget", "table", myCustomWidget, myCustomEditor, save);
		},





		febWidget: function() {

		function myCustomWidget(container$, widgetData) {
			XCC.require(["/xcc/rest/public/custom/febWidget.js"], function(febWidget) {
				febWidget.widget(container$, widgetData);
			});
		}

		function myCustomEditor(container$, widgetData) {
			XCC.require(["/xcc/rest/public/custom/febWidget.js"], function(febWidget) {
				febWidget.editor(container$, widgetData);
			});
		}

		function save(container$, widgetData) {
			XCC.require(["/xcc/rest/public/custom/febWidget.js"], function(febWidget) {
				febWidget.save(container$, widgetData);
			});
		}
		XCC.W.registerCustomWidget("FEB Widget", "table", myCustomWidget, myCustomEditor, save);
	}



	};
}(window));
