(function( $, Backbone, _, WP_API_Settings, undefined ) {

	$(document).ready( function( $ ){

		var backboneTemplate = $('#wpls--tmpl')
		,	itemTemplate     = _.template( backboneTemplate.html() )
		,	posts            = new wp.api.collections.Posts()
		,	main             = '#wpls'
		,	postList		 		 = '#wpls--post-list'
		,	postList         = $( main ).data('target') ? $( main ).data('target') : postList
		,	showExcerpt      = $( main ).data('excerpt') ? 'enabled' : 'disabled'
		,	results          = '#wpls--results'
		,	loader           = '#wpls--loading'
		,	input  			 		 = '#wpls--input'
		,	helper           = '#wpls--helper'
		,	helperText       = wp_search_vars.helperText
		,	helperSpan       = '<span id="wpls--helper">'+helperText+'</span>'
		,	clear     		   = '<i id="wpls--clear-search" class="dashicons dashicons-dismiss"></i>'
		,	clearItem        = '#wpls--clear-search'
		,	hideClass        = 'wpls--hide'
		,	showClass        = 'wpls--show'
		,	api              = WP_API_Settings.root
		,	timer

		$( postList ).addClass('wpls--empty');

		$(document).on('keyup keypress', input, function ( e ) {

			// clear the previous timer
			clearTimeout( timer )

			var key				= e.which
			,	that				= this
			,	val					= $.trim( $(this).val() )
			,	valEqual		= val == $(that).val()
			,	notEmpty		= '' !== val
			,	type				= $( this ).data('object-type')
			,	total				= $( main ).data('number')
			,	search_in		= $( this ).data('search-in')
			,	url					= api+'/'+type+'?search='+val+'&per_page='+total+'&_embed';

			// 600ms delay so we dont exectute excessively
			timer = setTimeout(function() {

				// don't proceed if the value is empty or not equal to itself
				if ( !valEqual && !notEmpty )
					return false;

				// what if the user only types two characters?
				if ( val.length == 2 && !$(helper).length ) {

					$( input ).after( helperSpan );

				}

				// if we have more than 3 characters
				if ( val.length >= 3 || val.length >= 3 && 13 == key ) {

					// dont run on escape or arrow keys
					if( blacklistedKeys( key ) )
						return false;

					// show loader
					$( loader ).removeClass('wpls--hide').addClass('wpls--show');

					// remove any helpers
					$( helper ).fadeOut().remove();

					// remove the cose
					destroyClose();

					// multiple request
					if ( type != 'posts' ) {
						
						var multiData = [];

						$.each( type, function( index, value ) {
							url = api+'/'+value+'?search='+val+'&per_page='+total+'&_embed';

							// make the search request
							$.getJSON( url, function( response ) {
								multiData = $.merge( $.merge( [], multiData ), response );
								multiData.sort(function (obj1, obj2 ) {
									return obj1.date - obj2.date;
								});
								show_results( multiData );
							});

						});

					} 
					//single request
					else {

						// make the search request
						$.getJSON( url, function( response ) {
							show_results( response );
						});

					};

					function show_results( data ) {
						// slice array if muiltiple request
						if ( type != 'posts' && data.length > total ) {
							data = data.slice( 0, total );
						}
						// remove current list of posts
						$(postList).children().remove();
						$(postList).removeClass('wpls--full').addClass('wpls--empty');

						// show results
						$(results).parent().removeClass('wpls--hide').addClass('wpls--show');

						// hide loader
						$(loader).removeClass('wpls--show').addClass('wpls--hide');

						// count results and show
						if ( data.length == 0 ) {

							// results are empty int
							$(results).text('0').closest( main ).addClass('wpls--no-results');

							// clear any close buttons
							destroyClose();

						} else {

							// again, dont run on escape or arrow keys
							if( blacklistedKeys( key ) )
								return false;

							// append close button
							if ( !$( clearItem ).length ) {

								$(input).after( clear );
							}

							// show how many results we have
							$(results).text( data.length ).closest( main ).removeClass('wpls--no-results');

							// loop through each object
							if ( search_in == 'title' ) {

								var count = 0;
								$.each( data, function ( i ) {
									if ( ~data[i].title.rendered.toLowerCase().indexOf( val.toLowerCase() ) ) {
										$(postList).append( itemTemplate( { post: data[i], settings: WP_API_Settings, excerpt: showExcerpt } ) )
										.removeClass('wpls--empty')
										.addClass('wpls--full');
										count++;
									}
									$(results).text( count );
								} );

							} else if ( search_in == 'content' ) {

								var count = 0;
								$.each( data, function ( i ) {
									if ( ~data[i].content.rendered.toLowerCase().indexOf( val.toLowerCase() ) ) {
										$(postList).append( itemTemplate( { post: data[i], settings: WP_API_Settings, excerpt: showExcerpt } ) )
										.removeClass('wpls--empty')
										.addClass('wpls--full');
										count++;
									}
									$(results).text( count );
								} );

							} else {

								$.each( data, function ( i ) {
									$(postList).append( itemTemplate( { post: data[i], settings: WP_API_Settings, excerpt: showExcerpt } ) )
									.removeClass('wpls--empty')
									.addClass('wpls--full');

								} );

							}
          }

					}; // End function work

				}

			}, 300);

			// if there's no value then destroy the search
			if ( val == '' ) {

				destroySearch();

			}

		});

		/**
		*	Clear search
		*/
		$( document ).on('click', clearItem, function(e){

			e.preventDefault();
			destroySearch();
		});

		/**
		* 	Utility function destroy search close
		*/
		function destroyClose(){

			$( clearItem ).remove();

		}

		/**
		*	Utility function to destroy the search
		*/
		function destroySearch(){

			$( postList ).children().remove();
			$( input ).val('');
			$( results ).parent().removeClass('wpls--show').addClass('wpls--hide');
			$( postList ).removeClass('wpls--full').addClass('wpls--empty')
			$( helper ).remove();
			destroyClose()
		}

		/**
		* 	Blacklisted keys - dont allow search on escape or arrow keys
		*	@since 0.9
		*/
		function blacklistedKeys( key ){

			return 27 == key || 37 == key || 38 == key || 39 == key || 40 == key;

		}

	});

})( jQuery, Backbone, _, WP_API_Settings );