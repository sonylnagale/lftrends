/**
 * lftrends
 * 
 * Graphs. Graphs. Graphs. Oh my god, graphs.
 * Use Social Counter API to graph trends over time
 * 
 * @todo see if we already have a base64 encoder tool instead of using https://github.com/carlo/jquery-base64
 * @see https://github.com/Livefyre/livefyre-docs/wiki/Social-Counter-API
 * @author Sonyl Nagale <sonyl@livefyre.com>
 * @version 0.1
 */

/**
 * @constructor
 * @param {Object} opts Object of options
 * @todo make options into its own class thing
 */
var lftrends = function(opts) {
	/** @default */
	var defaults = {
		network: "client-solutions.fyre.co",
		version: "3.0",
		resource: "http://bootstrap.{network}/api/v{version}/stats.collections.curate/{query}.json",
		initialFrom: null,
		subsequentFrom: "-15s",
		initialUntil: null,
		subsequentUntil: null,
		rules: [],
		type: "OR",
		interval: 5000,
		container: "container"
	};
		
	this.opts = opts || {};
	
	this.opts = $.extend(defaults,opts);

	this.updateCount = 0;
	this.chart;

	this._draw();
	
};

/**
 * @private
 * Constructs Base64 query to be used by API
 * @see https://github.com/Livefyre/livefyre-docs/wiki/Social-Counter-API#resource
 * 
 * @return {String} query 
 */
lftrends.prototype._constructQuery = function() {
	var query = '';
	var delimeter = (this.opts.type == 'OR') ? '|' : ',';
	
	for (var i = 0; i < this.opts.rules.length; ++i) {
		var rule = this.opts.rules[i];
		query += rule.site + ':' + rule.articleId + ';' + rule.rule;
		if (i < this.opts.rules.length - 1) {
			query += delimeter;
		}
	}
	
	query = $.base64.encode(query);
	
	return query;
};

/**
 * @private
 * Uses _constructQuery and member options to construct the API URL
 */
lftrends.prototype._constructResource = function() {
	this.opts.resource = this.opts.resource.replace('{network}',this.opts.network);
	this.opts.resource = this.opts.resource.replace('{version}',this.opts.version);
	this.opts.resource = this.opts.resource.replace('{query}',this._constructQuery());
};

/**
 * @private
 * Makes the requests to the API and uses other helpers to massage the data
 */
lftrends.prototype._request = function() {
	var url = this.opts.resource, 
		delimeter = '?', 
		from = (this.updateCount == 0) ? this.opts.initialFrom : this.opts.subsequentFrom,
		until = (this.updateCount == 0) ? this.opts.initialUntil : this.opts.subsequentUntil;	
	
	
	if (from != null) {
		url += delimeter + 'from=' + from;
		delimeter = '&';
	}
	
	if (until != null) {
		url += delimeter + 'until' + until;
	}
		
	$.ajax({
        url: url,
        jsonp: true,
        success: $.proxy(function(data) {
        	this._constructSeries(this._processData(data));
//        	setTimeout($.proxy(function() { this._request();},this), this.opts.interval);
        },this),
        cache: false
    });
};

/**
 * @private
 * Preprocesses data returned from Social Counter before being used for the chart
 * @param {Object} data Data from _request()
 * @return {Object} collections All the, erm, data?
 */ 
lftrends.prototype._processData = function(data) {
	
	// exit if it failed. Let's keep it quiet for now
	if (data.code != "200") {
		return;
	}
	
	var collections = {};
	
	// get them all together into one object
	for (var site in data.data) {
		if (data.data.hasOwnProperty(site)) {			
			collections = $.extend(collections,data.data[site]);
		}
	}
	
	// this feels really stupid and expensive. Need to find a better way
	// I probably want to change the structure of the rules array to an object or something
	for (var i = 0; i < this.opts.rules.length; ++i) {
		collections[this.opts.rules[i].articleId].title = this.opts.rules[i].name;
	}
	
	return collections;
};

/**
 * @private
 * Take the data after _processData() and format it into a nice series that Highcharts likes
 * @param {Object} data Data from _processData()
 */
lftrends.prototype._constructSeries = function(data) {
	for (var i = 0; i < this.chart.series.length; ++i) {
		
		// ok, let's do even MORE stupid iterating *cries*
		// I'm starting to doubt my sanity
		for (var collection in data) {
			if (this.chart.series[i].name == data[collection].title) {
				var match = collection;
			} 
		}
		var datapoints = data[match]["2"]; // hardcode "2" for now

		// this loop we actually need. we're going to toss out all the 0 datapoints
		var processedDataPoints = [];
		for (var j = 0; j < datapoints.length; ++j) {
			if (datapoints[j][0] != 0) {
				var point = {
					x: new Date(datapoints[j][1] * 1000), // take our unix timestamp and make a pretty date
					y: datapoints[j][0]
				};
				this.chart.series[i].addPoint(point, false, false);
				processedDataPoints.push(point);
			}
		}

		// now, if there was no new data, let's just add a continuity line
		if (processedDataPoints.length == 0) {
			var currentseries = this.chart.series[i];

			var point = {
				x: new Date(),
				y: currentseries.data[currentseries.data.length - 1].y,
				marker: {
					enabled: false
				}
			};
			currentseries.addPoint(point, false, false);
		}
	}
	
	// now, add the points. We hope.
	this.chart.redraw();
	this.updateCount++;
};


/**
 * @private
 * Initial draw of the chart
 */
lftrends.prototype._draw = function() {
	this._constructResource();

	// this also seems like a bad idea
	var series = [];
	for (var i = 0; i < this.opts.rules.length; ++i) {
		var sery = { // yes I know sery isn't a word, hush.
			name: this.opts.rules[i].name,
			data: []
		};
		series.push(sery);
	}
	
	Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });
	
	this.chart = new Highcharts.Chart({
        chart: {
            renderTo: this.opts.container,
            defaultSeriesType: 'spline',
            events: {
                load: this._request()
            },
            animation: {
            	duration: this.opts.interval,
            	easing: 'linear'
            }
        },
        title: {
            text: 'Data!'
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150,
            maxZoom: 20 * 1000
        },
        yAxis: {
            minPadding: 0.2,
            maxPadding: 0.2,
            title: {
                text: 'Value',
                margin: 80
            }
        },
        series: series
    });        
};
