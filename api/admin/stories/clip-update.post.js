const { EOL } = require('os')
const { cms_mutate } = require('../../../loaders.js')

module.exports = async function({ clip }) {

	let mutation_var_defs = clip.asset_bins.map((bin, bin_i) => {
		return bin.html_blocks.map((_, block_j) => {
			return `
				$name${bin_i}_${block_j}: String
				$code${bin_i}_${block_j}: String
				$html${bin_i}_${block_j}: String
			`
		})
	}).filter(Boolean).join(EOL)
	mutation_var_defs = mutation_var_defs.length ? EOL + mutation_var_defs : ''

	const { styles } = clip
	const styles_mutation = () => {
		// FIXME: this is broken...waiting for fix from GraphCMS team
		return ''
		// let output = ''
		// if (styles) {
		// 	output += ['create', 'update'].map(type => {
		// 		return [
		// 			`${type}: {`,
		// 			typeof styles.top === 'number' ? `top: ${styles.top}` : null,
		// 			typeof styles.right === 'number' ? `right: ${styles.right}` : null,
		// 			typeof styles.bottom === 'number' ? `bottom: ${styles.bottom}` : null,
		// 			typeof styles.left === 'number' ? `left: ${styles.left}` : null,
		// 			typeof styles.width === 'number' ? `templateWidth: ${styles.width}` : null,
		// 			typeof styles.height === 'number' ? `templateHeight: ${styles.height}` : null,
		// 			typeof styles.percent === 'boolean' ? `widthAsPercent: ${styles.percent}` : null,
		// 			typeof styles.gap === 'number' ? `gap: ${styles.gap}` : null,
		// 			'}',
		// 		].filter(Boolean).join(EOL)
		// 	}).join(EOL) + EOL
		// }
		// return output
	}

	const mutation = `
		mutation update_clip(
			$slug: String
			${mutation_var_defs}
		) {
			updated_clip: updateClip(where: { id: "${clip.id}" }, data: {
				slug: $slug
				order: ${clip.order}
				template: ${clip.template}
				hideNavigation: ${clip.hide_navigation}
				themeElements: [${clip.theme_elements.join(', ')}]
				transitions: [${clip.transitions.join(', ')}]
				# FIXME: this is broken...waiting for fix from GraphCMS team
				# styles: {
				# 	upsert: {
				# 		where: { id: "${styles.id}" }
				# 		data: {
				# 			${styles_mutation()}
				# 		}
				# 	}
				# }
				assetBins: {
					upsert: [${clip.asset_bins.map((bin, bin_i) => `{
						where: { id: "${bin.id}" }
						data: {
							create: {
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
									}`).join(EOL)}]
								}
							}
							update: {
								order: ${bin.order || 0}
								${bin.transition ? `transition: ${bin.transition}` : ''}
								# links: { set: {} }
								assets: { set: [${bin.assets.map(asset => `{ id: "${asset.id}" }`).join(' ')}] }
								htmlBlocks: {
									upsert: [${bin.html_blocks.map((block, block_j) => `{
										where: { id: "${block.id}" }
										data: {
											${['create', 'update'].map(type => `${type}: {
												name: $name${bin_i}_${block_j}
												code: $code${bin_i}_${block_j}
												html: $html${bin_i}_${block_j}
												${block.template ? `template: ${block.template}` : ''}
												${block.color ? `highlightColor: ${block.color}` : ''}
												order: ${block.order || 0}
											}`).join(EOL)}
										}
									}`).join(EOL)}]
								}
							}
						}
					}`).join(EOL)}]
				}
				# um...not letting it be moved around to a different parent sequence yet
				# parentSequence: { connect: { id: "...parent_id..." } }
				# parentAudioClips:
			}) {
				id
			}
		}
	`

	const variables = { slug: clip.slug || '' }
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
