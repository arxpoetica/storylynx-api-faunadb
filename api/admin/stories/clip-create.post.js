const { EOL } = require('os')
const { merge_asset } = require('../../../utils.js')
const { cms_mutate } = require('../../../loaders.js')

module.exports = async function({ clip, slug, order, parent_id }) {

	const {
		parent_name,
		template,
		hide_clip = false,
		hide_navigation = false,
		theme_elements = [],
		transitions = [],
		asset_bins = [],
		styles,
	} = clip

	let mutation_var_defs = asset_bins.map((bin, bin_i) => {
		return bin.assets.map((_, asset_j) => {
			return `
				$name${bin_i}_${asset_j}: String
				$source${bin_i}_${asset_j}: String
				$caption${bin_i}_${asset_j}: String
				$code${bin_i}_${asset_j}: String
				$html${bin_i}_${asset_j}: String
			`
		}).join(EOL)
	}).filter(bin => bin).join(EOL)
	mutation_var_defs = mutation_var_defs.length ? `, ${mutation_var_defs}` : ''

	const mutation = `
		mutation create_clip($slug: String${mutation_var_defs}) {
			created_clip: createClip(data: {
				slug: $slug
				parentName: "${parent_name}"
				order: ${order}
				template: ${template}
				hideClip: ${hide_clip}
				hideNavigation: ${hide_navigation}
				themeElements: [${theme_elements.join(', ')}]
				transitions: [${transitions.join(', ')}]
				assetBins: {
					create: [${asset_bins.map((bin, bin_i) => `{
						order: ${bin.order || 0}
						${bin.transition ? `transition: ${bin.transition}` : ''}
						storyAssets: {
							create: [${bin.assets.map((asset, asset_j) => `{
								order: ${asset.order || 0}
								${asset.asset_id ? `asset: { connect: { id: "${asset.asset_id}" } }` : ''}
								name: $name${bin_i}_${asset_j}
								source: $source${bin_i}_${asset_j}
								caption: $caption${bin_i}_${asset_j}
								${typeof asset.width === 'number' ? `widthOverride: ${asset.width}` : ''}
								${typeof asset.height === 'number' ? `heightOverride: ${asset.height}` : ''}
								${typeof asset.volume === 'number' ? `volume: ${asset.volume}` : ''}
								${asset.bg_pos ? `backgroundPosition: ${asset.bg_pos}` : ''}
								${typeof asset.contain === 'boolean' ? `contain: ${asset.contain}` : ''}
								${typeof asset.play_once === 'boolean' ? `playOnce: ${asset.play_once}` : ''}
								html: $html${bin_i}_${asset_j}
								htmlCode: $code${bin_i}_${asset_j}
								${asset.template ? `htmlTemplate: ${asset.template}` : ''}
								${asset.color ? `htmlHighlightColor: ${asset.color}` : ''}
							}`).join(`${EOL}							`)}]
						}
					}`).join(`${EOL}					`)}]
				}
				parentSequence: { connect: { id: "${parent_id}" } }
				# parentAudioClips:
				${styles ? `styles: {
					create: {
						${typeof styles.top === 'number' ? `top: ${styles.top}` : ''}
						${typeof styles.right === 'number' ? `right: ${styles.right}` : ''}
						${typeof styles.bottom === 'number' ? `bottom: ${styles.bottom}` : ''}
						${typeof styles.left === 'number' ? `left: ${styles.left}` : ''}
						${typeof styles.width === 'number' ? `templateWidth: ${styles.width}` : ''}
						${typeof styles.height === 'number' ? `templateHeight: ${styles.height}` : ''}
						${typeof styles.percent === 'boolean' ? `widthAsPercent: ${styles.percent}` : ''}
						${typeof styles.gap === 'number' ? `gap: ${styles.gap}` : ''}
					}
				}` : ''}
			}) {
				id
				slug
				hide_clip: hideClip
				hide_navigation: hideNavigation
				order
				template
				theme_elements: themeElements
				transitions
				styles {
					id
					top right left bottom
					gap
					width: templateWidth
					height: templateHeight
					percent: widthAsPercent
				}
				asset_bins: assetBins(orderBy: order_ASC) {
					id
					order
					assets: storyAssets(orderBy: order_ASC) {
						id
						asset {
							id
							handle
							url
							filename: fileName
							mime_type: mimeType
						}
						order
						name
						source
						caption
						width: widthOverride
						height: heightOverride
						contain
						bg_pos: backgroundPosition
						volume
						play_once: playOnce
						template: htmlTemplate
						color: htmlHighlightColor
						code: htmlCode
						html
					}
					transition
				}
			}
		}
	`

	const variables = { slug: slug || 'New clip' }
	asset_bins.forEach((bin, bin_i) => {
		bin.assets.forEach((asset, asset_j) => {
			variables[`name${bin_i}_${asset_j}`] = asset.name || ''
			variables[`source${bin_i}_${asset_j}`] = asset.source || ''
			variables[`caption${bin_i}_${asset_j}`] = asset.caption || ''
			variables[`code${bin_i}_${asset_j}`] = JSON.stringify(asset.code || {})
			variables[`html${bin_i}_${asset_j}`] = asset.html || ''
		})
	})

	const res = await cms_mutate(mutation, variables)

	res.created_clip.asset_bins = res.created_clip.asset_bins.map(bin => {
		bin.assets = bin.assets.map(merge_asset)
		return bin
	})
	res.created_clip.styles = res.created_clip.styles || {
		top: null,
		bottom: null,
		left: null,
		right: null,
		gap: null,
		width: null,
		height: null,
		percent: null,
	}

	return res

}
