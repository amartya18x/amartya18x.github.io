import bibtexParse from 'bibtex-parse-js';
import bibRaw from '../content/publications.bib?raw';

export const topics = ['Privacy', 'Unlearning', 'Robustness', 'Learning Theory', 'LLMs', 'ML and Society'];

const topicByKey: Record<string, string[]> = {
  'sanyal-littlestone-2026': ['Privacy', 'Learning Theory'],
  'sanyal-minority-collective-2026': ['ML and Society'],
  'sanyal-forget-only-2026': ['Unlearning', 'Learning Theory'],
  'sanyal-ai-safety-unlearning-2025': ['Unlearning', 'LLMs'],
  'sanyal-retain-sensitivity-2026': ['Unlearning', 'Privacy'],
  'sanyal-language-replay-2026': ['LLMs', 'Learning Theory'],
  'sanyal-private-worst-group-2026': ['Privacy', 'ML and Society'],
  'sanyal-lora-privacy-2026': ['Privacy', 'LLMs'],
  'sanyal-echo-2025': ['Learning Theory', 'Robustness'],
  'sanyal-onl-unl-2025': ['Unlearning', 'Learning Theory', 'Privacy'],
  'sanyal-dp-pca-2025': ['Privacy'],
  'sanyal-dp-align-2025': ['Privacy', 'LLMs'],
  'sanyal-topic-unl-2025': ['Unlearning', 'Learning Theory'],
  'sanyal-backdoor-2025': ['Robustness'],
  'anonymous2025deltainfluence': ['Robustness', 'Unlearning'],
  'sanyal-robcluster-2024': ['Robustness', 'Learning Theory'],
  'sanyal-mechanist-2024': ['LLMs', 'Robustness'],
  'sanyal-accline-2025': ['Robustness'],
  'sanyal-coll-act-2024': ['ML and Society', 'Learning Theory'],
  'sanyal-preproc-2024': ['Privacy'],
  'sanyal-onlinedp-2024': ['Privacy', 'Learning Theory'],
  'sanyal-corr-unl-2024': ['Unlearning', 'Robustness'],
  'sanyal-ssl-theory-2023': ['Learning Theory'],
  'sanyal-certification-paper-2023': ['Robustness', 'Learning Theory'],
  'sanyal-spl-paper-2023': ['Privacy', 'Learning Theory'],
  'sanyal-unlearning-2023': ['Unlearning', 'Robustness'],
  'sanyal-priv-gen-sparse-2024': ['Privacy', 'Learning Theory'],
  'sanyal-cert-adv-2023': ['Robustness'],
  'sanyal-law-robust-2023': ['Robustness', 'Learning Theory'],
  'sanyal-CO-2023': ['Robustness'],
  'sanyal-open-prob-2022': ['Privacy', 'Learning Theory'],
  'sanyal-ssl-2023': ['Robustness'],
  'sanyal-priv-fair-2022': ['Privacy', 'ML and Society'],
  'sanyal-noise-2022': ['Robustness'],
  'sanyal-tapas-2018': ['Privacy'],
  'sanyal-srn-2020': ['Robustness'],
  'sanyal-lowrank-2019': ['Robustness'],
  'sanyal-calibration-2020': ['Robustness'],
  'sanyal-force-2021': ['Robustness'],
  'sanyal-benign-2021': ['Robustness', 'Learning Theory'],
  'sanyal-multiscale-2017': ['Learning Theory'],
};

export const plainText = (value = '') => value.replace(/<br\s*\/?\s*>/gi, '; ').replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&apos;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

export const getPublicationDate = (entry: Record<string, string>) => {
  const date = new Date(entry.date || `${entry.year}-01-01`);
  return Number.isNaN(date.valueOf()) ? new Date(0) : date;
};

export const publications = bibtexParse.toJSON(bibRaw).map(({ citationKey, entryTags }) => {
  const tags = Object.fromEntries(Object.entries(entryTags || {}).map(([key, value]) => [key.toLowerCase(), value]));
  return { ...tags, key: citationKey, topics: topicByKey[citationKey] ?? [] };
}).sort((a, b) => getPublicationDate(b) - getPublicationDate(a));

export const formatConference = (entry) => {
  const short = entry.shortvenue ?? '';
  const full = entry.venue ?? entry.journal ?? '';
  return short && full && short !== full ? `${short} — ${full}` : short || full;
};

export const citationText = (entry) => {
  const venue = plainText(entry.venue ?? entry.journal);
  const journal = /TMLR|Transactions on Machine Learning Research/.test(entry.shortvenue || '');
  const preprint = entry.shortvenue === 'Preprint';
  const fields = {
    title: plainText(entry.title),
    author: plainText(entry.author).replace(/\*/g, '').replace(/,\s*$/, '').split(/,\s*/).join(' and '),
    year: entry.year,
    [journal ? 'journal' : 'booktitle']: preprint ? undefined : venue,
    url: entry.paper || entry.arxiv,
    note: entry.spotlight,
  };
  const escape = (value) => String(value).replace(/\\/g, '\\textbackslash{}').replace(/([&%_#])/g, '\\$1');
  return `@${journal ? 'article' : preprint ? 'misc' : 'inproceedings'}{${entry.key},\n${Object.entries(fields).filter(([, value]) => value).map(([key, value]) => `  ${key} = {${escape(value)}}`).join(',\n')}\n}\n`;
};
