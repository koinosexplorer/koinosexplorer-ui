import Head from 'next/head';
import Link from 'next/link';
import { get as _get } from 'lodash'
import { Row, Col, Table, Card, Pagination } from 'react-bootstrap';

// components global
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

// services
import { tx } from '@/services/tx';

// utils
import { dotData, getNonce } from '@/utils/data';

function index(props) {
  let address = _get(props, 'address', '');
  let txs = _get(props, 'txs.data', '');

  // pagination
  let pages = _get(props, 'txs.page', '');
  let page_size = _get(pages, 'page_size', 30);
  let page_total = _get(pages, 'total', 0);
  let page_current = _get(pages, 'page', 0);
  let pagination = Math.ceil(page_total/page_size);

  return (
    <>
      <Head>
        <title> KoinosExplorer | Transactions { address } </title>
      </Head>

      <Navbar />
      <main className="container">

        <Row>
          <Col className="px-1 my-xs-2 my-1">

          <Card>
              <Card.Header>
                <h5>
                  Transactions: 
                  <Link href={`/address/${ address }`} className="link_next">
                    <a> { address }</a>
                  </Link>
                </h5>
              </Card.Header>
              <Card.Body className="p-2">


                <Table hover responsive>
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

                <Pagination size="sm">

                  <Pagination.First className="px-2" disabled={page_current == 0} href={`/address/${address}/transactions?page=${1}&page_size=${page_size}`} />
                  <Pagination.Prev className="px-2" disabled={page_current == 0} href={`/address/${address}/transactions?page=${page_current}&page_size=${page_size}`} />
                  <Pagination.Item className="px-2" href={`/address/${address}/transactions?page=${page_current+1}&page_size=${page_size}`} active={page_current === page_current}>
                    {page_current+1}
                  </Pagination.Item>
                  <Pagination.Next className="px-2" disabled={page_current == pagination-1} href={`/address/${address}/transactions?page=${page_current+2}&page_size=${page_size}`} />
                  <Pagination.Last className="px-2" disabled={page_current == pagination-1} href={`/address/${address}/transactions?page=${pagination}&page_size=${page_size}`} />

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
    txs: [],
  }


  /**
   * Request data
   */
  let txAdddressResult;
  try {
    txAdddressResult = await tx.getTxByAddress(id, page<1 ? 0 : page-1, page_size);
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

  return {
    props: _props
  }
}

export default index;
