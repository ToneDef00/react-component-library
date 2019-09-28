import React from 'react'

const Card = (props) => {
  let cardClass = "card mt-5 ";
  if(props.color){
    cardClass += props.color
  }
  return (
    <div className={cardClass}>
      <div className="card-body">
        <h5 className="card-title">{props.title}</h5>
        <hr />
        <p className="card-text">
          {props.bodyText}
        </p>
        {props.children}
      </div>
    </div>
  )
}

export default Card
