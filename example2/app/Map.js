define([
	"dojo/_base/declare",
	"dojo/parser", 
	"dojo/ready",
	"dojo/_base/lang",
	"dojo/Evented",
	"dijit/_WidgetBase", 
	"app/config",
	"esri/arcgis/utils",
    "esri/geometry/Circle", 
    "esri/symbols/SimpleFillSymbol", 
    "esri/graphic"
], function(declare, parser, ready, lang, Evented, _WidgetBase, config, arcgisUtils, Circle, SimpleFillSymbol, Graphic){
        return declare([_WidgetBase, Evented], {
        	// Properties
        	map: null,
        	srcNodeRef: null,
        	symbol: new SimpleFillSymbol().setColor(null).outline.setColor("blue"),
        	
            /*
             * Creates an instance of the map
             */
            constructor: function(params, srcNodeRef) {
            	this.srcNodeRef = srcNodeRef;
            },
            
            /*
             * Handler called once the layout has been created
             */
            postCreate: function() {
            	var info, options;
            	
            	// Call the base class methods
            	this.inherited(arguments);    

				// Create our map
				this.init();
            },
            
            /*
             * Creates the map
             */
            init: function() {
            	var options = {
            		ignorePopups: true,
            		mapOptions: {
            			basemap: config.basemap
            		}            		
            	};
            	
				// Create the map
				arcgisUtils.createMap(config.webmapId, this.srcNodeRef, options).then(lang.hitch(this, function(response) {
					this.map = response.map;
					
					this.own(this.map.on("click", lang.hitch(this, this.drawCircle)));
					
					// Publish load event
					this.emit("load", { map: response.map });
				}));
			},

            /*
             * Draw a circle on the map
             */			
			drawCircle: function(e) {
				var circle, radius, map = this.map;
					
				// Clear existing grahics
		    	map.graphics.clear();
		    	
		    	radius = map.extent.getWidth() / 10;
          		circle = new Circle({
            		center: e.mapPoint,
            		radius: radius
          		});
          		
          		map.graphics.add(new Graphic(circle, this.symbol));
			}
        });
        
        ready(function(){
        	parser.parse();
    	});
	}
);