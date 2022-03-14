import Head from 'next/head';
import Link from 'next/link';
import moment from 'moment';
import copyClipboard from 'copy-text-to-clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Row, Col, Table, Card, Tab, Nav } from 'react-bootstrap';
import { get as _get } from 'lodash';

 
// components global
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

// services
import { tx } from '@/services/tx';
import { blocks } from '@/services/blocks';
import { tokens } from '@/services/tokens';

// icons
import { faCopy } from '@fortawesome/free-solid-svg-icons'

// utils
import { dotData, getNonce } from '@/utils/data';

function index(props) {
  let address = _get(props, 'address', '');

  let txs = _get(props, 'txs.data', []);
  let txs_total = _get(props, 'txs.page.total', 0);
  let blocks = _get(props, 'blocks.data', []);
  let blocks_total = _get(props, 'blocks.page.total', 0);

  return (
    <>
      <Head>
        <title> KoinosExplorer | Address { address } </title>
      </Head>

      <Navbar />
      <main className="container">
        <Row>
          <Col xs={12} md={12} lg={12} className="px-1 my-xs-2 my-1" >
            <Card style={{ overflowY: 'auto' }}>
              <Card.Header>
                <div className='d-flex'>
                  <h5> Address: { address } </h5>
                  <FontAwesomeIcon icon={faCopy} className="mx-2" color="black" onClick={() => copyClipboard(address)} />
                </div>
              </Card.Header>
              <Card.Body className="p-2">

                <Table>
                  <tbody>
                    <tr>
                      <td> Total transactions </td>
                      <td> { txs_total } </td>
                    </tr>
                    <tr>
                      <td> Total blocks </td>
                      <td> { blocks_total } </td>
                    </tr>
                  </tbody>
                </Table>
                  
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col className="px-1 my-xs-2 my-1">

            <Tab.Container id="left-tabs-example" defaultActiveKey="tx">
              <Card>
                <Card.Header>
                  <Nav variant="tabs" defaultActiveKey="#tx">
                    <Nav.Item>
                      <Nav.Link eventKey="tx">Transactions</Nav.Link>
                    </Nav.Item>
                    {
                      _get(props, 'blocks.page.total', 0) ?
                      <Nav.Item>
                        <Nav.Link eventKey="blocks">Blocks</Nav.Link>
                      </Nav.Item>
                      : null
                    }
                    <Nav.Item>
                      <Nav.Link eventKey="tokens">Tokens</Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Card.Header>
                <Card.Body>
                  <Tab.Content>

                    <Tab.Pane eventKey="tx">
                      <p>
                        Latest 30 from a total of
                        <Link href={`/address/${address}/transactions`} className="link_next">
                          <a> { txs_total } </a>
                        </Link>
                        transactions
                      </p>

                      <Table striped bordered responsive>
                        <thead>
                          <tr>
                            <th>Nonce</th>
                            <th>Transaction</th>
                            <th>Block num</th>
                            <th>Operations</th>
                            <th>Resources used</th>
                          </tr>
                        </thead>
                        <tbody>

                          {
                            txs.map((t, tkey) => (
                              <tr key={tkey}>
                                <td> { getNonce(_get(t,'transactions_metadata.header.nonce', '')) } </td>
                                <td>
                                  <Link href={`/tx/${ _get(t, 'transaction_id', '') }`} className="link_next">
                                    <a>{ _get(t,'transaction_id', '') }</a>
                                  </Link>
                                </td>
                                <td>
                                  <Link href={`/block/${ _get(t,'block_num', '') }`} className="link_next">
                                    <a>{ _get(t,'block_num', '') }</a>
                                  </Link>
                                </td>
                                <td> { _get(t,'transactions_metadata.operations', []).length } </td>
                                <td> { _get(t,'transactions_receipts.rc_used', '0') } </td>
                              </tr>
                            ))
                          }


                        </tbody>
                      </Table>
                    </Tab.Pane>
                    <Tab.Pane eventKey="tokens">
                      <h5 className="my-4 text-center"> Tokens history under construction </h5>
                    </Tab.Pane>

                    <Tab.Pane eventKey="blocks">
                      <p>
                        Latest 30 from a total of
                        <Link href={`/address/${address}/blocks`} className="link_next">
                          <a> { blocks_total } </a>
                        </Link>
                        blocks
                      </p>

                      <Table striped bordered responsive>
                        <thead>
                          <tr>
                            <th>Block num</th>
                            <th>id</th>
                            <th>Operations</th>
                            <th>Timestamp</th>
                          </tr>
                        </thead>
                        <tbody>

                          {
                            blocks.map((b, bkey) => (
                              <tr key={bkey}>
                                <td>
                                  <Link href={`/block/${ _get(b,'block_num', '0') }`} className="link_next">
                                    <a>{ _get(b,'block_num', '0') }</a>
                                  </Link>
                                </td>
                                <td> { _get(b,'blocks_metadata.id', '') } </td>
                                <td> { _get(b,'transactions', []).length } </td>
                                <td> { moment.unix( _get(b,'blocks_metadata.header.timestamp', '0')/1000 ).format('DD-MM-YYYY H:mm:ss') } </td>
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
    address: id,
    txs: [],
    blocks: []
  }
  /**
   * Request data
   */
  let txAdddressResult;
  try {
    txAdddressResult = await tx.getTxByAddress(id);
  } catch (error) {}
  if(txAdddressResult.success) {
    let resultData = txAdddressResult.data;
    let resulFinal = [];
    for (let index = 0; index < resultData.length; index++) {
      let tx = resultData[index];
      tx.transactions_receipts = dotData(tx.transactions_receipts);
      tx.transactions_metadata = dotData(tx.transactions_metadata);
      resulFinal.push(tx);
    }
    txAdddressResult.data = resulFinal;
    _props["txs"] = txAdddressResult;
  }


  let blocksProducers;
  try {
    blocksProducers = await blocks.getBlocksByProducer(id);
  } catch (error) {}
  if(blocksProducers.success) {
    let resultData = blocksProducers.data;
    let resulFinal = [];
    for (let index = 0; index < resultData.length; index++) {
      let block = resultData[index];
      block.blocks_receipts = dotData(block.blocks_receipts);
      block.blocks_metadata = dotData(block.blocks_metadata);
      resulFinal.push(block);
    }
    blocksProducers.data = resulFinal;
    _props["blocks"] = blocksProducers;
  }

  return {
    props: _props
  }
}

export default index;
