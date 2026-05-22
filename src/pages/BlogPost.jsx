import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { fetchPostBySlug, incrementViews } from "../lib/posts";
import { useI18n } from "../i18n";

// youtube/embed URL → iframe src
function toEmbed(url) {
  if (!url) return null;
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/
  );
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  return url;
}

export default function BlogPost() {
  const { content, languageMeta } = useI18n();
  const { ui } = content;
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [status, setStatus] = useState("loading");
  const counted = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    let alive = true;
    fetchPostBySlug(slug)
      .then((data) => {
        if (!alive) return;
        if (!data) return setStatus("notfound");
        setPost(data);
        setStatus("ok");
        if (!counted.current) {
          counted.current = true;
          incrementViews(slug);
        }
      })
      .catch(() => alive && setStatus("notfound"));
    return () => {
      alive = false;
    };
  }, [slug]);

  if (status === "loading")
    return <div className="container-px py-40 text-center text-muted">{ui.blog.loading}</div>;

  if (status === "notfound")
    return (
      <div className="container-px py-40 text-center">
        <p className="text-soft">{ui.blog.notFound}</p>
        <Link to="/#blog" className="mt-4 inline-block text-simple underline">
          {ui.blog.backToBlog}
        </Link>
      </div>
    );

  const embed = toEmbed(post.video_url);

  return (
    <article className="container-px py-28">
      <Link to="/#blog" className="text-sm text-muted hover:text-white">
        {ui.blog.back}
      </Link>

      <header className="mt-6">
        <div className="flex flex-wrap gap-2">
          {(post.tags ?? []).map((t) => (
            <span key={t} className="text-xs font-medium text-simple">
              #{t}
            </span>
          ))}
        </div>
        <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-white">
          {post.title}
        </h1>
        <div className="mt-4 flex items-center gap-4 text-sm text-muted">
          <span>
            {post.published_at &&
              new Date(post.published_at).toLocaleDateString(languageMeta.locale)}
          </span>
          <span>👁 {post.views ?? 0}</span>
        </div>
      </header>

      {post.cover_url && (
        <img
          src={post.cover_url}
          alt={post.title}
          className="mt-8 w-full rounded-2xl"
        />
      )}

      {embed && (
        <div className="mt-8 aspect-video overflow-hidden rounded-2xl">
          <iframe
            className="h-full w-full"
            src={embed}
            title="video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      <div className="prose-blog mt-10 max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            code({ inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {post.content_md || ""}
        </ReactMarkdown>
      </div>
    </article>
  );
}
