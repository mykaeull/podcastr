import { GetStaticProps } from "next"
import { api } from "../services/api"

interface Episode {
  id: string;
  title: string;
  members: string;
  published_at: string;
}

interface HomeProps {
  episodes: Episode[]
}

export default function Home(props: HomeProps) {
  return (
    <>
      <h1>Index</h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </>
  )
}

// SSG (serve site generation)
export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: { // episodes?_limit=12&_sort=published_at&_order=desc
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  return {
    props: {
      episodes: data
    },
    revalidate: 60 * 60 * 8
  }
}

/* SSR (server side rendering)
export async function getServerSideProps() {
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json()

  return {
    props: {
      episodes: data
    }
  }
}
*/