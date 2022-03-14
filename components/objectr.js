import Link from 'next/link';
import { Table, Form, ListGroup } from 'react-bootstrap';
import { get as _get } from 'lodash';

// utils
import { isBase64 } from '@/utils/data';
import { validate } from 'bitcoin-address-validation';


function Objectr(_props) {
  let props = _get(_props, 'commonProps', _props);
  let renderVlue = (dt) => {    
    if(typeof dt == 'object') {
      return Objectr(dt)
    }
    if(dt.length > 500) {
      return <Form.Control as="textarea" style={{ height: '300px' }} disabled defaultValue={dt} />
    }
    // check if b64
    if(!isBase64(dt)) {
      return dt.replace(/_/g, ' ')
    }
    if(validate(dt)) {
      return (
        <Link href={`/address/${  dt }`} className="link_next">
          <a>{ dt }</a>
        </Link>
      )
    }
    return dt
  }
  if(Array.isArray(props)) {
    return (
      <ListGroup>
        {
          props.map((d, keytt)=> (
            <ListGroup.Item key={keytt}>
              <Objectr commonProps={d}/>
            </ListGroup.Item>
          ))
        }
      </ListGroup>
    )
  }
  if(typeof props == 'object') {
    let heads = Object.keys(props)
    return (
      <Table striped bordered responsive>
        <thead>
          {
            heads.map((h, keyh) => (
              <tr key={keyh}>
                <td style={{ width: '160px', textAlign: 'center', verticalAlign: 'middle' }}> { h.replace(/_/g, ' ') } </td>
                <td> { renderVlue(props[h]) } </td>
              </tr>
            ))
          }
        </thead>
      </Table>
    )
  }
  return renderVlue(props)
}

export default Objectr