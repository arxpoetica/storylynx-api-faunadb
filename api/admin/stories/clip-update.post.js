import { EOL } from 'os'
import { cms_mutate } from '../../../loaders.js'

export const api = async function({ clip }) {

	let mutation_var_defs = clip.asset_bins.map((bin, bin_i) => {
		return bin.assets.map((_, asset_j) => {
			return `
				$name${bin_i}_${asset_j}: String
				$source${bin_i}_${asset_j}: String
				$caption${bin_i}_${asset_j}: String
				$code${bin_i}_${asset_j}: String
				$html${bin_i}_${asset_j}: String
			`
		})
	}).filter(Boolean).join(EOL)
	mutation_var_defs = mutation_var_defs.length ? EOL + mutation_var_defs : ''

	const { styles } = clip
	const styles_mutation = () => {
		let output = ''
		if (styles) {
			output += ['create', 'update'].map(type => {
				return [
					`${type}: {`,
					'top: ' + (typeof styles.top === 'number' ? styles.top : 'null'),
					'right: ' + (typeof styles.right === 'number' ? styles.right : 'null'),
					'bottom: ' + (typeof styles.bottom === 'number' ? styles.bottom : 'null'),
					'left: ' + (typeof styles.left === 'number' ? styles.left : 'null'),
					'templateWidth: ' + (typeof styles.width === 'number' ? styles.width : 'null'),
					'templateHeight: ' + (typeof styles.height === 'number' ? styles.height : 'null'),
					'widthAsPercent: ' + (typeof styles.percent === 'boolean' ? styles.percent : 'null'),
					'gap: ' + (typeof styles.gap === 'number' ? styles.gap : 'null'),
					'}',
				].filter(Boolean).join(EOL)
			}).join(EOL) + EOL
		}
		return output
	}

	function generate_story_asset(asset, bin_index, asset_index) {
		return `{
			order: ${asset.order || 0}
			${asset.asset_id ? `asset: { connect: { id: "${asset.asset_id}" } }` : ''}
			name: $name${bin_index}_${asset_index}
			source: $source${bin_index}_${asset_index}
			caption: $caption${bin_index}_${asset_index}
			${typeof asset.width === 'number' ? `widthOverride: ${asset.width}` : ''}
			${typeof asset.height === 'number' ? `heightOverride: ${asset.height}` : ''}
			${typeof asset.volume === 'number' ? `volume: ${asset.volume}` : ''}
			${asset.bg_pos ? `backgroundPosition: ${asset.bg_pos}` : ''}
			${typeof asset.contain === 'boolean' ? `contain: ${asset.contain}` : ''}
			${typeof asset.play_once === 'boolean' ? `playOnce: ${asset.play_once}` : ''}
			html: $html${bin_index}_${asset_index}
			htmlCode: $code${bin_index}_${asset_index}
			${asset.template ? `htmlTemplate: ${asset.template}` : ''}
			${asset.color ? `htmlHighlightColor: ${asset.color}` : ''}
		}`
	}

	/* eslint-disable max-len */
	const mutation = `
		mutation update_clip(
			$slug: String
			${mutation_var_defs}
		) {
			updated_clip: updateClip(where: { id: "${clip.id}" }, data: {
				slug: $slug
				order: ${clip.order}
				template: ${clip.template}
				hideClip: ${clip.hide_clip || false}
				hideNavigation: ${clip.hide_navigation || false}
				themeElements: [${clip.theme_elements.join(', ')}]
				transitions: [${clip.transitions.join(', ')}]
				styles: {
					upsert: {
						where: { id: "${styles.id}" }
						data: {
							${styles_mutation()}
						}
					}
				}
				assetBins: {
					upsert: [${clip.asset_bins.map((bin, bin_i) => `{
						where: { id: "${bin.id}" }
						data: {
							create: {
								order: ${bin.order || 0}
								${bin.transition ? `transition: ${bin.transition}` : ''}
								storyAssets: {
									create: [${bin.assets.map((asset, asset_j) => generate_story_asset(asset, bin_i, asset_j)).join(EOL)}]
								}
							}
							update: {
								order: ${bin.order || 0}
								${bin.transition ? `transition: ${bin.transition}` : ''}
								storyAssets: {
									upsert: [${bin.assets.map((asset, asset_j) => `{
										where: { id: "${asset.id}" }
										data: {
											${['create', 'update'].map(type => `${type}: ${generate_story_asset(asset, bin_i, asset_j)}`).join(EOL)}
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
		bin.assets.forEach((asset, asset_j) => {
			variables[`name${bin_i}_${asset_j}`] = asset.name || ''
			variables[`source${bin_i}_${asset_j}`] = asset.source || ''
			variables[`caption${bin_i}_${asset_j}`] = asset.caption || ''
			variables[`code${bin_i}_${asset_j}`] = JSON.stringify(asset.code || {})
			variables[`html${bin_i}_${asset_j}`] = asset.html || ''
		})
	})

	const res = await cms_mutate(mutation, variables)
	return res

}
