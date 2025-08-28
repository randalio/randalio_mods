<?php
/**
 * Plugin Name: Randal.io Mods
 * Description: Theme Mods and Custom JavaScript for Randal.io
 * Version: 2.0.0
 * Author: Randal Traicoff
 * License: Mine
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class RandalIO_Theme_Mods {
    /**
     * Constructor
     */
    public function __construct() {
        add_action('init', array($this, 'init'));
    }

    /**
     * Initialize the plugin
     */
    public function init() {

        add_action('wp_body_open', function() {
	
            echo '<div data-scroll>';
            echo '  <div data-scroll-container>';
        });
        add_action('wp_footer', function() {
            echo '  </div>';
            echo '</div>';
        });

        //enqueue randalio-mods.css
        function enqueue_randalio_mods_styles() {
            wp_enqueue_style('randalio-mods', plugin_dir_url(__FILE__) . '/dist/css/main.min.css', array(), time() );
        }
        add_action('wp_enqueue_scripts', 'enqueue_randalio_mods_styles');


        //enqueue admin styles
        function enqueue_randalio_mods_admin_styles() {
            wp_enqueue_style('randalio-mods-admin', plugin_dir_url(__FILE__) . '/dist/css/admin.min.css', array(),  time() );
        }
        add_action('admin_enqueue_scripts', 'enqueue_randalio_mods_admin_styles');

        // enqueue app.js
        function enqueue_randalio_mods_main_js() {
            wp_enqueue_script('randalio-mods-app', plugin_dir_url(__FILE__) . '/dist/js/main.min.js', array(), time(), true);
        }
        add_action('wp_enqueue_scripts', 'enqueue_randalio_mods_main_js');

    }

    /**
     * Functions can go here...
     */



    

}

// Initialize the plugin
new RandalIO_Theme_Mods();