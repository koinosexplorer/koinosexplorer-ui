import Head from 'next/head';
import Link from 'next/link';
import moment from 'moment';
import { Card, Nav, Tab, Table } from 'react-bootstrap';
import { get as _get } from 'lodash'

// services
import { blocks } from '@/services/blocks';

// components global
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import Objectr from '@/components/objectr';

// utils
import { dotData } from '@/utils/data';

function index(props) {

  const renderObject = (data) => {
    if(Array.isArray(data)) {
      return data.map(d => renderObject(d))
    }
    let heads = Object.keys(data)
    return (
      <Table striped bordered>
        <thead>
          {
            heads.map((h, kH)=> (
              <tr key={kH}>
                <td> { h } </td>
                <td> { data[h] } </td>
              </tr>
            ))
          }
        </thead>
      </Table>
    )
  }

  return (
    <>
      <Head>

        <title> KoinosExplorer | Block { _get(props, 'block_num', '0') } </title>
      </Head>

      <Navbar />
      <main className="container">

        <Tab.Container id="left-tabs-example" defaultActiveKey="block">
          <Card>
            <Card.Header>

              <Nav variant="tabs" defaultActiveKey="#block">
                <Nav.Item>
                  <Nav.Link eventKey="block">Block</Nav.Link>
                </Nav.Item>

                {
                  _get(props, 'transactions', []).length ? 
                  <Nav.Item>
                    <Nav.Link eventKey="tx">Tx</Nav.Link>
                  </Nav.Item>
                  : null
                }

              </Nav>

            </Card.Header>
            <Card.Body>

            <Tab.Content>
              <Tab.Pane eventKey="block">

                <Table striped bordered responsive>
                  <tbody>
                    <tr>
                      <td> Block num </td>
                      <td> { _get(props, 'block_num', '0') } </td>
                    </tr>
                    <tr>
                      <td> Block id </td>
                      <td> { _get(props, 'blocks_metadata.id', '0') } </td>
                    </tr>
                    <tr>
                      <td> Producer </td>
                      <td>
                        <Link href={`/address/${ _get(props, 'producer', '') }`} className="link_next">
                          <a>{ _get(props, 'producer', '') }</a>
                        </Link>
                      </td>
                    </tr>
                    <tr>
                      <td> Timestamp </td>
                      <td> { moment.unix(_get(props, 'blocks_metadata.header.timestamp', '') / 1000).fromNow() } </td>
                    </tr>
                    <tr>
                      <td> Network Bandwidth Used </td>
                      <td>
                        <a> { _get(props, 'blocks_receipts.network_bandwidth_used', '0') } </a>
                      </td>
                    </tr>
                    <tr>
                      <td> Compute Bandwidth Used </td>
                      <td>
                        <a> { _get(props, 'blocks_receipts.compute_bandwidth_used', '0') } </a>
                      </td>
                    </tr>
                    <tr>
                      <td> Disk Storage Used </td>
                      <td>
                        <a> { _get(props, 'blocks_receipts.disk_storage_used', '0') } </a>
                      </td>
                    </tr>
                    <tr>
                      <td> Signature </td>
                      <td style={{ 'maxWidth': '200px' }}>
                        <span> { _get(props, 'blocks_metadata.signature', '') } </span>
                      </td>
                    </tr>
                    <tr>
                      <td> Transactions </td>
                      <td style={{ 'maxWidth': '200px' }}>
                        <span> { _get(props, 'transactions', []).length } </span>
                      </td>
                    </tr>
                    <tr>
                      <td> Events </td>
                      <td style={{ 'maxWidth': '200px' }}>
                        {
                          _get(props, 'blocks_receipts.events', []).length ? Objectr( _get(props, 'blocks_receipts.events', []) ) : '0'
                        }
                      </td>
                    </tr>

                  </tbody>
                </Table>

              </Tab.Pane>
              <Tab.Pane eventKey="tx">

                <Table striped bordered responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Transaction id</th>
                      <th>Address</th>
                    </tr>
                  </thead>
                  <tbody>

                    {
                      _get(props, 'transactions', []).map((t, key) => (
                        <tr key={key}>
                          <td> { key+1 } </td>
                          <td>
                            <Link href={`/tx/${ _get(t, 'transaction_id', '0') }`} className="link_next">
                              <a>{ _get(t, 'transaction_id', '0') }</a>
                            </Link>
                          </td>
                          <td>
                            <Link href={`/address/${  _get(t, 'payer', '') }`} className="link_next">
                              <a>{ _get(t, 'payer', '') }</a>
                            </Link>
                          </td>
                        </tr>
                      ))
                    }


                  </tbody>
                </Table>


              </Tab.Pane>

            </Tab.Content>

            </Card.Body>
          </Card>
        </Tab.Container>

      </main>
      <Footer/>
    </>
  )
}

export async function getServerSideProps({ params }) {
  const { id } = params;
  let _props = null
  /**
   * Request data
   */
  let blockResult;
  try {
    blockResult = await blocks.getBlocksById(id);
  } catch (error) {}
  if(_get(blockResult, 'success', false)) {
    _props = blockResult.data;
    _props.blocks_receipts = dotData(_props.blocks_receipts)
    _props.blocks_metadata = dotData(_props.blocks_metadata)
  }

  return {
    props: _props
  }
}

export default index;
