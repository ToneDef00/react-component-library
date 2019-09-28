import React from 'react'
import { PropTypes } from 'prop-types'

const Column = props => {
  let styleClass = ''

  if (props.small) {
    styleClass += `col-sm-${props.small} `
  }
  if (props.medium) {
    styleClass += `col-md-${props.medium} `
  }
  if (props.large) {
    styleClass += `col-lg-${props.large} `
  }
  if (props.offset_sm) {
    styleClass += `offset-sm-${props.offset_sm} `
  }
  if (props.offset_md) {
    styleClass += `offset-md-${props.offset_md} `
  }
  if (props.offset_lg) {
    styleClass += `offset-lg-${props.offset_lg} `
  }

  if (styleClass.length > 1) {
    styleClass.slice(0, -1)
  }

  console.log(styleClass)
  return <div className={styleClass}>{props.children}</div>
}

Column.propTypes = {
  small: PropTypes.number,
  medium: PropTypes.number,
  large: PropTypes.number,
  offset_sm: PropTypes.number,
  offset_md: PropTypes.number,
  offset_lg: PropTypes.number
}

export default Column
