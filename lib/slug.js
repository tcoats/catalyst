const slugify = title => title.replace(/ /g, '-')
const unslugify = title => title.replace(/\-/g, ' ')

export { slugify, unslugify }