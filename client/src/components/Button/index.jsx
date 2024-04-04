import React from 'react'

const Button = ({
  padding = '',
  fontSize = '',
  textColor = '',
  fontWeight = '',
  bgColor = '',
  border = '',
  borderColor = '',
  borderRadius = '',
  disabled,
  text = 'Button',
  clickEvent = () => {}
}) => {
  return (
    <button
      className={`${padding} ${fontSize} ${textColor} ${fontWeight} ${bgColor} ${border} ${borderColor} ${borderRadius}`}
      onClick={clickEvent}
      disabled={disabled}
    >
      {text}
    </button>
  )
}

export default Button