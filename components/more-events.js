import PostPreview from './post-preview'

export default function MoreEvents({ posts }) {
  return (
    <section>
      <h2 className="mb-8 text-6xl md:text-7xl font-bold tracking-tighter leading-tight">
        More events
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 lg:gap-x-32 gap-y-20 md:gap-y-32 mb-32">
        {posts.map((post) => (
          <PostPreview
            key={post.slug}
            title={post.eventName}
            coverImage={post.eventFeaturedImage}
            date={post.eventDate}
            author={post.author}
            slug={post.slug}
            excerpt={post.eventDescription}
            type='events'
          />
        ))}
      </div>
    </section>
  )
}
