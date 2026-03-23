import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function CategoryPage() {
  const { categoryName } = useParams();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchByCategory = async () => {
      const res = await fetch(`${API_URL}/posts/category/${categoryName}`);
      const data = await res.json();
      setPosts(data);
    };
    fetchByCategory();
  }, [categoryName]);

  return (
    <div>
      <h1>Category: {categoryName}</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
