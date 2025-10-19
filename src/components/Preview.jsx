
import React from 'react';

const Preview = ({
  data,
  margins = { top: 28, right: 20, bottom: 28, left: 20 },
  lineHeight = 1.3,
  letterSpacing = 0,
  baseFontSize = 12,
  fontFamily = 'Inter, system-ui, -apple-system, "Segoe UI", Roboto',
}) => {
  const pageStyle = {
    width: '210mm',
    minHeight: '297mm',
    boxSizing: 'border-box',
    paddingTop: margins.top,
    paddingRight: margins.right,
    paddingBottom: margins.bottom,
    paddingLeft: margins.left,
    background: 'white',
    marginBottom: 32,
    marginTop: 32,
    fontFamily,
    fontSize: baseFontSize,
    lineHeight,
    letterSpacing,
    transition: 'all 0.2s',
  };

  return (
    <div className="preview-container" style={pageStyle}>
      <div className="header" style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: 8, marginBottom: 10 }}>
        <div>
          <div className="name">{data.name}</div>
          <div style={{ color: '#6b7280', fontSize: 13 }}>
            {data.education?.degree ? `${data.education.degree} • ${data.education?.school}` : ''}
          </div>
        </div>
        <div className="meta">
          <div>{data.location}</div>
          <div>{`${data.email} • ${data.phone}`}</div>
          {data.links?.linkedin && (
            <div style={{ marginTop: 6 }}>
              <a href={data.links?.linkedin}>{data.links?.linkedin}</a>
            </div>
          )}
        </div>
      </div>

      <div className="section">
        <h3>Skills</h3>
        <div className="skills-list">
          {(data.skills || []).map((s, i) => (
            <div key={i} className="badge" style={{ breakInside: 'avoid' }}>
              {s}
            </div>
          ))}
        </div>
      </div>

      {data.education && (
        <div className="section">
          <h3>Education</h3>
          <div style={{ fontWeight: 600 }}>{data.education?.degree}</div>
          <div className="meta">{`${data.education?.school} • ${data.education?.year}`}</div>
          {Array.isArray(data.education?.coursework) && data.education.coursework.length > 0 && (
            <div style={{ marginTop: 8, fontSize: 13 }}>{data.education.coursework.join(', ')}</div>
          )}
        </div>
      )}

      {data.involvement && (
        <div className="section">
          <h3>Involvement</h3>
          <div style={{ fontWeight: 600 }}>{data.involvement?.title}</div>
          <div className="meta">{`${data.involvement?.organization} • ${data.involvement?.date}`}</div>
        </div>
      )}

      <div className="section">
        <h4>Experience</h4>
        {(data.experience || []).map((job, idx) => (
          <div key={idx} className="job" style={{ marginBottom: 12, breakInside: 'avoid' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontWeight: 600 }}>{`${job.title}${job.company ? ` • ${job.company}` : ''}`}</div>
              <div className="meta">{[job.date, job.location].filter(Boolean).join(' • ')}</div>
            </div>
            {Array.isArray(job.points) && job.points.length > 0 && (
              <ul>
                {job.points.map((p, i) => (
                  <li key={i} style={{ marginBottom: 6 }}>
                    {p}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default React.memo(Preview);
