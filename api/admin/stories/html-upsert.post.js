const { cms_mutate } = require('../../../loaders.js')

module.exports = async function({ id, asset_bin_id, name, template, color, code, html }) {

	template = template === '' ? null : template
	color = color === '' ? null : color

	const template_str = template !== undefined ? `template: ${template}` : ''
	const color_str = color !== undefined ? `highlightColor: ${color}` : ''

	const mutation = `
		mutation UpsertHtml($code: String, $html: String, $name: String) {
			html_block: upsertHtmlBlock(
				where: { id: "${id}" }
				create: {
					name: $name
					${template_str}
					${color_str}
					code: $code
					html: $html
					parentAssetBin: {
						connect: { id: "${asset_bin_id}" }
					}
				}
				update: {
					name: $name
					${template_str}
					${color_str}
					code: $code
					html: $html
					parentAssetBin: {
						connect: { id: "${asset_bin_id}" }
					}
				}
			) {
				id
				name
				template
				color: highlightColor
				code
				html
			}
		}
	`
	const variables = {
		name: name || '',
		code: JSON.stringify(code || {}),
		html: html || '',
	}

	const res = await cms_mutate(mutation, variables)
	res.html_block.code = JSON.parse(res.html_block.code)

	return res

}
