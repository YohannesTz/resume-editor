import { useState, useEffect, useRef, useMemo } from 'react';

export function usePagination(data, margins, titleColor, bodyColor) { // Receive titleColor and bodyColor
  const [pages, setPages] = useState([]);
  const measureRef = useRef(null);

  const blocks = useMemo(() => {
    if (!data) return [];

    const blocks = [];

    // Helper to render the header block
    const HeaderBlock = () => (
        <header className="header" style={{ borderBottom: "2px solid #e5e7eb", paddingBottom: 8, marginBottom: 10 }}>
            <div>
                <div className="name" style={{ color: titleColor }}>{data.name}</div> 
                <div style={{ color: "#6b7280", fontSize: 13 }}>{data.education?.degree ? data.education.degree + " • " + data.education?.school : ""}</div>
            </div>
            <div className="meta">
                <div>{data.location}</div>
                <div>{data.email} • {data.phone}</div>
                {data.links?.linkedin && (
                    <div style={{ marginTop: 6 }}><a href={data.links?.linkedin}>{data.links?.linkedin}</a></div>
                )}
            </div>
        </header>
    );

    // Header (not splittable)
    blocks.push({
        key: "header",
        splittable: false,
        render: <HeaderBlock />,
    });

    // Skills
    blocks.push({
        key: "skills",
        splittable: false,
        render: (
            <section className="section">
                <h3 style={{ color: titleColor }}>Skills</h3> 
                <div className="skills-list" style={{ color: bodyColor }}> 
                    {(data.skills || []).map((s, i) => <div key={i} className="badge">{s}</div>)}
                </div>
            </section>
        ),
    });

    // Education
    if (data.education) {
        blocks.push({
            key: "education",
            splittable: false,
            render: (
                <section className="section">
                    <h3 style={{ color: titleColor }}>Education</h3> 
                    <div style={{ fontWeight: 600, color: bodyColor }}>{data.education?.degree}</div> 
                    <div className="meta" style={{ color: bodyColor }}>{data.education?.school} • {data.education?.year}</div> 
                    {Array.isArray(data.education?.coursework) && data.education.coursework.length > 0 && (
                        <div style={{ marginTop: 8, fontSize: 13, color: bodyColor }}>{data.education.coursework.join(", ")}</div> 
                    )}
                </section>
            ),
        });
    }

    // Involvement
    if (data.involvement) {
        blocks.push({
            key: "involvement",
            splittable: false,
            render: (
                <section className="section">
                    <h3 style={{ color: titleColor }}>Involvement</h3> 
                    <div style={{ fontWeight: 600, color: bodyColor }}>{data.involvement?.title}</div> 
                    <div className="meta" style={{ color: bodyColor }}>{data.involvement?.organization} • {data.involvement?.date}</div> 
                </section>
            ),
        });
    }

    // Experience: make each job a block that can be split across pages by points
    blocks.push({
        key: "experience_header",
        splittable: false,
        render: <section className="section"><h4 style={{ color: titleColor }}>Experience</h4></section>, // Apply titleColor
    });

    (data.experience || []).forEach((job, idx) => {
        blocks.push({
            key: `job-${idx}`,
            splittable: true,
            meta: { job, idx },
            render: (
                <div className="job" data-job-idx={idx} style={{ marginBottom: 12, color: bodyColor }}> 
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <div style={{ fontWeight: 600, color: titleColor }}>{job.title}{job.company ? ` • ${job.company}` : ''}</div> 
                        <div className="meta" style={{ color: bodyColor }}>{[job.date, job.location].filter(Boolean).join(" • ")}</div> 
                    </div>
                    {Array.isArray(job.points) && job.points.length > 0 && (
                        <ul>
                            {job.points.map((p, i) => <li key={i} data-job-idx-point={idx + "," + i} style={{ marginBottom: 6, color: bodyColor }}>{p}</li>)}
                        </ul>
                    )}
                </div>
            ),
        });
    });

    return blocks;
  }, [data, titleColor, bodyColor]); // Add titleColor and bodyColor to dependencies

  useEffect(() => {
    if (!measureRef.current || blocks.length === 0) return;

    const pageHeight = 1122.5197 - margins.top - margins.bottom;
    const nodes = Array.from(measureRef.current.children);
    const heights = nodes.map(node => node.offsetHeight);

    const newPages = [];
    let currentPage = [];
    let currentPageHeight = 0;

    for (let i = 0; i < blocks.length; i++) {
      const blockHeight = heights[i];

      if (currentPageHeight + blockHeight > pageHeight) {
        newPages.push(currentPage);
        currentPage = [];
        currentPageHeight = 0;
      }

      currentPage.push(blocks[i]);
      currentPageHeight += blockHeight;
    }
    newPages.push(currentPage);
    setPages(newPages);

  }, [blocks, margins]);

  const MeasureContainer = () => (
    <div ref={measureRef} style={{ position: 'absolute', left: '-9999px', width: '210mm' }}>
      {blocks.map(block => (
        <div key={block.key}>{block.render}</div>
      ))}
    </div>
  );

  return { pages, MeasureContainer };
}