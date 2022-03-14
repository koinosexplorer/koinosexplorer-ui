import Head from 'next/head';
import { get as _get } from 'lodash'

// components global
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

function index(props) {
  let address = _get(props, 'address', '');
  let tokens = _get(props, 'tokens', '')

  return (
    <>
      <Head>
        <title> KoinosExplorer | Tokens { address } </title>
      </Head>

      <Navbar />
      <main className="container">
      </main>
      <Footer/>
    </>
  )
}

export async function getServerSideProps({ params }) {
  const { id } = params;
  let _props = {
    address: id,
    tokens: []
  }
  return {
    props: _props
  }
}

export default index;
