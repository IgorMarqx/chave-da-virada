const notesStyles = `<style>
      :root { color-scheme: light; }
      body {
        margin: 32px;
        font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
        color: #0f172a;
        background: #ffffff;
      }
      .notes-container {
        border: 1px solid #d1fae5;
        background: #ecfdf5;
        padding: 24px;
        border-radius: 12px;
      }
      h1, h2, h3, h4 {
        color: #0f172a;
        margin: 0 0 12px;
        line-height: 1.25;
      }
      p {
        margin: 0 0 12px;
        line-height: 1.6;
      }
      ul, ol {
        margin: 0 0 12px 20px;
        line-height: 1.6;
      }
      blockquote {
        margin: 0 0 12px;
        padding: 12px 16px;
        border-left: 4px solid #34d399;
        background: #f0fdf4;
      }
      pre {
        background: #0f172a;
        color: #f8fafc;
        padding: 12px;
        border-radius: 8px;
        overflow: auto;
      }
      code {
        background: #e2e8f0;
        padding: 2px 6px;
        border-radius: 6px;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 12px 0;
        font-size: 14px;
      }
      th, td {
        border: 1px solid #e2e8f0;
        padding: 8px 10px;
        text-align: left;
      }
      th { background: #f8fafc; }
    </style>`;

const sanitizeNotesHtml = (contentHtml: string) =>
    contentHtml.replace(/oklch\\([^\\)]+\\)/gi, '#0f172a');

export const buildNotesDocument = (contentHtml: string) => `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Anotacoes do Topico</title>
    ${notesStyles}
  </head>
  <body>
    <div class="notes-container">
      ${sanitizeNotesHtml(contentHtml) || '<p>Sem anotacoes.</p>'}
    </div>
  </body>
</html>`;
