import { NextPage } from 'next'
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'

interface Props {
  rndNumber: Number
}

export default function Test({ rndNumber }: Props) {
  return <h1>{rndNumber} nummber</h1>
}

// const Test: NextPage<Props> = ({rndNumber}) => {
//   return <h1>{rndNumber}</h1>
// }



export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      rndNumber: 2
    }
  }
}