const req = require.context('../../assets/icons/svg', true, /\.svg$/)
const requireAll = requireContext => requireContext.keys()

const re = /\.\/(.*)\.svg/

const svgIcons = requireAll(req).map(i => {
  return `svg-icon-${i.match(re)[1]}`
})

export default svgIcons