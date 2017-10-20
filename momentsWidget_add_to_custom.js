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
}
