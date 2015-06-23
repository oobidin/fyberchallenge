/**
*	EmailViewer - module for 
**/

function EmailViewer(data, masterView, detailView, unreadShower) {
	this.masterView = _(masterView);
	this.detailView = _(detailView);
	this.unreadShower = _(unreadShower);
	this.data = data;
	
	this.init = function () {
		var self = this,
			curDate = new Date().getTime();
		
		this.unreadShower.on('change', function () {
			self.showUnread(this.checked)
		});
		
		this.data.sort(function(a, b) {
			return b.dateReceived - a.dateReceived;
		});
		
		var prevDate = {
			year: 0,
			month: 0,
			day: 0
		};
		for (var i = 0; i < this.data.length; i++) {
			var dataElem = this.data[i],
				date = dataElem.dateReceived,
				dateObj = new Date(date * 1000),
				day = dateObj.getDate(),
				month = dateObj.getMonth(),
				year = dateObj.getFullYear();
		
			if (prevDate.year != year || prevDate.month != month || prevDate.day != day) {
				this.masterView.append(this.createDateElem(date));
				prevDate.year = year;
				prevDate.month = month;
				prevDate.day = day;
			}
			
			this.masterView.append(this.createElem(this.data[i]));
		}
	};
	
	this.createDateElem = function(date) {
		return _.create('div')
				.addClass('subjects_item__date')
				.append(
					_.create('div').addClass('subjects_item_body')
					 .text(_.formats.dateNum(date))
				);
	};
	
	this.showUnread = function(val) {
		var self = this;
		this.masterView.fade('out', function () {
			for (var i = 0; i < self.data.length; i++) {
				var elem = self.data[i],
					domElem = _('letter' + elem.index);

				if (val && !elem.read)
					domElem.addClass('hidden');
				else
					domElem.removeClass('hidden');
				self.masterView.fade('in');
			}
		});
	};
	
	this.createElem = function(elem) {
		var div = _.create('div'),
			div_head = _.create('div'),
			from = _.create('span'),
			when = _.create('span'),
			div_body = _.create('div'),
			self = this;
		
		div.addClass('subjects_item').id(['letter', elem.index].join(''));
		from.addClass('subjects_item_from');
		when.addClass('subjects_item_when');
		from.text(elem.fromName);
		when.text(_.formats.dateAgo(elem.dateReceived));
		div_body.addClass('subjects_item_body').text(elem.subject || '(no subject)');
		div_head.addClass('subjects_item_head').append(from).append(when);
		
		div.append(div_head).append(div_body).on('click', function() {
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
			content_body = this.detailView.child({ 'class': 'content_body' }),
			content_body_header = content_body.child({ 'class': 'content_body_header' }),
			from = content_body_header.child({ 'class': 'content_body_header_from' }),
			to = content_body_header.child({ 'class': 'content_body_header_to' }),
			recieved = content_body_header.child({ 'class': 'content_body_header_recieved' }),
			content_body_main = content_body.child({ 'class': 'content_body_main' }),
			subject = content_body_main.child({ 'class': 'content_body_main_subject' }),
			text = content_body_main.child({ 'class': 'content_body_main_text' }),
			self = this;
		
		content_body.fade('out', function() {
			if (content_body.hasClass('hidden')) {
				self.detailView.child({ 'class': 'content_body__noselect' }).addClass('hidden');
				content_body.removeClass('hidden');
			}

			from.text([elem.fromName, ' (' , elem.fromEmail, ')'].join(''));
			to.text('You');
			var dateReceived = new Date(elem.dateReceived);
			recieved.text(_.formats.date(elem.dateReceived));
			subject.text(elem.subject);
			text.text(_.formats.pre(elem.content));
			content_body.fade('in');
		});
	};
	
	this.init();
}
