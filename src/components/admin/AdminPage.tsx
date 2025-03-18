import React, { useState } from 'react';
import api from '../../api/api';

const AdminPage: React.FC = () => {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [pictures, setPictures] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const data = {
            title,
            text,
            pictures
        };

        try {
            await api.post('https://newsapi-project.onrender.com/api/news', data);
            setMessage('News item successfully posted!');
            setTitle('');
            setText('');
            setPictures('');
        } catch (error) {
            setMessage('Failed to post news item.');
            console.error('Error posting news:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Admin Page</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Title:</label>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={e => setTitle(e.target.value)} 
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Text:</label>
                    <textarea 
                        value={text} 
                        onChange={e => setText(e.target.value)} 
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Picture URL:</label>
                    <input 
                        type="text" 
                        value={pictures} 
                        onChange={e => setPictures(e.target.value)} 
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Posting...' : 'Post News'}
                </button>
            </form>

            {message && <div className="mt-3 alert alert-info">{message}</div>}
        </div>
    );
};

export default AdminPage;
