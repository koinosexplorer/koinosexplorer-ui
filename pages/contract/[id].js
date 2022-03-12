import Head from 'next/head';
import { get as _get } from 'lodash'

// components global
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

function index(props) {
  let contract = _get(props, 'contract', '')
  let txs = _get(props, 'txs', '')

  return (
    <>
      <Head>
        <title> KoinosExplorer | Address { contract } </title>
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
    contract: id,
    txs: []
  }
  return {
    props: _props
  }
}

export default index;
