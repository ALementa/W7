import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL; // e.g. https://your-server.onrender.com/api

export default function HomePage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_URL}/posts`);
        const data = await res.json();
        if (isMounted) setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPosts();
    const id = setInterval(fetchPosts, 5000); // polling

    return () => {
      isMounted = false;
      clearInterval(id);
    };
  }, []);

  return (
    <div>
      <h1>Posts</h1>
      if (!Array.isArray(posts)) return <p>Loading...</p>;
      <ul>
        {posts.map(
          (
            post, // .map requirement
          ) => (
            <li key={post.id}>
              <Link to={`/posts/${post.id}`}>
                <h2>{post.title}</h2>
              </Link>
              <p>
                By {post.author} · {post.category_name || "Uncategorised"}
              </p>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
