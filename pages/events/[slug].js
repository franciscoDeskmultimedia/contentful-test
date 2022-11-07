import { useRouter } from 'next/router'
import Head from 'next/head'
import ErrorPage from 'next/error'
import Container from '../../components/container'
import PostBody from '../../components/post-body'
import MoreStories from '../../components/more-stories'
import Header from '../../components/header'
import PostHeader from '../../components/post-header'
import SectionSeparator from '../../components/section-separator'
import Layout from '../../components/layout'
import { getAllEventsWithSlug, getEventsAndMoreEvents } from '../../lib/api'
import PostTitle from '../../components/post-title'
import { CMS_NAME } from '../../lib/constants'

export default function Post({ post, morePosts, preview }) {
  const router = useRouter()

  if (!router.isFallback && !post) {
    return <ErrorPage statusCode={404} />
  }

  return (
    <Layout preview={preview}>
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article>
              <Head>
                <title>
                  {post.eventName} | Next.js Blog Example with {CMS_NAME}
                </title>
                <meta property="og:image" content={post.eventFeaturedImage.url} />
              </Head>
              <PostHeader
                title={post.eventName}
                coverImage={post.eventFeaturedImage}
                date={post.eventDate}
                // author={post.author}
              />
              {/* <PostBody content={post.content} /> */}
            </article>
            <SectionSeparator />
            {/* {morePosts && morePosts.length > 0 && (
              <MoreStories posts={morePosts} />
            )} */}
          </>
        )}
      </Container>
    </Layout>
  )
}

export async function getStaticProps({ params, preview = false }) {
  const data = await getEventsAndMoreEvents(params.slug, preview)

  return {
    props: {
      preview,
      post: data?.post ?? null,
      morePosts: data?.morePosts ?? null,
    },
  }
}

export async function getStaticPaths() {
  const allPosts = await getAllEventsWithSlug()
  return {
    paths: allPosts?.map(({ slug }) => `/events/${slug}`) ?? [],
    fallback: true,
  }
}