import Head from 'next/head';
import Link from 'next/link';
import moment from 'moment';
import { get as _get } from 'lodash'
import {  Card, Row, Col, Table } from 'react-bootstrap';

// components global
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

// services
import { blocks } from '@/services/blocks';
import { tx } from '@/services/tx';


function index(props) {

  /**
   * Table Head
   */
  let heightBlock = _get(props, 'blocks[0].block_num');
  let heightBlockProducer = _get(props, 'blocks[0].producer');
  let heightBlockId = _get(_get(props, 'blocks[0].blocks_metadata').find(m => m.name == 'id'), 'value', '');
  let heightBlockTime = _get(_get(props, 'blocks[0].blocks_metadata').find(m => m.name == 'header.timestamp'), 'value', '');
  let signature = _get(_get(props, 'blocks[0].blocks_metadata').find(m => m.name == 'signature'), 'value', '');
  let networkUsed = _get(_get(props, 'blocks[0].blocks_receipts').find(m => m.name == 'network_bandwidth_used'), 'value', '0');
  let computeUsed = _get(_get(props, 'blocks[0].blocks_receipts').find(m => m.name == 'compute_bandwidth_used'), 'value', '0');
  let diskUsed = _get(_get(props, 'blocks[0].blocks_receipts').find(m => m.name == 'disk_storage_used'), 'value', '0');

  /**
   * Table Latest
   */
  let _blockItems = _get(props, 'blocks', []).slice(1, 11);
  let _txItems = _get(props, 'tx').slice(0, 10);

  return (
    <>
      <Head>
        <title> KoinosExplorer </title>
      </Head>

      <Navbar />
      <main className="container px-4">

        <Row>
          <Col className="px-1 my-xs-2 my-1">
            <Card>
              <Card.Header>
                <h5> Head Block </h5>
              </Card.Header>
              <Card.Body>

              <Table striped bordered hover responsive>
                <tbody>
                  <tr>
                    <td> Head block </td>
                    <td>
                      <Link href={`/block/${ heightBlock }`} className="link_next">
                        <a> { heightBlock } </a>
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td> Block id </td>
                    <td> { heightBlockId } </td>
                  </tr>
                  <tr>
                    <td> Producer </td>
                    <td>
                      <Link href={`/address/${ heightBlockProducer }`} className="link_next">
                        <a>{ heightBlockProducer }</a>
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td> Timestamp </td>
                    <td>
                      <a> { moment.unix(heightBlockTime/1000).format('DD-MM-YYYY H:mm:ss') } </a>
                    </td>
                  </tr>
                  <tr>
                    <td> Network Bandwidth Used </td>
                    <td>
                      <a> { networkUsed } </a>
                    </td>
                  </tr>
                  <tr>
                    <td> Compute Bandwidth Used </td>
                    <td>
                      <a> { computeUsed } </a>
                    </td>
                  </tr>
                  <tr>
                    <td> Disk Storage Used </td>
                    <td>
                      <a> { diskUsed } </a>
                    </td>
                  </tr>
                  <tr>
                    <td> Signature </td>
                    <td style={{ 'maxWidth': '200px' }}>
                      <span> { signature } </span>
                    </td>
                  </tr>

                </tbody>
              </Table>

              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col xs={12} md={12} lg={6} className="px-1 my-xs-2 my-1">
            <Card style={{ height: "500px", overflowY: 'auto' }}>
              <Card.Header>
                <h5> Last Blocks </h5>
              </Card.Header>
              <Card.Body className="p-2">

                <Table hover responsive>
                  <tbody>
                    {
                      _blockItems.map((b, bkey) => (
                        <tr key={bkey}>
                          <td>
                            <b className="d-block">Block:</b>
                            <Link href={`/block/${ _get(b, 'block_num', 0) }`} className="link_next">
                              <a>{ _get(b, 'block_num', 0) }</a>
                            </Link>
                          </td>
                          <td>
                            <b className="d-block">Producer:</b>
                            <Link href={`/address/${ _get(b, 'producer', '') }`} className="link_next">
                              <a>{ _get(b, 'producer', '') }</a>
                            </Link>
                          </td>
                          <td>
                            <b className="d-block">Timestamp:</b>
                            <span className="d-block">
                              {
                                moment.unix(
                                  _get(_get(b, 'blocks_metadata').find(m => m.name == 'header.timestamp'), 'value', '')/1000
                                ).fromNow()
                              }
                            </span>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </Table>


              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={12} lg={6} className="px-1 my-xs-2 my-1" >
            <Card style={{ height: "500px", overflowY: 'auto' }}>
              <Card.Header>
                <h5> Last Transactions </h5>
              </Card.Header>
              <Card.Body className="p-2">

              <Table hover responsive>
                  <tbody>
                    {
                      _txItems.map((t, tkey) => (
                        <tr key={tkey}>
                          <td>
                            <div>
                              <b>Id: </b>
                              <Link href={`/tx/${ _get(t, 'transaction_id', 0) }`} className="link_next">
                                <a>  { ""+_get(t, 'transaction_id', '').substring(0, 50)+'...' }</a>
                              </Link>
                            </div>
                            <div>
                              <b>Block num: </b>
                              <Link href={`/block/${ _get(t, 'block_num', 0) }`} className="link_next">
                                <a>  { _get(t, 'block_num', '') }</a>
                              </Link>
                            </div>
                            <div>
                              <b>Address: </b>
                              <Link href={`/address/${ _get(t, 'caller', 0) }`} className="link_next">
                                <a>  { _get(t, 'caller', '') }</a>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </Table>


              </Card.Body>
            </Card>
          </Col>

        </Row>

      </main>
      <Footer/>
    </>
  )
}

export async function getServerSideProps() {
  /**
   * Request data
   */
  let _props = {
    blocks: [],
    tx: [],
  }
  let latestBlocks, latestTx;
  try {
    latestBlocks = await blocks.getBlocksLatest();
    latestTx = await tx.getTxLatest();
  } catch (error) {}
  if(_get(latestBlocks, 'success', false) && _get(latestTx, 'success', false)) {
    _props['blocks'] = latestBlocks.data;
    _props['tx'] = latestTx.data;
  }

  return {
    props: _props
  }
}

export default index