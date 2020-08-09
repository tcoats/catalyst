const slugify = title => title.replace(/ /g, '-')
const unslugify = title => title.replace(/\-/g, ' ')
const classify = title => `document-${title.toLowerCase().replace(/ /g, '-')}`

export { slugify, unslugify, classify }