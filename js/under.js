/**
*  Under.js - mini JS library
**/


if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(obj, start) {
    	for (var i = (start || 0), j = this.length; i < j; i++)
			if (this[i] === obj)
				return i;
		return -1;
	};
}

function _(e) {
	return new _.wrapper(e);
}
_.wrapper = function (e) {
	if (e.nodeType) {
		this[0] = e;
		return this;
    }
    var elem = document.getElementById(e);
    return _(elem);
};
_.ajax = function(url, done) {
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
	xmlhttp.open('GET', url, false);
	xmlhttp.send(null);
	if(xmlhttp.status == 200)
	  done(xmlhttp.responseText);
};
_.create = function(tag) {
	return _(document.createElement(tag));
};
_.formats = {
	pre: function(text) {
		var arr = text.split('\r\n');
		for (var i = 0; i < arr.length; i++)
			arr[i] = ['<span>', arr[i], '</span>'].join('');
		return arr.join('');
	},
	dateAgo: function(date) {
		var delta = new Date(new Date().getTime() - date * 1000),
			year = delta.getFullYear() - 1970,
			month = delta.getMonth(),
			day = delta.getDate(),
			hour = delta.getHours(),
			min = delta.getMinutes(),
			sec = delta.getSeconds();
		function _addS(text, num) {
			return [text, num > 1 ? 's' : ''].join('')  
		}
		if (year)
			return [year, _addS('year', year), 'ago'].join(' ');
		if (month)
			return [month, _addS('month', month), 'ago'].join(' ');
		if (day)
			return [day, _addS('day', day), 'ago'].join(' ');
		if (hour)
			return [hour, _addS('hour', hour), 'ago'].join(' ');
		if (min)
			return [min, _addS('min', min), 'ago'].join(' ');
		if (sec)
			return [sec, _addS('sec', min), 'ago'].join(' ');
		
	},
	dateNum: function(date) {
		var dateObj = new Date(date * 1000);
		function _add0(num) {
			return num < 10 ? '0' + num : num;
		}
		return [_add0(dateObj.getDate()), _add0(dateObj.getMonth() + 1), dateObj.getFullYear()].join('-');
	},
	date: function(date) {
		var dateObj = new Date(date * 1000),
			monthArr = [
				'January',
				'February',
				'March',
				'April',
				'May',
				'June',
				'July',
				'August',
				'September',
				'October',
				'November',
				'December'
			];
		function _addEnds(n) {
			var end = 'th';
			if (n >= 11 && n <= 13)
				end = 'th';
			switch (n % 10) {
				case 1:
					end = 'st';
				break;
				case 2:
					end = 'nd';
				break;
				case 3:
					end = 'rd';
				break;
			}
			return [n, end].join('');
		}
		return [monthArr[dateObj.getMonth()], _addEnds(dateObj.getDate()), dateObj.getFullYear()].join(' ');
	}
};
_.ANIMATION_TIME = 3000;
_.wrapper.prototype = _.prototype = {
	constructor: _,
	addClass: function(className) {
		if (this[0].classList) {
			var classes = this[0].classList;
			if (!classes.contains(className))
				classes.add(className)
		} else {
			var classes = this[0].className.split(' ');
			if (classes.indexOf(className) == -1)
				classes.push(className);
			this[0].className = classes.join(' ')
		}
		return this;
	},
	removeClass: function(className) {
		if (this[0].classList) {
			var classes = this[0].classList;
			if (classes.contains(className))
				classes.remove(className)
			return this;
		} else {
			var classes = this[0].className.split(' '),
				inx = classes.indexOf(className);
			if (inx > -1)
				classes.splice(inx, 1);
			this[0].className = classes.join(' ')
		}
	},
	hasClass: function(className) {
		return this[0].classList ? this[0].classList.contains(className) : this[0].className.indexOf(className) > -1;
	},
	show: function() {
		this.removeClass('hidden');
		return this;
	},
	hide: function() {
		this.addClass('hidden');
		return this;
	},
	fade: function(direction, done) {
		var elem = this[0],
			isIn = direction == 'in',
			self = this,
			n = 0,
			timerId;
		elem.style.opacity = isIn ? 0 : 1;
		function _fade() {
			var val = parseFloat(parseFloat(elem.style.opacity).toFixed(2)),
				condition = isIn ? (val += .1) < 1 : (val -= .1) >= 0;
			if (condition) {
			  elem.style.opacity = val;
			  timerId = setTimeout(_fade, self.ANIMATION_TIME/100);
			} else {
				clearTimeout(timerId);
				elem.style.display = isIn ? 'block' : 'none';
				if (done) {
					done();
				}
			}
		 };
		_fade();
	},
	child: function(criteria) { // Now I need just search first child by class
		if (criteria['class'])
			return _(this[0].getElementsByClassName(criteria['class'])[0]);
		return null;
	},
	append: function(child) {
		this[0].appendChild(child[0]);
		return this;
	},
	text: function(text) {
		this[0].innerHTML = text;
		return this;
	},
	id: function(id) {
		this[0].id = id;
		return this;
	},
	on: function(eventName, callback) {
		var elem = this[0];
		switch(eventName) {
			case 'change':
				if (elem.tagName == 'INPUT' && elem.type == 'checkbox' && 'onpropertychange' in elem)
					elem.onpropertychange =  callback;
				else
					elem.addEventListener('change', callback);
			break;
			default:
				if (elem.addEventListener)
				  elem.addEventListener(eventName, callback, false);
			   else if (elem.attachEvent)
				  elem.attachEvent('on' + eventName, callback);
			   else
				  elem[evnt] = func;
				elem.addEventListener(eventName, callback);
			break;
		}
		return this;
	}
};