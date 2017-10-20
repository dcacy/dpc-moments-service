# dpc-moments-service

This is a sample widget to show Watson Workspace moments in an
IBM Connections Engagement Center widget.

## Quick Installation

```
Upload momentsWidget.js to your EC server.
Add momentsWidget_add_to_custom.js to your custom.js.
Deploy the app to bluemix.
Configure your Connections proxy to allow requests to the deployed app.
Add the Moments Widget to a page and configure.
```


## Usage

Customize any EC page.  Click `Create Widget` and you'll see the Moments Widget as an option.
Add it to your page, then go to edit mode and provide the ID of the space you want to render.

Please see the LICENSE file for license and copyright info. Specifically, please note that
this sample code is provided with NO WARRANTY! Please do not call IBM Support, as they will
not be able to help you. :-)

## Detailed Installation

### Create a Watson Workspace app

Anyone with an IBM ID can create a Watson Workspace app.  Go [here](https://developer.watsonwork.ibm.com/apps)
and click the `Create new app` button.  Provide a unique name for your app and take note of
the App ID and App Secret, as you'll need to provide them to your application.

Now go to a space in Watson Workspace and add your new app to that space.

Note: this application simply reads the moments for any space to which it's added, so it doesn't need
to listen for any events, etc.  All it needs is to be added to at least one space.

### Deploy the node.js application

Deploy this application to your node.js server or to bluemix. There are plenty of tutorials
available on this process.  

You will need to provide your application with the App ID and Secret from the above steps.  You can
hard code them into the app, you can provide them as environment variables, or you can add them to
the `manifest.yml` like this:

```
applications:
- path: .
  memory: 128M
  instances: 1
  domain: mybluemix.net
  name: <your app name>
  host: <your app host name>
  disk_quota: 1024M
  env:
    WORKSPACE_APP_ID: <your App Id>
    WORKSPACE_APP_SECRET: <your App Secret>
    DEBUG: dpc-moments-service-* (optional)

```

### Engagement Center

A custom widget in Engagement Center has two parts: the first part is the JavaScript required to define
the three functions a widget has: render, edit, and save.  The second part is the registration of the
widget.  The first part can be in a separate file, but the second part must be in `custom.js`. In this sample,
the first part is found in `momentsWidget.js`, and the second in `momentsWidget_add_to_custom.js`.

Open the `momentsWidget.js` file in an editor.  Locate the URL in the Ajax call (around line 82). Edit
this URL to reflect the ID of the form you created above; you'll probably only need to change the ID.

Log on to Engagement Center as an administrator and click the Customize button. Upload the edited `momentsWidget.js`
file to the server.

Download the custom.js file from the server and open it in an editor.  You will need to paste in the
lines from `momentsWidget_add_to_custom.js` to it in the right spot, which is just after the `init` function.
You also want to add a line _in_ the `init` function to call the function you are pasting in.
It may look like this when you are done:

```
init : function() {
  XCC.require.s.contexts._.config.paths.embedded = "/xcc/rest/public/custom/CUSTOM-XCC-EE";			
  XCC.X.momentsWidget(); // this line is added to invoke the function below
},
// adding lines from momentsWidget_add_to_custom.js
momentsWidget: function() {

  function myCustomWidget(container$, widgetData) {
    ...

```

Upload your edited `custom.js` file to the server, and refresh the page.
[This video](https://youtu.be/6T94Czc3vGk) shows the simple steps to add the widget to the page and customize it.  


The video shows the following steps:

1. Click on the Customize button.
2. Click Create Widget.  Find the new Moments Widget and add it to the page.
3. The widget should be automatically added to the page. Hover your cursor over the top right corner
of the new widget and click on the hamburger menu which appears.
4. If you did everything correctly, you should be able to configure the widget. Enter the ID of
the space you wish to monitor (the ID is in the URL of the browser when you are in that space, so just copy
  it from there).
5. Provide a title and a height, and Save.

You should see the moments render in the widget in a nifty tag cloud.  Click on a word to be taken
to the space.
