<?php
/**
 * Plugin Name: HEMORA Content
 * Description: Content model for the HEMORA website (headless). Adds "Properties" with one
 *              entry per hotel (Lereng Senja, Sriti Palu); every field falls back to the
 *              website's built-in copy when left empty. Requires Advanced Custom Fields (free).
 * Version:     1.0.0
 *
 * Kept in the HEMORA repository (deploy/wordpress/mu-plugins) and mounted read-only.
 * Field names mirror PropertyData in app/property-data.ts; app/cms.ts reads them.
 */

if (!defined('ABSPATH')) {
	exit;
}

const HEMORA_POST_TYPE = 'hemora_property';
const HEMORA_SECTIONS  = ['stay' => 'Stay', 'dining' => 'Dining', 'wellness' => 'Wellness', 'journal' => 'Journal'];

/* -------------------------------------------------------------------------
 * Post type: one "Property" per hotel. New ones cannot be added from the UI —
 * the website only knows lereng and sriti (created by `wp hemora seed`).
 * ---------------------------------------------------------------------- */
add_action('init', function () {
	register_post_type(HEMORA_POST_TYPE, [
		'labels'              => [
			'name'          => 'Properties',
			'singular_name' => 'Property',
			'menu_name'     => 'HEMORA Properties',
			'all_items'     => 'All properties',
			'edit_item'     => 'Edit property',
			'view_item'     => 'View on website',
		],
		'public'              => true,
		'publicly_queryable'  => false,
		'exclude_from_search' => true,
		'show_ui'             => true,
		'show_in_menu'        => true,
		'show_in_nav_menus'   => false,
		'show_in_rest'        => true,
		'rest_base'           => 'hemora-properties',
		'menu_icon'           => 'dashicons-building',
		'menu_position'       => 3,
		'supports'            => ['title', 'revisions'],
		'rewrite'             => false,
		'map_meta_cap'        => true,
		'capabilities'        => ['create_posts' => 'do_not_allow'],
	]);
});

// "View on website" goes to the Next.js page, e.g. https://…/hemora/lereng.
add_filter('post_type_link', function ($link, $post) {
	return $post->post_type === HEMORA_POST_TYPE ? home_url('/' . $post->post_name) : $link;
}, 10, 2);

// Headless site: hide the blog, page and comment menus — the website does not use them.
add_action('admin_menu', function () {
	remove_menu_page('edit.php');
	remove_menu_page('edit.php?post_type=page');
	remove_menu_page('edit-comments.php');
}, 999);

add_action('admin_notices', function () {
	if (!class_exists('ACF')) {
		echo '<div class="notice notice-error"><p><strong>HEMORA:</strong> activate the <em>Advanced Custom Fields</em> plugin to edit property content.</p></div>';
	}
});

/* -------------------------------------------------------------------------
 * Fields (ACF free: text, textarea, image, file, group, tab).
 * ---------------------------------------------------------------------- */
function hemora_field(string $type, string $name, string $label, array $extra = []): array {
	return array_merge(['type' => $type, 'name' => $name, 'label' => $label], $extra);
}

function hemora_text(string $name, string $label, string $help = ''): array {
	return hemora_field('text', $name, $label, ['instructions' => $help]);
}

function hemora_area(string $name, string $label, string $help = '', int $rows = 3): array {
	return hemora_field('textarea', $name, $label, ['instructions' => $help, 'rows' => $rows, 'new_lines' => '']);
}

function hemora_image(string $name, string $label, string $help = ''): array {
	return hemora_field('image', $name, $label, ['instructions' => $help, 'return_format' => 'url', 'preview_size' => 'medium', 'library' => 'all']);
}

function hemora_group(string $name, string $label, array $sub_fields, string $help = ''): array {
	return hemora_field('group', $name, $label, ['instructions' => $help, 'layout' => 'block', 'sub_fields' => $sub_fields]);
}

function hemora_tab(string $label): array {
	return hemora_field('tab', '', $label, ['placement' => 'top']);
}

/** Gives every field a stable, unique key derived from its path. */
function hemora_keyed(array $fields, string $prefix = 'field_hemora'): array {
	foreach ($fields as $i => $field) {
		$slug = $field['name'] !== '' ? $field['name'] : 'tab_' . sanitize_key($field['label']);
		$key  = $prefix . '_' . $slug;
		$fields[$i]['key'] = $key;
		if (!empty($field['sub_fields'])) {
			$fields[$i]['sub_fields'] = hemora_keyed($field['sub_fields'], $key);
		}
	}
	return $fields;
}

function hemora_schema(): array {
	$fields = [
		hemora_tab('Hero & home'),
		hemora_text('title', 'Full name', 'e.g. "Lereng Senja, Ciwidey"'),
		hemora_text('shortTitle', 'Short name', 'Menu, footer and home page, e.g. "Lereng Senja"'),
		hemora_text('location', 'Location', 'e.g. "Ciwidey, West Java"'),
		hemora_text('tone', 'Tagline label', 'Small gold label, e.g. "Highland Retreat"'),
		hemora_text('selectorLine', 'Home page line', 'One line under the name on the home page'),
		hemora_area('wordmark', 'Hero wordmark', 'The oversized name in the hero. One line per row.', 2),
		hemora_text('heroKicker', 'Hero kicker'),
		hemora_text('heroTitle', 'Hero title'),
		hemora_text('heroEmphasis', 'Hero title (gold part)'),
		hemora_area('intro', 'Hero introduction'),
		hemora_text('primaryAction', 'Hero button label'),
		hemora_field('file', 'heroVideo', 'Hero video', ['instructions' => 'MP4, ideally under 8 MB and without sound. Plays on the home page and property hero.', 'return_format' => 'url', 'mime_types' => 'mp4,webm']),
		hemora_image('heroPoster', 'Hero video poster', 'Shown while the video loads'),
		hemora_image('heroImage', 'Hero image', 'Used in the menu overlay and cards'),
		hemora_text('heroAlt', 'Hero description (accessibility)'),

		hemora_tab('Story'),
		hemora_text('philosophyLabel', 'Section label'),
		hemora_area('philosophyTitle', 'Statement', 'The large sentence that lights up while scrolling', 2),
		hemora_area('philosophyLead', 'Lead paragraph', '', 4),
		hemora_area('philosophyBody', 'Second paragraph', '', 4),
		hemora_group('stats', 'Highlights', array_map(
			fn ($n) => hemora_group("stat_$n", "Highlight $n", [hemora_text('value', 'Value', 'e.g. "48"'), hemora_text('label', 'Label', 'e.g. "Suites & Villas"')]),
			[1, 2, 3, 4]
		)),
		hemora_area('marquee', 'Scrolling words', 'One phrase per line', 5),

		hemora_tab('Offers'),
		hemora_text('offersTitle', 'Section title'),
		hemora_area('offersIntro', 'Section introduction'),
		hemora_group('offers', 'Offers', array_map(
			fn ($n) => hemora_group("offer_$n", "Offer $n", [
				hemora_text('name', 'Name'),
				hemora_text('meta', 'Details', 'e.g. "03 nights · Fri-Sun"'),
				hemora_text('rate', 'Rate', 'e.g. "From IDR 1.850K"'),
				hemora_area('description', 'Description'),
				hemora_image('image', 'Image'),
				hemora_text('alt', 'Image description'),
			]),
			[1, 2, 3]
		)),
	];

	foreach (HEMORA_SECTIONS as $slug => $label) {
		$fields[] = hemora_tab($label);
		$fields[] = hemora_group("section_$slug", "$label chapter", array_merge(
			[
				hemora_text('label', 'Menu label'),
				hemora_text('eyebrow', 'Eyebrow', 'e.g. "§ 02 — Stay"'),
				hemora_text('title', 'Title'),
				hemora_area('body', 'Text', '', 4),
				hemora_area('secondary', 'Secondary text'),
				hemora_image('image', 'Image'),
				hemora_text('alt', 'Image description'),
				hemora_text('caption', 'Caption'),
				hemora_text('meta', 'Detail line'),
			],
			array_map(
				fn ($n) => hemora_group("detail_$n", "Card $n", [
					hemora_text('title', 'Title'),
					hemora_area('body', 'Text'),
					hemora_image('image', 'Image'),
					hemora_text('alt', 'Image description'),
				]),
				[1, 2, 3]
			)
		));
	}

	return array_merge($fields, [
		hemora_tab('Guest note & booking'),
		hemora_area('quote', 'Guest quote'),
		hemora_text('quoteSource', 'Quote source'),
		hemora_text('bookingTitle', 'Booking title'),
		hemora_area('bookingLead', 'Booking text'),
		hemora_image('bookingImage', 'Booking image'),
		hemora_text('bookingAlt', 'Booking image description'),
		hemora_text('bookingPropertyId', 'Mora Club property ID', 'When Mora Club publishes this hotel\'s ID, enter it here so "Check Availability" opens this hotel directly.'),

		hemora_tab('Contact'),
		hemora_area('address', 'Address', '', 2),
		hemora_field('email', 'email', 'Email'),
		hemora_text('phone', 'Phone'),
	]);
}

add_action('acf/init', function () {
	if (!function_exists('acf_add_local_field_group')) {
		return;
	}
	acf_add_local_field_group([
		'key'                   => 'group_hemora_property',
		'title'                 => 'Property content',
		'fields'                => hemora_keyed(hemora_schema()),
		'location'              => [[['param' => 'post_type', 'operator' => '==', 'value' => HEMORA_POST_TYPE]]],
		'position'              => 'acf_after_title',
		'style'                 => 'seamless',
		'instruction_placement' => 'field',
		'show_in_rest'          => 1,
		'description'           => 'Empty fields fall back to the website\'s built-in copy.',
	]);
});

/* -------------------------------------------------------------------------
 * Tell the website to refresh right after an edit.
 * ---------------------------------------------------------------------- */
function hemora_refresh_website(): void {
	$url    = getenv('HEMORA_REVALIDATE_URL');
	$secret = getenv('HEMORA_REVALIDATE_SECRET');
	if (!$url || !$secret) {
		return;
	}
	$response = wp_remote_post($url, ['headers' => ['x-hemora-secret' => $secret], 'timeout' => 8]);
	$ok       = !is_wp_error($response) && wp_remote_retrieve_response_code($response) === 200;

	// The refresh marks pages stale; visiting each one makes Next.js rebuild it now, so the
	// first real visitor already sees the edit. Fire-and-forget, a second apart.
	if ($ok) {
		$site  = preg_replace('#/api/revalidate/?$#', '', $url);
		$paths = [''];
		foreach (['lereng', 'sriti'] as $property) {
			$paths[] = "/$property";
			foreach (array_keys(HEMORA_SECTIONS) as $section) {
				$paths[] = "/$property/$section";
			}
		}
		foreach ($paths as $path) {
			wp_remote_get($site . $path, ['timeout' => 1, 'blocking' => false]);
		}
	}
	if (get_current_user_id()) {
		set_transient('hemora_refresh_' . get_current_user_id(), $ok ? 'ok' : 'failed', 60);
	}
}

add_action('acf/save_post', function ($post_id) {
	if (is_numeric($post_id) && get_post_type($post_id) === HEMORA_POST_TYPE && !wp_is_post_revision($post_id)) {
		hemora_refresh_website();
	}
}, 20);

foreach (['trashed_post', 'untrashed_post', 'deleted_post'] as $hook) {
	add_action($hook, function ($post_id) {
		if (get_post_type($post_id) === HEMORA_POST_TYPE) {
			hemora_refresh_website();
		}
	});
}

add_action('admin_notices', function () {
	$key   = 'hemora_refresh_' . get_current_user_id();
	$state = get_transient($key);
	if (!$state) {
		return;
	}
	delete_transient($key);
	echo $state === 'ok'
		? '<div class="notice notice-success is-dismissible"><p>Website updated with your changes.</p></div>'
		: '<div class="notice notice-warning is-dismissible"><p>Saved. The website could not be refreshed right away; it will pick up the changes within 5 minutes.</p></div>';
});

/* -------------------------------------------------------------------------
 * WP-CLI: wp hemora seed --source=<url of /api/content/defaults> [--force]
 * Creates the two properties and fills every field (images and videos are
 * imported into the Media Library) from the website's built-in content.
 * ---------------------------------------------------------------------- */
if (defined('WP_CLI') && WP_CLI) {
	WP_CLI::add_command('hemora seed', function ($args, $assoc) {
		if (!function_exists('update_field')) {
			WP_CLI::error('Activate Advanced Custom Fields first: wp plugin install advanced-custom-fields --activate');
		}
		$source = $assoc['source'] ?? '';
		if (!$source) {
			WP_CLI::error('Pass --source=<url>, e.g. http://hemora-web:3000/hemora/api/content/defaults');
		}
		$force  = !empty($assoc['force']);
		$origin = preg_replace('#^(https?://[^/]+).*$#', '$1', $source);

		$response = wp_remote_get($source, ['timeout' => 30]);
		if (is_wp_error($response) || wp_remote_retrieve_response_code($response) !== 200) {
			WP_CLI::error('Could not load ' . $source);
		}
		$data = json_decode(wp_remote_retrieve_body($response), true);
		if (empty($data['properties'])) {
			WP_CLI::error('No properties in the response.');
		}

		require_once ABSPATH . 'wp-admin/includes/file.php';
		require_once ABSPATH . 'wp-admin/includes/media.php';
		require_once ABSPATH . 'wp-admin/includes/image.php';

		foreach ($data['properties'] as $slug => $p) {
			$existing = get_posts(['post_type' => HEMORA_POST_TYPE, 'name' => $slug, 'post_status' => 'any', 'numberposts' => 1]);
			if ($existing && !$force) {
				WP_CLI::log("Skipping $slug (already exists; use --force to overwrite its fields).");
				continue;
			}
			$post_id = $existing ? $existing[0]->ID : wp_insert_post([
				'post_type'   => HEMORA_POST_TYPE,
				'post_name'   => $slug,
				'post_title'  => $p['shortTitle'] ?? $slug,
				'post_status' => 'publish',
			], true);
			if (is_wp_error($post_id)) {
				WP_CLI::error($post_id->get_error_message());
			}

			$media = fn ($url) => hemora_import_media($url ?? '', $origin, $post_id);
			foreach (hemora_values_from_content($p, $media) as $name => $value) {
				update_field('field_hemora_' . $name, $value, $post_id);
			}
			WP_CLI::success("Seeded $slug (post $post_id).");
		}
		hemora_refresh_website();
	});
}

/** Maps the website's PropertyData JSON onto the ACF field structure. */
function hemora_values_from_content(array $p, callable $media): array {
	$text_keys = ['title', 'shortTitle', 'location', 'tone', 'selectorLine', 'heroKicker', 'heroTitle', 'heroEmphasis', 'intro', 'primaryAction', 'heroAlt', 'philosophyLabel', 'philosophyTitle', 'philosophyLead', 'philosophyBody', 'offersTitle', 'offersIntro', 'quote', 'quoteSource', 'bookingTitle', 'bookingLead', 'bookingAlt', 'address', 'email', 'phone'];
	$values    = [];
	foreach ($text_keys as $key) {
		$values[$key] = (string) ($p[$key] ?? '');
	}
	$values['bookingPropertyId'] = (string) ($p['bookingPropertyId'] ?? '');
	$values['wordmark']          = implode("\n", $p['wordmark'] ?? []);
	$values['marquee']           = implode("\n", $p['marquee'] ?? []);
	$values['heroVideo']         = $media($p['heroVideo'] ?? '');
	$values['heroPoster']        = $media($p['heroPoster'] ?? '');
	$values['heroImage']         = $media($p['heroImage'] ?? '');
	$values['bookingImage']      = $media($p['bookingImage'] ?? '');

	$values['stats'] = [];
	foreach (array_values($p['stats'] ?? []) as $i => $stat) {
		$values['stats']['stat_' . ($i + 1)] = ['value' => $stat['value'] ?? '', 'label' => $stat['label'] ?? ''];
	}

	$values['offers'] = [];
	foreach (array_values($p['offers'] ?? []) as $i => $offer) {
		$values['offers']['offer_' . ($i + 1)] = [
			'name'        => $offer['name'] ?? '',
			'meta'        => $offer['meta'] ?? '',
			'rate'        => $offer['rate'] ?? '',
			'description' => $offer['description'] ?? '',
			'image'       => $media($offer['image'] ?? ''),
			'alt'         => $offer['alt'] ?? '',
		];
	}

	foreach (array_keys(HEMORA_SECTIONS) as $slug) {
		$section = $p['sections'][$slug] ?? [];
		$group   = [
			'label'     => $section['label'] ?? '',
			'eyebrow'   => $section['eyebrow'] ?? '',
			'title'     => $section['title'] ?? '',
			'body'      => $section['body'] ?? '',
			'secondary' => $section['secondary'] ?? '',
			'image'     => $media($section['image'] ?? ''),
			'alt'       => $section['alt'] ?? '',
			'caption'   => $section['caption'] ?? '',
			'meta'      => $section['meta'] ?? '',
		];
		foreach (array_values($section['details'] ?? []) as $i => $detail) {
			$group['detail_' . ($i + 1)] = [
				'title' => $detail['title'] ?? '',
				'body'  => $detail['body'] ?? '',
				'image' => $media($detail['image'] ?? ''),
				'alt'   => $detail['alt'] ?? '',
			];
		}
		$values["section_$slug"] = $group;
	}

	return $values;
}

/** Imports a website asset into the Media Library once (deduplicated by source URL). */
function hemora_import_media(string $url, string $origin, int $post_id) {
	if ($url === '') {
		return '';
	}
	$absolute = preg_match('#^https?://#', $url) ? $url : rtrim($origin, '/') . $url;
	$found    = get_posts(['post_type' => 'attachment', 'post_status' => 'inherit', 'meta_key' => '_hemora_source', 'meta_value' => $absolute, 'fields' => 'ids', 'numberposts' => 1]);
	if ($found) {
		return $found[0];
	}
	// download_url() refuses internal hosts such as hemora-web:3000 (anti-SSRF), so stream
	// the file with the regular HTTP client; this only runs from the trusted WP-CLI command.
	$tmp      = wp_tempnam(wp_basename(parse_url($absolute, PHP_URL_PATH)));
	$response = wp_remote_get($absolute, ['timeout' => 120, 'stream' => true, 'filename' => $tmp]);
	if (is_wp_error($response) || wp_remote_retrieve_response_code($response) !== 200) {
		@unlink($tmp);
		$reason = is_wp_error($response) ? $response->get_error_message() : 'HTTP ' . wp_remote_retrieve_response_code($response);
		WP_CLI::warning("Could not download $absolute: $reason");
		return '';
	}
	$id = media_handle_sideload(['name' => wp_basename(parse_url($absolute, PHP_URL_PATH)), 'tmp_name' => $tmp], $post_id);
	if (is_wp_error($id)) {
		@unlink($tmp);
		WP_CLI::warning("Could not import $absolute: " . $id->get_error_message());
		return '';
	}
	update_post_meta($id, '_hemora_source', $absolute);
	WP_CLI::log("  imported " . wp_basename($absolute));
	return $id;
}
