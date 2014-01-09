<?php
	$article = $_REQUEST['subject'];
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Map Demo</title>
<!-- streamhub-map depends on streamhub-sdk. Ensure it's been included in your page. v 2.2.0-->
<script src="http://livefyre-cdn.s3.amazonaws.com/libs/sdk/v2.5.1/builds/333/streamhub-sdk.min.js"></script>

<!-- Include streamhub-map too. 0.2.6, updated 12/12/2013-->
<script src="http://cdn.livefyre.com/libs/apps/cheung31/streamhub-map/v0.2.6-build.14/streamhub-map.min.js"></script>

<!-- Optionally, include some reasonable default CSS rules for StreamHub Content. This stylesheet is provided by the StreamHub SDK. -->
<link rel="stylesheet" href="http://cdn.livefyre.com/libs/sdk/v2.2.0/streamhub-sdk.min.css" /></link>
</head>
<body>
	<div id="lf_map"></div>
<script>
var collections = {
		'snow': { 
			siteId: '333682',
			articleId: 'sn-1389203378710'
		},
		'cold': {
			siteId: '333682', 
	        articleId: 'sn-1389203417469'
		},
		'winter': {
			siteId: '333682', 
		    articleId: 'sn-1389203732013'
		}
}


Livefyre.require(['streamhub-sdk/collection','streamhub-map/content/content-map-view'], function(Collection,ContentMapView){
    var collection = new Collection({
        network: "client-solutions.fyre.co",
        siteId: 333682,
        articleId: collections.<?php echo $article; ?>.articleId
    });
    var view = new ContentMapView({
        el: document.getElementById("lf_map"),
        initial: 300, //not supported in this version of ContentMapView
        showMore: 25 //not supported in this version of ContentMapView
    });
    collection.pipe(view);
})

</script>

</body>
</html>