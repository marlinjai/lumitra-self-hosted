import { defineConfig } from 'clearify';

export default defineConfig({
  name: 'Lumitra Self-Hosted',
  siteUrl: 'https://self-hosted-docs.lumitra.co',
  hubProject: {
    hubUrl: 'https://docs.lumitra.co',
    hubName: 'ERP Suite',
    name: 'Lumitra Self-Hosted',
    description: 'Docker-based self-hosting for Brain APIs',
    status: 'active',
    icon: '🐳',
    tags: ['docker', 'self-hosted', 'infrastructure'],
    group: 'Lumitra Infrastructure',
  },
  sections: [
    { label: 'Documentation', docsDir: './docs/public' },
  ],
  mermaid: {
    strategy: 'client',
  },
});
