import { GetStaticProps } from "next"
import { api } from "../services/api"
import { format, parseISO } from "date-fns"
import ptBR from "date-fns/locale/pt-BR"
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString"

interface Episode {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: string;
  duration: number;
  durationAsString: string;
  description: string;
  url: string;
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

  const episodes = data.map((e) => {
    return {
      id: e.id,
      title: e.title,
      thumbnail: e.thumbnail,
      members: e.members,
      publishedAt: format(parseISO(e.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(e.file.duration),
      durationAsString: convertDurationToTimeString(Number(e.file.duration)),
      description: e.description,
      url: e.file.url
    }
  })

  return {
    props: {
      episodes: episodes
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