

import Pagination from '@/components/Pagination'
import PostList from '@/components/PostList'
import { getPosts, cacheContent } from '@/utils'
import appConfig from '@/appConfig'
export const getServerSideProps = async (context) => {
    const {req, res} = context
    cacheContent(req, res)
    const { pagination } = appConfig
    let { page } = context.params
    let posts
    page = isNaN(+page) ? 1 : +page

    let skip = (page - 1) * pagination.pageSize
    let take = pagination.pageSize

    try {
        posts = await getPosts({ skip, take })
    } catch (error) {
        console.log(error)
    }

    if (!posts) {
        return {
            notFound: true
        }
    }


    return {
        props: {
            posts: posts || [],
            page
        }
    }
}


export default function Blog(props) {
    const { posts, page } = props
    let count = posts ? posts.length : 0
    return (
        <>
            <div className="container max-w-3xl mx-auto" >
                <PostList posts={posts} />
                <Pagination page={page} count={count} />
            </div>
        </>
    )
}