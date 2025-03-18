import React, { useState, useEffect } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

interface NewsItem {
  id: number;
  title: string;
  text: string;
  pictures?: string;
  tags: { id: number; name: string }[];
  created_at?: string;
  total_likes: number;
  total_dislikes: number;
  view_count: number;
}

const Newsfeed: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const PAGE_LIMIT = 3;
  const navigate = useNavigate();

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/news?page=${page}`);
      const data = response.data.results;

      if (data.length < PAGE_LIMIT) setHasMore(false);

      setNews((prevNews) => (page === 1 ? data : [...prevNews, ...data]));
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [page]);

  const handleLikeDislike = async (id: number, like: boolean) => {
    try {
      await api.post(`/api/news/${id}/like`, { like });
      fetchNews();
    } catch (error) {
      console.error("Error updating like/dislike:", error);
    }
  };

  const handleDelete = async () => {
    try {
      if (selectedNewsId) {
        await api.delete(`/api/news/${selectedNewsId}`);
        setNews(news.filter((item) => item.id !== selectedNewsId));
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error deleting news:", error);
    }
  };

  const fetchNewsByTag = async (tag: string) => {
    setLoading(true);
    setActiveTag(tag);
    setPage(1);
    setHasMore(true);

    try {
      const response = await api.get(`/api/news?tags=${tag}`);
      setNews(response.data.results);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container mt-5">
      <div className="d-flex flex-wrap mb-4 gap-2">
        <Button onClick={() => { setActiveTag(null); setPage(1); setHasMore(true); }} variant="primary">
          All
        </Button>
        {["Sports", "Politics", "Technology", "Entertainment", "Science", "Health"].map((tag) => (
          <Button key={tag} onClick={() => fetchNewsByTag(tag)} variant="secondary">
            {tag}
          </Button>
        ))}
            <Button onClick={() => navigate("/admin")} variant="primary">
          Admin Page
        </Button>
      </div>

      <InfiniteScroll
        dataLength={news.length}
        next={() => setPage(prev => prev + 1)}
        hasMore={hasMore && !activeTag}
        loader={
          <div className="d-flex justify-content-center mb-4">
            <Spinner animation="border" />
          </div>
        }
      >
         {loading && (
          <div className="d-flex justify-content-center mb-4">
            <Spinner animation="border" />
          </div>
        )}
        <div className="row">
          {news.map((item) => (
            <div className="col-lg-4 col-md-6 mb-4" key={item.id}>
              <div className="card h-100">
                {item.pictures && (
                  <img
                    src={item.pictures}
                    className="card-img-top"
                    alt={item.title}
                    onClick={() => navigate(`/news/${item.id}`)}
                    style={{ cursor: "pointer" }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title" onClick={() => navigate(`/news/${item.id}`)}>{item.title}</h5>
                  <p>{item.text.substring(0, 100)}...</p>
                  {item.tags.map(tag => (
              <span key={tag.id} className="badge bg-secondary me-2">{tag.name}</span>
            ))}
                  <div><small>Published: {new Date(item.created_at || "").toLocaleString()}</small></div>
                  <div className="mt-2">
                    <Button variant="success" onClick={() => handleLikeDislike(item.id, true)}>
                      Like ({item.total_likes})
                    </Button>
                    <Button variant="danger" onClick={() => handleLikeDislike(item.id, false)} className="ms-2">
                      Dislike ({item.total_dislikes})
                    </Button>
                    <Button variant="warning" className="ms-2" onClick={() => { setSelectedNewsId(item.id); setShowModal(true); }}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </InfiniteScroll>

      {showModal && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this news item?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </Modal.Footer>
        </Modal>
      )}
    </section>
  );
};

export default Newsfeed;