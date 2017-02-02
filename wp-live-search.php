<?php
/**
 *
 * @package   WP_Live_Search
 * @author    Jaay Martelli <info@shambix.com>
 * @license   GPL-2.0+
 * @link      https://github.com/Jany-M/wp-live-search
 *
 * Plugin Name:       WP Live Search
 * Plugin URI:        http://www.shambix.com
 * Description:       A super light-weight live search plugin that utilizes the WP REST API V2. Search isn't working atm.
 * Version:           2.0
 * GitHub Plugin URI: https://github.com/Jany-M/wp-live-search
 *
 * Original Author			Nick Haskins <email@nickhaskins.com>
 * Original Author URI:  	http://nickhaskins.com
 * Original Script:			https://github.com/bearded-avenger/wp-live-search
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

// Set some constants
define('WP_LIVE_SEARCH_VERSION', '0.9');
define('WP_LIVE_SEARCH_DIR', plugin_dir_path( __FILE__ ));
define('WP_LIVE_SEARCH_URL', plugins_url( '', __FILE__ ));

require_once( plugin_dir_path( __FILE__ ) . 'public/class-wp-live-search.php' );

register_activation_hook( __FILE__, array( 'WP_Live_Search', 'activate' ) );
register_deactivation_hook( __FILE__, array( 'WP_Live_Search', 'deactivate' ) );

add_action( 'plugins_loaded', array( 'WP_Live_Search', 'get_instance' ) );
