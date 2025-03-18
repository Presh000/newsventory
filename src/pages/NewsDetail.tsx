import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { Button, Spinner, Modal } from 'react-bootstrap';

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

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleLikeDislike = async (like: boolean) => {
    try {
      await axios.post(`http://127.0.0.1:8001/api/news/${id}/like/`, { like });
      if (news) {
        setNews(prevNews =>
          prevNews ? {
            ...prevNews,
            total_likes: like ? prevNews.total_likes + 1 : prevNews.total_likes,
            total_dislikes: !like ? prevNews.total_dislikes + 1 : prevNews.total_dislikes,
          } : null
        );
      }
    } catch (error) {
      console.error('Error updating like/dislike:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8001/api/news/${id}`);
      alert('News item deleted successfully');
      navigate('/'); // Redirects to homepage or news list after deletion
    } catch (error) {
      console.error('Error deleting news item:', error);
    }
  };

  useEffect(() => {
    const fetchNewsDetail = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/news/${id}`);
        setNews(response.data);
      } catch (error) {
        console.error('Error fetching news details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [id]);

  if (loading) {
    return <div className="d-flex justify-content-center my-5"><Spinner animation="border" /></div>;
  }

  if (!news) {
    return <div className="text-center my-5">News item not found.</div>;
  }

  return (
    <div className="container my-5">
      <div className="card">
        {news.pictures && (
          <img src={news.pictures} className="card-img-top" alt={news.title} />
        )}
        <div className="card-body">
          <h3 className="card-title">{news.title}</h3>
          <p className="card-text">{news.text}</p>
          <div className="mb-2">
            {news.tags.map(tag => (
              <span key={tag.id} className="badge bg-secondary me-2">{tag.name}</span>
            ))}
          </div>
          <div>
            <small>Published: {new Date(news.created_at || '').toLocaleString()}</small>
            <br />
            <small>Views: {news.view_count}</small>
          </div>
          <div className="mt-3">
            <Button variant="success" className="me-2" onClick={() => handleLikeDislike(true)}>Like ({news.total_likes})</Button>
            <Button variant="danger" className="me-2" onClick={() => handleLikeDislike(false)}>Dislike ({news.total_dislikes})</Button>
            <Button variant="warning" onClick={() => setShowModal(true)}>Delete</Button>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this news item?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default NewsDetail;
