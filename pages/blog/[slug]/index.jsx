import { formatDate, markdownToHtml } from "@/utils";
import CustomHead from "@/components/CustomHead";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Loading from "@/components/Loading";
import Link from "next/link";
import DeleteModal from "@/components/DeleteModal";
import { Link as ScrollLink } from "react-scroll";
import Blog from "@/components/Blog";
import { useUser } from "@clerk/nextjs";
import { getPostBySlug, cacheContent } from "@/utils";

export async function getServerSideProps(context) {
  const { req, res } = context;
  cacheContent(req, res);
  const { slug } = context.query;
  let post = null;
  // Get Post from database

  try {
    post = await getPostBySlug(slug);
  } catch (error) {
    console.log(error);
    // Return a 404 page
    return {
      notFound: true,
    };
  }

  if (!post) {
    return {
      notFound: true,
    };
  }

  post.content = await markdownToHtml(post.content);
  return {
    props: {
      post: {
        ...post,
        createdAt: formatDate(post.createdAt),
        updatedAt: formatDate(post.updatedAt),
      },
    },
  };
}

export default function Post(props) {
  const { isLoading, isSignedIn, user } = useUser();
  const { post } = props;
  const headings = post?.content
    ?.match(/<h([1-6]).*?>(.*?)<\/h\1>/gi)
    ?.map((heading) => {
      const level = heading.match(/<h([1-6]).*?>/i)[1];
      const text = heading.replace(/<\/?h[1-6].*?>/gi, "");
      const id = text.replace(/\s+/g, "-").toLowerCase();
      return { level, text, id };
    });

  // Adding ID to each heading in post content and return it
  post.content = post?.content?.replace(
    /<h([1-6]).*?>(.*?)<\/h\1>/gi,
    (match, level, text) => {
      const id = text.replace(/\s+/g, "-").toLowerCase();
      return `<h${level} id="${id}">${text}</h${level}>`;
    }
  );

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const deletePost = async () => {
    setLoading(true);
    const res = await fetch(`/api/blog/${post.id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (res.status === 200) {
      console.log(data);
      router.push("/blog");
    }
    if (data.error) {
      alert(data.error);
    }
    setLoading(false);
  };

  return (
    <>
      <CustomHead
        title={post.title}
        description={post.description}
      ></CustomHead>
      {loading && <Loading />}
      <div className="container max-w-2xl mx-auto">
        {!isLoading && isSignedIn && (
          <div className="flex space-x-2">
            <DeleteModal onDelete={deletePost} />
            <Link className="btn-black" href={`/blog/edit/${post.slug}`}>
              Edit
            </Link>
          </div>
        )}
        <Blog post={post} headings={headings} />
      </div>
    </>
  );
}
