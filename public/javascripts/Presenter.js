/*
Copyright (C) 2015 Apple Inc. All Rights Reserved.
See LICENSE.txt for this sample’s licensing information

Abstract:
Templates can be displayed to the user via three primary means:
- pushing a document on the stack
- associating a document with a menu bar item
- presenting a modal
This class shows examples for each one.
*/

var currentMediaURL = "";

/**
 * @description Sets playback event listeners on the player
 * @param {Player} currentPlayer - The current Player instance
 */
function setPlaybackEventListeners(currentPlayer) {

    /**
     * The requestSeekToTime event is called when the user attempts to seek to a specific point in the asset.
     * The listener is passed an object with the following attributes:
     * - type: this attribute represents the name of the event
     * - target: this attribute represents the event target which is the player object
     * - timeStamp: this attribute represents the timestamp of the event
     * - currentTime: this attribute represents the current playback time in seconds
     * - requestedTime: this attribute represents the time to seek to in seconds
     * The listener must return a value:
     * - true to allow the seek
     * - false or null to prevent it
     * - a number representing an alternative point in the asset to seek to, in seconds
     * @note Only a single requestSeekToTime listener can be active at any time. If multiple eventListeners are added for this event, only the last one will be called.
     */
    currentPlayer.addEventListener("requestSeekToTime", function(event) {
        console.log("Event: " + event.type + "\ntarget: " + event.target + "\ntimestamp: " + event.timeStamp + "\ncurrent time: " + event.currentTime + "\ntime to seek to: " + event.requestedTime) ;
        return true;
    });


    /**
     * The shouldHandleStateChange is called when the user requests a state change, but before the change occurs.
     * The listener is passed an object with the following attributes:
     * - type: this attribute represents the name of the event
     * - target: this attribute represents the event target which is the player object
     * - timeStamp: this attribute represents the name of the event
     * - state: this attribute represents the state that the player will switch to, possible values: playing, paused, scanning
     * - oldState: this attribute represents the previous state of the player, possible values: playing, paused, scanning
     * - elapsedTime: this attribute represents the elapsed time, in seconds
     * - duration: this attribute represents the duration of the asset, in seconds
     * The listener must return a value:
     * - true to allow the state change
     * - false to prevent the state change
     * This event should be handled as quickly as possible because the user has already performed the action and is waiting for the application to respond.
     * @note Only a single shouldHandleStateChange listener can be active at any time. If multiple eventListeners are added for this event, only the last one will be called.
     */
    currentPlayer.addEventListener("shouldHandleStateChange", function(event) {
        console.log("Event: " + event.type + "\ntarget: " + event.target + "\ntimestamp: " + event.timeStamp + "\nold state: " + event.oldState + "\nnew state: " + event.state + "\nelapsed time: " + event.elapsedTime + "\nduration: " + event.duration);
        return true;
    });

    /**
     * The stateDidChange event is called after the player switched states.
     * The listener is passed an object with the following attributes:
     * - type: this attribute represents the name of the event
     * - target: this attribute represents the event target which is the player object
     * - timeStamp: this attribute represents the timestamp of the event
     * - state: this attribute represents the state that the player switched to
     * - oldState: this attribute represents the state that the player switched from
     */
    currentPlayer.addEventListener("stateDidChange", function(event) {
        if (event.oldState == "playing" && event.state == "end") {
          if (currentMediaURL.length) {
            console.log('delete');
            var requestXHR = new XMLHttpRequest();
            requestXHR.open("GET", currentMediaURL + '/delete', true);
            requestXHR.send();
          }
        }

        console.log("Event: " + event.type + "\ntarget: " + event.target + "\ntimestamp: " + event.timeStamp + "\noldState: " + event.oldState + "\nnew state: " + event.state);
    });

    /**
     * The stateWillChange event is called when the player is about to switch states.
     * The listener is passed an object with the following attributes:
     * - type: this attribute represents the name of the event
     * - target: this attribute represents the event target which is the player object
     * - timeStamp: this attribute represents the timestamp of the event
     * - state: this attribute represents the state that the player switched to
     * - oldState: this attribute represents the state that the player switched from
     */
    currentPlayer.addEventListener("stateWillChange", function(event) {
        console.log("Event: " + event.type + "\ntarget: " + event.target + "\ntimestamp: " + event.timeStamp + "\noldState: " + event.oldState + "\nnew state: " + event.state);
    });

    /**
     * The timeBoundaryDidCross event is called every time a particular time point is crossed during playback.
     * The listener is passed an object with the following attributes:
     * - type: this attribute represents the name of the event
     * - target: this attribute represents the event target which is the player object
     * - timeStamp: this attribute represents the timestamp of the event
     * - boundary: this attribute represents the boundary value that was crossed to trigger the event
     * When adding the listener, a third argument has to be provided as an array of numbers, each representing a time boundary as an offset from the beginning of the asset, in seconds.
     * @note This event can fire multiple times for the same time boundary as the user can scrub back and forth through the asset.
     */
    currentPlayer.addEventListener("timeBoundaryDidCross", function(event) {
        console.log("Event: " + event.type + "\ntarget: " + event.target + "\ntimestamp: " + event.timeStamp + "\nboundary: " + event.boundary);
    }, [30, 100, 150.5, 180.75]);

    /**
     * The timeDidChange event is called whenever a time interval has elapsed, this interval must be provided as the third argument when adding the listener.
     * The listener is passed an object with the following attributes:
     * - type: this attribute represents the name of the event
     * - target: this attribute represents the event target which is the player object
     * - timeStamp: this attribute represents the timestamp of the event
     * - time: this attribute represents the current playback time, in seconds.
     * - interval: this attribute represents the time interval
     * @note The interval argument should be an integer value as floating point values will be coerced to integers. If omitted, this value defaults to 1
     */
    currentPlayer.addEventListener("timeDidChange", function(event) {
        console.log("Event: " + event.type + "\ntarget: " + event.target + "\ntimestamp: " + event.timeStamp + "\ntime: " +  event.time + "\ninterval: " + event.interval);
    }, { interval: 10 });

    /**
     * The mediaItemDidChange event is called after the player switches media items.
     * The listener is passed an event object with the following attributes:
     * - type: this attribute represents the name of the event
     * - target: this attribute represents the event target which is the player object
     * - timeStamp: this attribute represents the timestamp of the event
     * - reason: this attribute represents the reason for the change; possible values are: 0 (Unknown), 1 (Played to end), 2 (Forwarded to end), 3 (Errored), 4 (Playlist changed), 5 (User initiated)
     */
    currentPlayer.addEventListener("mediaItemDidChange", function(event) {
        console.log("Event: " + event.type + "\ntarget: " + event.target + "\ntimestamp: " + event.timeStamp + "\nreason: " + event.reason);
    });

   /**
     * The mediaItemWillChange event is when the player is about to switch media items.
     * The listener is passed an event object with the following attributes:
     * - type: this attribute represents the name of the event
     * - target: this attribute represents the event target which is the player object
     * - timeStamp: this attribute represents the timestamp of the event
     * - reason: this attribute represents the reason for the change; possible values are: 0 (Unknown), 1 (Played to end), 2 (Forwarded to end), 3 (Errored), 4 (Playlist changed), 5 (User initiated)
     */
    currentPlayer.addEventListener("mediaItemWillChange", function(event) {
        console.log("Event: " + event.type + "\ntarget: " + event.target + "\ntimestamp: " + event.timeStamp + "\nreason: " + event.reason);
    });
}

var Presenter = {

    /**
     * @description This function demonstrate the default way of present a document. 
     * The document can be presented on screen by adding to to the documents array
     * of the navigationDocument. The navigationDocument allows you to manipulate
     * the documents array with the pushDocument, popDocument, replaceDocument, and
     * removeDocument functions. 
     *
     * You can replace an existing document in the navigationDocumetn array by calling 
     * the replaceDocument function of navigationDocument. replaceDocument requires two
     * arguments: the new document, the old document.
     * @param {Document} xml - The XML document to push on the stack
     */
    defaultPresenter: function(xml) {

        /*
        If a loading indicator is visible, we replace it with our document, otherwise 
        we push the document on the stack
        */
        if(this.loadingIndicatorVisible) {
            navigationDocument.replaceDocument(xml, this.loadingIndicator);
            this.loadingIndicatorVisible = false;
        } else {
            navigationDocument.pushDocument(xml);
        }
    },

    /**
     * @description Extends the default presenter functionality and registers
     * the onTextChange handler to allow for a search implementation
     * @param {Document} xml - The XML document to push on the stack
     */
    searchPresenter: function(xml) {

        this.defaultPresenter.call(this, xml);
        var doc = xml;

        var searchField = doc.getElementsByTagName("searchField").item(0);
        var keyboard = searchField.getFeature("Keyboard");

        keyboard.onTextChange = function() {
            var searchText = keyboard.text;
            console.log('search text changed: ' + searchText);
            buildResults(doc, searchText);
        }
    },    

    /**
     * @description This function demonstrates the presentation of documents as modals.
     * You can present and manage a document in a modal view by using the pushModal() and
     * removeModal() functions. Only a single document may be presented as a modal at
     * any given time. Documents presented in the modal view are presented in fullscreen
     * with a semi-transparent background that blurs the document below it.
     *
     * @param {Document} xml - The XML document to present as modal
     */
    modalDialogPresenter: function(xml) {
        navigationDocument.presentModal(xml);
    },

    /**
     * @description This function demonstrates how to present documents within a menu bar.
     * Each item in the menu bar can have a single document associated with it. To associate
     * document to you an item you use the MenuBarDocument feature.
     *
     * Menu bar elements have a MenuBarDocument feature that stores the document associated
     * with a menu bar element. In JavaScript you access the MenuBarDocument by invoking the 
     * getFeature function on the menuBar element. 
     *
     * A feature in TVMLKit is a construct for attaching extended capabilities to an
     * element. See the TVMLKit documentation for information on elements with available
     * features.
     *
     * @param {Document} xml - The XML document to associate with a menu bar element
     * @param {Element} ele - The currently selected item element
     */
    menuBarItemPresenter: function(xml, ele) {
        /*
        To get the menu bar's 'MenuBarDocument' feature, we move up the DOM Node tree using
        the parentNode property. This allows us to access the the menuBar element from the 
        current item element.
        */
        var feature = ele.parentNode.getFeature("MenuBarDocument");

        if (feature) {
            /*
            To retrieve the document associated with the menu bar element, if one has been 
            set, you call the getDocument function the MenuBarDocument feature. The function
            takes one argument, the item element.
            */
            var currentDoc = feature.getDocument(ele);
            /*
            To present a document within the menu bar, you need to associate it with the 
            menu bar item. This is accomplished by call the setDocument function on MenuBarDocument
            feature. The function takes two argument, the document to be presented and item it 
            should be associated with.

            In this implementation we are only associating a document once per menu bar item. You can 
            associate a document each time the item is selected, or you can associate documents with 
            all the menu bar items before the menu bar is presented. You will need to experimet here
            to balance document presentation times with updating the document items.
            */
            if (!currentDoc) {
                feature.setDocument(xml, ele);
            }
        }
    },

    /**
     * @description This function handles the select event and invokes the appropriate presentation method.
     * This is only one way to implent a system for presenting documents. You should determine
     * the best system for your application and data model.
     *
     * @param {Event} event - The select event
     */
    load: function(event) {
        console.log(event);

        var self = this,
            ele = event.target,
            templateURL = ele.getAttribute("template"),
            mediaURL = ele.getAttribute("media"),
            presentation = ele.getAttribute("presentation");

        /*
        Check if the selected element has a 'template' attribute. If it does then we begin
        the process to present the template to the user.
        */
        if (templateURL) {
            /*
            Whenever a user action is taken you need to visually indicate to the user that
            you are processing their action. When a users action indicates that a new document
            should be presented you should first present a loadingIndicator. This will provide
            the user feedback if the app is taking a long time loading the data or the next 
            document.
            */
            self.showLoadingIndicator(presentation);

            /* 
            Here we are retrieving the template listed in the templateURL property.
            */
            resourceLoader.loadResource(templateURL,
                function(resource) {
                    if (resource) {
                        /*
                        The XML template must be turned into a DOMDocument in order to be 
                        presented to the user. See the implementation of makeDocument below.
                        */
                        var doc = self.makeDocument(resource);
                        
                        /*
                        Event listeners are used to handle and process user actions or events. Listeners
                        can be added to the document or to each element. Events are bubbled up through the
                        DOM heirarchy and can be handled or cancelled at at any point.

                        Listeners can be added before or after the document has been presented.

                        For a complete list of available events, see the TVMLKit DOM Documentation.
                        */
                        doc.addEventListener("select", self.load.bind(self));
                        doc.addEventListener("highlight", self.load.bind(self));


                        /*
                        This is a convenience implementation for choosing the appropriate method to 
                        present the document. 
                        */
                        if (self[presentation] instanceof Function) {
                            self[presentation].call(self, doc, ele);
                        } else {
                            self.defaultPresenter.call(self, doc);
                        }
                    }
                }
            );
        } else if (mediaURL) {
          currentMediaURL = mediaURL;

          var player = new Player();
          player.playlist = new Playlist();

          var video = new MediaItem('video', mediaURL);
          player.playlist.push(video);

          setPlaybackEventListeners(player);
          player.play();
        }
    },

    /**
     * @description This function creates a XML document from the contents of a template file.
     * In this example we are utilizing the DOMParser to transform the Index template from a 
     * string representation into a DOMDocument.
     *
     * @param {String} resource - The contents of the template file
     * @return {Document} - XML Document
     */
    makeDocument: function(resource) {
        if (!Presenter.parser) {
            Presenter.parser = new DOMParser();
        }

        var doc = Presenter.parser.parseFromString(resource, "application/xml");
        return doc;
    },

    /**
     * @description This function handles the display of loading indicators.
     *
     * @param {String} presentation - The presentation function name
     */
    showLoadingIndicator: function(presentation) {
        /*
        You can reuse documents that have previously been created. In this implementation
        we check to see if a loadingIndicator document has already been created. If it 
        hasn't then we create one.
        */
        if (!this.loadingIndicator) {
            this.loadingIndicator = this.makeDocument(this.loadingTemplate);
        }
        
        /* 
        Only show the indicator if one isn't already visible and we aren't presenting a modal.
        */
        if (!this.loadingIndicatorVisible && presentation != "modalDialogPresenter" && presentation != "menuBarItemPresenter") {
            navigationDocument.pushDocument(this.loadingIndicator);
            this.loadingIndicatorVisible = true;
        }
    },

    /**
     * @description This function handles the removal of loading indicators.
     * If a loading indicator is visible, it removes it from the stack and sets the loadingIndicatorVisible attribute to false.
     */
    removeLoadingIndicator: function() {
        if (this.loadingIndicatorVisible) {
            navigationDocument.removeDocument(this.loadingIndicator);
            this.loadingIndicatorVisible = false;
        }
    },

    /**
     * @description Instead of a loading a template from the server, it can stored in a property 
     * or variable for convenience. This is generally employed for templates that can be reused and
     * aren't going to change often, like a loadingIndicator.
     */
    loadingTemplate: `<?xml version="1.0" encoding="UTF-8" ?>
        <document>
          <loadingTemplate>
            <activityIndicator>
              <text>Loading...</text>
            </activityIndicator>
          </loadingTemplate>
        </document>`
}
