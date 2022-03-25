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
  let pages = _get(props, 'holders.page', '');
  let page_size = _get(pages, 'page_size', 30);
  let page_total = _get(pages, 'total', 0);
  let page_current = _get(pages, 'page', 0);
  let pagination = Math.ceil(page_total/page_size);

  return (
    <>
      <Head>
        <title> KoinosExplorer | Holders { _get(token, 'name', '') } </title>
      </Head>

      <Navbar />
      <main className="container">

        <Row>
          <Col className="px-1 my-xs-2 my-1">

          <Card>
              <Card.Header>
                <h5>
                  Holders of token:
                  <Link href={`/token/${ token_id }`} className="link_next">
                    <a> { _get(token, 'symbol', '') } </a>
                  </Link>
                  
                </h5>
              </Card.Header>
              <Card.Body className="p-2">


                <Table hover responsive>
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
                          <td> { (page_current*page_size)+holderK+1 } </td>
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

                <Pagination size="sm">

                  <Pagination.First className="px-2" disabled={page_current == 0} href={`/token/${token_id}/holders?page=${1}&page_size=${page_size}`} />
                  <Pagination.Prev className="px-2" disabled={page_current == 0} href={`/token/${token_id}/holders?page=${page_current}&page_size=${page_size}`} />
                  <Pagination.Item className="px-2" href={`/token/${token_id}/holders?page=${page_current+1}&page_size=${page_size}`} active={page_current === page_current}>
                    {page_current+1}
                  </Pagination.Item>
                  <Pagination.Next className="px-2" disabled={page_current == pagination-1} href={`/token/${token_id}/holders?page=${page_current+2}&page_size=${page_size}`} />
                  <Pagination.Last className="px-2" disabled={page_current == pagination-1} href={`/token/${token_id}/holders?page=${pagination}&page_size=${page_size}`} />

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
    holders: [],
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

  let tokeHolder;
  try {
    tokeHolder = await tokens.getHolders(id, page<1 ? 0 : page-1, page_size)
  } catch (error) {}
  if(_get(tokeHolder, 'success', false)) {
    _props["holders"] = tokeHolder;
  }

  return {
    props: _props
  }
}

export default index;

