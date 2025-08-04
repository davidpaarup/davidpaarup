# David Paarup Personal Website

This is my personal website featuring my resumé and art gallery.

## Language Support

The website supports multiple languages with dedicated URLs:

- **English** (default): `/` or `/index.html`
- **Spanish**: `/es/index.html`
- **Danish**: `/da/index.html` 
- **Norwegian**: `/no/index.html`

Each language has its own dedicated pages:
- Resume/CV page: `index.html`
- Drawings/Art gallery: `drawings.html`

## File Structure

```
/
├── index.html          # English resume
├── drawings.html       # English drawings
├── es/
│   ├── index.html      # Spanish resume
│   └── drawings.html   # Spanish drawings
├── da/
│   ├── index.html      # Danish resume
│   └── drawings.html   # Danish drawings
└── no/
    ├── index.html      # Norwegian resume
    └── drawings.html   # Norwegian drawings
```

## Features

- Language-specific URLs (no more client-side language switching)
- Responsive design with mobile menu
- Dynamic content loading from Sanity CMS
- Multi-language content support
- SEO-friendly with proper lang attributes and meta descriptions
