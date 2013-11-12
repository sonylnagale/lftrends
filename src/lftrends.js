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
		subsequentFrom: "-5s",
		initialUntil: null,
		subsequentUntil: null,
		rules: [],
		type: "OR",
		interval: 5000,
		container: "container"
	};
		
	this.opts = opts || {};
	
	this.opts = $.extend(defaults,opts);

	var updateCount = 0, query = this._constructQuery(), chart;

	this._constructResource();
	
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
	console.log(this.opts.resource);
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
		url += delimeter + 'from=' + this.opts.initialFrom;
		delimeter = '&';
	}
	
	if (until != null) {
		url += delimeter + 'until' + this.opts.initialUntil;
	}
	
	$.ajax({
        url: url,
        success: function(data) {
        	data = this._processData(data);
        	
        	
        	/*
            var series = this.chart.series[0],
                shift = series.data.length > 100; // shift if the series is longer than 20

            // add the point
            chart.series[0].addPoint(point, true, shift);
            
            // call it again after one second
            setTimeout(requestData, 1000);    */
        },
        cache: false
    });
};

/**
 * @private
 * Preprocesses data returned from Social Counter before being used for the chart
 * @param {Object} data Data from _request()
 */ 
lftrends.prototype._processData = function(data) {
	
	// exit if it failed. Let's keep it quiet for now
	if (data.code != "200") {
		return;
	}
	
	
	
	
};