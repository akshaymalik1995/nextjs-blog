import Link from 'next/link'
import { getPosts, cacheContent } from '@/utils'
import PostList from '@/components/PostList'
import appConfig from '@/appConfig'
import { useEffect } from 'react'
import { useRouter } from 'next/router' 
export const getServerSideProps = async (context) => {
  // GET REQUEST AND RESPONSE OBJECTS
  const {req, res} = context
  // CACHE CONTENT
  cacheContent(req, res)
  // GET PAGINATION SETTINGS FROM APP CONFIG
  const { pagination } = appConfig
  // INITIALIZE POSTS
  let posts = []
  // TRY TO GET POSTS
  try {
    posts = await getPosts({ skip : 0 ,  take: pagination.pageSize })
  } catch (error) {
    console.log(error)
    return {
      notFound: true
    }
  }

  
   
  return {
    props: {
      posts : posts || []
    }
  }
}


export default function Home({ posts}) {
  const router = useRouter()
  if (!posts || posts?.length === 0) {
    return (
      <>
        <div className="container max-w-3xl mx-auto" >
          <h1 className="text-4xl my-12">No Posts</h1>
        </div>
      </>

    )
  }
  return (
    <>
      <div className="container max-w-3xl mx-auto" >
        
      <h1 className="text-4xl my-12">Latest</h1>
      <hr></hr>
        <PostList posts={posts} />
        {/* Link to all posts */}
        <Link className="btn-black inline-block my-8" href="/blog/page/1">
          All Posts
        </Link>

      </div>
    </>
  )
}
