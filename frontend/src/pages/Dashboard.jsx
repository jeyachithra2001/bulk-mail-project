import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Send, History, LogOut, Users, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import api from "../api";

function parseRecipients(value) {
  return [...new Set(value.split(/[,\s;]+/).map(item => item.trim().toLowerCase()).filter(Boolean))];
}

function formatDate(value) {
  return new Date(value).toLocaleString();
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [recipientText, setRecipientText] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const recipients = useMemo(() => parseRecipients(recipientText), [recipientText]);

  async function loadHistory() {
    setHistoryLoading(true);
    try {
      const { data } = await api.get("/emails/history");
      setHistory(data.history || []);
    } catch (err) {
      if (err.response?.status === 401) logout();
      else setMessage({ type: "error", text: "Could not load email history." });
    } finally {
      setHistoryLoading(false);
    }
  }

  useEffect(() => { loadHistory(); }, []);

  function logout() {
    localStorage.removeItem("bulkMailToken");
    localStorage.removeItem("bulkMailAdmin");
    navigate("/login");
  }

  async function handleSend(event) {
    event.preventDefault();
    setMessage(null);
    if (!recipients.length) return setMessage({ type: "error", text: "Enter at least one recipient." });
    if (recipients.length > 100) return setMessage({ type: "error", text: "Maximum 100 recipients per batch." });
    setLoading(true);
    try {
      const { data } = await api.post("/emails/send", { recipients, subject, body });
      setMessage({
        type: data.email.failedCount ? "warning" : "success",
        text: data.message
      });
      setRecipientText("");
      setSubject("");
      setBody("");
      await loadHistory();
    } catch (err) {
      const invalid = err.response?.data?.invalidEmails;
      setMessage({
        type: "error",
        text: invalid?.length
          ? `Invalid email address(es): ${invalid.join(", ")}`
          : err.response?.data?.message || "Email sending failed."
      });
      if (err.response?.status === 401) logout();
    } finally {
      setLoading(false);
    }
  }

  const totalSent = history.reduce((sum, item) => sum + (item.sentCount || 0), 0);
  const totalFailed = history.reduce((sum, item) => sum + (item.failedCount || 0), 0);

  return (
    <div className="dashboard">
      <header className="topbar">
        <div className="brand"><span className="brand-icon small"><Mail size={20} /></span><span>BulkMail<span className="brand-dot">.</span></span></div>
        <div className="top-actions"><span className="admin-label">{localStorage.getItem("bulkMailAdmin")}</span><button className="ghost-btn" onClick={logout}><LogOut size={17} /> Logout</button></div>
      </header>

      <main className="main-content">
        <div className="page-heading">
          <div><p className="eyebrow">EMAIL MANAGEMENT</p><h1>Bulk mail dashboard</h1><p className="muted">Compose, send and track your email campaigns.</p></div>
        </div>

        <section className="stats-grid">
          <div className="stat-card"><span className="stat-icon purple"><Send size={19} /></span><div><p>Total campaigns</p><strong>{history.length}</strong></div></div>
          <div className="stat-card"><span className="stat-icon green"><CheckCircle2 size={19} /></span><div><p>Emails sent</p><strong>{totalSent}</strong></div></div>
          <div className="stat-card"><span className="stat-icon red"><XCircle size={19} /></span><div><p>Failed emails</p><strong>{totalFailed}</strong></div></div>
        </section>

        <section className="content-grid">
          <div className="panel compose-panel">
            <div className="panel-heading"><div><span className="panel-icon"><Send size={18} /></span><h2>Compose email</h2></div><span className="recipient-count"><Users size={15} /> {recipients.length} recipients</span></div>
            <form onSubmit={handleSend} className="compose-form">
              <label>Recipient emails</label>
              <textarea rows="4" value={recipientText} onChange={e => setRecipientText(e.target.value)} placeholder={"Enter emails separated by commas or new lines\nexample@gmail.com, hello@example.com"} required />
              <p className="field-hint">You can add up to 100 unique email addresses per batch.</p>
              <label>Subject</label>
              <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Enter email subject" required maxLength="200" />
              <label>Email message</label>
              <textarea rows="8" value={body} onChange={e => setBody(e.target.value)} placeholder="Write your email message here..." required />
              {message && <div className={`alert ${message.type}`}>{message.text}</div>}
              <button className="primary-btn send-btn" disabled={loading}><Send size={17} /> {loading ? "Sending emails..." : "Send bulk email"}</button>
            </form>
          </div>

          <aside className="panel tips-panel">
            <div className="panel-heading"><div><span className="panel-icon"><Mail size={18} /></span><h2>Before you send</h2></div></div>
            <ul className="tips-list">
              <li><CheckCircle2 size={17} /> Check recipient email addresses.</li>
              <li><CheckCircle2 size={17} /> Write a clear subject line.</li>
              <li><CheckCircle2 size={17} /> Test with your own email first.</li>
              <li><CheckCircle2 size={17} /> Only email people who have agreed to receive your messages.</li>
            </ul>
            <div className="notice"><strong>Sending limit</strong><p>This demo allows up to 100 recipients per batch. Your email provider may enforce lower limits.</p></div>
          </aside>
        </section>

        <section className="panel history-panel">
          <div className="panel-heading"><div><span className="panel-icon"><History size={18} /></span><h2>Email history</h2></div><button className="refresh-btn" onClick={loadHistory}><RefreshCw size={15} /> Refresh</button></div>
          {historyLoading ? <p className="empty-state">Loading history...</p> : history.length === 0 ? <p className="empty-state">No emails sent yet. Your sent email campaigns will appear here.</p> : (
            <div className="table-wrap"><table><thead><tr><th>Subject</th><th>Date</th><th>Recipients</th><th>Sent</th><th>Failed</th><th>Status</th></tr></thead><tbody>
              {history.map(item => <tr key={item._id}><td className="subject-cell">{item.subject}</td><td>{formatDate(item.createdAt)}</td><td>{item.totalRecipients}</td><td className="success-text">{item.sentCount}</td><td className="failed-text">{item.failedCount}</td><td><span className={`status-pill ${item.status}`}>{item.status}</span></td></tr>)}
            </tbody></table></div>
          )}
        </section>
        <footer>BulkMail <span className="brand-dot">.</span></footer>
      </main>
    </div>
  );
}
