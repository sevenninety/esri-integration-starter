define([
    "dojo/_base/declare",
    "dojo/parser",
    "dojo/ready",
    "dojo/_base/lang",
    "dojo/Evented",
    "dijit/_WidgetBase",
    "app/config",
    "esri/views/MapView",
    "esri/WebMap",
    "esri/geometry/Circle",
    "esri/Graphic"
], function(declare, parser, ready, lang, Evented, _WidgetBase, config, MapView, WebMap, Circle, Graphic) {
    return declare([_WidgetBase, Evented], {
        // Properties
        view: null,
        srcNodeRef: null,
        symbol: (symbol = {
            type: "simple-fill",
            style: "solid",
            outline: {
                color: "blue",
                width: 1
            }
        }),

        /**
         * Creates an instance of the map
         */
        constructor: function(params, srcNodeRef) {
            this.srcNodeRef = srcNodeRef;
        },

        /**
         * Handler called once the layout has been created
         */
        postCreate: function() {
            // Call the base class methods
            this.inherited(arguments);

            // Create our map
            this.init();
        },

        /**
         * Creates the map
         */
        init: function() {
            var webmap = new WebMap({
                portalItem: {
                    id: config.webmapId
                }
            });

            this.view = new MapView({
                map: webmap,
                container: "esri-map"
            });

            this.view.when(
                lang.hitch(this, function() {
                    this.own(this.view.on("click", lang.hitch(this, this.drawCircle)));

                    // Publish load event
                    this.emit("load", { view: this.view });
                })
            );
        },

        drawCircle: function(e) {
            var circle,
                radius,
                view = this.view;

            // Clear existing graphics
            view.graphics.removeAll();

            radius = view.extent.width / 20;
            circle = new Circle({
                center: e.mapPoint,
                radius: radius
            });

            view.graphics.add(new Graphic(circle, this.symbol));
        },

        showExtent: function() {
            var extent = this.view.extent;
            alert(extent.xmin + " " + extent.ymin + extent.xmax + " " + extent.ymax);
        }
    });

    ready(function() {
        parser.parse();
    });
});
