const PAGE = `
slug
title
blocksCollection(limit:10){
  items{
    sliderItemsCollection(limit:10){
      items{
        title
        description{
          json
        }
        cta{
          text
          url
        }
        image{
          url
          height
          width
          title
        }
      }
    }
  }
}
`

const POST_GRAPHQL_FIELDS = `
slug
title
coverImage {
  url
}
date
author {
  name
  picture {
    url
  }
}
excerpt
content {
  json
  links {
    assets {
      block {
        sys {
          id
        }
        url
        description
      }
    }
  }
}
`

const EVENTS_GRAPHQL_FIELDS = `
slug
eventName
eventDate
eventFeaturedImage {
  title
  description
  contentType
  fileName
  size
  url
  width
  height
}
`

async function fetchGraphQL(query, preview = false) {
  return fetch(
    `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${
          preview
            ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
            : process.env.CONTENTFUL_ACCESS_TOKEN
        }`,
      },
      body: JSON.stringify({ query }),
    }
  ).then((response) => response.json())
}
function extractPage(fetchResponse) {
  return fetchResponse?.data?.pageCollection?.items?.[0]
}

function extractPost(fetchResponse) {
  return fetchResponse?.data?.postCollection?.items?.[0]
}

function extractEvent(fetchResponse) {
  return fetchResponse?.data?.eventCollection?.items?.[0]
}

function extractPostEntries(fetchResponse) {
  return fetchResponse?.data?.postCollection?.items
}

function extractEventEntries(fetchResponse) {
  return fetchResponse?.data?.eventCollection?.items
}

export async function getPreviewPostBySlug(slug) {
  const entry = await fetchGraphQL(
    `query {
      postCollection(where: { slug: "${slug}" }, preview: true, limit: 1) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    true
  )
  return extractPost(entry)
}

export async function getAllPagesWithSlug() {
  const entries = await fetchGraphQL(
    `query {
      pageColection(where: { slug_exists: true }, order: date_DESC) {
        items {
          ${PAGE}
        }
      }
    }`
  )
  return extractPostEntries(entries)
}

export async function getAllPostsWithSlug() {
  const entries = await fetchGraphQL(
    `query {
      postCollection(where: { slug_exists: true }, order: date_DESC) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`
  )
  return extractPostEntries(entries)
}

export async function getAllEventsWithSlug() {
  const entries = await fetchGraphQL(
    `query {
      eventCollection(where: { slug_exists: true }, order: date_DESC) {
        items {
          ${EVENTS_GRAPHQL_FIELDS}
        }
      }
    }`
  )
  return extractEventEntries(entries)
}

export async function getAllPostsForHome(preview) {
  const entries = await fetchGraphQL(
    `query {
      postCollection(order: date_DESC, preview: ${preview ? 'true' : 'false'}) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    preview
  )
  return extractPostEntries(entries)
}

export async function getAllEventsForHome(preview) {
  const entries = await fetchGraphQL(
    `query {
      eventCollection( preview: ${preview ? 'true' : 'false'}) {
        items {
          ${EVENTS_GRAPHQL_FIELDS}
        }
      }
    }`,
    preview
  )
  return extractEventEntries(entries)
}

export async function getPostAndMorePosts(slug, preview) {
  const entry = await fetchGraphQL(
    `query {
      postCollection(where: { slug: "${slug}" }, preview: ${
      preview ? 'true' : 'false'
    }, limit: 1) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    preview
  )
  const entries = await fetchGraphQL(
    `query {
      postCollection(where: { slug_not_in: "${slug}" }, order: date_DESC, preview: ${
      preview ? 'true' : 'false'
    }, limit: 2) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    preview
  )
  return {
    post: extractPost(entry),
    morePosts: extractPostEntries(entries),
  }
}

export async function getEventsAndMoreEvents(slug, preview) {
  const entry = await fetchGraphQL(
    `query {
      eventCollection(where: { slug: "${slug}" }, preview: ${
      preview ? 'true' : 'false'
    }, limit: 1) {
        items {
          ${EVENTS_GRAPHQL_FIELDS}
        }
      }
    }`,
    preview
  )
  const entries = await fetchGraphQL(
    `query {
      eventCollection(where: { slug_not_in: "${slug}" }, order: date_DESC, preview: ${
      preview ? 'true' : 'false'
    }, limit: 2) {
        items {
          ${EVENTS_GRAPHQL_FIELDS}
        }
      }
    }`,
    preview
  )
  return {
    post: extractEvent(entry),
    morePosts: extractEventEntries(entries),
  }
}

export async function getPage(slug, preview) {
  const entry = await fetchGraphQL(
    `query {
      pageCollection(where: { slug: "${slug}" }, preview: ${
      preview ? 'true' : 'false'
    }, limit: 1) {
        items {
          ${PAGE}
        }
      }
    }`,
    preview
  )
  
  return {
    page: extractPage(entry),
  }
}