define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dijit/_TemplatedMixin",
    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/event",

    "VPSVideoJS/lib/video", 
    "VPSVideoJS/lib/Youtube",
    "VPSVideoJS/lib/Vimeo",
    "dojo/text!VPSVideoJS/widget/template/VPSVideoJS.html",

], function (declare, _WidgetBase, _TemplatedMixin, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoArray, lang, dojoText, dojoHtml, dojoEvent, video, Youtube, Vimeo, widgetTemplate) {
    "use strict";

    return declare("VPSVideoJS.widget.VPSVideoJS", [ _WidgetBase, _TemplatedMixin ], {

        templateString: widgetTemplate,


        widgetBase: null,

        // DOM elements
        videoNode: null,

        // Parameters configured in the Modeler.
        videoURL: "",
        videoType: "",

        // Internal variables.
        _handles: null,
        _contextObj: null,
        _player: null,

        constructor: function () {
            logger.debug(this.id + ".constructor");
            this._handles = [];
        },

        postCreate: function () {
            logger.debug(this.id + ".postCreate");
            mxui.dom.addCss(require.toUrl("VPSVideoJS/lib/video-js.min.css"));

            var options = {};
    
            this._player = video('my-player', options);
            video.registerTech('Vimeo', Vimeo);
        },

        update: function (obj, callback) {
            logger.debug(this.id + ".update");

            this._contextObj = obj;
            this._player = video('my-player');
            this._updateRendering(callback);
        },

        resize: function (box) {
            logger.debug(this.id + ".resize");
        },

        uninitialize: function () {
            this._player.dispose();
            logger.debug(this.id + ".uninitialize");
        },

        _updateRendering: function (callback) {
            logger.debug(this.id + "._updateRendering");

            if (this._contextObj !== null) {
                dojoStyle.set(this.domNode, "display", "block");

                try {
                    var vidURL = this._contextObj.get(this.videoURL);
                    var vidType = "video/".concat(this._contextObj.get(this.videoType));
                    var vidSrc = {type: vidType, src: vidURL};

                    logger.debug("video source = " + JSON.stringify(vidSrc));

                    this._player.src(vidSrc);
                }
                catch(err) {
                    logger.debug(err.message);
                }
            } else {
                dojoStyle.set(this.domNode, "display", "none");
            }

            this._executeCallback(callback, "_updateRendering");
        },

        // Shorthand for running a microflow
        // _execMf: function (mf, guid, cb) {
        //     logger.debug(this.id + "._execMf");
        //     if (mf && guid) {
        //         mx.ui.action(mf, {
        //             params: {
        //                 applyto: "selection",
        //                 guids: [guid]
        //             },
        //             callback: lang.hitch(this, function (objs) {
        //                 if (cb && typeof cb === "function") {
        //                     cb(objs);
        //                 }
        //             }),
        //             error: function (error) {
        //                 console.debug(error.description);
        //             }
        //         }, this);
        //     }
        // },

        // Shorthand for executing a callback, adds logging to your inspector
        _executeCallback: function (cb, from) {
            logger.debug(this.id + "._executeCallback" + (from ? " from " + from : ""));
            if (cb && typeof cb === "function") {
                cb();
            }
        }
    });
});

require(['VPSVideoJS/widget/VPSVideoJS']);

