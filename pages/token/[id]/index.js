import Head from 'next/head';
import Link from 'next/link';
import { get as _get } from 'lodash'
import { Row, Col, Table, Card, Tab, Nav } from 'react-bootstrap';

// services
import { tokens } from '@/services/tokens';

// components global
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

function index(props) {
  let token = _get(props, 'token', '')
  let token_id = _get(props, 'token.token_id', '');

  return (
    <>
      <Head>
        <title> KoinosExplorer | Token { _get(token, 'name', '') } </title>
      </Head>

      <Navbar />
      <main className="container">

        <Row>
          <Col xs={12} md={12} lg={12} className="px-1 my-xs-2 my-1" >
            <Card style={{ overflowY: 'auto' }}>
              <Card.Body className="p-2">

                <Table>
                  <tbody>
                    <tr>
                      <td> Token name </td>
                      <td> { _get(token, 'name', '') } </td>
                    </tr>
                    <tr>
                      <td> Token symbol </td>
                      <td> { _get(token, 'symbol', '') } </td>
                    </tr>
                    <tr>
                      <td> Token decimals </td>
                      <td> { _get(token, 'decimals', '') } </td>
                    </tr>
                    <tr>
                      <td> Token contract </td>
                      <td> { _get(token, 'contract_id', '') } </td>
                    </tr>
                  </tbody>
                </Table>
                  
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col xs={12} md={12} lg={12} className="px-1 my-xs-2 my-1" >

          <Tab.Container id="left-tabs-example" defaultActiveKey="tx">
              <Card>
                <Card.Header>
                  <Nav variant="tabs" defaultActiveKey="#tx">
                    <Nav.Item>
                      <Nav.Link eventKey="tx">Transactions</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="holders">Holders</Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Card.Header>
                <Card.Body>
                  <Tab.Content>

                    <Tab.Pane eventKey="tx">
                      <p>
                        Latest 30 from a total of
                        <Link href={`/token/${token_id}/transactions`} className="link_next">
                          <a> { _get(props, 'tx.page.total') } </a>
                        </Link>
                        transactions
                      </p>

                      <Table striped bordered responsive>
                        <thead>
                          <tr>
                            <th>Transaction</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Value</th>
                          </tr>
                        </thead>
                        <tbody>

                          {
                            _get(props, 'tx.data', []).map((t, bkey) => (
                              <tr key={bkey}>
                                <td>
                                  <Link href={`/tx/${ _get(t,'transaction_id', '0') }`} className="link_next">
                                    <a>{ _get(t,'transaction_id', '0').substring(0, 20) + '...' }</a>
                                  </Link>
                                </td>
                                <td>
                                  <Link href={`/address/${ _get(t,'from', '') }`} className="link_next">
                                    <a>{ _get(t,'from', '') }</a>
                                  </Link>
                                </td>
                                <td>
                                  <Link href={`/address/${ _get(t,'to', '') }`} className="link_next">
                                    <a>{ _get(t,'to', '') }</a>
                                  </Link>
                                </td>
                                <td> { Number( _get(t,'value', "0") ) / Number( "1".padEnd(Number( _get(props,'token.decimals', "0") )+1, "0")) } </td>
                              </tr>
                            ))
                          }

                        </tbody>
                      </Table>
                    </Tab.Pane>
                    <Tab.Pane eventKey="holders">

                      <p>
                        First 30 holders of
                        <Link href={`/token/${token_id}/holders`} className="link_next">
                          <a> { _get(props, 'holders.page.total') } </a>
                        </Link>
                        holders
                      </p>


                      <Table striped bordered responsive>
                        <thead>
                          <tr>
                            <th>Rank</th>
                            <th>Holder</th>
                            <th>Quantity</th>
                          </tr>
                        </thead>
                        <tbody>

                          {
                            _get(props, 'holders.data', []).map((holder, holderK) => (
                              <tr key={holderK}>
                                <td> { holderK+1 } </td>
                                <td>
                                  <Link href={`/address/${ _get(holder, 'holder', '') }`} className="link_next">
                                    <a> { _get(holder, 'holder', '') } </a>
                                  </Link>
                                </td>
                                <td> { Number( _get(holder,'amount', "0") ) / Number( "1".padEnd(Number( _get(props,'token.decimals', "0") )+1, "0"))  } </td>
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


          </Col>
        </Row>

      </main>
      <Footer/>
    </>
  )
}

export async function getServerSideProps({ params }) {
  const { id } = params;
  let _props = {
    token: {},
    tx: [],
    holders: []
  }
  let tokeData;
  try {
    tokeData = await tokens.getToken(id)
  } catch (error) {}
  if(_get(tokeData, 'success', false)) {
    _props["token"] = tokeData.data;
  }

  let tokeTransactions;
  try {
    tokeTransactions = await tokens.getTransfersByToken(id)
  } catch (error) {}
  if(_get(tokeTransactions, 'success', false)) {
    _props["tx"] = tokeTransactions;
  }


  let tokeHolder;
  try {
    tokeHolder = await tokens.getHolders(id)
  } catch (error) {}
  if(_get(tokeHolder, 'success', false)) {
    _props["holders"] = tokeHolder;
  }

  return {
    props: _props
  }
}

export default index;
