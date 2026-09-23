// Renders a post body. Blank lines separate blocks; a block can be a heading (## ), a bullet
// list (- ), a quote (> ), or a paragraph. Keeps the admin editor plain text.
export function Prose({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);

  return (
    <div className="prose">
      {blocks.map((block, i) => {
        const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);

        if (lines.every((l) => l.startsWith('- '))) {
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}>{l.slice(2)}</li>
              ))}
            </ul>
          );
        }

        if (lines.every((l) => l.startsWith('> '))) {
          return <blockquote key={i}>{lines.map((l) => l.slice(2)).join(' ')}</blockquote>;
        }

        if (block.startsWith('### ')) return <h3 key={i}>{block.slice(4)}</h3>;
        if (block.startsWith('## ')) return <h2 key={i}>{block.slice(3)}</h2>;

        return <p key={i}>{block}</p>;
      })}
    </div>
  );
}
