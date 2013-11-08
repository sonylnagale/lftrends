(function() {
	var normalizedata = function(data) {
		var rawdata = [];
		
		// throw out empty datapoints
		for (var i = 0; i < data.length; ++i) {
			if (data[i][0] != 0) {
				rawdata.push({
					x: new Date(data[i][1] * 1000),
					y: data[i][0]
				});
			}
		}
		
		return rawdata;
	};
	
	var baseURL = "http://bootstrap.client-solutions.fyre.co/api/v3.0/stats.collections.curate/{rule}.json";
	
	var rules = 
		             {
						"site": "333682",
						"type": 2, // Twitter
						"all": "MzMzNjgyOnNuLTEzODM3ODg3NzMwMjU7MnwzMzM2ODI6c24tMTM4Mzc5OTcyNjE0NTsyfDMzMzY4Mjpzbi0xMzgzNzk5ODI5NDg1OzJ8MzMzNjgyOnNuLTEzODM4ODQ0NzM4NzI7Mg==",
			
		            	 "sfo": {
		            		 id: 'sn-1383788773025',
			            	 raw: '333682:sn-1383788773025;2',
			            	 encoded: 'MzMzNjgyOnNuLTEzODM3ODg3NzMwMjU7Mg=='
			             },
			             
			             "nyc": {
			            	 id: 'sn-1383799726145',
			            	 raw: '333682:sn-1383799726145;2',
			            	 encoded: 'MzMzNjgyOnNuLTEzODM3OTk3MjYxNDU7Mg=='
			             },
			             
			             "lax": {
			            	 id: 'sn-1383799829485',
			            	 raw: '333682:sn-1383799829485;2',
			            	 encoded: "MzMzNjgyOnNuLTEzODM3OTk4Mjk0ODU7Mg=="
			             },
			             
			             "ord": {
			            	 id: 'sn-1383884473872',
			            	 raw: '333682:sn-1383884473872;2',
			            	 encoded: ''
			             }
		             };
	
	var sitedata = {
	            	"sn-1383788773025": {
	            		title: '#sfo',
	            		data: []
	            	},
	            	
	            	"sn-1383799726145": {
	            		title: '#nyc',
	            		data: []
	            	},
	            	
	            	"sn-1383799829485" : {
	            		title: '#lax',
	            		data:[]
	            	},
	            	
	            	"sn-1383884473872": {
	            		title: '#ord'
	            	}
			};
		
	var getdata = function(from,callback) {
		$.ajax({
			url: baseURL.replace('{rule}',rules.all) + from,
			jsonp: true
		}).done(function(data) {
			var collections = Object.keys(data.data[rules.site]);

			for (var i = 0; i < collections.length; ++i) {
				sitedata[collections[i]].data = normalizedata(data.data[rules.site][collections[i]]["2"]);
			}
			
			if (callback) {
				callback();
			}
			
		});
	};
	var chart;

	var updatechart = function() {
		chart.series.setData([{
            name: '#sfo',
            	data: sitedata["sn-1383788773025"].data
        	},
        	{
        		name: '#nyc',
                data: sitedata["sn-1383799726145"].data
        	},
        	{
                name: '#lax',
                data: sitedata["sn-1383799829485"].data
        	},
        	,
        	{
                name: '#ord',
                data: sitedata["sn-1383884473872"].data
        	},
        
        
        ], true);
	};
	
	var makechart = function() {
        $('#container').highcharts({
            chart: {
                type: 'spline',
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
                events: {
                    load: function() {
    
                        // set up the updating of the chart each second
                        var series = this.series[0];
//                        setInterval(function() {
////                            var x = (new Date()).getTime(), // current time
////                                y = Math.random();
////                            series.addPoint([x, y], true, true);
//                        	
//                        	getdata('?from=-5s',updatechart);
//                        }, 5000);
                    }
                }
            },
            title: {
                text: '#SFO, #LAX, #ORD, or #NYC??'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                title: {
                    text: 'Value'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function() {
                        return '<b>'+ this.series.name +'</b><br/>'+
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>'+
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                	name: '#sfo',
                	data: sitedata["sn-1383788773025"].data
            	},
            	{
            		name: '#nyc',
	                data: sitedata["sn-1383799726145"].data
            	},
            	{
	                name: '#lax',
	                data: sitedata["sn-1383799829485"].data
            	},
            	{
	                name: '#ord',
	                data: sitedata["sn-1383884473872"].data
            	}
            ]
        });
	};
	
	
	getdata('',makechart);
	
//	console.log();
	
	// chart
	

	    $(document).ready(function() {
	        Highcharts.setOptions({
	            global: {
	                useUTC: false
	            }
	        });
	    });
	    
	        
}());