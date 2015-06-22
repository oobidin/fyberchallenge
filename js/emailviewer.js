function EmailViewer(arr, masterView, detailView, readShower) {
	this.data = arr.sort(function(a, b) {
		return b.order - a.order;
	});
	
	this.masterView = _.dom.get(masterView);
	this.detailView = _.dom.get(detailView);
	this.readShower = _.dom.get(readShower);
	
	this.init = function () {
		var self = this;
		if ('onpropertychange' in this.readShower)
			this.readShower.addEventListener('propertychange', function () {
				self.showRead(this.checked)
			});
		else
			this.readShower.addEventListener('change', function () {
				self.showRead(this.checked)
			});
		for (var i = 0; i < this.data.length; i++)
			this.masterView.appendChild(this.createElem(this.data[i]));
	};
	
	this.createDateElem = function(date) {
		
	};
	
	this.showRead = function(val) {
		var self = this;
		_.fade(this.masterView, 'out', function () {
			for (var i = 0; i < self.data.length; i++) {
				var elem = self.data[i],
					domElem = _.dom.get('letter' + elem.index);

				if (val && !elem.read)
					_.dom.addClass(domElem, 'hidden');
				else
					_.dom.removeClass(domElem, 'hidden');
				_.fade(self.masterView, 'in');
			}
		});
	};
	
	this.createElem = function(elem) {
		var div = _.dom.create('div'),
			div_head = _.dom.create('div'),
			from = _.dom.create('span'),
			when = _.dom.create('span'),
			div_body = _.dom.create('div'),
			self = this;
		
		function _getAgo(time) {
			var delta = new Date(new Date().getTime());
			return [delta.getDay() ? delta.getDay() + ' days' : delta.getHours() ? delta.getHours() + ' hours' : delta.getMinutes() ? delta.getMinutes() + ' min' : delta.getSeconds() + ' sec', 'ago'].join(' ');
		}
		
		div.classList.add('subjects_item');
		div.id = ['letter', elem.index].join('');
		div_head.classList.add('subjects_item_head');
		div_body.classList.add('subjects_item_body');
		from.classList.add('subjects_item_from');
		when.classList.add('subjects_item_when');
		from.textContent = elem.fromName;
		when.textContent = _getAgo(elem.dateReceived);
		div_body.textContent = elem.subject || '(no subject)';
		div_head.appendChild(from);
		div_head.appendChild(when);
		div.appendChild(div_head);
		div.appendChild(div_body);
		div.addEventListener('click', function() {
			self.showDetail(this.id.substring(6));
		});
		return div;
	};

	this.getElem = function(id) {
		for (var i = 0; i < this.data.length; i++)
			if (this.data[i].index == id)
				return this.data[i];
		return null;
	};
	
	this.showDetail = function(id) {
		var elem = this.getElem(id),
			content_body = this.detailView.getElementsByClassName('content_body')[0],
			content_body_header = content_body.getElementsByClassName('content_body_header')[0],
			from = content_body_header.getElementsByClassName('content_body_header_from')[0],
			to = content_body_header.getElementsByClassName('content_body_header_to')[0],
			recieved = content_body_header.getElementsByClassName('content_body_header_recieved')[0],
			content_body_main = content_body.getElementsByClassName('content_body_main')[0],
			subject = content_body_main.getElementsByClassName('content_body_main_subject')[0],
			text = content_body_main.getElementsByClassName('content_body_main_text')[0],
			self = this;

		_.fade(content_body, 'out', function() {
			if (_.dom.hasClass(content_body, 'hidden')) {
				_.dom.addClass(self.detailView.getElementsByClassName('content-body__noselect')[0], 'hidden');
				_.dom.removeClass(content_body, 'hidden');
			}

			from.textContent = [elem.fromName, ' (' ,elem.fromEmail, ')'].join('');
			to.textContent = 'You';
			var dateReceived = new Date(elem.dateReceived);
			recieved.textContent = [dateReceived.getMonth(), dateReceived.getDay() + 'st', dateReceived.getFullYear()].join(' ');
			subject.textContent = elem.subject;
			text.textContent = elem.content;
			_.fade(content_body, 'in');
		});

	};
	
	this.init();
}
