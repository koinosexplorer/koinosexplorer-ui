import Head from 'next/head';
import Link from 'next/link';
import moment from 'moment';
import { get as _get } from 'lodash'
import { Row, Col, Table, Card, Pagination } from 'react-bootstrap';

// components global
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

// services
import { blocks } from '@/services/blocks';

// utils
import { dotData } from '@/utils/data';

function index(props) {
  let address = _get(props, 'address', '');
  let _blocks = _get(props, 'blocks.data', '');

  // pagination
  let pages = _get(props, 'blocks.page', '');
  let page_size = _get(pages, 'page_size', 30);
  let page_total = _get(pages, 'total', 0);
  let page_current = _get(pages, 'page', 0);
  let pagination = Math.ceil(page_total/page_size);

  return (
    <>
      <Head>
        <title> KoinosExplorer | Blocks { address } </title>
      </Head>

      <Navbar />
      <main className="container">

        <Row>
          <Col className="px-1 my-xs-2 my-1">

          <Card>
              <Card.Header>
                <h5>
                  Blocks: 
                  <Link href={`/address/${ address }`} className="link_next">
                    <a> { address }</a>
                  </Link>
                </h5>
              </Card.Header>
              <Card.Body className="p-2">


                <Table hover responsive>
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
                      _blocks.map((b, bkey) => (
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

                <Pagination size="sm">

                  <Pagination.First className="px-2" disabled={page_current == 0} href={`/address/${address}/blocks?page=${1}&page_size=${page_size}`} />
                  <Pagination.Prev className="px-2" disabled={page_current == 0} href={`/address/${address}/blocks?page=${page_current}&page_size=${page_size}`} />
                  <Pagination.Item className="px-2" href={`/address/${address}/blocks?page=${page_current+1}&page_size=${page_size}`} active={page_current === page_current}>
                    {page_current+1}
                  </Pagination.Item>
                  <Pagination.Next className="px-2" disabled={page_current == pagination-1} href={`/address/${address}/blocks?page=${page_current+2}&page_size=${page_size}`} />
                  <Pagination.Last className="px-2" disabled={page_current == pagination-1} href={`/address/${address}/blocks?page=${pagination}&page_size=${page_size}`} />


                </Pagination>

              </Card.Body>
            </Card>

          </Col>
        </Row>

      </main>
      <Footer/>
    </>
  )
}

export async function getServerSideProps({ params, query }) {
  const { id } = params;
  const { page = 0, page_size = 30 } = query;
  let _props = {
    address: id,
    blocks: [],
  }


  /**
   * Request data
   */
  let blocksProducers;
  try {
    blocksProducers = await blocks.getBlocksByProducer(id, page<1 ? 0 : page-1, page_size);
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
