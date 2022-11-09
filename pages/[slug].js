import { useRouter } from 'next/router'
import Head from 'next/head'
import ErrorPage from 'next/error'
import Container from '../components/container'
import Header from '../components/header'
import SectionSeparator from '../components/section-separator'
import Layout from '../components/layout'
import { getAllPagesWithSlug, getPage } from '../lib/api'
import PostTitle from '../components/post-title'
import { CMS_NAME } from '../lib/constants'

import Slider from '../components/slider'
import { Children } from 'react'

const Page = ({ page, preview }) => {
    const router = useRouter()

    if (!router.isFallback && !page) {
      return <ErrorPage statusCode={404} />
    }
    return(
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
                    {page.title} | Next.js Blog Example with {CMS_NAME}
                  </title>
                  {/* <meta property="og:image" content={post.eventFeaturedImage.url} /> */}
                </Head>
                <h1>{page.title}</h1>

                {page.blocksCollection.items.map((item,index)=>{
                    
                    if(Object.keys(item) == 'sliderItemsCollection'){
                        return(
                            <Slider key={index} slides={item.sliderItemsCollection.items}></Slider>
                        )
                    }
                     
                    
                })}
                
              </article>
              {/* <SectionSeparator /> */}
            </>
          )}
        </Container>
      </Layout>
    )
}



export async function getStaticProps({ params, preview = false }) {
    const data = await getPage(params.slug, preview)
  
    return {
      props: {
        preview,
        page: data?.page ?? null,
      },
    }
  }

  export async function getStaticPaths() {
    const pages = await getAllPagesWithSlug()
    return {
      paths: pages?.map(({ slug }) => `/${slug}`) ?? [],
      fallback: true,
    }
  }

export default Page;