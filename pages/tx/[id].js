import Head from 'next/head';
import moment from 'moment';
import Link from 'next/link';
import {  Card, Row, Col, Table, Tab, Nav, ListGroup } from 'react-bootstrap';
import { get as _get } from 'lodash'

// components global
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import Objectr from '@/components/objectr';

// services
import { tx } from '@/services/tx';

// utils
import { dotData } from '@/utils/data';

function index(props) {
  return (
    <>
      <Head>
        <title> KoinosExplorer | Tx { _get(props, 'transaction_id', '') }  </title>
      </Head>

      <Navbar />
      <main className="container">

        <Row>
          <Col className="px-1 my-xs-2 my-1">

            <Tab.Container id="left-tabs-example" defaultActiveKey="tx">
              <Card>
                <Card.Header>
                  <Nav variant="tabs" defaultActiveKey="#tx">
                    <Nav.Item>
                      <Nav.Link eventKey="tx">Tx</Nav.Link>
                    </Nav.Item>
                    {
                      _get(props, 'transactions_metadata.operations', []).length ?
                      <Nav.Item>
                        <Nav.Link eventKey="operations">Operations</Nav.Link>
                      </Nav.Item>
                      : null
                    }
                    {
                      _get(props, 'transactions_receipts.events', []).length ?
                      <Nav.Item>
                        <Nav.Link eventKey="events">Events</Nav.Link>
                      </Nav.Item>
                      : null
                    }
                  </Nav>

                </Card.Header>
                <Card.Body>

                <Tab.Content>

                  <Tab.Pane eventKey="tx">

                    <Table striped bordered responsive>
                      <tbody>
                        <tr>
                          <td> Id </td>
                          <td> { _get(props, 'transaction_id', '') } </td>
                        </tr>
                        <tr>
                          <td> Address </td>
                          <td>
                            <Link href={`/address/${  _get(props, 'payer', '') }`} className="link_next">
                              <a>{ _get(props, 'payer', '') }</a>
                            </Link>
                          </td>
                        </tr>
                        <tr>
                          <td> Nonce </td>
                          <td> { _get(props, 'transactions_metadata.header.nonce', '') } </td>
                        </tr>
                        <tr>
                          <td> Block num </td>
                          <td> { _get(props, 'block_num', '') } </td>
                        </tr>
                        <tr>
                          <td> RC limit</td>
                          <td> { _get(props, 'transactions_receipts.rc_limit', '') } </td>
                        </tr>
                        <tr>
                          <td> RC used </td>
                          <td> { _get(props, 'transactions_receipts.rc_used', '') } </td>
                        </tr>
                        <tr>
                          <td> Network Bandwidth Used </td>
                          <td>
                            <a> { _get(props, 'transactions_receipts.network_bandwidth_used', '0') } </a>
                          </td>
                        </tr>
                        <tr>
                          <td> Compute Bandwidth Used </td>
                          <td>
                            <a> { _get(props, 'transactions_receipts.compute_bandwidth_used', '0') } </a>
                          </td>
                        </tr>
                        <tr>
                          <td> Disk Storage Used </td>
                          <td>
                            <a> { _get(props, 'transactions_receipts.disk_storage_used', '0') } </a>
                          </td>
                        </tr>
                        <tr>
                          <td> Signature </td>
                          <td style={{ 'maxWidth': '200px' }}>
                            <ListGroup>
                              {
                                _get(props, 'transactions_metadata.signatures', [])
                                .map((s, lkey) => (
                                  <ListGroup.Item key={lkey}> { s } </ListGroup.Item>
                                ))
                              }
                            </ListGroup>
                          </td>
                        </tr>
                        <tr>
                          <td> Operations </td>
                          <td style={{ 'maxWidth': '200px' }}>
                            <span> { _get(props, 'transactions_metadata.operations', []).length } </span>
                          </td>
                        </tr>
                        <tr>
                          <td> Events </td>
                          <td style={{ 'maxWidth': '200px' }}>
                            { _get(props, 'transactions_receipts.events', []).length }
                          </td>
                        </tr>

                      </tbody>
                    </Table>

                  </Tab.Pane>
                  <Tab.Pane eventKey="operations">

                    { Objectr(_get(props, 'transactions_metadata.operations', [])) }

                  </Tab.Pane>
                  
                  <Tab.Pane eventKey="events">

                    { Objectr(_get(props, 'transactions_receipts.events', [])) }

                  </Tab.Pane>

                </Tab.Content>

                </Card.Body>
              </Card>
            </Tab.Container>

          </Col>
        </Row>

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
  let txResult;
  try {
    txResult = await tx.getTxById(id);
  } catch (error) {}
  if(txResult.success) {
    _props = txResult.data;
    _props.transactions_receipts = dotData(_props.transactions_receipts);
    _props.transactions_metadata = dotData(_props.transactions_metadata);
  }

  return {
    props: _props
  }
}

export default index;
