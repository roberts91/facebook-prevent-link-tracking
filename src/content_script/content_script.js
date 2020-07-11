'use strict';

$(document).ready(function() {
	var intervalTime = fbplt_intervalTime();
	if ( fbplt_shouldDebug() ) console.log('Start to look for links, iterating every ' + intervalTime + ' millisecond');
	setInterval(function () {
		fbplt_lookForOutboundLinks();
	}, intervalTime);
});

/**
 * Get the URL parameters.
 *
 * @param  {String} url The URL
 * @return {Object}     The URL parameters
 */
var fbplt_getParams = function (url) {
	var params = {};
	var parser = document.createElement('a');
	parser.href = url;
	var query = parser.search.substring(1);
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		params[pair[0]] = decodeURIComponent(pair[1]);
	}
	return params;
};

/**
 * Define the interval time used when looking for links to correct.
 *
 * @returns {number}
 */
var fbplt_intervalTime = function () {
	return 250;
};

/**
 * Whether we should debug to console or not.
 *
 * @returns {boolean}
 */
var fbplt_shouldDebug = function () {
	return false;
};

/**
 * Remove the Facebook Click Indentifier parameter from the URL.
 *
 * @param url
 * @returns {*}
 */
var fbplt_removeFacebookClickIdentifier = function (url) {

	var regex = new RegExp(/\?(.*)(fbclid=[^&]*)(.*)/, 'i');
	url = url.replace(regex, '?$1$3');

	url = url.replace('?&', '?'); // Quick fix in some cases
	url = url.replace('&&', '&'); // Quick fix in some cases

	var regex = new RegExp(/(\?)$/, 'i');
	url = url.replace(regex, '');

	return url;
};

/**
 * Look for outbound links and convert them to regular links (without Facebook-tracking).
 */
var fbplt_lookForOutboundLinks = function () {
	var links = $('a[href^="https://l.facebook.com"]');
	if ( links.length > 0 && fbplt_shouldDebug() ) console.log('Found ' + links.length + ' links to correct.')
	links.each(function() {
		var obj = $(this),
			href = obj.attr('href'),
			params = fbplt_getParams(href),
			u = typeof params.u !== 'undefined' ? params.u : false,
			u = fbplt_removeFacebookClickIdentifier(u);
		if ( u ) {
			if ( fbplt_shouldDebug() ) console.log('Removed tracking from link ' + u);
			obj.attr('href', u);
		}
	});
}
