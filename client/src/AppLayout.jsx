import { Link, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import NewPostPage from "./pages/NewPostPage.jsx";
import PostDetailPage from "./pages/PostDetailPage.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";

export default function AppLayout() {
  return (
    <>
      <nav>
        <Link to="/">Home</Link> | <Link to="/new">New Post</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/new" element={<NewPostPage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />
        <Route
          path="/posts/category/:categoryName"
          element={<CategoryPage />}
        />
      </Routes>
    </>
  );
}
