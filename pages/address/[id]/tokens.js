import Head from 'next/head';
import Link from 'next/link';
import { get as _get, uniq as _uniq } from 'lodash'
import { Row, Col, Table, Card, Pagination } from 'react-bootstrap';

// services
import { tokens } from '@/services/tokens';

// components global
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

function index(props) {
  let address = _get(props, 'address', '');
  let _tokens = _get(props, 'tokens.data', []);

  // pagination
  let pages = _get(props, 'tokens.page', '');
  let page_size = _get(pages, 'page_size', 30);
  let page_total = _get(pages, 'total', 0);
  let page_current = _get(pages, 'page', 0);
  let pagination = Math.ceil(page_total/page_size);

  return (
    <>
      <Head>
        <title> KoinosExplorer | Tokens { address } </title>
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


                <Table striped bordered responsive>
                  <thead>
                    <tr>
                      <th>Transaction</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Value</th>
                      <th>Token</th>
                    </tr>
                  </thead>
                  <tbody>

                    {
                      _tokens.map((t, bkey) => (
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
                          <td> { Number( _get(t,'value', "0") ) / Number( "1".padEnd(Number( _get(t,'token_info.decimals', "0") )+1, "0")) } </td>
                          <td> { _get(t, 'token_info.symbol') } </td>
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
    tokens: []
  }

  let tokensTransactions;
  try {
    tokensTransactions = await tokens.getTransfersByAddress(id, page<1 ? 0 : page-1, page_size);
  } catch (error) {}
  if(_get(tokensTransactions, 'success', false)) {

    let tokensFull = {}
    let _tokens = _uniq(tokensTransactions.data.map(t => t.token_id));
    for (let indexT = 0; indexT < _tokens.length; indexT++) {
      let token_id = _tokens[indexT];
      let tokeDt = await tokens.getToken(token_id);
      tokensFull[token_id] = tokeDt.data
    }

    let resultData = tokensTransactions.data;
    let resulFinal = [];
    for (let index = 0; index < resultData.length; index++) {
      let tokenTransfer = resultData[index];
      tokenTransfer["token_info"] = tokensFull[tokenTransfer.token_id];
      resulFinal.push(tokenTransfer);
    }
    tokensTransactions.data = resulFinal;
    _props["tokens"] = tokensTransactions;
  }


  return {
    props: _props
  }
}

export default index;
