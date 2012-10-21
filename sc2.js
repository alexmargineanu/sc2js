	function getFilters() {
		$('ul#filters').append('<li><a href="#filter" id="' + casters[i] + '" data-option-value="' + casters[i] + '">' + casters[i] + '</a></li>');
	}
	
	function getFeed(i) {
		var fragment = '';
		$.ajax({
			type : "GET",
			url : 'http://gdata.youtube.com/feeds/api/users/' + casters[i] + '/uploads?v=2&alt=jsonc&max-container=50',
			cache : false,
			dataType : 'jsonp',
			success : function(data) {
				$.each(data.data.items, function(index) {
					if (isSC(this.title.toLowerCase())) {
						fragment += "<div class='element " + casters[i] + "' data-symbol='" + casters[i] + "' title='" + this.title.replace(/'/g, '`') + "'><a href='" + this.player['default'] + "'><img src='" + this.thumbnail.sqDefault + "' /></a><h3><a href='" + this.player['default'] + "'>" + this.title.substr(0, 60) + "</a></h3><p>" + this.viewCount + " views - <abbr>" + humanized_time_span(this.uploaded) + "</abbr> </p></div>";
					}
				});
				$('#container').append(fragment);
			}
		});
	}
	
	function isSC(e) {
		return (e.indexOf('starcraft') !== -1 || e.indexOf('hots') !== -1 || e.indexOf('sc2') !== -1) ? true : false;
	}
	
	for ( i = 0; i < casters.length; i++) {
		getFeed(i);
		getFilters(i);
	}



	$(window).load(function() {
		
		var $container 		= $('#container'),
			defaultOption 	= lscache.get('scjs-options') || 'option-select-all';
		
		$('#' + defaultOption).addClass('selected');
		if (defaultOption !== 'option-select-all') {
			$('#container').isotope({
				filter : '.' + defaultOption
			});		
		}	
		$container.isotope({
			itemSelector : '.element'
		});

		var $optionSets = $('#options .option-set'), $optionLinks = $optionSets.find('a');

		$optionLinks.click(function() {
			var $this = $(this);
			if ($this.hasClass('selected')) {
				return false;
			}
			lscache.set('scjs-options', $this.attr('data-option-value') == '*' ? 'option-select-all' : $this.attr('data-option-value'));
			var $optionSet = $this.parents('.option-set');
			$optionSet.find('.selected').removeClass('selected');
			$this.addClass('selected');

			var options = {}, key = $optionSet.attr('data-option-key'), value = $this.attr('data-option-value');
			value = value === 'false' ? false : value;
			options[key] = value !== '*' ? '.' + value : value;
			if (key === 'layoutMode' && typeof changeLayoutMode === 'function') {
				changeLayoutMode($this, options)
			} else {
				$container.isotope(options);
			}

			return false;
		});
	});