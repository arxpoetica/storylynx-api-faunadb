const { EOL } = require('os')
const { cms_mutate } = require('../../../loaders.js')

module.exports = async function({ clip, slug, order, parent_id }) {

	let mutation_var_defs = clip.asset_bins.map((bin, bin_i) => {
		return bin.html_blocks.map((_, block_j) => {
			return `$name${bin_i}_${block_j}: String, $code${bin_i}_${block_j}: String, $html${bin_i}_${block_j}: String` // eslint-disable-line max-len
		}).join(', ')
	}).filter(bin => bin).join(', ')
	mutation_var_defs = mutation_var_defs.length ? `, ${mutation_var_defs}` : ''

	const mutation = `
		mutation create_clip($slug: String${mutation_var_defs}) {
			created_clip: createClip(data: {
				slug: $slug
				order: "${order}"
				template: ${clip.template}
				hideNavigation: ${clip.hide_navigation}
				themeElements: { set: [${clip.theme_elements.join(', ')}] }
				transitions: { set: [${clip.transitions.join(', ')}] }
				assetBins: {
					create: [${clip.asset_bins.map((bin, bin_i) => `{
						order: ${bin.order || 0}
						${bin.transition ? `transition: ${bin.transition}` : ''}
						# links: { set: {} }
						assets: { connect: [${bin.assets.map(asset => `{ id: "${asset.id}" }`).join(' ')}] }
						htmlBlocks: {
							create: [${bin.html_blocks.map((block, block_j) => `{
								name: $name${bin_i}_${block_j}
								code: $code${bin_i}_${block_j}
								html: $html${bin_i}_${block_j}
								${block.template ? `template: ${block.template}` : ''}
								${block.color ? `highlightColor: ${block.color}` : ''}
								order: ${block.order || 0}
							}`).join(`${EOL}							`)}]
						}
					}`).join(`${EOL}					`)}]
				}
				parentSequence: { connect: { id: "${parent_id}" } }
				# parentAudioClips:
				${clip.styles ? `styles: {
					create: {
						${typeof clip.styles.top === 'number' ? `top: ${clip.styles.top}` : ''}
						${typeof clip.styles.right === 'number' ? `right: ${clip.styles.right}` : ''}
						${typeof clip.styles.bottom === 'number' ? `bottom: ${clip.styles.bottom}` : ''}
						${typeof clip.styles.left === 'number' ? `left: ${clip.styles.left}` : ''}
						${typeof clip.styles.width === 'number' ? `templateWidth: ${clip.styles.width}` : ''}
						${typeof clip.styles.height === 'number' ? `templateHeight: ${clip.styles.height}` : ''}
						${typeof clip.styles.percent === 'boolean' ? `widthAsPercent: ${clip.styles.percent}` : ''}
						${typeof clip.styles.gap === 'number' ? `gap: ${clip.styles.gap}` : ''}
					}
				}` : ''}
			}) {
				id
				slug
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
					assets {
						id
						handle
						source
						caption
						width: widthOverride
						height: heightOverride
						contain
						filename: fileName
						mime_type: mimeType
						bg_pos: backgroundPosition
						volume
					}
					# links // NOTE: will use in the near future for vimeo, etc.
					html_blocks: htmlBlocks {
						id
						name
						template
						color: highlightColor
						code
						html
					}
					transition
				}
			}
		}
	`

	const variables = { slug: slug || 'New clip' }
	clip.asset_bins.forEach((bin, bin_i) => {
		bin.html_blocks.forEach((block, block_j) => {
			variables[`name${bin_i}_${block_j}`] = block.name || ''
			variables[`code${bin_i}_${block_j}`] = JSON.stringify(block.code || {})
			variables[`html${bin_i}_${block_j}`] = block.html || ''
		})
	})

	const res = await cms_mutate(mutation, variables)
	return res

}
