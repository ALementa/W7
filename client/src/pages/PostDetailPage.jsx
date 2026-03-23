import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function load() {
      const res = await fetch(`${API_URL}/posts/${id}`);
      const data = await res.json();
      setPost(data);
    }

    load();
  }, [id]);

  const handleLike = async () => {
    await fetch(`${API_URL}/posts/${id}/like`, { method: "PATCH" });
    // повторно загружаем пост
    const res = await fetch(`${API_URL}/posts/${id}`);
    const data = await res.json();
    setPost(data);
  };

  const handleDelete = async () => {
    await fetch(`${API_URL}/posts/${id}`, { method: "DELETE" });
    navigate("/");
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>
        By {post.author} · {post.category_name}
      </p>
      <p>{post.body}</p>
      <p>Likes: {post.likes}</p>
      <button onClick={handleLike}>Like</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}
