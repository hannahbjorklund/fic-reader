export default function WorkBody({ ficData }) {
  return (
    <div className="text-body">
      {ficData &&
        ficData.chapters.map((x, i) => {
          return (
            <>
              <h2 id={i + 1} className={`chap-${i + 1}-header`}>
                {x.chapter_title}
              </h2>
              {x.chapter_text.map((y, j) => {
                return (
                  <p id={j + 1} className="chap-line">
                    {y}
                  </p>
                );
              })}
            </>
          );
        })}
    </div>
  );
}
