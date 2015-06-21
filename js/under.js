window._ = {
	dom: {
		get: function(id) {
			return document.getElementById(id);
		},
		create: function(tag) {
			return document.createElement(tag);
		},
		addClass: function(elem, className) {
			var classes = elem.classList;
			if (!classes.contains(className))
				classes.add(className)
			//return this;
		},
		removeClass: function(elem, className) {
			var classes = elem.classList;
			if (classes.contains(className))
				classes.remove(className)
			//return this;
		},
		hasClass: function(elem, className) {
			return elem.classList.contains(className)
		},
	},
	addClass: function(id, className) {
		var classes = this.dom.get(id).classList;
		if (!classes.contains(className))
			classes.add(className)
	},
	removeClass: function(id, className) {
		var classes = this.dom.get(id).classList;
		if (classes.contains(className))
			classes.remove(className)
	},
	hasClass: function(id, className) {
		return this.dom.get(id).classList.contains(className)
	},
	show: function(id) {
		this.addClass(id, 'hidden')
	},
	hide: function(id) {
		this.removeClass(id, 'hidden')
	},
	fade: function() {
		
	},
	ajax: function(url, opts, done) {
		function getXmlHttp() {
		  var xmlhttp;
		  try {
			xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
		  } catch (e) {
			try {
			  xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (E) {
			  xmlhttp = false;
			}
		  }
		  if (!xmlhttp && typeof XMLHttpRequest!='undefined')
			xmlhttp = new XMLHttpRequest();
		  return xmlhttp;
		}
		var xmlhttp = getXmlHttp();
		if (opts) {
			if (opts.getJSON)
				xmlhttp.overrideMimeType("application/json")
		}
		xmlhttp.open('GET', url, false);
		xmlhttp.send(null);
		if(xmlhttp.status == 200)
		  done(xmlhttp.responseText);
	}
};