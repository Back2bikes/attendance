import React from 'react'
import PropTypes from 'prop-types';
import { Container, Divider, Card, Icon, Image, Label } from 'semantic-ui-react'
import '/imports/ui/ordering/ordering-part-card.css'

const PartCard = (props) => {
  const {
    _id,
    barcode,
    createdAt,
    desc,
    imageUrl,
    partNo,
    retailPrice,
    status,
    wholesalePrice
  } = props.part

  return (
    <Card className={props.className}
      key={_id}
    >
      <div className='part-img-container'>
        <Image src={imageUrl} className='part-img' />
      </div>
      <Card.Content>
        <Card.Header>Part # {partNo}</Card.Header>
        <Card.Meta>
          <span className='barcode'>{barcode}</span>
        </Card.Meta>

        <Divider />

        <Card.Description>{desc}</Card.Description>

        <Divider />

        <Card.Header>Price ${retailPrice}</Card.Header>
      </Card.Content>
    </Card>
  )
}

// PartsCard.propTypes = {

//   // _id:PropTypes.string.isRequired,
//   // barcode:,
//   // createdAt:,
//   // desc:,
//   // imageUrl:,
//   // partNo:,
//   // retailPrice:,
//   // status:,
//   // wholesalePrice:



//   // className: PropTypes.string,
//   // _id: PropTypes.string.isRequired,
//   // name: PropTypes.string.isRequired,
//   // avatar: PropTypes.string.isRequired,
//   // isHere: PropTypes.bool.isRequired,
//   // sessions: PropTypes.array.isRequired,
//   // lastIn: PropTypes.object,
//   // sessionCount: PropTypes.number.isRequired,
// };

export default PartCard