import Link from 'next/link'
import { getPosts } from '@/utils'
import PostList from '@/components/PostList'

export const getServerSideProps = async (context) => {
  let posts = []
  try {
    posts = await getPosts({skip: 0, take: undefined})
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


export default function Admin({ posts}) {
  
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
        
      <h1 className="text-4xl my-12">Posts</h1>
      <hr></hr>
        <PostList posts={posts} />
      </div>
    </>
  )
}
