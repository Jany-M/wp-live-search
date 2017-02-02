<?php

/**
*	The view for the item search
*
*	This function is pluggable
*	@since 0.1
*/
if ( !function_exists( 'wpls_backbone_templates' ) ):

	add_action('wp_footer', 'wpls_backbone_templates');
	function wpls_backbone_templates(){

		?>
			<!-- WP Live Search -->
			<script type="text/html" id="wpls--tmpl">
				<li id="wpls--item-<%= post.ID %>" class="wpls--item">
					<a href="<%= post.link %>" class="wpls--link">
						<% if ( post.featured_media ) { %>
							<% if ( post._embedded["wp:featuredmedia"]["0"].media_details.sizes.thumbnail.source_url ) { %>
								<img class="wpls--item-image" src='<%= post._embedded["wp:featuredmedia"]["0"].media_details.sizes.thumbnail.source_url %>' alt='<% if ( post._embedded["wp:featuredmedia"]["0"].media_details.image_meta.title ) { %><%=post._embedded["wp:featuredmedia"]["0"].media_details.image_meta.title%><% } %> '>
							<% } %>
						<% } %>
						<div class="wpls--item-title-wrap">
							<h4 class="wpls--item-title"><%= post.title.rendered %></h4>
						</div>
						<% if ( 'enabled' == excerpt ) { %>
							<div class="wpls--item-excerpt"><%= post.excerpt.rendered %></div>
						<% } %>
					</a>
				</li>
			</script>
		<?php

	}

endif;