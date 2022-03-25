import Head from 'next/head';
import Link from 'next/link';
import { get as _get } from 'lodash'
import { Row, Col, Table, Card, Pagination } from 'react-bootstrap';

// components global
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

// services
import { tokens } from '@/services/tokens';

function index(props) {
  let token = _get(props, 'token', '');
  let token_id = _get(props, 'token.token_id', '');

  // pagination
  let pages = _get(props, 'tx.page', '');
  let page_size = _get(pages, 'page_size', 30);
  let page_total = _get(pages, 'total', 0);
  let page_current = _get(pages, 'page', 0);
  let pagination = Math.ceil(page_total/page_size);

  return (
    <>
      <Head>
        <title> KoinosExplorer | Transactions { _get(token, 'name', '') } </title>
      </Head>

      <Navbar />
      <main className="container">

        <Row>
          <Col className="px-1 my-xs-2 my-1">

          <Card>
              <Card.Header>
                <h5>
                  Transactions of token:
                  <Link href={`/token/${ token_id }`} className="link_next">
                    <a> { _get(token, 'symbol', '') } </a>
                  </Link>
                  
                </h5>
              </Card.Header>
              <Card.Body className="p-2">


                <Table hover responsive>
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

                <Pagination size="sm">

                  <Pagination.First className="px-2" disabled={page_current == 0} href={`/token/${token_id}/transactions?page=${1}&page_size=${page_size}`} />
                  <Pagination.Prev className="px-2" disabled={page_current == 0} href={`/token/${token_id}/transactions?page=${page_current}&page_size=${page_size}`} />
                  <Pagination.Item className="px-2" href={`/token/${token_id}/transactions?page=${page_current+1}&page_size=${page_size}`} active={page_current === page_current}>
                    {page_current+1}
                  </Pagination.Item>
                  <Pagination.Next className="px-2" disabled={page_current == pagination-1} href={`/token/${token_id}/transactions?page=${page_current+2}&page_size=${page_size}`} />
                  <Pagination.Last className="px-2" disabled={page_current == pagination-1} href={`/token/${token_id}/transactions?page=${pagination}&page_size=${page_size}`} />

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
    token: {},
    tx: [],
  }


  /**
   * Request data
   */

  let tokeData;
  try {
    tokeData = await tokens.getToken(id)
  } catch (error) {}
  if(_get(tokeData, 'success', false)) {
    _props["token"] = tokeData.data;
  }

  let tokeTransactions;
  try {
    tokeTransactions = await tokens.getTransfersByToken(id, page<1 ? 0 : page-1, page_size)
  } catch (error) {}
  if(_get(tokeTransactions, 'success', false)) {
    _props["tx"] = tokeTransactions;
  }

  return {
    props: _props
  }
}

export default index;
