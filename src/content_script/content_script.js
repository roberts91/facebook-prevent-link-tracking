'use strict';

$(document).ready(function() {
	var intervalTime = fbplt_intervalTime();
	if ( fbplt_shouldDebug() ) console.log('Start to look for links, iterating every ' + intervalTime + ' millisecond');
	setInterval(function () {
		fbplt_lookForOutboundLinks();
	}, intervalTime);
});

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

	if ( ! url ) return url;

	// Remove the fbclid-parmeter from the URL
	var regex = new RegExp(/\?(.*)(fbclid=[^&]*)(.*)/, 'i');
	url = url.replace(regex, '?$1$3');

	// Quick fix in some cases, would not been necessary if by regex skills were better
	url = url.replace('?&', '?');
	url = url.replace('&&', '&');

	// Remove trailing ?
	var regex = new RegExp(/(\?)$/, 'i');
	url = url.replace(regex, '');

	// Remove trailing &
	var regex = new RegExp(/(\&)$/, 'i');
	url = url.replace(regex, '');

	return url;
};

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
 * Look for outbound links and convert them to regular links (without Facebook-tracking).
 */
var fbplt_lookForOutboundLinks = function () {

	// Replace links that already has Facebook tracking URL
	var links = $('a[href^="https://l.facebook.com"]');
	if ( links.length > 0 && fbplt_shouldDebug() ) console.log('Found ' + links.length + ' external facebook track links to correct.')
	links.each(function() {
		var obj = $(this),
			url = obj.attr('href'),
			params = fbplt_getParams(url),
			u = typeof params.u !== 'undefined' ? params.u : false, // Attempt to extract the original URL
			u = fbplt_removeFacebookClickIdentifier(u);
		if ( u ) {
			if ( fbplt_shouldDebug() ) console.log('Removed tracking from external facebook track link ' + u);
			obj.attr('href', u);
		}
	});

	// Replace outbound links with a new element so that the URL swap does not happen when clicking on element
	var externalLinks = $('a:not([href^="https://www.facebook.com"]):not([href^="https://facebook.com"])[href^="http"]:not(.fbplt-fixed)');
	if ( externalLinks.length > 0 && fbplt_shouldDebug() ) console.log('Found ' + externalLinks.length + ' external links to correct.')
	externalLinks.each(function() {
		var obj = $(this),
			newObject = this.cloneNode(true),
			newObjectJquery = $(newObject),
			url = obj.attr('href'),
			replacedUrl = fbplt_removeFacebookClickIdentifier(url);
		if ( fbplt_shouldDebug() ) console.log('Removed tracking from external link ' + url);
		newObjectJquery.addClass('fbplt-fixed');
		obj.replaceWith(newObject);
		if ( replacedUrl ) {
			newObjectJquery.attr('href', replacedUrl);
		}
	});
}
