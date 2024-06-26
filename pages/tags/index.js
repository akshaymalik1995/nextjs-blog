import { getTagsAndCounts, cacheContent } from "@/utils";
import Link from "next/link";
export async function getServerSideProps(context) {
    const {req, res} = context
    cacheContent(req, res)
    let tags = []
    try {
        tags = await getTagsAndCounts();
    } catch (error) {
        console.log(error);
        return {
            notFound: true
        };
    }

    if (tags) {
        tags = tags.filter((tag) => {
            if (tag._count.posts !== 0) {
                return tag;
            }
        })
    }


    return {
        props: {
            tags: tags || []
        }
    };
}



export default function Tags(props) {
    const { tags } = props;

    if (!tags || tags.length === 0) {
        return (
            <div className="container max-w-3xl mx-auto">
                <h1 className="text-4xl my-12">No Tags</h1>
            </div>
        );
    }

    return (
        <div className="container max-w-2xl mx-auto">
            <h1 className="text-4xl my-12">Tags</h1>
            <div className="flex flex-wrap">
                {tags.map((tag) => (
                    <Link
                        key={tag.name}
                        href={`/tags/${tag.name}`}

                        className="btn-black m-2 ">
                        {tag.name.toUpperCase()} ({tag._count.posts})

                    </Link>
                ))}
            </div>
        </div>
    );
}